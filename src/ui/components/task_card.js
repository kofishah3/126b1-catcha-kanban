export function createTaskCard({id, title}) {
  const card = document.createElement("div");
  card.className = "task-card"
  card.dataset.id = id;

  const titleText = document.createElement("h3");
  titleText.className = "task-title";
  titleText.textContent = title;

  card.appendChild(titleText);
  
  return card;
}