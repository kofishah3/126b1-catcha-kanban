import { getTasks } from "./api/storage.js";
import { createColumn } from "./ui/components/kanban-column.js";

const APP_ELEMENT = document.getElementById("app");
const BOARDS_NAV_ELEMENT = document.getElementById("boards-nav");
const BOARD_TITLE_ELEMENT = document.getElementById("board-title");

// Mock Data
const BOARDS = [
  { id: "board-1", name: "Main Board" },
  { id: "board-2", name: "Marketing" },
  { id: "board-3", name: "Development" },
];

const COLUMNS = [
  { id: "to-do", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const MOCK_TASKS = [
  {
    id: "task-1",
    columnId: "to-do",
    title: "Design System Refactor",
    createdAt: "Feb 14, 2026",
    deadline: "Feb 28, 2026",
    priority: "High",
  },
  {
    id: "task-2",
    columnId: "to-do",
    title: "Write Documentation",
    createdAt: "Feb 15, 2026",
    priority: "Medium",
  },
  {
    id: "task-3",
    columnId: "doing",
    title: "Implement Task Card UI",
    createdAt: "Feb 16, 2026",
    deadline: "Feb 17, 2026",
    priority: "High",
  },
  {
    id: "task-4",
    columnId: "done",
    title: "Project Setup",
    createdAt: "Feb 10, 2026",
    priority: "Low",
  },
];

let currentBoardId = BOARDS[0].id;

function renderBoardsNav() {
  if (!BOARDS_NAV_ELEMENT) return;

  BOARDS_NAV_ELEMENT.innerHTML = "";

  BOARDS.forEach((board) => {
    const isActive = board.id === currentBoardId;
    const link = document.createElement("div");
    link.className = `board-link ${isActive ? "board-link--active" : ""}`;
    link.dataset.boardId = board.id;

    const icon = document.createElement("i");
    icon.dataset.lucide = "layout";
    link.appendChild(icon);

    const text = document.createElement("span");
    text.className = "board-link__text";
    text.textContent = board.name;
    link.appendChild(text);

    link.addEventListener("click", () => {
      currentBoardId = board.id;
      renderBoardsNav();
      renderBoard();
    });

    BOARDS_NAV_ELEMENT.appendChild(link);
  });

  // this just loads all the icons used in the codebase
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

  // Load tasks for the current board from local storage
  const boardTasks = getTasks(currentBoardId);

  COLUMNS.forEach((column) => {
    // Filter tasks for this specific column
    const columnTasks = boardTasks.filter(
      (task) => task.columnId === column.id,
    );
    const columnElement = createColumn(column, columnTasks);
    boardContainer.appendChild(columnElement);
  });

  APP_ELEMENT.appendChild(boardContainer);
  if (window.lucide) window.lucide.createIcons();
}

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
