export class Resonance {
    constructor(game) {
        this.game = game;
        this.emotions = {
            '2': 'Anger'
        };
        this.activeEmotion = null;
        
        this.el = document.getElementById('resonance-device');
        this.slots = [
            document.getElementById('slot-1'),
            document.getElementById('slot-2'),
            document.getElementById('slot-3')
        ];
        this.activeText = document.getElementById('active-emotion');
        
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueBox.addEventListener('click', () => {
            this.dialogueBox.classList.add('hidden');
        });
        
        this.btnContainer = document.getElementById('btn-container');
        this.stopBtn = document.getElementById('stop-btn');
        this.stopBtn.addEventListener('click', () => this.handleStop());
        
        this.dontStopBtn = document.getElementById('dont-stop-btn');
        this.dontStopBtn.addEventListener('click', () => this.handleDontStop());
    }
    
    unlockEmotion(key, name) {
        this.emotions[key] = name;
        const slot = document.getElementById(`slot-${key}`);
        if(slot) slot.classList.remove('locked');
    }
    
    show() { this.el.classList.remove('hidden'); }
    hide() { this.el.classList.add('hidden'); }
    
    handleInput(key) {
        if(this.emotions[key]) {
            this.activeEmotion = this.emotions[key];
            this.updateUI();
        } else if(key === 'f' && this.activeEmotion) {
            this.useEmotion();
        }
    }
    
    updateUI() {
        this.slots.forEach((s, idx) => {
            if(this.emotions[String(idx+1)] === this.activeEmotion) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        this.activeText.innerText = `Active: ${this.activeEmotion || 'None'}`;
    }
    
    useEmotion() {
        if(this.game.sceneManager.currentScene && this.game.sceneManager.scenes[this.game.sceneManager.currentScene].handleEmotion) {
            this.game.sceneManager.scenes[this.game.sceneManager.currentScene].handleEmotion(this.activeEmotion);
        } else {
            this.showMessage(`You project ${this.activeEmotion}, but nothing happens here.`);
        }
    }
    
    showMessage(text, duration = 4000) {
        this.dialogueBox.innerText = text;
        this.dialogueBox.classList.remove('hidden');
        if(this.hideTimeout) clearTimeout(this.hideTimeout);
        if(duration > 0) {
            this.hideTimeout = setTimeout(() => {
                this.dialogueBox.classList.add('hidden');
            }, duration);
        }
    }
    
    revealStopButton() {
        this.btnContainer.classList.remove('hidden');
    }
    
    handleStop() {
        this.showMessage("You disabled the forced resonance. Everyone wakes from their emotional control.", 6000);
        this.game.state.labDiscovered = true;
        this.btnContainer.classList.add('hidden');
        this.el.classList.add('hidden');
        setTimeout(() => {
            this.game.sceneManager.fadeOut();
            setTimeout(() => this.game.sceneManager.switchScene('finale', 'wakes'), 1000);
        }, 3000);
    }

    handleDontStop() {
        this.showMessage("You refused to stop. The village rises up against you...", 6000);
        this.game.state.labDiscovered = true;
        this.btnContainer.classList.add('hidden');
        this.el.classList.add('hidden');
        setTimeout(() => {
            this.game.sceneManager.fadeOut();
            setTimeout(() => this.game.sceneManager.switchScene('finale', 'trapped'), 1000);
        }, 3000);
    }
}
