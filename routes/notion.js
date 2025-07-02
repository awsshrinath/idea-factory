const express = require('express');
const router = express.Router();
const notionService = require('../services/notionService');

// Get all UI/UX tasks
router.get('/uiux-tasks', async (req, res) => {
  try {
    const { status, priority } = req.query;
    let tasks;

    if (status) {
      tasks = await notionService.getTasksByStatus('uiux', status);
    } else if (priority) {
      tasks = await notionService.getTasksByPriority('uiux', priority);
    } else {
      tasks = await notionService.getUIUXTasks();
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all RAG/MCP tasks
router.get('/ragmcp-tasks', async (req, res) => {
  try {
    const { status, priority, phase } = req.query;
    let tasks;

    if (status) {
      tasks = await notionService.getTasksByStatus('ragmcp', status);
    } else if (priority) {
      tasks = await notionService.getTasksByPriority('ragmcp', priority);
    } else {
      tasks = await notionService.getRAGMCPTasks();
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all backend tasks
router.get('/backend-tasks', async (req, res) => {
  try {
    const { status, priority } = req.query;
    let tasks;

    if (status) {
      tasks = await notionService.getTasksByStatus('backend', status);
    } else if (priority) {
      tasks = await notionService.getTasksByPriority('backend', priority);
    } else {
      tasks = await notionService.getBackendTasks();
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project overview/dashboard
router.get('/project-overview', async (req, res) => {
  try {
    const overview = await notionService.getProjectOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new UI/UX task
router.post('/uiux-tasks', async (req, res) => {
  try {
    const task = await notionService.createUIUXTask(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new RAG/MCP task
router.post('/ragmcp-tasks', async (req, res) => {
  try {
    const task = await notionService.createRAGMCPTask(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.patch('/tasks/:pageId/status', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { status, completionDate } = req.body;
    
    const updatedTask = await notionService.updateTaskStatus(pageId, status, completionDate);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;