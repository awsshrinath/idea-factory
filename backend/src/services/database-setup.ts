import { supabase } from '../database';
import fs from 'fs';
import path from 'path';

// Database setup configuration
interface SchemaSetupConfig {
  enableRLS: boolean;
  createSampleData: boolean;
  enableTriggers: boolean;
  enableViews: boolean;
}

interface SchemaSetupResult {
  success: boolean;
  tablesCreated: string[];
  errors: string[];
  warnings: string[];
}

export async function setupContentManagementSchema(): Promise<boolean> {
  try {
    console.log('🔧 Setting up content management database schema...');

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '../database/content-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found at:', schemaPath);
      return false;
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split the SQL into individual statements (rough split by semicolons)
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });

          if (error) {
            console.warn(`⚠️  Warning executing statement ${i + 1}:`, error.message);
            // Continue with other statements even if one fails
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.warn(`⚠️  Error executing statement ${i + 1}:`, err);
        }
      }
    }

    console.log('✅ Content management schema setup completed');
    return true;
  } catch (error) {
    console.error('❌ Failed to setup content management schema:', error);
    return false;
  }
}

export async function checkContentManagementTables(): Promise<{
  exists: boolean;
  tables: string[];
  missing: string[];
}> {
  try {
    const requiredTables = [
      'content_items',
      'content_analytics',
      'content_approvals',
      'content_revisions',
      'content_templates',
      'content_campaigns',
      'content_campaign_items'
    ];

    const existingTables: string[] = [];
    const missingTables: string[] = [];

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (!error) {
          existingTables.push(table);
        } else {
          missingTables.push(table);
        }
      } catch {
        missingTables.push(table);
      }
    }

    return {
      exists: missingTables.length === 0,
      tables: existingTables,
      missing: missingTables
    };
  } catch (error) {
    console.error('Error checking content management tables:', error);
    return {
      exists: false,
      tables: [],
      missing: []
    };
  }
}

// Comprehensive Database Schema Setup
export async function setupComprehensiveSchema(config: SchemaSetupConfig = {
  enableRLS: true,
  createSampleData: false,
  enableTriggers: true,
  enableViews: true
}): Promise<SchemaSetupResult> {
  const result: SchemaSetupResult = {
    success: false,
    tablesCreated: [],
    errors: [],
    warnings: []
  };

  try {
    console.log('🚀 Setting up comprehensive database schema...');

    // Read the comprehensive schema file
    const schemaPath = path.join(__dirname, '../database/comprehensive-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      result.errors.push('Comprehensive schema file not found');
      return result;
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL into logical sections
    const sections = parseSQLSections(schemaSql);
    
    console.log(`📋 Found ${sections.length} schema sections to execute`);

    // Execute each section
    for (const section of sections) {
      try {
        const sectionResult = await executeSQLSection(section);
        result.tablesCreated.push(...sectionResult.tablesCreated);
        result.warnings.push(...sectionResult.warnings);
      } catch (error) {
        const errorMsg = `Failed to execute section "${section.name}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    // Setup content management schema as well
    const contentSetup = await setupContentManagementSchema();
    if (!contentSetup) {
      result.warnings.push('Content management schema setup had warnings');
    }

    result.success = result.errors.length === 0;
    
    if (result.success) {
      console.log('✅ Comprehensive database schema setup completed successfully');
      console.log(`📊 Created ${result.tablesCreated.length} tables`);
      
      if (result.warnings.length > 0) {
        console.log(`⚠️  ${result.warnings.length} warnings occurred`);
      }
    } else {
      console.error(`❌ Schema setup failed with ${result.errors.length} errors`);
    }

    return result;
  } catch (error) {
    result.errors.push(`Comprehensive schema setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

// Helper function to parse SQL into logical sections
function parseSQLSections(sql: string): Array<{name: string, statements: string[]}> {
  const sections: Array<{name: string, statements: string[]}> = [];
  const lines = sql.split('\n');
  
  let currentSection = { name: 'Initial Setup', statements: [] as string[] };
  let currentStatement = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for section headers (comments with ====)
    if (trimmedLine.startsWith('--') && trimmedLine.includes('====')) {
      // Save previous section if it has content
      if (currentSection.statements.length > 0) {
        sections.push(currentSection);
      }
      
      // Start new section
      const sectionName = trimmedLine.replace(/^--\s*/, '').replace(/=+/g, '').trim();
      currentSection = { name: sectionName, statements: [] };
      continue;
    }
    
    // Skip comments and empty lines
    if (trimmedLine.startsWith('--') || trimmedLine === '') {
      continue;
    }
    
    // Accumulate statement
    currentStatement += line + '\n';
    
    // If line ends with semicolon, we have a complete statement
    if (trimmedLine.endsWith(';')) {
      currentSection.statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    currentSection.statements.push(currentStatement.trim());
  }
  
  // Add final section
  if (currentSection.statements.length > 0) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Helper function to execute a SQL section
async function executeSQLSection(section: {name: string, statements: string[]}): Promise<{
  tablesCreated: string[];
  warnings: string[];
}> {
  const result = { tablesCreated: [] as string[], warnings: [] as string[] };
  
  console.log(`📝 Executing section: ${section.name} (${section.statements.length} statements)`);
  
  for (let i = 0; i < section.statements.length; i++) {
    const statement = section.statements[i];
    
    try {
      // Use raw SQL execution
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        result.warnings.push(`Warning in ${section.name} statement ${i + 1}: ${error.message}`);
      } else {
        // Extract table name if this is a CREATE TABLE statement
        const createTableMatch = statement.match(/CREATE TABLE.*?IF NOT EXISTS\s+(\w+)/i);
        if (createTableMatch) {
          result.tablesCreated.push(createTableMatch[1]);
        }
      }
    } catch (err) {
      result.warnings.push(`Error in ${section.name} statement ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }
  
  return result;
}

// Check comprehensive database tables
export async function checkComprehensiveTables(): Promise<{
  exists: boolean;
  tables: string[];
  missing: string[];
  summary: Record<string, number>;
}> {
  try {
    const requiredTables = [
      // User Management
      'user_profiles', 'user_sessions',
      // Social Media
      'social_accounts', 'social_posts',
      // AI & RAG
      'knowledge_documents', 'character_profiles', 'character_interactions',
      // Content Management (Enhanced)
      'content_generation_jobs', 'content_media',
      // Analytics
      'user_activity_logs', 'platform_analytics', 'api_usage',
      // Automation
      'automation_rules', 'scheduled_tasks',
      // Notifications
      'user_notifications', 'system_settings',
      // Original Content Management
      'content_items', 'content_analytics', 'content_approvals', 
      'content_revisions', 'content_templates', 'content_campaigns', 
      'content_campaign_items'
    ];

    const existingTables: string[] = [];
    const missingTables: string[] = [];

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (!error) {
          existingTables.push(table);
        } else {
          missingTables.push(table);
        }
      } catch {
        missingTables.push(table);
      }
    }

    // Categorize tables for summary
    const summary = {
      'User Management': existingTables.filter(t => ['user_profiles', 'user_sessions'].includes(t)).length,
      'Social Media': existingTables.filter(t => ['social_accounts', 'social_posts'].includes(t)).length,
      'AI & RAG': existingTables.filter(t => ['knowledge_documents', 'character_profiles', 'character_interactions'].includes(t)).length,
      'Content Management': existingTables.filter(t => t.startsWith('content_')).length,
      'Analytics': existingTables.filter(t => ['user_activity_logs', 'platform_analytics', 'api_usage'].includes(t)).length,
      'Automation': existingTables.filter(t => ['automation_rules', 'scheduled_tasks'].includes(t)).length,
      'System': existingTables.filter(t => ['user_notifications', 'system_settings'].includes(t)).length,
    };

    return {
      exists: missingTables.length === 0,
      tables: existingTables,
      missing: missingTables,
      summary
    };
  } catch (error) {
    console.error('Error checking comprehensive tables:', error);
    return {
      exists: false,
      tables: [],
      missing: [],
      summary: {}
    };
  }
}

// Create comprehensive sample data
export async function createComprehensiveSampleData(userId: string): Promise<boolean> {
  try {
    console.log('📝 Creating comprehensive sample data for user:', userId);

    // Create user profile
    const userProfile = {
      user_id: userId,
      username: 'demo_user',
      display_name: 'Demo User',
      bio: 'Content creator and social media enthusiast',
      timezone: 'UTC',
      subscription_tier: 'pro',
      preferences: {
        theme: 'dark',
        notifications: true,
        auto_post: false
      }
    };

    await supabase.from('user_profiles').upsert(userProfile);

    // Create sample character profile
    const characterProfile = {
      user_id: userId,
      name: 'Creative Assistant',
      description: 'A friendly and creative AI assistant for content generation',
      personality: 'Creative, enthusiastic, and helpful with a focus on engaging content',
      tone: 'friendly',
      vocabulary: ['amazing', 'fantastic', 'incredible', 'wonderful', 'exciting'],
      background: 'Specialized in social media content and creative writing',
      writing_style: 'conversational and engaging'
    };

    const { data: characterData } = await supabase
      .from('character_profiles')
      .insert(characterProfile)
      .select()
      .single();

    // Create sample knowledge documents
    const knowledgeDocs = [
      {
        user_id: userId,
        title: 'Social Media Best Practices',
        content: 'Effective social media content should be authentic, engaging, and provide value to your audience. Post consistently, use relevant hashtags, and engage with your community.',
        document_type: 'text',
        tags: ['social-media', 'best-practices', 'engagement']
      },
      {
        user_id: userId,
        title: 'Content Calendar Strategy',
        content: 'A well-planned content calendar helps maintain consistency and ensures diverse content types. Plan themes, special events, and seasonal content in advance.',
        document_type: 'text',
        tags: ['planning', 'strategy', 'calendar']
      }
    ];

    await supabase.from('knowledge_documents').insert(knowledgeDocs);

    // Create sample content items (using existing function)
    await createSampleContent(userId);

    // Create sample automation rule
    const automationRule = {
      user_id: userId,
      name: 'Daily Motivation Post',
      description: 'Automatically generate and schedule daily motivational content',
      trigger_type: 'schedule',
      trigger_config: { schedule: '0 9 * * *' }, // Daily at 9 AM
      action_type: 'generate_content',
      action_config: { 
        platform: 'instagram',
        content_type: 'motivational',
        character_id: characterData?.id
      }
    };

    await supabase.from('automation_rules').insert(automationRule);

    // Create sample notification
    const notification = {
      user_id: userId,
      type: 'info',
      title: 'Welcome to Idea Factory!',
      message: 'Your account has been set up successfully. Start creating amazing content!',
      action_url: '/dashboard',
      action_label: 'Go to Dashboard'
    };

    await supabase.from('user_notifications').insert(notification);

    console.log('✅ Comprehensive sample data created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create comprehensive sample data:', error);
    return false;
  }
}

export async function createSampleContent(userId: string): Promise<boolean> {
  try {
    console.log('📝 Creating sample content for user:', userId);

    const sampleContent = [
      {
        title: 'Welcome to Content Management',
        description: 'Introduction to our content management system',
        content: 'Welcome to our advanced content management system! This platform helps you create, manage, and publish content across multiple platforms.',
        platform: 'general',
        tone: 'friendly',
        status: 'published',
        tags: ['welcome', 'introduction', 'cms'],
        user_id: userId
      },
      {
        title: 'Social Media Best Practices',
        description: 'Tips for effective social media content',
        content: 'Creating engaging social media content requires understanding your audience, maintaining consistency, and using the right tone for each platform.',
        platform: 'social',
        tone: 'professional',
        status: 'draft',
        tags: ['social-media', 'tips', 'best-practices'],
        user_id: userId
      },
      {
        title: 'Content Calendar Planning',
        description: 'How to plan your content calendar effectively',
        content: 'A well-planned content calendar ensures consistent posting, helps maintain brand voice, and allows for strategic content distribution.',
        platform: 'blog',
        tone: 'informative',
        status: 'approved',
        tags: ['planning', 'calendar', 'strategy'],
        user_id: userId
      }
    ];

    const { data, error } = await supabase
      .from('content_items')
      .insert(sampleContent)
      .select();

    if (error) {
      console.error('Error creating sample content:', error);
      return false;
    }

    // Create sample analytics for the content
    if (data && data.length > 0) {
      const analyticsData = data.map(item => ({
        content_id: item.id,
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 30) + 2,
        engagement_rate: parseFloat((Math.random() * 10 + 1).toFixed(2))
      }));

      await supabase
        .from('content_analytics')
        .insert(analyticsData);
    }

    console.log('✅ Sample content created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create sample content:', error);
    return false;
  }
} 