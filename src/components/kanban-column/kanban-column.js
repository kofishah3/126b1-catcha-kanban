import { TaskCard } from "../task-card/task-card.js";

export async function createColumn({ id, title }, tasks = [], boardId) {
  const $section = document.createElement("section");
  const columnClassModifier = title.toLowerCase().replace(/\s+/g, "-");
  $section.className = `kanban-column kanban-column--${columnClassModifier}`;
  $section.dataset.columnId = id;
  $section.setAttribute("aria-label", `${title} column`);

  if (!createColumn.template) {
    const response = await fetch(
      "./src/components/kanban-column/kanban-column.html",
    );
    createColumn.template = await response.text();
  }

  $section.innerHTML = createColumn.template;

  const titleText = $section.querySelector(".kanban-column__title");
  titleText.textContent = title;

  const icon = $section.querySelector(".kanban-column__icon");
  icon.setAttribute("data-lucide", getIconForTitle(title));

  const addButton = $section.querySelector(".kanban-column__add-button");
  addButton.setAttribute("aria-label", `Add task to ${title}`);

  const tasksContainer = $section.querySelector(
    ".kanban-column__tasks-container",
  );
  tasksContainer.setAttribute("aria-label", `${title} tasks`);

  for (const task of tasks) {
    const taskCardInstance = new TaskCard(task, boardId);
    const taskCard = await taskCardInstance.render();
    taskCard.setAttribute("role", "listitem");
    tasksContainer.appendChild(taskCard);
  }

  $section.addEventListener("dragover", (e) => {
    e.preventDefault();
    $section.classList.add("kanban-column--drag-over");
  });

  $section.addEventListener("dragleave", () => {
    $section.classList.remove("kanban-column--drag-over");
  });

  $section.addEventListener("drop", (e) => {
    e.preventDefault();
    $section.classList.remove("kanban-column--drag-over");
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

  addButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addButton.click();
    }
  });

  return $section;
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
