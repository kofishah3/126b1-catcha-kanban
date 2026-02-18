import { createColumn } from "./ui/components/kanban-column.js";
import { getBoards, addBoard, addTask, getTasks } from "./api/storage.js";


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


// LOGIC: Adding new Kanban Board
const ADD_BOARD_BUTTON = document.getElementById("add-board-button");
ADD_BOARD_BUTTON.addEventListener("click", () => {
  const name = prompt("Board name?");
  if(!name) return;

  const newBoard = addBoard(name);
  BOARDS.push(newBoard);
  currentBoardId = newBoard.id;

  renderBoardsNav();
  renderBoard();
});


// LOGIC: Adding new task
document.addEventListener("create-task", (e) => {
  addTask(currentBoardId, {
    title: e.detail.title,
    columnId: e.detail.columnId,
    priority: e.detail.priority,
    deadline: e.detail.deadline,
    createdAt: new Date().toISOString(),
  });

  renderBoard();
})


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
