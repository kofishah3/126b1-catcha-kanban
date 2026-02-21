export function createTaskCard(
  { id, title, createdAt, deadline, priority },
  boardId,
) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.taskId = id;
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "article");
  card.setAttribute(
    "aria-label",
    `Task: ${title}${priority ? `, priority ${priority}` : ""}${deadline ? `, deadline ${deadline}` : ""}`,
  );

  const header = document.createElement("div");
  header.className = "task-card__header";

  const titleText = document.createElement("h3");
  titleText.className = "task-card__title";
  titleText.textContent = title;

  const moveButton = document.createElement("button");
  moveButton.className = "task-card__move-button";
  moveButton.setAttribute("aria-label", `Move task "${title}" to next status`);
  moveButton.innerHTML = `<i data-lucide="circle-check"></i>`;

  moveButton.addEventListener("click", () => {
    document.dispatchEvent(
      new CustomEvent("move-task", {
        detail: { taskId: id },
      }),
    );
  });

  moveButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      moveButton.click();
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "task-card__delete-button";
  deleteButton.setAttribute("aria-label", `Delete task "${title}"`);
  deleteButton.innerHTML = `<i data-lucide="trash"></i>`;

  deleteButton.addEventListener("click", () => {
    document.dispatchEvent(
      new CustomEvent("delete-task", {
        detail: { taskId: id },
      }),
    );
  });

  deleteButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      deleteButton.click();
    }
  });

  const actions = document.createElement("div");
  actions.className = "task-card__actions";
  actions.appendChild(moveButton);
  actions.appendChild(deleteButton);

  header.appendChild(titleText);
  header.appendChild(actions);

  const info = document.createElement("div");
  info.className = "task-card__info";

  if (deadline) {
    const deadlineEl = document.createElement("div");
    deadlineEl.className = "task-card__deadline";
    deadlineEl.innerHTML = `<i data-lucide="clock" aria-hidden="true"></i> <span>${deadline}</span>`;
    info.appendChild(deadlineEl);
  }

  const footer = document.createElement("div");
  footer.className = "task-card__footer";

  if (priority) {
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `task-card__priority task-card__priority--${priority.toLowerCase()}`;
    priorityBadge.textContent = priority;
    priorityBadge.setAttribute("aria-label", `Priority: ${priority}`);
    footer.appendChild(priorityBadge);
  }

  card.appendChild(header);
  card.appendChild(info);
  card.appendChild(footer);

  return card;
}
