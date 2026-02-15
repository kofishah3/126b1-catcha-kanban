export function createColumn({ id, title }, tasks = []) {
  const section = document.createElement("section");
  const columnClassModifier = title.toLowerCase().replace(/\s+/g, "-");
  section.className = `kanban-column kanban-column--${columnClassModifier}`;
  section.dataset.columnId = id;

  const header = document.createElement("div");
  header.className = "kanban-column__header";

  const iconName = getIconForTitle(title);
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", iconName);
  icon.className = "kanban-column__icon";

  const titleText = document.createElement("h3");
  titleText.className = "kanban-column__title";
  titleText.textContent = title;

  const tasksContainer = document.createElement("div");
  tasksContainer.className = "kanban-column__tasks-container";

  header.appendChild(icon);
  header.appendChild(titleText);

  section.appendChild(header);
  section.appendChild(tasksContainer);

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
