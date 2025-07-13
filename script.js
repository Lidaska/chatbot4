const panel = document.getElementById("left-panel");
const dragHandle = document.getElementById("drag-handle");
const resizeHandle = document.getElementById("resize-handle");
const inputBox = document.getElementById("chat-input");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

dragHandle.addEventListener("mousedown", function(e) {
  isDragging = true;
  offsetX = e.clientX - panel.offsetLeft;
  offsetY = e.clientY - panel.offsetTop;
});

document.addEventListener("mousemove", function(e) {
  if (isDragging) {
    panel.style.left = (e.clientX - offsetX) + "px";
    panel.style.top = (e.clientY - offsetY) + "px";
  }
});

document.addEventListener("mouseup", function() {
  isDragging = false;
});

// Resize Logic
resizeHandle.addEventListener("mousedown", function(e) {
  e.preventDefault();
  document.addEventListener("mousemove", resizePanel);
  document.addEventListener("mouseup", stopResize);
});

function resizePanel(e) {
  const minWidth = 200;
  const minHeight = 200;
  const width = Math.max(minWidth, e.clientX - panel.offsetLeft);
  const height = Math.max(minHeight, e.clientY - panel.offsetTop);
  panel.style.width = width + "px";
  panel.style.height = height + "px";
}

function stopResize() {
  document.removeEventListener("mousemove", resizePanel);
  document.removeEventListener("mouseup", stopResize);
}

// Chat + GPT Logic
inputBox.addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendToHiyori();
});

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendToHiyori() {
  const msg = inputBox.value.trim();
  if (!msg) return;
  addMessage("user", msg);
  inputBox.value = "";

  const reply = await hiyoriReply(msg);
  addMessage("hiyori", reply);
}

async function hiyoriReply(msg) {
  try {
    const res = await fetch("/.netlify/functions/gpt-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    return data.reply || "Oops, something went wrong.";
  } catch (e) {
    return "Sorry, couldn't reach the AI right now.";
  }
}
