import { createColumn } from "./components/kanban-column/kanban-column.js";
import {
  getBoards,
  addBoard,
  addTask,
  getTasks,
  deleteTask,
  moveTask,
  deleteBoard,
} from "./api/storage.js";
import { createKanbanBoardModal } from "./components/kanban-board-modal/kanban-board-modal.js";
import { createTaskModal } from "./components/task-modal/task-modal.js";

const APP_ELEMENT = document.getElementById("app");
const BOARDS_NAV_ELEMENT = document.getElementById("boards-nav");
const BOARD_TITLE_ELEMENT = document.getElementById("board-title");
const SIDEBAR_ELEMENT = document.getElementById("sidebar");
const SIDEBAR_TOGGLE_BUTTON = document.getElementById("sidebar-toggle");
const SIDEBAR_OVERLAY_ELEMENT = document.getElementById("sidebar-overlay");

let BOARDS = getBoards();

function toggleSidebar() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    SIDEBAR_ELEMENT.classList.toggle("sidebar--active");
    SIDEBAR_OVERLAY_ELEMENT.classList.toggle("sidebar-overlay--active");
  } else {
    SIDEBAR_ELEMENT.classList.toggle("sidebar--collapsed");
  }
}

function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    SIDEBAR_ELEMENT.classList.remove("sidebar--active");
    SIDEBAR_OVERLAY_ELEMENT.classList.remove("sidebar-overlay--active");
  }
}

SIDEBAR_TOGGLE_BUTTON.addEventListener("click", toggleSidebar);
SIDEBAR_OVERLAY_ELEMENT.addEventListener("click", closeSidebarOnMobile);

if (BOARDS.length === 0) {
  const defaultBoard = addBoard("Main Board");
  BOARDS = [defaultBoard];
}

let currentBoardId = BOARDS[0].id;

const COLUMNS = [
  { id: "to-do", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

function renderBoardsNav() {
  if (!BOARDS_NAV_ELEMENT) return;

  BOARDS_NAV_ELEMENT.innerHTML = "";

  BOARDS.forEach((board) => {
    const isActive = board.id === currentBoardId;

    const link = document.createElement("div");
    link.className = `board-link ${isActive ? "board-link--active" : ""}`;
    link.dataset.boardId = board.id;

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

    const switchBoard = async () => {
      currentBoardId = board.id;
      renderBoardsNav();
      await renderBoard();
      closeSidebarOnMobile();
    };

    link.addEventListener("click", switchBoard);
    link.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchBoard();
      }
    });

    if (BOARDS.length > 1) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "board-link__delete-button";
      deleteBtn.setAttribute("aria-label", `Delete board: ${board.name}`);
      deleteBtn.innerHTML = `<i data-lucide="trash-2" aria-hidden="true"></i>`;

      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const confirmed = confirm(
          `Delete board "${board.name}"? This will also delete all its tasks.`,
        );
        if (!confirmed) return;

        deleteBoard(board.id);
        BOARDS = BOARDS.filter((b) => b.id !== board.id);

        if (currentBoardId === board.id) {
          currentBoardId = BOARDS[0].id;
        }

        renderBoardsNav();
        await renderBoard();
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

async function renderBoard() {
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

  const columnPromises = COLUMNS.map((column) => {
    const columnTasks = boardTasks.filter(
      (task) => task.columnId === column.id,
    );
    return createColumn(column, columnTasks, currentBoardId);
  });

  const columnElements = await Promise.all(columnPromises);
  columnElements.forEach((columnElement) => {
    boardContainer.appendChild(columnElement);
  });

  APP_ELEMENT.appendChild(boardContainer);
  if (window.lucide) window.lucide.createIcons();
}

const ADD_BOARD_BUTTON = document.getElementById("add-board-button");
ADD_BOARD_BUTTON.addEventListener("click", () => {
  document._lastFocusedBeforeModal = ADD_BOARD_BUTTON;
  createKanbanBoardModal();
});

document.addEventListener("create-board", async (e) => {
  const newBoard = addBoard(e.detail.name);
  BOARDS.push(newBoard);
  currentBoardId = newBoard.id;

  renderBoardsNav();
  await renderBoard();
});

const UNIVERSAL_ADD_TASK_BUTTON = document.getElementById(
  "universal-add-task-button",
);

UNIVERSAL_ADD_TASK_BUTTON.addEventListener("click", () => {
  document._lastFocusedBeforeModal = UNIVERSAL_ADD_TASK_BUTTON;
  createTaskModal("to-do");
});

document.addEventListener("create-task", async (e) => {
  addTask(currentBoardId, {
    title: e.detail.title,
    columnId: e.detail.columnId,
    priority: e.detail.priority,
    deadline: e.detail.deadline,
    createdAt: new Date().toISOString(),
  });

  await renderBoard();
});

document.addEventListener("delete-task", async (e) => {
  deleteTask(currentBoardId, e.detail.taskId);
  await renderBoard();
});

document.addEventListener("move-task", async (e) => {
  const tasks = getTasks(currentBoardId);
  const task = tasks.find((t) => t.id === e.detail.taskId);

  if (!task) return;

  const columnIndex = COLUMNS.findIndex((col) => col.id === task.columnId);
  if (columnIndex === -1 || columnIndex === COLUMNS.length - 1) return;

  const nextColumnId = COLUMNS[columnIndex + 1].id;
  moveTask(currentBoardId, task.id, nextColumnId);
  await renderBoard();
});

document.addEventListener("move-task-to-column", async (e) => {
  moveTask(currentBoardId, e.detail.taskId, e.detail.newColumnId);
  await renderBoard();
});

document.addEventListener("open-create-task", (e) => {
  createTaskModal(e.detail.columnId);
});

document.addEventListener("refresh-board", async () => {
  await renderBoard();
});

async function initializeApp() {
  renderBoardsNav();
  await renderBoard();

  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    window.addEventListener("load", () => {
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

initializeApp();
