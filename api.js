// Toate apelurile catre backend sunt aici
const API_BASE = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });
    if (res.status === 204) return null;
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
}

const API = {
    getBoards:      ()                    => apiFetch("/boards"),
    getBoard:       (id)                  => apiFetch(`/boards/${id}`),
    createBoard:    (name, emoji, week)   => apiFetch("/boards", { method: "POST", body: JSON.stringify({name, emoji, week}) }),
    deleteBoard:    (id)                  => apiFetch(`/boards/${id}`, { method: "DELETE" }),

    createList:     (boardId, name, color) => apiFetch(`/boards/${boardId}/lists`, { method: "POST", body: JSON.stringify({ name, color }) }),
    deleteList:     (listId)              => apiFetch(`/lists/${listId}`, { method: "DELETE" }),

    createCard:     (listId, title, color) => apiFetch(`/lists/${listId}/cards`, { method: "POST", body: JSON.stringify({ title, color }) }),
    updateCard:     (cardId, patch)        => apiFetch(`/cards/${cardId}`, { method: "PUT", body: JSON.stringify(patch) }),
    deleteCard:     (cardId)              => apiFetch(`/cards/${cardId}`, { method: "DELETE" }),

    createComment:  (cardId, text, color) => apiFetch(`/cards/${cardId}/comments`, { method: "POST", body: JSON.stringify({ text, color }) }),
    deleteComment:  (commentId)           => apiFetch(`/comments/${commentId}`, { method: "DELETE" }),
};
