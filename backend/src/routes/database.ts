import { Router, Request, Response } from 'express';
import { 
  setupComprehensiveSchema,
  checkComprehensiveTables,
  createComprehensiveSampleData,
  setupContentManagementSchema,
  checkContentManagementTables,
  createSampleContent
} from '../services/database-setup';

const router = Router();

// Comprehensive Database Setup
router.post('/setup/comprehensive', async (req: Request, res: Response) => {
  try {
    const { 
      enableRLS = true, 
      createSampleData = false, 
      enableTriggers = true, 
      enableViews = true 
    } = req.body;

    console.log('🚀 Starting comprehensive database setup...');
    
    const result = await setupComprehensiveSchema({
      enableRLS,
      createSampleData,
      enableTriggers,
      enableViews
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Comprehensive database schema setup completed successfully',
        tablesCreated: result.tablesCreated,
        warnings: result.warnings,
        stats: {
          totalTables: result.tablesCreated.length,
          warningCount: result.warnings.length
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Database schema setup completed with errors',
        errors: result.errors,
        warnings: result.warnings,
        tablesCreated: result.tablesCreated
      });
    }
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup comprehensive database schema',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check Database Status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const comprehensiveCheck = await checkComprehensiveTables();
    const contentCheck = await checkContentManagementTables();

    const status = {
      comprehensive: {
        isComplete: comprehensiveCheck.exists,
        tablesExisting: comprehensiveCheck.tables.length,
        tablesMissing: comprehensiveCheck.missing.length,
        existingTables: comprehensiveCheck.tables,
        missingTables: comprehensiveCheck.missing,
        summary: comprehensiveCheck.summary
      },
      contentManagement: {
        isComplete: contentCheck.exists,
        tablesExisting: contentCheck.tables.length,
        tablesMissing: contentCheck.missing.length,
        existingTables: contentCheck.tables,
        missingTables: contentCheck.missing
      },
      overall: {
        isHealthy: comprehensiveCheck.exists && contentCheck.exists,
        totalTables: comprehensiveCheck.tables.length + contentCheck.tables.length,
        totalMissing: comprehensiveCheck.missing.length + contentCheck.missing.length
      }
    };

    res.status(200).json(status);
  } catch (error) {
    console.error('Database status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check database status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Content Management Schema Setup (Legacy)
router.post('/setup/content', async (req: Request, res: Response) => {
  try {
    console.log('🔧 Setting up content management schema...');
    
    const success = await setupContentManagementSchema();
    
    if (success) {
      res.status(200).json({
        success: true,
        message: 'Content management schema setup completed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Content management schema setup completed with warnings'
      });
    }
  } catch (error) {
    console.error('Content schema setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup content management schema',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create Sample Data
router.post('/sample-data', async (req: Request, res: Response) => {
  try {
    const { userId, comprehensive = true } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    console.log(`📝 Creating ${comprehensive ? 'comprehensive' : 'basic'} sample data for user: ${userId}`);
    
    let success: boolean;
    if (comprehensive) {
      success = await createComprehensiveSampleData(userId);
    } else {
      success = await createSampleContent(userId);
    }
    
    if (success) {
      res.status(200).json({
        success: true,
        message: `${comprehensive ? 'Comprehensive' : 'Basic'} sample data created successfully`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create sample data'
      });
    }
  } catch (error) {
    console.error('Sample data creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sample data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Database Health Check
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Quick health check by testing a simple query
    const { data, error } = await require('../database').supabase
      .from('content_items')
      .select('id')
      .limit(1);

    if (error) {
      res.status(500).json({
        healthy: false,
        message: 'Database connection failed',
        error: error.message
      });
    } else {
      res.status(200).json({
        healthy: true,
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      healthy: false,
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reset Database (Development only - should be protected in production)
router.post('/reset', async (req: Request, res: Response) => {
  try {
    const { confirm } = req.body;

    if (confirm !== 'RESET_DATABASE') {
      return res.status(400).json({
        success: false,
        message: 'Reset confirmation required. Send {"confirm": "RESET_DATABASE"}'
      });
    }

    console.log('⚠️  Database reset requested...');
    
    // This is a simplified reset - in a real implementation, you'd want more sophisticated cleanup
    res.status(200).json({
      success: true,
      message: 'Database reset functionality would be implemented here (development only)',
      warning: 'This endpoint should be disabled in production'
    });
  } catch (error) {
    console.error('Database reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Database Migration Status
router.get('/migrations', async (req: Request, res: Response) => {
  try {
    const status = await checkComprehensiveTables();
    
    const migrations = {
      pending: status.missing.map(table => ({
        table,
        description: `Create ${table} table`,
        required: true
      })),
      completed: status.tables.map(table => ({
        table,
        description: `${table} table exists`,
        completedAt: 'Unknown' // Would track this in a real migration system
      })),
      summary: {
        total: status.tables.length + status.missing.length,
        completed: status.tables.length,
        pending: status.missing.length,
        completionPercentage: Math.round((status.tables.length / (status.tables.length + status.missing.length)) * 100)
      }
    };

    res.status(200).json(migrations);
  } catch (error) {
    console.error('Migration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get migration status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;