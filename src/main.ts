import { LAppDelegate } from './lappdelegate';
import * as LAppDefine from './lappdefine';

window.addEventListener(
  'load',
  (): void => {
    if (!LAppDelegate.getInstance().initialize()) {
      return;
    }

    LAppDelegate.getInstance().run();

    // Simple chatbot logic
    const messages = document.getElementById('messages')!;
    const input = document.getElementById('user-input') as HTMLInputElement;
    const button = document.getElementById('send-button')!;

    // Initial bot greeting
    const intro = document.createElement('div');
    intro.textContent = "Hello! I'm Hiyori. Ask me anything!";
    messages.appendChild(intro);

    button.addEventListener('click', () => {
      const userText = input.value;
      if (!userText) return;

      const userMsg = document.createElement('div');
      userMsg.textContent = "You: " + userText;
      messages.appendChild(userMsg);

      const botReply = document.createElement('div');
      botReply.textContent = "Hiyori: " + generateBotReply(userText);
      messages.appendChild(botReply);

      input.value = '';
      messages.scrollTop = messages.scrollHeight;
    });
  },
  { passive: true }
);

window.addEventListener(
  'beforeunload',
  (): void => LAppDelegate.releaseInstance(),
  { passive: true }
);

function generateBotReply(text: string): string {
  if (text.toLowerCase().includes("hello")) {
    return "Hi there!";
  } else if (text.toLowerCase().includes("how are you")) {
    return "I'm doing great, thank you!";
  } else {
    return "Hmm... interesting!";
  }
}
