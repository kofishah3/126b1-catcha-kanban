/**
 * Task Card Schema:
 * {
 *   id: string,
 *   boardId: string,   // The board this task belongs to
 *   title: string,
 *   // description: string,
 *   createdAt: date,
 *   deadline: date,        // (optional, e.g., "2024-12-31"),
 *   priority: string,      // ("Low", "Medium", "High"),
 *   columnId: string,      // The status of the card, or the column this task belongs to (e.g., "to-do", "doing", "done")
 * }
 */

// ===== UTILITIES =====

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

// ===== DATA LAYER (CRUD) =====

/**
 * @param {string} boardId
 * @returns {Array}
 */
export function loadTasks(boardId) {
  try {
    const key = getTasksKey(boardId);
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const tasks = JSON.parse(data);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    throw error;
  }
}

/**
 * @param {string} boardId
 * @param {Array} tasks
 */
export function saveTasks(boardId, tasks) {
  try {
    const key = getTasksKey(boardId);
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (error) {
    throw error;
  }
}

/**
 * @param {string} boardId
 */
export function clearTasksKey(boardId) {
  try {
    const key = getTasksKey(boardId);
    localStorage.removeItem(key);
  } catch (error) {
    throw error;
  }
}

const BOARDS_KEY = "kanban-boards";

/**
 * @returns {Array}
 */
export function getBoards() {
  try {
    const data = localStorage.getItem(BOARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Array} boards
 */
export function saveBoards(boards) {
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  } catch (error) {
    throw error;
  }
}
