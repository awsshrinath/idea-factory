const { Client } = require('@notionhq/client');

class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  // Get UI/UX Development Tasks
  async getUIUXTasks(filter = null) {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_UIUX_TASKS_DB,
        filter: filter,
        sorts: [
          {
            property: 'Priority',
            direction: 'ascending'
          }
        ]
      });
      return response.results;
    } catch (error) {
      console.error('Error fetching UI/UX tasks:', error);
      throw error;
    }
  }

  // Get RAG/MCP AI Intelligence Tasks
  async getRAGMCPTasks(filter = null) {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_RAG_MCP_TASKS_DB,
        filter: filter,
        sorts: [
          {
            property: 'Phase',
            direction: 'ascending'
          },
          {
            property: 'Priority',
            direction: 'ascending'
          }
        ]
      });
      return response.results;
    } catch (error) {
      console.error('Error fetching RAG/MCP tasks:', error);
      throw error;
    }
  }

  // Get Backend Development Tasks
  async getBackendTasks(filter = null) {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_BACKEND_TASKS_DB,
        filter: filter,
        sorts: [
          {
            property: 'Priority',
            direction: 'ascending'
          }
        ]
      });
      return response.results;
    } catch (error) {
      console.error('Error fetching backend tasks:', error);
      throw error;
    }
  }

  // Create a new UI/UX task
  async createUIUXTask(taskData) {
    try {
      const properties = {
        'Task Name': {
          title: [
            {
              text: {
                content: taskData.name,
              },
            },
          ],
        },
        'Category': {
          select: {
            name: taskData.category,
          },
        },
        'Priority': {
          select: {
            name: taskData.priority,
          },
        },
        'Status': {
          select: {
            name: taskData.status || 'Not Started',
          },
        },
        'Feature Area': {
          multi_select: taskData.featureAreas?.map(area => ({ name: area })) || [],
        },
        'Notes': {
          rich_text: [
            {
              text: {
                content: taskData.notes || '',
              },
            },
          ],
        },
      };

      const response = await this.notion.pages.create({
        parent: { database_id: process.env.NOTION_UIUX_TASKS_DB },
        properties: properties,
      });
      return response;
    } catch (error) {
      console.error('Error creating UI/UX task:', error);
      throw error;
    }
  }

  // Create a new RAG/MCP task
  async createRAGMCPTask(taskData) {
    try {
      const properties = {
        'Task Name': {
          title: [
            {
              text: {
                content: taskData.name,
              },
            },
          ],
        },
        'Category': {
          select: {
            name: taskData.category,
          },
        },
        'Phase': {
          select: {
            name: taskData.phase,
          },
        },
        'Priority': {
          select: {
            name: taskData.priority,
          },
        },
        'Status': {
          select: {
            name: taskData.status || 'Not Started',
          },
        },
        'Feature Area': {
          multi_select: taskData.featureAreas?.map(area => ({ name: area })) || [],
        },
        'Notes': {
          rich_text: [
            {
              text: {
                content: taskData.notes || '',
              },
            },
          ],
        },
      };

      const response = await this.notion.pages.create({
        parent: { database_id: process.env.NOTION_RAG_MCP_TASKS_DB },
        properties: properties,
      });
      return response;
    } catch (error) {
      console.error('Error creating RAG/MCP task:', error);
      throw error;
    }
  }

  // Update task status
  async updateTaskStatus(pageId, status, completionDate = null) {
    try {
      const properties = {
        'Status': {
          select: {
            name: status,
          },
        },
      };

      if (completionDate && status === 'Completed') {
        properties['Completion Date'] = {
          date: {
            start: completionDate,
          },
        };
      }

      const response = await this.notion.pages.update({
        page_id: pageId,
        properties: properties,
      });
      return response;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  // Get tasks by status
  async getTasksByStatus(database, status) {
    const filter = {
      property: 'Status',
      select: {
        equals: status,
      },
    };

    switch (database) {
      case 'uiux':
        return this.getUIUXTasks(filter);
      case 'ragmcp':
        return this.getRAGMCPTasks(filter);
      case 'backend':
        return this.getBackendTasks(filter);
      default:
        throw new Error('Invalid database type');
    }
  }

  // Get tasks by priority
  async getTasksByPriority(database, priority) {
    const filter = {
      property: 'Priority',
      select: {
        equals: priority,
      },
    };

    switch (database) {
      case 'uiux':
        return this.getUIUXTasks(filter);
      case 'ragmcp':
        return this.getRAGMCPTasks(filter);
      case 'backend':
        return this.getBackendTasks(filter);
      default:
        throw new Error('Invalid database type');
    }
  }

  // Get project overview
  async getProjectOverview() {
    try {
      const [uiuxTasks, ragmcpTasks, backendTasks] = await Promise.all([
        this.getUIUXTasks(),
        this.getRAGMCPTasks(),
        this.getBackendTasks(),
      ]);

      return {
        uiux: this.analyzeTaskStats(uiuxTasks),
        ragmcp: this.analyzeTaskStats(ragmcpTasks),
        backend: this.analyzeTaskStats(backendTasks),
        total: this.analyzeTaskStats([...uiuxTasks, ...ragmcpTasks, ...backendTasks]),
      };
    } catch (error) {
      console.error('Error getting project overview:', error);
      throw error;
    }
  }

  // Helper method to analyze task statistics
  analyzeTaskStats(tasks) {
    const stats = {
      total: tasks.length,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      blocked: 0,
      pendingReview: 0,
    };

    tasks.forEach(task => {
      const status = task.properties.Status?.select?.name;
      switch (status) {
        case 'Not Started':
          stats.notStarted++;
          break;
        case 'In Progress':
          stats.inProgress++;
          break;
        case 'Completed':
          stats.completed++;
          break;
        case 'Blocked':
          stats.blocked++;
          break;
        case 'Pending Review':
          stats.pendingReview++;
          break;
      }
    });

    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0;
    return stats;
  }
}

module.exports = new NotionService();