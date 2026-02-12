export function createColumn({id, title}, tasks = []) {
  const section = document.createElement("section");
  section.className = "kanban-column";
  section.dataset.columnId = id; 

  const header = document.createElement("div");
  header.className = "kanban-column_header"; 

  const accentDot = document.createElement("span");
  accentDot.className = "kanban-column_accent-dot";

  const titleText = document.createElement("h3");
  titleText.className = "kanban-column_title";
  titleText.textContent = title;

  const tasksContainer = document.createElement("div");
  tasksContainer.className = "kanban-column_tasks-container"  

  header.appendChild(accentDot);
  header.appendChild(titleText);

  section.appendChild(header);
  section.appendChild(tasksContainer);
                                                                                                                  

  
  return section;
}
