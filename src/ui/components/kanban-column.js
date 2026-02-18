import { createTaskCard } from "./task-card.js";
import { createTaskModal } from "./task-modal.js";

export function createColumn({ id, title }, tasks = []) {
  const section = document.createElement("section");
  const columnClassModifier = title.toLowerCase().replace(/\s+/g, "-");
  section.className = `kanban-column kanban-column--${columnClassModifier}`;
  section.dataset.columnId = id;

  const header = document.createElement("div");
  header.className = "kanban-column__header";

  const headerLeft = document.createElement("div");
  headerLeft.className = "kanban-column__header-left";

  const iconName = getIconForTitle(title);
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", iconName);
  icon.className = "kanban-column__icon";

  const titleText = document.createElement("h3");
  titleText.className = "kanban-column__title";
  titleText.textContent = title;

  headerLeft.appendChild(icon);
  headerLeft.appendChild(titleText);

  const addButton = document.createElement("button");
  addButton.className = "kanban-column__add-button";
  addButton.title = "Add task to this column";
  addButton.innerHTML = `<i data-lucide="plus"></i>`;

  header.appendChild(headerLeft);
  header.appendChild(addButton);

  const tasksContainer = document.createElement("div");
  tasksContainer.className = "kanban-column__tasks-container";

  tasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    tasksContainer.appendChild(taskCard);
  });

  section.appendChild(header);
  section.appendChild(tasksContainer);

  // Display Pop up to add task
  addButton.addEventListener("click", () => {
    createTaskModal(id);
  });

  return section;
}

function getIconForTitle(title) {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes("todo") || normalizedTitle.includes("to do"))
    return "circle";
  if (normalizedTitle.includes("doing") || normalizedTitle.includes("progress"))
    return "pencil";
  if (normalizedTitle.includes("done") || normalizedTitle.includes("completed"))
    return "check";
  return "list";
}

