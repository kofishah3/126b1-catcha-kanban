import { createColumn } from "./ui/components/kanban-column.js";
import { getBoards, addBoard, addTask, getTasks, deleteTask, moveTask, deleteBoard } from "./api/storage.js";
import { createKanbanBoardModal } from "./ui/components/kanban-board-modal.js";
import { createTaskModal } from "./ui/components/task-modal.js";

const APP_ELEMENT = document.getElementById("app");
const BOARDS_NAV_ELEMENT = document.getElementById("boards-nav");
const BOARD_TITLE_ELEMENT = document.getElementById("board-title");

// Loading boards
let BOARDS = getBoards();

if (BOARDS.length === 0) {
  const defaultBoard = addBoard("Main Board");
  BOARDS = [defaultBoard];
}

let currentBoardId = BOARDS[0].id;

// Fixed Columns
const COLUMNS = [
  { id: "to-do", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

// Renderer
function renderBoardsNav() {
  if (!BOARDS_NAV_ELEMENT) return;

  BOARDS_NAV_ELEMENT.innerHTML = "";

  BOARDS.forEach((board) => {
    const isActive = board.id === currentBoardId;

    const link = document.createElement("div");
    link.className = `board-link ${isActive ? "board-link--active" : ""}`;
    link.dataset.boardId = board.id;

    // Keyboard accessibility for board links
    link.setAttribute("tabindex", "0");
    link.setAttribute("role", "button");
    link.setAttribute("aria-label", `Switch to board: ${board.name}`);

    const icon = document.createElement("i");
    icon.dataset.lucide = "layout";
    icon.setAttribute("aria-hidden", "true");
    link.appendChild(icon);

    const text = document.createElement("span");
    text.className = "board-link__text";
    text.textContent = board.name;
    link.appendChild(text);

    // Switch board on click or Enter/Space
    const switchBoard = () => {
      currentBoardId = board.id;
      renderBoardsNav();
      renderBoard();
    };

    link.addEventListener("click", switchBoard);
    link.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchBoard();
      }
    });

    // ── Delete board button ──
    // Only show delete button if there's more than 1 board
    if (BOARDS.length > 1) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "board-link__delete-button";
      deleteBtn.setAttribute("aria-label", `Delete board: ${board.name}`);
      deleteBtn.innerHTML = `<i data-lucide="trash-2" aria-hidden="true"></i>`;

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent switching to the board when deleting
        const confirmed = confirm(`Delete board "${board.name}"? This will also delete all its tasks.`);
        if (!confirmed) return;

        deleteBoard(board.id);
        BOARDS = BOARDS.filter((b) => b.id !== board.id);

        // If we deleted the active board, switch to the first remaining one
        if (currentBoardId === board.id) {
          currentBoardId = BOARDS[0].id;
        }

        renderBoardsNav();
        renderBoard();
      });

      deleteBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          deleteBtn.click();
        }
      });

      link.appendChild(deleteBtn);
    }

    BOARDS_NAV_ELEMENT.appendChild(link);
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderBoard() {
  if (!APP_ELEMENT) return;

  const currentBoard = BOARDS.find((board) => board.id === currentBoardId);
  if (BOARD_TITLE_ELEMENT) {
    BOARD_TITLE_ELEMENT.textContent = currentBoard
      ? currentBoard.name
      : "Kanban Board";
  }

  APP_ELEMENT.innerHTML = "";

  const boardContainer = document.createElement("div");
  boardContainer.className = "kanban-board";

  const boardTasks = getTasks(currentBoardId);

  COLUMNS.forEach((column) => {
    const columnTasks = boardTasks.filter(
      (task) => task.columnId === column.id,
    );
    const columnElement = createColumn(column, columnTasks, currentBoardId);
    boardContainer.appendChild(columnElement);
  });

  APP_ELEMENT.appendChild(boardContainer);
  if (window.lucide) window.lucide.createIcons();
}

// LOGIC: Adding new Kanban Board
const ADD_BOARD_BUTTON = document.getElementById("add-board-button");
ADD_BOARD_BUTTON.addEventListener("click", () => {
  document._lastFocusedBeforeModal = ADD_BOARD_BUTTON;
  createKanbanBoardModal();
});

document.addEventListener("create-board", (e) => {
  const newBoard = addBoard(e.detail.name);
  BOARDS.push(newBoard);
  currentBoardId = newBoard.id;

  renderBoardsNav();
  renderBoard();
});

// LOGIC: Adding new task
const UNIVERSAL_ADD_TASK_BUTTON = document.getElementById(
  "universal-add-task-button"
);

UNIVERSAL_ADD_TASK_BUTTON.addEventListener("click", () => {
  document._lastFocusedBeforeModal = UNIVERSAL_ADD_TASK_BUTTON;
  createTaskModal("to-do");
});

// LOGIC: Adding new task to specific column
document.addEventListener("create-task", (e) => {
  addTask(currentBoardId, {
    title: e.detail.title,
    columnId: e.detail.columnId,
    priority: e.detail.priority,
    deadline: e.detail.deadline,
    createdAt: new Date().toISOString(),
  });

  renderBoard();
});

// LOGIC: Delete Task
document.addEventListener("delete-task", (e) => {
  deleteTask(currentBoardId, e.detail.taskId);
  renderBoard();
});

// LOGIC: Move Task
document.addEventListener("move-task", (e) => {
  const tasks = getTasks(currentBoardId);
  const task = tasks.find(t => t.id === e.detail.taskId);

  if (!task) return;

  const columnIndex = COLUMNS.findIndex(col => col.id === task.columnId);
  if (columnIndex === -1 || columnIndex === COLUMNS.length - 1) return;

  const nextColumnId = COLUMNS[columnIndex + 1].id;
  moveTask(currentBoardId, task.id, nextColumnId);
  renderBoard();
});

document.addEventListener("open-create-task", (e) => {
  createTaskModal(e.detail.columnId);
});

document.addEventListener("refresh-board", () => {
  renderBoard();
});

function initializeApp() {
  renderBoardsNav();
  renderBoard();

  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    window.addEventListener("load", () => {
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

initializeApp();