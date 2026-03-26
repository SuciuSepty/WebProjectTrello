function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('hidden');
}

// fiecare tablou primeste un id unic ca sa nu se incurce starea lor
let boardCounter = 0;
let currentBoardId = null;
const boardStates = new Map(); // id -> array de noduri .list

// construieste un element comment-item cu actiuni (completat / sters)
function buildCommentItem(text, color) {
    color = color || '#5e6c84';
    const item = document.createElement("div");
    item.classList.add("comment-item");
    item.style.borderLeft = `6px solid ${color}`;

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
    doneBtn.title = "Marcheaza ca rezolvat";
    doneBtn.innerHTML = '<i class="fas fa-check"></i>';
    doneBtn.onclick = function() {
        item.classList.toggle('comment-done');
    };

    const delBtn = document.createElement("button");
    delBtn.className = "comment-action-btn comment-del-btn";
    delBtn.title = "Sterge comentariul";
    delBtn.innerHTML = '<i class="fas fa-times"></i>';
    delBtn.onclick = function() {
        item.remove();
    };

    actions.appendChild(doneBtn);
    actions.appendChild(delBtn);

    item.appendChild(icon);
    item.appendChild(span);
    item.appendChild(actions);
    return item;
}

function createCard(text, checked = false, comments = []) {
    const template = document.getElementById("card-template");
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".card");
    card.querySelector(".task-text").textContent = text;

    if (checked) {
        const cb = card.querySelector("input[type='checkbox']");
        cb.checked = true;
        card.querySelector(".task-text").style.textDecoration = "line-through";
        card.querySelector(".task-text").style.opacity = "0.6";
    }

    if (comments.length > 0) {
        const commentsDiv = card.querySelector(".card-comments");
        // coloreaza iconita albastru daca are comentarii
        const commentIcon = card.querySelector('.fa-comment-dots');
        if (commentIcon) commentIcon.style.color = '#0079bf';
        const inputRow = commentsDiv.querySelector('.comments-input-row');
        comments.forEach(text => {
            commentsDiv.insertBefore(buildCommentItem(text), inputRow);
        });
    }

    return card;
}

function createList(name, cards = []) {
    const template = document.getElementById("list-template");
    const clone = template.content.cloneNode(true);
    const listEl = clone.firstElementChild;
    listEl.querySelector(".list-title").textContent = name;
    const container = listEl.querySelector(".cards-container");
    cards.forEach(c => container.appendChild(c));
    return listEl;
}

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
}

// porneste aplicatia cu tabloul de demo pregatit
document.addEventListener("DOMContentLoaded", () => {
    createFacultateBoard();

    // click pe un emoji il selecteaza si il deselecteaza pe cel anterior
    document.getElementById("emoji-grid").addEventListener("click", e => {
        const btn = e.target.closest(".emoji-btn");
        if (!btn) return;
        document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

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

    const boardList = document.getElementById("boardList");
    const template = document.getElementById("board-template");

    const clone = template.content.cloneNode(true);
    const li = clone.querySelector("li");
    li.dataset.boardId = boardId;
    clone.querySelector(".board-emoji").textContent = boardEmoji;
    clone.querySelector(".board-name").textContent = boardName;

    li.addEventListener("click", function() {
        if (currentBoardId === parseInt(this.dataset.boardId)) return;
        saveCurrentBoardState();

        document.querySelectorAll(".board-list li").forEach(el => el.classList.remove("active"));
        this.classList.add("active");

        currentBoardId = parseInt(this.dataset.boardId);
        loadBoardState(currentBoardId);

        document.getElementById("currentBoardTitle").style.display = "inline-flex";
        document.getElementById("currentBoardTitle").innerHTML = `${boardEmoji} ${boardName} <i class="fas fa-star" style="color: gold; font-size: 16px;"></i>`;
        document.getElementById("emptyStateText").style.display = "none";
        document.getElementById("listsContainer").style.display = "flex";
    });

    boardList.appendChild(clone);
    li.click(); // intra direct, nu astepta loading screen
}

function addNewList() {
    openModal("list");
}

function addNewCard(buttonElement) {
    openModal("card", buttonElement);
}

function onCustomEmojiType() {
    const val = document.getElementById("input-custom-emoji").value.trim();
    if (val) {
        // daca userul scrie ceva, deselectam gridul
        document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
    }
}

// ===== MODAL =====

let modalContext = null;
let modalCardButtonRef = null;

function openModal(mode, buttonRef = null) {
    modalContext = mode;
    modalCardButtonRef = buttonRef;

    document.getElementById("input-board-name").value = "";
    document.getElementById("input-list-name").value = "";
    document.getElementById("input-card-name").value = "";
    document.getElementById("input-card-comment").value = "";
    document.getElementById("input-list-color").value = "#ebecf0";
    document.getElementById("input-list-hex").value = "#ebecf0";
    document.getElementById("input-card-color").value = "#ffffff";
    document.getElementById("input-card-hex").value = "#ffffff";

    const boardSection = document.getElementById("modal-board-section");
    const listSection = document.getElementById("modal-list-section");
    const cardLabel = document.getElementById("modal-card-label");

    if (mode === "board") {
        document.getElementById("modal-title").textContent = "Tablou nou";
        boardSection.style.display = "block";
        listSection.style.display = "none";
        document.getElementById("modal-card-section").style.display = "none";
        // resetam selectia emoji la primul element si golim custom input
        document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
        document.querySelector(".emoji-btn").classList.add("active");
        document.getElementById("input-custom-emoji").value = "";
    } else if (mode === "list") {
        document.getElementById("modal-title").textContent = "Tabela noua";
        boardSection.style.display = "none";
        listSection.style.display = "block";
        document.getElementById("modal-card-section").style.display = "block";
        cardLabel.textContent = "Sarcina initiala (optional)";
    } else {
        document.getElementById("modal-title").textContent = "Sarcina noua";
        boardSection.style.display = "none";
        listSection.style.display = "none";
        document.getElementById("modal-card-section").style.display = "block";
        cardLabel.textContent = "Sarcina";
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

function confirmModal() {
    if (modalContext === "board") {
        const boardName = document.getElementById("input-board-name").value.trim();
        if (!boardName) { document.getElementById("input-board-name").focus(); return; }
        const customEmoji = document.getElementById("input-custom-emoji").value.trim();
        const activeEmoji = document.querySelector(".emoji-btn.active");
        const boardEmoji = customEmoji || (activeEmoji ? activeEmoji.dataset.emoji : "📌");
        closeModal();
        _spawnBoard(boardName, boardEmoji);
        return;
    }
    if (modalContext === "list") {
        const listName = document.getElementById("input-list-name").value.trim();
        if (!listName) { document.getElementById("input-list-name").focus(); return; }

        const listColor = document.getElementById("input-list-color").value;
        const cardName  = document.getElementById("input-card-name").value.trim();
        const cardColor = document.getElementById("input-card-color").value;
        const cardComment = document.getElementById("input-card-comment").value.trim();

        const listEl = createList(listName);
        listEl.style.backgroundColor = listColor;

        if (cardName) {
            const card = createCard(cardName, false, cardComment ? [cardComment] : []);
            card.style.backgroundColor = cardColor;
            listEl.querySelector(".cards-container").appendChild(card);
        }

        const listsContainer = document.getElementById("listsContainer");
        listsContainer.insertBefore(listEl, document.querySelector(".add-list-wrapper"));

    } else if (modalContext === "card") {
        const cardName = document.getElementById("input-card-name").value.trim();
        if (!cardName) { document.getElementById("input-card-name").focus(); return; }

        const cardColor   = document.getElementById("input-card-color").value;
        const cardComment = document.getElementById("input-card-comment").value.trim();

        const card = createCard(cardName, false, cardComment ? [cardComment] : []);
        card.style.backgroundColor = cardColor;
        modalCardButtonRef.previousElementSibling.appendChild(card);
    }

    closeModal();
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ===========

// click pe card = toggle comentarii, dar nu si daca apesi pe iconite, checkbox sau in zona de comentarii
function openTaskDetails(cardElement, event) {
    if (
        event.target.closest(".card-actions") ||
        event.target.closest("input[type='checkbox']") ||
        event.target.closest(".card-comments")
    ) {
        return;
    }
    toggleComments(cardElement.querySelector('.fa-comment-dots'));
}

function toggleTask(checkboxElement) {
    const taskText = checkboxElement.nextElementSibling;
    if (checkboxElement.checked) {
        taskText.style.textDecoration = "line-through";
        taskText.style.opacity = "0.6";
    } else {
        taskText.style.textDecoration = "none";
        taskText.style.opacity = "1";
    }
}

// toggle comentarii -- click pe iconita deschide/inchide sectiunea
function toggleComments(iconElement) {
    const card = iconElement.closest('.card');
    const commentsDiv = card.querySelector('.card-comments');
    const isOpen = commentsDiv.classList.contains('comments-open');

    if (isOpen) {
        commentsDiv.classList.remove('comments-open');
        // pastram iconita albastra daca are comentarii
        if (!commentsDiv.querySelector('.comment-item')) {
            iconElement.style.color = '';
        }
    } else {
        commentsDiv.classList.add('comments-open');
        iconElement.style.color = '#0079bf';
        // focus automat pe input cand deschizi
        const input = commentsDiv.querySelector('.comment-input');
        if (input) setTimeout(() => input.focus(), 50);
    }
}

// submit fara prompt -- citeste din inputul inline
function submitComment(btnEl) {
    const commentsDiv = btnEl.closest('.card-comments');
    const input = commentsDiv.querySelector('.comment-input');
    const colorPicker = commentsDiv.querySelector('.comment-color-picker');
    const commentText = input.value.trim();
    if (!commentText) return;

    const card = commentsDiv.closest('.card');
    const commentIcon = card.querySelector('.fa-comment-dots');
    if (commentIcon) commentIcon.style.color = '#0079bf';

    const color = colorPicker ? colorPicker.value : '#5e6c84';

    const newComment = buildCommentItem(commentText, color);
    // border mai gros pentru vizibilitate
    newComment.style.borderLeft = `6px solid ${color}`;

    // comentariile se adauga deasupra inputului
    const inputRow = commentsDiv.querySelector('.comments-input-row');
    commentsDiv.insertBefore(newComment, inputRow);

    input.value = '';
    input.focus();
}

// Enter = trimite comentariul
function handleCommentKey(event, input) {
    if (event.key === 'Enter') {
        submitComment(input.nextElementSibling);
    }
}

