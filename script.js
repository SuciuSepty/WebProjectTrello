function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('hidden');
}

let currentBoardId = null; // ID din baza de date

function buildCommentItem(text, color, commentId) {
    color = color || '#5e6c84';
    const item = document.createElement("div");
    item.classList.add("comment-item");
    item.style.borderLeft = `6px solid ${color}`;
    if (commentId) item.dataset.commentId = commentId;

    const icon = document.createElement("i");
    icon.className = "fas fa-comment fa-xs";
    icon.style.color = color;

    const span = document.createElement("span");
    span.className = "comment-text";
    span.textContent = text;

    const actions = document.createElement("div");
    actions.className = "comment-actions";

    const doneBtn = document.createElement("button");
    doneBtn.className = "comment-action-btn comment-done-btn";
<<<<<<< HEAD
    doneBtn.title = "Marche\u0103z\u0103 ca rezolvat";
=======
    doneBtn.title = "Marcheaza ca rezolvat";
>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
    doneBtn.innerHTML = '<i class="fas fa-check"></i>';
    doneBtn.onclick = function () { item.classList.toggle('comment-done'); };

    const delBtn = document.createElement("button");
    delBtn.className = "comment-action-btn comment-del-btn";
<<<<<<< HEAD
    delBtn.title = "\u0218terge comentariul";
=======
    delBtn.title = "Sterge comentariul";
>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
    delBtn.innerHTML = '<i class="fas fa-times"></i>';
    delBtn.onclick = async function () {
        if (commentId) {
            try { await API.deleteComment(commentId); } catch (e) { console.error(e); }
        }
        item.remove();
    };

    actions.appendChild(doneBtn);
    actions.appendChild(delBtn);
    item.appendChild(icon);
    item.appendChild(span);
    item.appendChild(actions);
    return item;
}

function createCard(titleOrData, checked = false, comments = []) {
    let title, cardId, color;
    if (typeof titleOrData === "object" && titleOrData !== null) {
        title    = titleOrData.title;
        cardId   = titleOrData.id;
        checked  = titleOrData.done;
        color    = titleOrData.color || "#ffffff";
        comments = (titleOrData.comments || []).map(c => ({ text: c.text, color: c.color, id: c.id }));
    } else {
        title = titleOrData;
        color = "#ffffff";
    }
    const template = document.getElementById("card-template");
    const clone    = template.content.cloneNode(true);
    const card     = clone.querySelector(".card");
    card.querySelector(".task-text").textContent = title;
    if (cardId) card.dataset.cardId = cardId;
    if (color)  card.style.backgroundColor = color;

    if (checked) {
        const cb = card.querySelector("input[type='checkbox']");
        cb.checked = true;
        card.querySelector(".task-text").style.textDecoration = "line-through";
        card.querySelector(".task-text").style.opacity = "0.6";
    }
    if (comments.length > 0) {
        const commentsDiv = card.querySelector(".card-comments");
        const commentIcon = card.querySelector('.fa-comment-dots');
        if (commentIcon) commentIcon.style.color = '#0079bf';
        const inputRow = commentsDiv.querySelector('.comments-input-row');
        comments.forEach(c => {
            const text = typeof c === "string" ? c : c.text;
            const col  = typeof c === "string" ? undefined : c.color;
            const cId  = typeof c === "string" ? undefined : c.id;
            commentsDiv.insertBefore(buildCommentItem(text, col, cId), inputRow);
        });
    }
    return card;
}

function createList(nameOrData, cards = []) {
    let name, listId, color;
    if (typeof nameOrData === "object" && nameOrData !== null) {
        name   = nameOrData.name;
        listId = nameOrData.id;
        color  = nameOrData.color || "#ebecf0";
        cards  = (nameOrData.cards || []).map(c => createCard(c));
    } else {
        name  = nameOrData;
        color = "#ebecf0";
    }
    const template = document.getElementById("list-template");
    const clone    = template.content.cloneNode(true);
    const listEl   = clone.firstElementChild;
    listEl.querySelector(".list-title").textContent = name;
    listEl.style.backgroundColor = color;
    if (listId) listEl.dataset.listId = listId;
    const container = listEl.querySelector(".cards-container");
    cards.forEach(c => container.appendChild(c));
    return listEl;
}

<<<<<<< HEAD
async function loadBoardsFromAPI() {
    let boards;
    try {
        boards = await API.getBoards();
    } catch (e) {
        console.error("Nu pot contacta API-ul.", e);
        document.getElementById("emptyStateText").textContent = "Backend offline.";
        return;
    }
    boards.forEach(b => _appendBoardToSidebar(b));
    const firstLi = document.querySelector(".board-list li");
    if (firstLi) firstLi.click();
=======
// tabloul de demo pt facultate -- apare automat la incarcare
function createFacultateBoard() {
    const boardId = ++boardCounter;

    const lista1 = createList("De facut", [
        createCard("Referat Sisteme de Operare", false, ["Trebuie trimis pana vineri!", "Minim 5 pagini"]),
        createCard("Tema Baze de Date – modelul E-R"),
        createCard("Citit capitolul 4 din Algoritmi"),
        createCard("Inscris la examen sesiune iunie"),
        createCard("Cerere bursa de merit"),
    ]);

    const lista2 = createList("In progres", [
        createCard("Proiect HTML etapa 1", false, ["Trebuie sa contina HTML, CSS si JS", "Demo live la laborator"]),
        createCard("Lab 3 Programare Orientata pe Obiecte", false, ["Clasa Animal cu mostenire"]),
    ]);

    const lista3 = createList("Finalizat ✓", [
        createCard("Instalat Visual Studio Code", true),
        createCard("Creat cont GitHub", true, ["username: student_ro"]),
    ]);

    boardStates.set(boardId, [lista1, lista2, lista3]);

    const boardList = document.getElementById("boardList");
    const template = document.getElementById("board-template");
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector("li");
    li.dataset.boardId = boardId;
    li.querySelector(".board-emoji").textContent = "📚";
    clone.querySelector(".board-name").textContent = "Facultate";

    li.addEventListener("click", function () {
        if (currentBoardId === parseInt(this.dataset.boardId)) return;
        saveCurrentBoardState();
        document.querySelectorAll(".board-list li").forEach(el => el.classList.remove("active"));
        this.classList.add("active");
        currentBoardId = parseInt(this.dataset.boardId);
        loadBoardState(currentBoardId);
        document.getElementById("currentBoardTitle").style.display = "inline-flex";
        document.getElementById("currentBoardTitle").innerHTML = `📚 Facultate <i class="fas fa-star" style="color: gold; font-size: 16px;"></i>`;
        document.getElementById("emptyStateText").style.display = "none";
        document.getElementById("listsContainer").style.display = "flex";
    });

    boardList.appendChild(clone);
    li.click();
>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
}

document.addEventListener("DOMContentLoaded", () => {
    loadBoardsFromAPI();
    document.getElementById("emoji-grid").addEventListener("click", e => {
        const btn = e.target.closest(".emoji-btn");
        if (!btn) return;
        document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

<<<<<<< HEAD
function _appendBoardToSidebar(board) {
=======
function createDefaultLists(boardId) {
    // cele 2 liste predefinite cu care porneste orice tablou nou
    const defaultNames = ["De facut", "In progres"];
    const template = document.getElementById("list-template");
    const nodes = [];
    defaultNames.forEach(name => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".list-title").textContent = name;
        nodes.push(clone.firstElementChild);
    });
    boardStates.set(boardId, nodes);
}

function saveCurrentBoardState() {
    if (currentBoardId === null) return;
    // detasam listele din DOM si le salvam in memoria tabloului curent
    const listsContainer = document.getElementById("listsContainer");
    const lists = [...listsContainer.querySelectorAll(":scope > .list")];
    boardStates.set(currentBoardId, lists);
    lists.forEach(l => l.remove());
}

function loadBoardState(boardId) {
    const listsContainer = document.getElementById("listsContainer");
    const addListWrapper = document.querySelector(".add-list-wrapper");
    const lists = boardStates.get(boardId) || [];
    // re-inseram listele salvate inaintea butonului de add
    lists.forEach(l => listsContainer.insertBefore(l, addListWrapper));
}

// desc un tablou nou -- lobby gol, niciun jucator inca
function addNewBoard() {
    openModal("board");
}

function _spawnBoard(boardName, boardEmoji) {
    const boardId = ++boardCounter;
    createDefaultLists(boardId);

>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
    const boardList = document.getElementById("boardList");
    const template  = document.getElementById("board-template");
    const clone     = template.content.cloneNode(true);
    const li        = clone.querySelector("li");
    li.dataset.boardId = board.id;
    li.querySelector(".board-emoji").textContent = board.emoji;
    li.querySelector(".board-name").textContent  = board.name;
    li.addEventListener("click", async function () {
        if (currentBoardId === parseInt(this.dataset.boardId)) return;
        document.querySelectorAll(".board-list li").forEach(el => el.classList.remove("active"));
        this.classList.add("active");
        currentBoardId = parseInt(this.dataset.boardId);
        document.getElementById("emptyStateText").style.display = "none";
        document.getElementById("listsContainer").style.display = "flex";
        document.getElementById("currentBoardTitle").style.display = "inline-flex";
        document.getElementById("currentBoardTitle").innerHTML =
            `${board.emoji} ${board.name} (${board.week}) <i class="fas fa-star" style="color: gold; font-size: 16px;"></i>`;
        try {
            const freshBoard = await API.getBoard(currentBoardId);
            _renderBoardLists(freshBoard);
        } catch (e) {
            console.error("Eroare la încărcarea board-ului:", e);
        }
    });
    boardList.appendChild(clone);
}

function _renderBoardLists(board) {
    const listsContainer = document.getElementById("listsContainer");
    const addListWrapper = document.querySelector(".add-list-wrapper");
    listsContainer.querySelectorAll(":scope > .list").forEach(l => l.remove());
    (board.lists || []).forEach(listData => {
        const listEl = createList(listData);
        listsContainer.insertBefore(listEl, addListWrapper);
    });
}

function addNewBoard() { openModal("board"); }

async function _spawnBoard(boardName, boardEmoji, boardWeek) {
    let board;
    try {
        board = await API.createBoard(boardName, boardEmoji, boardWeek);
    } catch (e) { alert("Eroare la crearea tabloului: " + e.message); return; }
    board.lists = [];
    _appendBoardToSidebar(board);
    const li = document.querySelector(`.board-list li[data-board-id="${board.id}"]`);
    if (li) li.click();
}

function addNewList() { openModal("list"); }

async function _deleteList(listEl) {
    const listId = listEl.dataset.listId;
    if (listId) {
        try { await API.deleteList(parseInt(listId)); } catch (e) { console.error(e); }
    }
    listEl.remove();
}

function addNewCard(buttonElement) { openModal("card", buttonElement); }

async function _deleteCard(cardEl) {
    const cardId = cardEl.dataset.cardId;
    if (cardId) {
        try { await API.deleteCard(parseInt(cardId)); } catch (e) { console.error(e); }
    }
    cardEl.remove();
}

let modalContext = null;
let modalCardButtonRef = null;

function openModal(mode, buttonRef = null) {
    modalContext = mode;
    modalCardButtonRef = buttonRef;
    document.getElementById("input-board-name").value = "";
    document.getElementById("input-board-week").value = "";
    document.getElementById("input-list-name").value  = "";
    document.getElementById("input-card-name").value  = "";
    document.getElementById("input-card-comment").value = "";
    document.getElementById("input-list-color").value = "#ebecf0";
    document.getElementById("input-list-hex").value   = "#ebecf0";
    document.getElementById("input-card-color").value = "#ffffff";
    document.getElementById("input-card-hex").value   = "#ffffff";

    const boardSection = document.getElementById("modal-board-section");
    const listSection  = document.getElementById("modal-list-section");
    const cardLabel    = document.getElementById("modal-card-label");

    if (mode === "board") {
        document.getElementById("modal-title").textContent = "Tablou nou";
        boardSection.style.display = "block";
        listSection.style.display  = "none";
        document.getElementById("modal-card-section").style.display = "none";
        document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
        document.querySelector(".emoji-btn").classList.add("active");
        document.getElementById("input-custom-emoji").value = "";
    } else if (mode === "list") {
<<<<<<< HEAD
        document.getElementById("modal-title").textContent = "Tabel\u0103 nou\u0103";
=======
        document.getElementById("modal-title").textContent = "Tabela noua";
>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
        boardSection.style.display = "none";
        listSection.style.display  = "block";
        document.getElementById("modal-card-section").style.display = "block";
<<<<<<< HEAD
        cardLabel.textContent = "Sarcin\u0103 ini\u0163ial\u0103 (op\u0163ional)";
    } else {
        document.getElementById("modal-title").textContent = "Sarcin\u0103 nou\u0103";
=======
        cardLabel.textContent = "Sarcina initiala (optional)";
    } else {
        document.getElementById("modal-title").textContent = "Sarcina noua";
>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
        boardSection.style.display = "none";
        listSection.style.display  = "none";
        document.getElementById("modal-card-section").style.display = "block";
<<<<<<< HEAD
        cardLabel.textContent = "Sarcin\u0103";
=======
        cardLabel.textContent = "Sarcina";
>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
    }
    document.getElementById("modal-overlay").classList.add("open");
    setTimeout(() => {
        const first = mode === "board" ? "input-board-name" : mode === "list" ? "input-list-name" : "input-card-name";
        document.getElementById(first).focus();
    }, 60);
}

function closeModal() {
    document.getElementById("modal-overlay").classList.remove("open");
    modalContext = null;
    modalCardButtonRef = null;
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
}

function syncHex(type) {
    document.getElementById(`input-${type}-hex`).value = document.getElementById(`input-${type}-color`).value;
}

function syncColor(type) {
    const hex = document.getElementById(`input-${type}-hex`).value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
        document.getElementById(`input-${type}-color`).value = hex;
    }
}

function onCustomEmojiType() {
    const val = document.getElementById("input-custom-emoji").value.trim();
    if (val) document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
}

async function confirmModal() {
    if (modalContext === "board") {
        const boardName = document.getElementById("input-board-name").value.trim();
        if (!boardName) { document.getElementById("input-board-name").focus(); return; }
        const customEmoji = document.getElementById("input-custom-emoji").value.trim();
        const activeEmoji = document.querySelector(".emoji-btn.active");
        const boardEmoji  = customEmoji || (activeEmoji ? activeEmoji.dataset.emoji : "\ud83d\udccc");
        const boardWeek = document.getElementById("input-board-week").value.trim();
        if (!boardWeek) { document.getElementById("input-board-week").focus(); return; }
        closeModal();
        await _spawnBoard(boardName, boardEmoji, boardWeek);
        return;
    }
    if (modalContext === "list") {
        const listName = document.getElementById("input-list-name").value.trim();
        if (!listName) { document.getElementById("input-list-name").focus(); return; }
        if (!currentBoardId) { alert("Selecteaz\u0103 un tablou mai \u00eent\u00e2i."); return; }

        const listColor   = document.getElementById("input-list-color").value;
        const cardName    = document.getElementById("input-card-name").value.trim();
        const cardColor   = document.getElementById("input-card-color").value;
        const cardComment = document.getElementById("input-card-comment").value.trim();
        closeModal();

        let listData;
        try {
            listData = await API.createList(currentBoardId, listName, listColor);
        } catch (e) { alert("Eroare la crearea listei: " + e.message); return; }
        listData.cards = [];

        if (cardName) {
            try {
                const cardData = await API.createCard(listData.id, cardName, cardColor);
                if (cardComment) {
                    const commentData = await API.createComment(cardData.id, cardComment, "#5e6c84");
                    cardData.comments = [commentData];
                } else { cardData.comments = []; }
                listData.cards.push(cardData);
            } catch (e) { console.error(e); }
        }

        const listEl = createList(listData);
        const listsContainer = document.getElementById("listsContainer");
        listsContainer.insertBefore(listEl, document.querySelector(".add-list-wrapper"));
        return;
    }
    if (modalContext === "card") {
        const cardName = document.getElementById("input-card-name").value.trim();
        if (!cardName) { document.getElementById("input-card-name").focus(); return; }

        const cardColor   = document.getElementById("input-card-color").value;
        const cardComment = document.getElementById("input-card-comment").value.trim();
        const listEl      = modalCardButtonRef.closest(".list");
        const listId      = listEl ? parseInt(listEl.dataset.listId) : null;
        const cardsContainer = listEl ? listEl.querySelector(".cards-container") : null;
        closeModal();

        let cardData;
        if (listId) {
            try {
                cardData = await API.createCard(listId, cardName, cardColor);
                if (cardComment) {
                    const commentData = await API.createComment(cardData.id, cardComment, "#5e6c84");
                    cardData.comments = [commentData];
                } else { cardData.comments = []; }
            } catch (e) { alert("Eroare la crearea sarcinii: " + e.message); return; }
        }
        const card = cardData ? createCard(cardData) : createCard(cardName, false, cardComment ? [cardComment] : []);
        card.style.backgroundColor = cardColor;
        if (cardsContainer) cardsContainer.appendChild(card);
    }
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function openTaskDetails(cardElement, event) {
    if (
        event.target.closest(".card-actions") ||
        event.target.closest("input[type='checkbox']") ||
        event.target.closest(".card-comments")
    ) return;
    toggleComments(cardElement.querySelector('.fa-comment-dots'));
}

async function toggleTask(checkboxElement) {
    const taskText = checkboxElement.nextElementSibling;
    const card     = checkboxElement.closest(".card");
    const cardId   = card ? parseInt(card.dataset.cardId) : null;
    if (checkboxElement.checked) {
        taskText.style.textDecoration = "line-through";
        taskText.style.opacity = "0.6";
    } else {
        taskText.style.textDecoration = "none";
        taskText.style.opacity = "1";
    }
    if (cardId) {
        try { await API.updateCard(cardId, { done: checkboxElement.checked }); } catch (e) { console.error(e); }
    }
}

function toggleComments(iconElement) {
    const card        = iconElement.closest('.card');
    const commentsDiv = card.querySelector('.card-comments');
    const isOpen      = commentsDiv.classList.contains('comments-open');
    if (isOpen) {
        commentsDiv.classList.remove('comments-open');
        if (!commentsDiv.querySelector('.comment-item')) iconElement.style.color = '';
    } else {
        commentsDiv.classList.add('comments-open');
        iconElement.style.color = '#0079bf';
        const input = commentsDiv.querySelector('.comment-input');
        if (input) setTimeout(() => input.focus(), 50);
    }
}

async function submitComment(btnEl) {
    const commentsDiv = btnEl.closest('.card-comments');
    const input       = commentsDiv.querySelector('.comment-input');
    const colorPicker = commentsDiv.querySelector('.comment-color-picker');
    const commentText = input.value.trim();
    if (!commentText) return;

    const card        = commentsDiv.closest('.card');
    const commentIcon = card.querySelector('.fa-comment-dots');
    if (commentIcon) commentIcon.style.color = '#0079bf';

    const color  = colorPicker ? colorPicker.value : '#5e6c84';
    const cardId = card ? parseInt(card.dataset.cardId) : null;

    let commentId;
    if (cardId) {
        try {
            const data = await API.createComment(cardId, commentText, color);
            commentId  = data.id;
        } catch (e) { console.error(e); }
    }

    const newComment = buildCommentItem(commentText, color, commentId);
    newComment.style.borderLeft = `6px solid ${color}`;
    const inputRow = commentsDiv.querySelector('.comments-input-row');
    commentsDiv.insertBefore(newComment, inputRow);
    input.value = '';
    input.focus();
}

function handleCommentKey(event, input) {
<<<<<<< HEAD
    if (event.key === 'Enter') submitComment(input.nextElementSibling);
}
=======
    if (event.key === 'Enter') {
        submitComment(input.nextElementSibling);
    }
}

>>>>>>> edb359db62dc225b8ed98ed3bd7a53e45951fcab
