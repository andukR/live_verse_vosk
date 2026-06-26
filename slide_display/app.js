const refInput = document.querySelector("#refInput");
const verseInput = document.querySelector("#verseInput");
const refText = document.querySelector("#refText");
const verseText = document.querySelector("#verseText");
const applyButton = document.querySelector("#applyButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const slide = document.querySelector(".slide");
const statusText = document.querySelector("#statusText");

function applySlide() {
  refText.textContent = refInput.value.trim() || " ";
  verseText.textContent = verseInput.value.trim() || " ";
  resizeVerseText();
}

function resizeVerseText() {
  const length = verseText.textContent.trim().length;
  verseText.classList.toggle("long", length > 230);
  verseText.classList.toggle("very-long", length > 520);
}

function setStatus(value) {
  if (statusText) {
    statusText.textContent = value;
  }
}

function applyLiveSlide(payload) {
  if (!payload) {
    return;
  }
  refInput.value = payload.ref || "";
  verseInput.value = payload.verse || "";
  applySlide();
  setStatus(`Live: ${new Date().toLocaleTimeString("ru-RU")}`);
}

function enterPresentation() {
  document.body.classList.add("presentation");
  if (slide.requestFullscreen) {
    slide.requestFullscreen();
  }
}

applyButton.addEventListener("click", applySlide);
fullscreenButton.addEventListener("click", enterPresentation);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.body.classList.remove("presentation");
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    applySlide();
  }
  if (event.key === "F11") {
    document.body.classList.add("presentation");
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove("presentation");
  }
});

function connectLiveEvents() {
  if (location.protocol === "file:") {
    setStatus("Live работает через tools/slide_server.py");
    return;
  }
  const events = new EventSource("/events");
  events.onopen = () => setStatus("Live подключен");
  events.onmessage = (event) => {
    try {
      applyLiveSlide(JSON.parse(event.data));
    } catch (error) {
      setStatus("Ошибка live-события");
    }
  };
  events.onerror = () => setStatus("Live переподключается...");
}

resizeVerseText();
connectLiveEvents();
