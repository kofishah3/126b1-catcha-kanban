import { createTaskCard } from "./task-card.js";

export function createColumn({ id, title }, tasks = [], boardId) {
  const section = document.createElement("section");
  const columnClassModifier = title.toLowerCase().replace(/\s+/g, "-");
  section.className = `kanban-column kanban-column--${columnClassModifier}`;
  section.dataset.columnId = id;
  section.setAttribute("aria-label", `${title} column`);

  const header = document.createElement("div");
  header.className = "kanban-column__header";

  const headerLeft = document.createElement("div");
  headerLeft.className = "kanban-column__header-left";

  const iconName = getIconForTitle(title);
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", iconName);
  icon.className = "kanban-column__icon";
  icon.setAttribute("aria-hidden", "true");

  const titleText = document.createElement("h3");
  titleText.className = "kanban-column__title";
  titleText.textContent = title;

  headerLeft.appendChild(icon);
  headerLeft.appendChild(titleText);

  const addButton = document.createElement("button");
  addButton.className = "kanban-column__add-button";
  addButton.setAttribute("aria-label", `Add task to ${title}`);
  addButton.innerHTML = `<i data-lucide="plus" aria-hidden="true"></i>`;

  addButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addButton.click();
    }
  });

  header.appendChild(headerLeft);
  header.appendChild(addButton);

  const tasksContainer = document.createElement("div");
  tasksContainer.className = "kanban-column__tasks-container";
  tasksContainer.setAttribute("role", "list");
  tasksContainer.setAttribute("aria-label", `${title} tasks`);

  tasks.forEach((task) => {
    const taskCard = createTaskCard(task, boardId);
    taskCard.setAttribute("role", "listitem");
    tasksContainer.appendChild(taskCard);
  });

  section.appendChild(header);
  section.appendChild(tasksContainer);

  section.addEventListener("dragover", (e) => {
    e.preventDefault();
    section.classList.add("kanban-column--drag-over");
  });

  section.addEventListener("dragleave", () => {
    section.classList.remove("kanban-column--drag-over");
  });

  section.addEventListener("drop", (e) => {
    e.preventDefault();
    section.classList.remove("kanban-column--drag-over");
    const taskId = e.dataTransfer.getData("text/plain");

    document.dispatchEvent(
      new CustomEvent("move-task-to-column", {
        detail: { taskId, newColumnId: id },
      }),
    );
  });

  addButton.addEventListener("click", () => {
    document._lastFocusedBeforeModal = addButton;
    document.dispatchEvent(
      new CustomEvent("open-create-task", {
        detail: { columnId: id },
      }),
    );
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
