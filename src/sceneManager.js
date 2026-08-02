import { IntroScene } from './scenes/introScene.js';
import { VillageScene } from './scenes/villageScene.js';
import { ChildPuzzleScene } from './scenes/childPuzzleScene.js';
import { EngineerPuzzleScene } from './scenes/engineerPuzzleScene.js';
import { LabScene } from './scenes/labScene.js';
import { FinaleScene } from './scenes/finaleScene.js';

export class SceneManager {
    constructor(game) {
        this.game = game;
        this.currentScene = null;
        this.scenes = {
            intro: new IntroScene(game),
            village: new VillageScene(game),
            child_puzzle: new ChildPuzzleScene(game),
            engineer_puzzle: new EngineerPuzzleScene(game),
            lab: new LabScene(game),
            finale: new FinaleScene(game)
        };
        this.overlayAlpha = 1;
        this.fadeTarget = 0;
        
        this.leaveBtn = document.getElementById('leave-room-btn');
        this.leaveBtn.addEventListener('click', () => {
            if (this.currentScene !== 'village' && this.currentScene !== 'finale' && this.currentScene !== 'intro') {
                this.fadeOut();
                setTimeout(() => this.switchScene('village'), 1000);
            }
        });
    }
    
    switchScene(sceneName, ...args) {
        if(this.currentScene && this.scenes[this.currentScene].exit) {
            this.scenes[this.currentScene].exit();
        }
        this.currentScene = sceneName;
        
        // Adjust music tempo based on scene
        if (sceneName === 'child_puzzle' || sceneName === 'engineer_puzzle') {
            this.game.sound.setTempoMode('high');
        } else {
            this.game.sound.setTempoMode('low');
        }

        if (sceneName === 'child_puzzle' || sceneName === 'engineer_puzzle' || sceneName === 'lab') {
            this.leaveBtn.classList.remove('hidden');
        } else {
            this.leaveBtn.classList.add('hidden');
        }

        if(this.scenes[this.currentScene].enter) {
            this.scenes[this.currentScene].enter(...args);
        }
        this.fadeIn();
    }
    
    fadeIn() { this.fadeTarget = 0; }
    fadeOut() { this.fadeTarget = 1; }
    
    update(dt) {
        if(this.currentScene) this.scenes[this.currentScene].update(dt);
        
        const fadeSpeed = 0.8;
        if(this.overlayAlpha < this.fadeTarget) {
            this.overlayAlpha = Math.min(this.overlayAlpha + dt * fadeSpeed, this.fadeTarget);
        } else if(this.overlayAlpha > this.fadeTarget) {
            this.overlayAlpha = Math.max(this.overlayAlpha - dt * fadeSpeed, this.fadeTarget);
        }
    }
    
    draw(ctx) {
        if(this.currentScene && this.scenes[this.currentScene].draw) {
            this.scenes[this.currentScene].draw(ctx);
        }
    }
    
    drawUI(ctx) {
        if(this.currentScene && this.scenes[this.currentScene].drawUI) {
            this.scenes[this.currentScene].drawUI(ctx);
        }
        if(this.overlayAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.overlayAlpha})`;
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        }
    }

    handleClick(x, y, e) {
        if(this.overlayAlpha > 0.5) return; 
        if(this.currentScene && this.scenes[this.currentScene].handleClick) {
            this.scenes[this.currentScene].handleClick(x, y, e);
        }
    }
}
