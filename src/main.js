import { createColumn } from "./ui/components/kanban_column.js";

const app = document.getElementById('app');
const boardsNav = document.getElementById('boards-nav');
const boardTitle = document.getElementById('board-title');

// mock data
const boards = [
  { id: 'board-1', name: 'Main Board' },
  { id: 'board-2', name: 'Marketing' },
  { id: 'board-3', name: 'Development' }
];

const columns = [
  {id: 'to-do', title: 'To Do'},
  {id: 'doing', title: 'Doing'},
  {id: 'done', title: 'Done'},
]

let currentBoardId = boards[0].id;

// nav bar
function renderBoardsNav() {
  if (!boardsNav) return;
  boardsNav.innerHTML = '';
  
  boards.forEach(board => {
    const link = document.createElement('div'); 
    link.className = `board-link ${board.id === currentBoardId ? 'active' : ''}`;
    link.dataset.boardId = board.id;
    
    const icon = document.createElement('i');
    icon.dataset.lucide = 'layout';
    link.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = board.name;
    link.appendChild(text);

    link.addEventListener('click', () => {
      currentBoardId = board.id;
      renderBoardsNav(); 
      renderBoard();
    });

    boardsNav.appendChild(link);
  });
  
  if (window.lucide) window.lucide.createIcons();
}

function renderBoard() {
  if (!app) return;
  
  const currentBoard = boards.find(b => b.id === currentBoardId);
  if(boardTitle) boardTitle.textContent = currentBoard ? currentBoard.name : 'Kanban Board';

  app.innerHTML = "";


  const boardContainer = document.createElement('div');
  boardContainer.className = 'kanban-board';

  columns.forEach(column => {
    const column_element = createColumn(column);
    boardContainer.appendChild(column_element);
  })

  app.appendChild(boardContainer);
}

renderBoardsNav();
renderBoard();

if (window.lucide) {
  window.lucide.createIcons();
} else {
  window.addEventListener('load', () => {
    if (window.lucide) window.lucide.createIcons();
  });
}