/**
 * Client-side localStorage API for Kanban board task management
 * All operations are board-specific using boardId parameter
 *
 * Task Card Schema:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   columnId: string,     // Column this task belongs to (e.g., "to-do", "doing", "done")
 *   createdAt: number
 * }
 */

// ===== HELPER FUNCTIONS =====

/**
 * @param {string} boardId
 * @returns {string}
 */
function getTasksKey(boardId) {
  return `tasks-${boardId}`;
}

/**
 * @returns {string}
 */
export function generateTaskId() {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * @param {string} boardId
 * @returns {Array}
 */
function loadTasks(boardId) {
  try {
    const key = getTasksKey(boardId);
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const tasks = JSON.parse(data);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error(`Error loading tasks for board ${boardId}:`, error);
    return [];
  }
}

/**
 * @param {string} boardId
 * @param {Array} tasks
 * @returns {boolean} Success status
 */
function saveTasks(boardId, tasks) {
  try {
    const key = getTasksKey(boardId);
    localStorage.setItem(key, JSON.stringify(tasks));
    return true;
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
    } else {
      console.error(`Error saving tasks for board ${boardId}:`, error);
    }
    return false;
  }
}

// ===== CRUD OPERATIONS =====

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
 * @returns {Array} Array of task objects in the specified column
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
      description: taskData.description || "",
      columnId: taskData.columnId || "to-do",
      createdAt: Date.now(),
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
 * @param {Object} updates - Object with properties to update
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

    // Merge updates with existing task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      id: tasks[taskIndex].id, // Prevent ID from being changed
      createdAt: tasks[taskIndex].createdAt, // Prevent createdAt from being changed
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
 * @param {string} newColumnId - The target column identifier
 * @returns {Object|null} The updated task object or null if failed
 */
export function moveTask(boardId, taskId, newColumnId) {
  return updateTask(boardId, taskId, { columnId: newColumnId });
}

/**
 * @param {string} boardId
 * @returns {boolean}
 */
export function clearBoardTasks(boardId) {
  try {
    const key = getTasksKey(boardId);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error clearing tasks for board ${boardId}:`, error);
    return false;
  }
}
