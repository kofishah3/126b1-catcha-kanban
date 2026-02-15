import { createColumn } from "./ui/components/kanban-column.js";

const APP_ELEMENT = document.getElementById("app");
const BOARDS_NAV_ELEMENT = document.getElementById("boards-nav");
const BOARD_TITLE_ELEMENT = document.getElementById("board-title");

// mock data
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

let currentBoardId = BOARDS[0].id;

/**
 * Renders the top/side navigation for boards.
 */
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

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Renders the current kanban board.
 */
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

  COLUMNS.forEach((column) => {
    const columnElement = createColumn(column);
    boardContainer.appendChild(columnElement);
  });

  APP_ELEMENT.appendChild(boardContainer);
  if (window.lucide) window.lucide.createIcons();
}

// Initial initialization
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
