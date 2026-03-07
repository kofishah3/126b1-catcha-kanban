import {
  generateTaskId,
  loadTasks,
  saveTasks,
  clearTasksKey,
  getBoards,
  saveBoards,
} from "../data/local/storage.js";

// ===== TASK SYNC OPERATIONS =====

/**
 * Get all tasks for a specific board
 * @param {string} boardId
 * @returns {Array}
 */
export function getTasks(boardId) {
  try {
    return loadTasks(boardId);
  } catch (error) {
    throw error;
  }
}

/**
 * Get tasks filtered by column for a specific board
 * @param {string} boardId
 * @param {string} columnId
 * @returns {Array}
 */
export function getTasksByColumn(boardId, columnId) {
  try {
    const tasks = loadTasks(boardId);
    return tasks.filter((task) => task.columnId === columnId);
  } catch (error) {
    throw error;
  }
}

/**
 * Add a new task to a board
 * @param {string} boardId
 * @param {Object} taskData
 * @returns {Object} The created task object
 */
export function addTask(boardId, taskData) {
  try {
    const tasks = loadTasks(boardId);

    const newTask = {
      id: generateTaskId(),
      title: taskData.title || "Untitled Task",
      createdAt: taskData.createdAt || new Date().toISOString(),
      deadline: taskData.deadline || null,
      priority: taskData.priority || null,
      columnId: taskData.columnId || "to-do",
    };

    tasks.push(newTask);
    saveTasks(boardId, tasks);

    return newTask;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing task's properties
 * @param {string} boardId
 * @param {string} taskId
 * @param {Object} updates
 * @returns {Object} The updated task object
 */
export function updateTask(boardId, taskId, updates) {
  try {
    const tasks = loadTasks(boardId);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      id: tasks[taskIndex].id,
      createdAt: tasks[taskIndex].createdAt,
    };

    saveTasks(boardId, tasks);

    return tasks[taskIndex];
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a task from a board
 * @param {string} boardId
 * @param {string} taskId
 */
export function deleteTask(boardId, taskId) {
  try {
    const tasks = loadTasks(boardId);
    const filteredTasks = tasks.filter((task) => task.id !== taskId);

    if (filteredTasks.length === tasks.length) {
      throw new Error(`Task not found: ${taskId}`);
    }

    saveTasks(boardId, filteredTasks);
  } catch (error) {
    throw error;
  }
}

/**
 * Move a task to a different column
 * @param {string} boardId
 * @param {string} taskId
 * @param {string} newColumnId
 * @returns {Object} The updated task object
 */
export function moveTask(boardId, taskId, newColumnId) {
  try {
    return updateTask(boardId, taskId, { columnId: newColumnId });
  } catch (error) {
    throw error;
  }
}

/**
 * Remove all tasks belonging to a board
 * @param {string} boardId
 */
export function clearBoardTasks(boardId) {
  try {
    clearTasksKey(boardId);
  } catch (error) {
    throw error;
  }
}

// ===== BOARD SYNC OPERATIONS =====

export { getBoards };

/**
 * Add a new board
 * @param {string} name
 * @returns {Object} The created board object
 */
export function addBoard(name) {
  try {
    const boards = getBoards();

    const newBoard = {
      id: `board-${Date.now()}`,
      name,
    };

    boards.push(newBoard);
    saveBoards(boards);

    return newBoard;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a board and all its tasks
 * @param {string} boardId
 */
export function deleteBoard(boardId) {
  try {
    clearBoardTasks(boardId);

    const boards = getBoards();
    const filtered = boards.filter((b) => b.id !== boardId);
    saveBoards(filtered);
  } catch (error) {
    throw error;
  }
}
