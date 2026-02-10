export function createColumn({id, title}, tasks = []) {
  const section = document.createElement("section");
  section.className = "column";
  section.dataset.columnId = id; 

  const header = document.createElement("div");
  header.className = "column-header"; 

  const accentDot = document.createElement("span");
  accentDot.className = "accent-dot";

  const titleText = document.createElement("h3");
  titleText.className = "column-title";
  titleText.textContent = title;

  const tasksContainer = document.createElement("div");
  tasksContainer.className = "tasks-container"  

  header.appendChild(accentDot);
  header.appendChild(titleText);

  section.appendChild(header);
  section.appendChild(tasksContainer);
  
  return section;
}
