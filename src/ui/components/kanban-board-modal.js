export function createKanbanBoardModal() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "task-modal";

    modal.innerHTML = `
        <h2>Create Kanban Board</h2>

        <label>
            Board Name
            <input type="text" id="board-name" placeholder="Enter board name" />
        </label>

        <div class="modal-actions">
            <button id="cancel-board">Cancel</button>
            <button id="create-board">Create</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector("#cancel-board").onclick = () => overlay.remove();

    modal.querySelector("#create-board").onclick = () => {
        const name = modal.querySelector("#board-name").value.trim();
        if (!name) return alert("Board name is required");

        document.dispatchEvent(
            new CustomEvent("create-board", {
                detail: { name },
            })
        );

        overlay.remove();
    };
}

