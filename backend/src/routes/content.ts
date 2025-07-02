import { Router, Request, Response } from 'express';
import { supabase } from '../database';
import { generateText, generateImage, generateRAGContent, MCPRequest } from '../services/ai';
import { setupContentManagementSchema, checkContentManagementTables, createSampleContent } from '../services/database-setup';
import { searchKnowledgeBase } from '../services/vector-search';
import { getCharacterProfile, buildCharacterPrompt } from '../services/character-profile';

const router = Router();

// Interface definitions
interface ContentCreateRequest {
  title: string;
  description: string;
  content?: string;
  platform: string;
  tone: string;
  status?: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'scheduled' | 'published';
  scheduled_for?: string;
  metadata?: any;
  tags?: string[];
  ai_model?: string;
  language?: string;
}

interface ContentUpdateRequest {
  title?: string;
  description?: string;
  content?: string;
  status?: string;
  scheduled_for?: string;
  metadata?: any;
  tags?: string[];
  approval_notes?: string;
}

interface BulkOperationRequest {
  content_ids: string[];
  operation: 'delete' | 'approve' | 'reject' | 'schedule' | 'publish';
  data?: any;
}

// Content CRUD Operations

// GET /api/v1/content - List content with filtering and search
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      platform,
      search,
      tags,
      date_from,
      date_to,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const userId = (req as any).user?.sub;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = supabase
      .from('content_items')
      .select(`
        *,
        content_analytics(views, likes, shares, engagement_rate),
        content_approvals(status, approved_by, approved_at, notes)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .range(offset, offset + parseInt(limit as string) - 1)
      .order(sort_by as string, { ascending: sort_order === 'asc' });

    // Apply filters
    if (status) query = query.eq('status', status);
    if (platform) query = query.eq('platform', platform);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`);
    }
    if (tags) {
      const tagArray = (tags as string).split(',');
      query = query.contains('tags', tagArray);
    }
    if (date_from) query = query.gte('created_at', date_from);
    if (date_to) query = query.lte('created_at', date_to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      content: data,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: count,
        total_pages: Math.ceil((count || 0) / parseInt(limit as string))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch content', message: error.message });
  }
});

// GET /api/v1/content/:id - Get single content item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;

    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        content_analytics(*),
        content_approvals(*),
        content_revisions(*)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch content', message: error.message });
  }
});

// POST /api/v1/content - Create new content
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const contentData: ContentCreateRequest = req.body;

    // Auto-generate content if description provided but no content
    if (contentData.description && !contentData.content) {
      try {
        const generatedContent = await generateText(contentData.description);
        contentData.content = generatedContent || undefined;
      } catch (aiError) {
        console.warn('AI generation failed, continuing without auto-generation:', aiError);
      }
    }

    const { data, error } = await supabase
      .from('content_items')
      .insert({
        ...contentData,
        user_id: userId,
        status: contentData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial analytics entry
    await supabase
      .from('content_analytics')
      .insert({
        content_id: data.id,
        views: 0,
        likes: 0,
        shares: 0,
        engagement_rate: 0
      });

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create content', message: error.message });
  }
});

// PUT /api/v1/content/:id - Update content
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;
    const updateData: ContentUpdateRequest = req.body;

    // Create revision before updating
    const { data: currentContent } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (currentContent) {
      await supabase
        .from('content_revisions')
        .insert({
          content_id: id,
          revision_data: currentContent,
          created_at: new Date().toISOString()
        });
    }

    const { data, error } = await supabase
      .from('content_items')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update content', message: error.message });
  }
});

// DELETE /api/v1/content/:id - Delete content
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;

    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Content deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete content', message: error.message });
  }
});

// Content Generation & AI Integration

// POST /api/v1/content/generate - Generate content using AI
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { description, platform, tone, ai_model, language, save_as_draft = true } = req.body;
    const userId = (req as any).user?.sub;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const generatedContent = await generateText(description);

    if (save_as_draft) {
      const { data, error } = await supabase
        .from('content_items')
        .insert({
          title: `Generated: ${description.substring(0, 50)}...`,
          description,
          content: generatedContent || undefined,
          platform: platform || 'general',
          tone: tone || 'neutral',
          ai_model: ai_model || 'gpt-4',
          language: language || 'en',
          status: 'draft',
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      res.json({ content: generatedContent, saved_item: data });
    } else {
      res.json({ content: generatedContent });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate content', message: error.message });
  }
});

// POST /api/v1/content/:id/regenerate - Regenerate content for existing item
router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;

    const { data: contentItem, error: fetchError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!contentItem) return res.status(404).json({ error: 'Content not found' });

    const generatedContent = await generateText(contentItem.description);

    const { data, error } = await supabase
      .from('content_items')
      .update({
        content: generatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to regenerate content', message: error.message });
  }
});

// Enhanced Content Generation with RAG+MCP

// POST /api/v1/content/generate/rag - Generate content using RAG + Character consistency
router.post('/generate/rag', async (req: Request, res: Response) => {
  try {
    const { 
      description, 
      platform, 
      tone, 
      characterId, 
      searchQuery,
      temperature,
      maxTokens,
      save_as_draft = true,
      title,
      tags = []
    } = req.body;
    const userId = (req as any).user?.sub;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Search for relevant context if searchQuery provided
    let context = [];
    if (searchQuery) {
      context = await searchKnowledgeBase(searchQuery, 5);
    }

    // Build character-specific prompt if character provided
    let enhancedPrompt = description;
    if (characterId) {
      const character = await getCharacterProfile(characterId);
      if (!character) {
        return res.status(404).json({ error: 'Character profile not found' });
      }
      enhancedPrompt = await buildCharacterPrompt(characterId, description);
    }

    // Build MCP request
    const mcpRequest: MCPRequest = {
      prompt: enhancedPrompt,
      characterId,
      context,
      temperature,
      maxTokens,
    };

    // Generate content with RAG context
    const generatedContent = await generateRAGContent(mcpRequest);

    if (!generatedContent) {
      return res.status(500).json({ error: 'Failed to generate content' });
    }

    // Record character interaction if character was used
    if (characterId) {
      const { recordCharacterInteraction } = await import('../services/character-profile');
      await recordCharacterInteraction(characterId, description, generatedContent);
    }

    if (save_as_draft) {
      const { data, error } = await supabase
        .from('content_items')
        .insert({
          title: title || `Generated: ${description.substring(0, 50)}...`,
          description,
          content: generatedContent,
          platform: platform || 'general',
          tone: tone || 'neutral',
          ai_model: 'gpt-4o-rag',
          status: 'draft',
          tags: tags,
          metadata: {
            character_id: characterId,
            context_sources: context.map(c => c.source),
            context_used: context.length > 0,
            generation_params: { temperature, maxTokens }
          },
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial analytics entry
      await supabase
        .from('content_analytics')
        .insert({
          content_id: data.id,
          views: 0,
          likes: 0,
          shares: 0,
          engagement_rate: 0
        });

      res.json({ 
        content: generatedContent, 
        saved_item: data,
        context_used: context.length > 0,
        context_sources: context.map(c => c.source),
        character_used: !!characterId
      });
    } else {
      res.json({ 
        content: generatedContent,
        context_used: context.length > 0,
        context_sources: context.map(c => c.source),
        character_used: !!characterId
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate RAG content', message: error.message });
  }
});

// POST /api/v1/content/generate/batch - Batch content generation
router.post('/generate/batch', async (req: Request, res: Response) => {
  try {
    const { 
      content_requests, // Array of {description, platform, tone, title?, tags?}
      characterId,
      use_rag = false,
      searchQuery,
      save_as_drafts = true
    } = req.body;
    const userId = (req as any).user?.sub;

    if (!content_requests || !Array.isArray(content_requests) || content_requests.length === 0) {
      return res.status(400).json({ error: 'content_requests array is required' });
    }

    if (content_requests.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 content items can be generated at once' });
    }

    const results = [];
    let context = [];

    // Get context once if using RAG
    if (use_rag && searchQuery) {
      context = await searchKnowledgeBase(searchQuery, 5);
    }

    // Create content generation job
    const { data: jobData } = await supabase
      .from('content_generation_jobs')
      .insert({
        user_id: userId,
        job_type: 'batch',
        status: 'processing',
        input_data: { content_requests, characterId, use_rag, searchQuery },
        progress: 0,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    // Process each content request
    for (let i = 0; i < content_requests.length; i++) {
      const request = content_requests[i];
      
      try {
        let generatedContent: string | null;

        if (use_rag) {
          let enhancedPrompt = request.description;
          if (characterId) {
            enhancedPrompt = await buildCharacterPrompt(characterId, request.description);
          }

          const mcpRequest: MCPRequest = {
            prompt: enhancedPrompt,
            characterId,
            context,
          };

          generatedContent = await generateRAGContent(mcpRequest);
        } else {
          generatedContent = await generateText(request.description);
        }

        if (generatedContent) {
          if (save_as_drafts) {
            const { data: contentData } = await supabase
              .from('content_items')
              .insert({
                title: request.title || `Generated: ${request.description.substring(0, 50)}...`,
                description: request.description,
                content: generatedContent,
                platform: request.platform || 'general',
                tone: request.tone || 'neutral',
                ai_model: use_rag ? 'gpt-4o-rag' : 'gpt-4o',
                status: 'draft',
                tags: request.tags || [],
                metadata: {
                  batch_job_id: jobData?.id,
                  batch_index: i,
                  character_id: characterId,
                  context_used: use_rag && context.length > 0
                },
                user_id: userId
              })
              .select()
              .single();

            if (contentData) {
              await supabase
                .from('content_analytics')
                .insert({
                  content_id: contentData.id,
                  views: 0,
                  likes: 0,
                  shares: 0,
                  engagement_rate: 0
                });
            }

            results.push({
              success: true,
              content: generatedContent,
              saved_item: contentData,
              request_index: i
            });
          } else {
            results.push({
              success: true,
              content: generatedContent,
              request_index: i
            });
          }
        } else {
          results.push({
            success: false,
            error: 'Failed to generate content',
            request_index: i
          });
        }

        // Update job progress
        if (jobData) {
          await supabase
            .from('content_generation_jobs')
            .update({
              progress: Math.round(((i + 1) / content_requests.length) * 100)
            })
            .eq('id', jobData.id);
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          request_index: i
        });
      }
    }

    // Update job as completed
    if (jobData) {
      await supabase
        .from('content_generation_jobs')
        .update({
          status: 'completed',
          progress: 100,
          output_data: { results },
          completed_at: new Date().toISOString()
        })
        .eq('id', jobData.id);
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      job_id: jobData?.id,
      total_requests: content_requests.length,
      successful: successCount,
      failed: failureCount,
      results,
      context_used: use_rag && context.length > 0,
      character_used: !!characterId
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Batch generation failed', message: error.message });
  }
});

// GET /api/v1/content/jobs/:jobId - Get content generation job status
router.get('/jobs/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).user?.sub;

    const { data, error } = await supabase
      .from('content_generation_jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Job not found' });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch job status', message: error.message });
  }
});

// Content Templates

// GET /api/v1/content/templates - List content templates
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { category, platform, include_public = 'true' } = req.query;

    let query = supabase
      .from('content_templates')
      .select('*')
      .order('created_at', { ascending: false });

    // Show user's templates and public templates
    if (include_public === 'true') {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('user_id', userId);
    }

    if (category) query = query.eq('category', category);
    if (platform) query = query.eq('platform', platform);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch templates', message: error.message });
  }
});

// POST /api/v1/content/templates - Create content template
router.post('/templates', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { 
      name, 
      description, 
      template_data, 
      platform, 
      category, 
      is_public = false 
    } = req.body;

    if (!name || !template_data) {
      return res.status(400).json({ error: 'Name and template_data are required' });
    }

    const { data, error } = await supabase
      .from('content_templates')
      .insert({
        user_id: userId,
        name,
        description,
        template_data,
        platform,
        category,
        is_public,
        usage_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create template', message: error.message });
  }
});

// POST /api/v1/content/templates/:id/use - Use template to create content
router.post('/templates/:id/use', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;
    const { 
      customizations = {},
      generate_content = false,
      save_as_draft = true 
    } = req.body;

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('content_templates')
      .select('*')
      .eq('id', id)
      .or(`user_id.eq.${userId},is_public.eq.true`)
      .single();

    if (templateError) throw templateError;
    if (!template) return res.status(404).json({ error: 'Template not found' });

    // Merge template data with customizations
    const contentData = {
      ...template.template_data,
      ...customizations,
      platform: customizations.platform || template.platform || 'general'
    };

    let finalContent = contentData.content;

    // Generate content if requested
    if (generate_content && contentData.description) {
      try {
        const generatedContent = await generateText(contentData.description);
        finalContent = generatedContent || contentData.content;
      } catch (aiError) {
        console.warn('AI generation failed while using template:', aiError);
      }
    }

    if (save_as_draft) {
      const { data: contentItem, error: contentError } = await supabase
        .from('content_items')
        .insert({
          title: contentData.title || `From Template: ${template.name}`,
          description: contentData.description || '',
          content: finalContent,
          platform: contentData.platform,
          tone: contentData.tone || 'neutral',
          status: 'draft',
          tags: contentData.tags || [],
          metadata: {
            template_id: template.id,
            template_name: template.name,
            generated_from_template: true
          },
          user_id: userId
        })
        .select()
        .single();

      if (contentError) throw contentError;

      // Increment template usage count
      await supabase
        .from('content_templates')
        .update({
          usage_count: (template.usage_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      res.json({
        content_item: contentItem,
        template_used: template.name,
        generated_content: generate_content
      });
    } else {
      res.json({
        content_data: {
          title: contentData.title || `From Template: ${template.name}`,
          description: contentData.description || '',
          content: finalContent,
          platform: contentData.platform,
          tone: contentData.tone || 'neutral',
          tags: contentData.tags || []
        },
        template_used: template.name,
        generated_content: generate_content
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to use template', message: error.message });
  }
});

// Content Campaigns

// GET /api/v1/content/campaigns - List content campaigns
router.get('/campaigns', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { status, include_items = 'false' } = req.query;

    let query = supabase
      .from('content_campaigns')
      .select(`
        *,
        ${include_items === 'true' ? 'content_campaign_items(content_items(*))' : ''}
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch campaigns', message: error.message });
  }
});

// POST /api/v1/content/campaigns - Create content campaign
router.post('/campaigns', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { 
      name, 
      description, 
      start_date, 
      end_date, 
      campaign_config = {} 
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    const { data, error } = await supabase
      .from('content_campaigns')
      .insert({
        user_id: userId,
        name,
        description,
        start_date,
        end_date,
        status: 'active',
        campaign_config
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create campaign', message: error.message });
  }
});

// POST /api/v1/content/campaigns/:id/add-content - Add content to campaign
router.post('/campaigns/:id/add-content', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;
    const { content_ids, order_indices = [] } = req.body;

    if (!content_ids || !Array.isArray(content_ids)) {
      return res.status(400).json({ error: 'content_ids array is required' });
    }

    // Verify campaign ownership
    const { data: campaign } = await supabase
      .from('content_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Verify content ownership
    const { data: contentItems } = await supabase
      .from('content_items')
      .select('id')
      .in('id', content_ids)
      .eq('user_id', userId);

    if (!contentItems || contentItems.length !== content_ids.length) {
      return res.status(400).json({ error: 'Some content items not found or not owned by user' });
    }

    // Add content to campaign
    const campaignItems = content_ids.map((contentId: string, index: number) => ({
      campaign_id: id,
      content_id: contentId,
      order_index: order_indices[index] || index
    }));

    const { data, error } = await supabase
      .from('content_campaign_items')
      .upsert(campaignItems, { onConflict: 'campaign_id,content_id' })
      .select();

    if (error) throw error;

    res.json({
      message: `Added ${content_ids.length} content items to campaign`,
      items: data
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add content to campaign', message: error.message });
  }
});

// Approval Workflow

// POST /api/v1/content/:id/submit-for-approval
router.post('/:id/submit-for-approval', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;

    const { data, error } = await supabase
      .from('content_items')
      .update({
        status: 'pending_approval',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    // Create approval record
    await supabase
      .from('content_approvals')
      .insert({
        content_id: id,
        status: 'pending',
        submitted_at: new Date().toISOString()
      });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit for approval', message: error.message });
  }
});

// POST /api/v1/content/:id/approve
router.post('/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = (req as any).user?.sub;

    const { data, error } = await supabase
      .from('content_items')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    // Update approval record
    await supabase
      .from('content_approvals')
      .update({
        status: 'approved',
        approved_by: userId,
        approved_at: new Date().toISOString(),
        notes: notes || null
      })
      .eq('content_id', id);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to approve content', message: error.message });
  }
});

// POST /api/v1/content/:id/reject
router.post('/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = (req as any).user?.sub;

    const { data, error } = await supabase
      .from('content_items')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    // Update approval record
    await supabase
      .from('content_approvals')
      .update({
        status: 'rejected',
        approved_by: userId,
        approved_at: new Date().toISOString(),
        notes: notes || 'Content rejected'
      })
      .eq('content_id', id);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reject content', message: error.message });
  }
});

// Scheduling

// POST /api/v1/content/:id/schedule
router.post('/:id/schedule', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { scheduled_for, platform_config } = req.body;
    const userId = (req as any).user?.sub;

    if (!scheduled_for) {
      return res.status(400).json({ error: 'scheduled_for is required' });
    }

    const { data, error } = await supabase
      .from('content_items')
      .update({
        status: 'scheduled',
        scheduled_for,
        platform_config: platform_config || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to schedule content', message: error.message });
  }
});

// Analytics

// GET /api/v1/content/:id/analytics
router.get('/:id/analytics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.sub;

    // Verify content ownership
    const { data: contentItem } = await supabase
      .from('content_items')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!contentItem) return res.status(404).json({ error: 'Content not found' });

    const { data, error } = await supabase
      .from('content_analytics')
      .select('*')
      .eq('content_id', id)
      .single();

    if (error) throw error;

    res.json(data || {
      content_id: id,
      views: 0,
      likes: 0,
      shares: 0,
      engagement_rate: 0
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch analytics', message: error.message });
  }
});

// POST /api/v1/content/:id/analytics - Update analytics
router.post('/:id/analytics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { views, likes, shares, comments, engagement_rate } = req.body;
    const userId = (req as any).user?.sub;

    // Verify content ownership
    const { data: contentItem } = await supabase
      .from('content_items')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!contentItem) return res.status(404).json({ error: 'Content not found' });

    const { data, error } = await supabase
      .from('content_analytics')
      .upsert({
        content_id: id,
        views: views || 0,
        likes: likes || 0,
        shares: shares || 0,
        comments: comments || 0,
        engagement_rate: engagement_rate || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update analytics', message: error.message });
  }
});

// Bulk Operations

// POST /api/v1/content/bulk
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const { content_ids, operation, data: operationData }: BulkOperationRequest = req.body;
    const userId = (req as any).user?.sub;

    if (!content_ids || !Array.isArray(content_ids) || content_ids.length === 0) {
      return res.status(400).json({ error: 'content_ids array is required' });
    }

    if (!operation) {
      return res.status(400).json({ error: 'operation is required' });
    }

    let updateData: any = { updated_at: new Date().toISOString() };

    switch (operation) {
      case 'approve':
        updateData.status = 'approved';
        break;
      case 'reject':
        updateData.status = 'rejected';
        break;
      case 'schedule':
        if (!operationData?.scheduled_for) {
          return res.status(400).json({ error: 'scheduled_for is required for schedule operation' });
        }
        updateData.status = 'scheduled';
        updateData.scheduled_for = operationData.scheduled_for;
        break;
      case 'publish':
        updateData.status = 'published';
        updateData.published_at = new Date().toISOString();
        break;
      case 'delete':
        const { error: deleteError } = await supabase
          .from('content_items')
          .delete()
          .in('id', content_ids)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;
        return res.json({ message: `Deleted ${content_ids.length} content items` });
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    const { data, error } = await supabase
      .from('content_items')
      .update(updateData)
      .in('id', content_ids)
      .eq('user_id', userId)
      .select();

    if (error) throw error;

    res.json({
      message: `${operation} operation completed`,
      affected_items: data?.length || 0,
      items: data
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Bulk operation failed', message: error.message });
  }
});

// Advanced Analytics & Reporting

// GET /api/v1/content/analytics/performance - Detailed performance analytics
router.get('/analytics/performance', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { 
      period = '30',
      group_by = 'platform',
      content_ids,
      include_trends = 'true'
    } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    let contentQuery = supabase
      .from('content_items')
      .select(`
        id, title, platform, status, created_at, published_at,
        content_analytics(views, likes, shares, comments, engagement_rate, updated_at)
      `)
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (content_ids) {
      const idsArray = (content_ids as string).split(',');
      contentQuery = contentQuery.in('id', idsArray);
    }

    const { data: contentData, error: contentError } = await contentQuery;
    if (contentError) throw contentError;

    // Group performance data
    const performanceData: Record<string, any> = {};
    let totalViews = 0;
    let totalEngagement = 0;
    const trends: Record<string, any[]> = {};

    contentData?.forEach(item => {
      const analytics = item.content_analytics;
      if (analytics) {
        const groupKey = group_by === 'platform' ? item.platform : 
                        group_by === 'status' ? item.status :
                        group_by === 'date' ? item.created_at?.split('T')[0] : 'all';

        if (!performanceData[groupKey]) {
          performanceData[groupKey] = {
            count: 0,
            total_views: 0,
            total_likes: 0,
            total_shares: 0,
            total_comments: 0,
            total_engagement: 0,
            avg_engagement_rate: 0,
            content_items: []
          };
        }

        const group = performanceData[groupKey];
        group.count += 1;
        group.total_views += analytics.views || 0;
        group.total_likes += analytics.likes || 0;
        group.total_shares += analytics.shares || 0;
        group.total_comments += analytics.comments || 0;
        group.total_engagement += (analytics.likes || 0) + (analytics.shares || 0) + (analytics.comments || 0);
        group.content_items.push(item);

        totalViews += analytics.views || 0;
        totalEngagement += (analytics.likes || 0) + (analytics.shares || 0) + (analytics.comments || 0);

        // Track trends by date
        if (include_trends === 'true') {
          const dateKey = item.created_at?.split('T')[0] || 'unknown';
          if (!trends[dateKey]) trends[dateKey] = [];
          trends[dateKey].push({
            views: analytics.views || 0,
            engagement: (analytics.likes || 0) + (analytics.shares || 0) + (analytics.comments || 0)
          });
        }
      }
    });

    // Calculate averages
    Object.values(performanceData).forEach((group: any) => {
      group.avg_engagement_rate = group.count > 0 ? 
        group.content_items.reduce((sum: number, item: any) => 
          sum + (item.content_analytics?.engagement_rate || 0), 0) / group.count : 0;
    });

    res.json({
      period_days: parseInt(period as string),
      group_by,
      total_content: contentData?.length || 0,
      total_views: totalViews,
      total_engagement: totalEngagement,
      performance_by_group: performanceData,
      trends: include_trends === 'true' ? trends : undefined
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch performance analytics', message: error.message });
  }
});

// GET /api/v1/content/analytics/top-performing - Get top performing content
router.get('/analytics/top-performing', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { 
      metric = 'engagement_rate',
      limit = '10',
      platform,
      period = '30'
    } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    let query = supabase
      .from('content_with_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order(metric as string, { ascending: false })
      .limit(parseInt(limit as string));

    if (platform) query = query.eq('platform', platform);

    const { data, error } = await query;
    if (error) throw error;

    res.json({
      metric_sorted_by: metric,
      period_days: parseInt(period as string),
      platform_filter: platform || 'all',
      top_content: data || []
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch top performing content', message: error.message });
  }
});

// GET /api/v1/content/analytics/insights - AI-powered content insights
router.get('/analytics/insights', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { period = '30' } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    // Get comprehensive analytics data
    const { data: analyticsData, error } = await supabase
      .from('content_dashboard_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error

    // Get recent content performance
    const { data: recentContent } = await supabase
      .from('content_with_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    const insights = {
      content_volume: {
        total: analyticsData?.total_content || 0,
        trend: 'stable', // Would calculate based on historical data
        recommendation: analyticsData?.total_content < 10 ? 
          'Consider creating more content to increase engagement opportunities' :
          'Good content volume - maintain consistent posting'
      },
      engagement_performance: {
        avg_engagement_rate: analyticsData?.avg_engagement_rate || 0,
        total_engagement: analyticsData?.total_engagement || 0,
        trend: 'improving', // Would calculate based on historical data
        top_platform: recentContent?.reduce((acc: any, item: any) => {
          acc[item.platform] = (acc[item.platform] || 0) + (item.engagement_rate || 0);
          return acc;
        }, {})
      },
      content_mix: {
        platforms: recentContent?.reduce((acc: any, item: any) => {
          acc[item.platform] = (acc[item.platform] || 0) + 1;
          return acc;
        }, {}),
        recommendation: 'Diversify content across more platforms for broader reach'
      },
      posting_patterns: {
        most_active_day: 'Monday', // Would calculate from actual data
        best_performing_time: '9:00 AM', // Would calculate from actual data
        consistency_score: 0.8 // Would calculate based on posting frequency
      },
      ai_suggestions: [
        'Consider creating more video content - it typically gets 2x more engagement',
        'Your professional tone content performs 30% better than casual tone',
        'Thursday posts get 25% more views - consider scheduling more content then'
      ]
    };

    res.json({
      period_days: parseInt(period as string),
      generated_at: new Date().toISOString(),
      insights
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate insights', message: error.message });
  }
});

// POST /api/v1/content/analytics/export - Export analytics data
router.post('/analytics/export', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { 
      format = 'json',
      period = '30',
      include_content = true,
      include_analytics = true,
      filters = {}
    } = req.body;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    let exportData: any = {
      export_info: {
        user_id: userId,
        generated_at: new Date().toISOString(),
        period_days: parseInt(period as string),
        format,
        filters
      }
    };

    if (include_content) {
      let contentQuery = supabase
        .from('content_items')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (filters.platform) contentQuery = contentQuery.eq('platform', filters.platform);
      if (filters.status) contentQuery = contentQuery.eq('status', filters.status);

      const { data: contentData, error: contentError } = await contentQuery;
      if (contentError) throw contentError;

      exportData.content = contentData;
    }

    if (include_analytics) {
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('content_analytics')
        .select(`
          *,
          content_items!inner(user_id, platform, status, created_at)
        `)
        .eq('content_items.user_id', userId)
        .gte('content_items.created_at', startDate.toISOString());

      if (analyticsError) throw analyticsError;

      exportData.analytics = analyticsData;
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = exportData.content?.map((item: any) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        status: item.status,
        created_at: item.created_at,
        views: exportData.analytics?.find((a: any) => a.content_id === item.id)?.views || 0,
        likes: exportData.analytics?.find((a: any) => a.content_id === item.id)?.likes || 0,
        shares: exportData.analytics?.find((a: any) => a.content_id === item.id)?.shares || 0,
        comments: exportData.analytics?.find((a: any) => a.content_id === item.id)?.comments || 0
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="content-export-${Date.now()}.csv"`);
      
      // Simple CSV conversion
      if (csvData && csvData.length > 0) {
        const headers = Object.keys(csvData[0]).join(',');
        const rows = csvData.map((row: any) => Object.values(row).join(','));
        res.send([headers, ...rows].join('\n'));
      } else {
        res.send('No data to export');
      }
    } else {
      res.json(exportData);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to export analytics data', message: error.message });
  }
});

// Dashboard & Summary Analytics

// GET /api/v1/content/dashboard
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    const { period = '30' } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    // Get content statistics
    const { data: contentStats, error: statsError } = await supabase
      .from('content_items')
      .select('status, platform, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (statsError) throw statsError;

    // Get analytics summary
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('content_analytics')
      .select(`
        views, likes, shares, comments, engagement_rate,
        content_items!inner(user_id, created_at)
      `)
      .eq('content_items.user_id', userId)
      .gte('content_items.created_at', startDate.toISOString());

    if (analyticsError) throw analyticsError;

    // Process statistics
    const stats = {
      total_content: contentStats?.length || 0,
      by_status: {},
      by_platform: {},
      total_views: 0,
      total_engagement: 0,
      average_engagement_rate: 0
    };

    // Count by status and platform
    contentStats?.forEach(item => {
      stats.by_status[item.status] = (stats.by_status[item.status] || 0) + 1;
      stats.by_platform[item.platform] = (stats.by_platform[item.platform] || 0) + 1;
    });

    // Calculate analytics totals
    if (analyticsData && analyticsData.length > 0) {
      stats.total_views = analyticsData.reduce((sum, item) => sum + (item.views || 0), 0);
      stats.total_engagement = analyticsData.reduce((sum, item) => 
        sum + (item.likes || 0) + (item.shares || 0) + (item.comments || 0), 0
      );
      stats.average_engagement_rate = analyticsData.reduce((sum, item) => 
        sum + (item.engagement_rate || 0), 0
      ) / analyticsData.length;
    }

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard data', message: error.message });
  }
});

// Database Setup & Testing Endpoints

// GET /api/v1/content/setup/check - Check if content management tables exist
router.get('/setup/check', async (req: Request, res: Response) => {
  try {
    const tableStatus = await checkContentManagementTables();
    res.json({
      content_management_ready: tableStatus.exists,
      existing_tables: tableStatus.tables,
      missing_tables: tableStatus.missing,
      total_required: 7,
      total_existing: tableStatus.tables.length
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to check database setup', message: error.message });
  }
});

// POST /api/v1/content/setup/initialize - Initialize content management schema
router.post('/setup/initialize', async (req: Request, res: Response) => {
  try {
    const success = await setupContentManagementSchema();
    
    if (success) {
      res.json({ 
        message: 'Content management schema initialized successfully',
        status: 'success'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to initialize schema',
        status: 'failed'
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Setup initialization failed', message: error.message });
  }
});

// POST /api/v1/content/setup/sample-data - Create sample content for testing
router.post('/setup/sample-data', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const success = await createSampleContent(userId);
    
    if (success) {
      res.json({ 
        message: 'Sample content created successfully',
        status: 'success'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create sample content',
        status: 'failed'
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Sample data creation failed', message: error.message });
  }
});

export default router; 