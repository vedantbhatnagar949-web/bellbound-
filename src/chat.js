export class ChatUI {
    constructor(game) {
        this.game = game;
        this.el = document.getElementById('chat-ui');
        this.historyEl = document.getElementById('chat-history');
        this.inputEl = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.closeBtn = document.getElementById('chat-close');

        this.currentNpc = null;

        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.closeBtn.addEventListener('click', () => this.hide());
        this.inputEl.addEventListener('keydown', (e) => {
            // Prevent game input from stealing keys when typing
            e.stopPropagation();
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    show(npc) {
        this.currentNpc = npc;
        this.el.classList.remove('hidden');
        this.historyEl.innerHTML = '';
        this.addMessage('system', `[Approached the ${npc}]`);
        this.inputEl.focus();
    }

    hide() {
        this.el.classList.add('hidden');
        this.currentNpc = null;
    }

    addMessage(sender, text) {
        const div = document.createElement('div');
        if (sender === 'system') {
            div.className = 'msg-system';
            div.innerText = text;
        } else if (sender === 'player') {
            div.className = 'msg-player';
            div.innerText = `You: ${text}`;
        } else {
            div.className = 'msg-npc';
            div.innerText = `${this.currentNpc.toUpperCase()}: ${text}`;
        }
        this.historyEl.appendChild(div);
        this.historyEl.scrollTop = this.historyEl.scrollHeight;
    }

    async sendMessage() {
        const text = this.inputEl.value.trim();
        if (!text || !this.currentNpc) return;
        
        this.addMessage('player', text);
        this.inputEl.value = '';
        this.inputEl.disabled = true;
        this.sendBtn.disabled = true;

        const state = {
            solved: this.currentNpc === 'child' ? this.game.state.childPuzzleSolved : this.game.state.engineerPuzzleSolved
        };

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ npc: this.currentNpc, message: text, state })
            });
            const data = await res.json();
            if (data.error) {
                this.addMessage('system', 'Error: ' + data.error);
            } else {
                this.addMessage(this.currentNpc, data.reply);
            }
        } catch (e) {
            this.addMessage('system', 'Connection error.');
        } finally {
            this.inputEl.disabled = false;
            this.sendBtn.disabled = false;
            this.inputEl.focus();
        }
    }
}
