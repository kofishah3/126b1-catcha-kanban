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
  return loadTasks(boardId);
}

/**
 * Get tasks filtered by column for a specific board
 * @param {string} boardId
 * @param {string} columnId
 * @returns {Array}
 */
export function getTasksByColumn(boardId, columnId) {
  const tasks = loadTasks(boardId);
  return tasks.filter((task) => task.columnId === columnId);
}

/**
 * Add a new task to a board
 * @param {string} boardId
 * @param {Object} taskData
 * @returns {Object|null} The created task object or null if failed
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

    if (saveTasks(boardId, tasks)) {
      return newTask;
    }
    return null;
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
}

/**
 * Update an existing task's properties
 * @param {string} boardId
 * @param {string} taskId
 * @param {Object} updates
 * @returns {Object|null} The updated task object or null if not found
 */
export function updateTask(boardId, taskId, updates) {
  try {
    const tasks = loadTasks(boardId);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      console.warn(`Task ${taskId} not found in board ${boardId}`);
      return null;
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      id: tasks[taskIndex].id,
      createdAt: tasks[taskIndex].createdAt,
    };

    if (saveTasks(boardId, tasks)) {
      return tasks[taskIndex];
    }
    return null;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
}

/**
 * Delete a task from a board
 * @param {string} boardId
 * @param {string} taskId
 * @returns {boolean}
 */
export function deleteTask(boardId, taskId) {
  try {
    const tasks = loadTasks(boardId);
    const filteredTasks = tasks.filter((task) => task.id !== taskId);

    if (filteredTasks.length === tasks.length) {
      console.warn(`Task ${taskId} not found in board ${boardId}`);
      return false;
    }

    return saveTasks(boardId, filteredTasks);
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
}

/**
 * Move a task to a different column
 * @param {string} boardId
 * @param {string} taskId
 * @param {string} newColumnId
 * @returns {Object|null}
 */
export function moveTask(boardId, taskId, newColumnId) {
  return updateTask(boardId, taskId, { columnId: newColumnId });
}

/**
 * Remove all tasks belonging to a board
 * @param {string} boardId
 * @returns {boolean}
 */
export function clearBoardTasks(boardId) {
  return clearTasksKey(boardId);
}

// ===== BOARD SYNC OPERATIONS =====

export { getBoards };

/**
 * Add a new board
 * @param {string} name
 * @returns {Object} The created board object
 */
export function addBoard(name) {
  const boards = getBoards();

  const newBoard = {
    id: `board-${Date.now()}`,
    name,
  };

  boards.push(newBoard);
  saveBoards(boards);

  return newBoard;
}

/**
 * Delete a board and all its tasks
 * @param {string} boardId
 * @returns {boolean}
 */
export function deleteBoard(boardId) {
  try {
    clearBoardTasks(boardId);

    const boards = getBoards();
    const filtered = boards.filter((b) => b.id !== boardId);
    saveBoards(filtered);

    return true;
  } catch (error) {
    console.error("Error deleting board:", error);
    return false;
  }
}
