const waiting = document.querySelector("#waiting");
const candidateCard = document.querySelector("#candidate");
const ref = document.querySelector("#ref");
const verse = document.querySelector("#verse");
const asr = document.querySelector("#asr");
const connection = document.querySelector("#connection");
const status = document.querySelector("#status");
const approve = document.querySelector("#approve");
const reject = document.querySelector("#reject");
const manualRef = document.querySelector("#manualRef");
const manualApply = document.querySelector("#manualApply");
const manualStatus = document.querySelector("#manualStatus");
const bookNames = document.querySelector("#bookNames");
const bookSuggestions = document.querySelector("#bookSuggestions");
const pipelineStage = document.querySelector("#pipelineStage");
const pipelineProgress = document.querySelector("#pipelineProgress");
const pipelineMessage = document.querySelector("#pipelineMessage");
const manualHint = document.querySelector("#manualHint");
const manualCard = document.querySelector("#manualCard");
let books = [];

const stageNames = {
  listening: "Слушаю",
  ner: "Распознаю речь",
  resolver: "Разбираю ссылку",
  direct: "Разбираю ссылку",
  quote_context: "Поиск по тексту стиха",
  not_found: "Ссылка не найдена",
  candidate: "Ожидает подтверждения",
  approved: "Отправлено",
  rejected: "Отклонено",
};

function renderProcessing(processing = {}) {
  const stage = processing.stage || "listening";
  const manualRequired = Boolean(processing.manual_required);
  pipelineStage.textContent = stageNames[stage] || "Распознавание";
  pipelineProgress.value = Number(processing.progress) || 0;
  pipelineMessage.textContent = processing.message || "LiVerse слушает речь";
  manualHint.classList.toggle("hidden", !manualRequired);
  manualCard.classList.toggle("attention", manualRequired);
}

function render(state) {
  renderProcessing((state && state.processing) || {});
  const candidate = state && state.candidate;
  waiting.classList.toggle("hidden", Boolean(candidate));
  candidateCard.classList.toggle("hidden", !candidate);
  if (!candidate) return;
  ref.textContent = candidate.ref || "Неизвестная ссылка";
  verse.textContent = candidate.verse || "";
  asr.textContent = candidate.asr || candidate.detected_text || "";
  status.textContent = "";
}

async function decide(action) {
  approve.disabled = true;
  reject.disabled = true;
  status.textContent = action === "approve" ? "Отправляю в Holyrics…" : "Отклоняю…";
  try {
    const response = await fetch(`/api/${action}`, { method: "POST" });
    const result = await response.json();
    if (!result.ok) throw new Error(result.reason || "Ошибка");
    status.textContent = action === "approve" ? "Отправлено" : "Отклонено";
  } catch (error) {
    status.textContent = `Ошибка: ${error.message}`;
  } finally {
    approve.disabled = false;
    reject.disabled = false;
  }
}

approve.addEventListener("click", () => decide("approve"));
reject.addEventListener("click", () => decide("reject"));

function bookQuery(value) {
  return value.trimStart().replace(/\s+\d.*$/, "").toLocaleLowerCase("ru-RU");
}

function renderBookSuggestions() {
  const query = bookQuery(manualRef.value);
  bookSuggestions.replaceChildren();
  if (!query || /\d/.test(manualRef.value)) return;
  books
    .filter((book) => book.toLocaleLowerCase("ru-RU").startsWith(query))
    .slice(0, 6)
    .forEach((book) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "book-suggestion";
      button.textContent = book;
      button.addEventListener("click", () => {
        manualRef.value = `${book} `;
        bookSuggestions.replaceChildren();
        manualRef.focus();
      });
      bookSuggestions.append(button);
    });
}

async function loadBooks() {
  try {
    const response = await fetch("/api/books");
    const result = await response.json();
    books = result.books || [];
    books.forEach((book) => {
      const option = document.createElement("option");
      option.value = book;
      bookNames.append(option);
    });
  } catch {
    manualStatus.textContent = "Не удалось загрузить список книг";
  }
}

async function applyManualReference() {
  const value = manualRef.value.trim();
  if (!value) {
    manualStatus.textContent = "Введите книгу, главу и стих";
    return;
  }
  manualApply.disabled = true;
  manualStatus.textContent = "Проверяю ссылку…";
  try {
    const response = await fetch("/api/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: value }),
    });
    const result = await response.json();
    if (!result.ok) throw new Error("книга, глава или стих не найдены");
    manualRef.value = result.candidate.ref;
    manualStatus.textContent = "Цитата подставлена. Проверьте и нажмите «Принять».";
  } catch (error) {
    manualStatus.textContent = `Ошибка: ${error.message}`;
  } finally {
    manualApply.disabled = false;
  }
}

manualRef.addEventListener("input", renderBookSuggestions);
manualRef.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyManualReference();
});
manualApply.addEventListener("click", applyManualReference);

const events = new EventSource("/operator-events");
events.onopen = () => { connection.textContent = "Телефон подключён"; };
events.onmessage = (event) => {
  try { render(JSON.parse(event.data)); }
  catch { connection.textContent = "Ошибка данных"; }
};
events.onerror = () => { connection.textContent = "Переподключение…"; };
loadBooks();
