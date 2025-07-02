const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const notionAPI = {
  // Get project overview
  async getProjectOverview() {
    const response = await fetch(`${API_BASE_URL}/api/notion/project-overview`);
    if (!response.ok) throw new Error('Failed to fetch project overview');
    return response.json();
  },

  // UI/UX Tasks
  async getUIUXTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/notion/uiux-tasks?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch UI/UX tasks');
    return response.json();
  },

  async createUIUXTask(task) {
    const response = await fetch(`${API_BASE_URL}/api/notion/uiux-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create UI/UX task');
    return response.json();
  },

  // RAG/MCP Tasks
  async getRAGMCPTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/notion/ragmcp-tasks?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch RAG/MCP tasks');
    return response.json();
  },

  async createRAGMCPTask(task) {
    const response = await fetch(`${API_BASE_URL}/api/notion/ragmcp-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create RAG/MCP task');
    return response.json();
  },

  // Backend Tasks
  async getBackendTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/notion/backend-tasks?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch backend tasks');
    return response.json();
  },

  // Update task status
  async updateTaskStatus(pageId, status, completionDate = null) {
    const response = await fetch(`${API_BASE_URL}/api/notion/tasks/${pageId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, completionDate }),
    });
    if (!response.ok) throw new Error('Failed to update task status');
    return response.json();
  },
};