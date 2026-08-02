import { AssetLoader } from './assetLoader.js';
import { SceneManager } from './sceneManager.js';
import { Camera } from './camera.js';
import { Resonance } from './resonance.js';
import { Input } from './input.js';
import { ChatUI } from './chat.js';
import { SoundEngine } from './soundEngine.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

export const Game = {
    canvas,
    ctx,
    sound: SoundEngine,
    state: {
        childPuzzleSolved: false,
        engineerPuzzleSolved: false,
        labDiscovered: false,
        treeUnlocked: false
    },
    async init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialize Web Audio context on user interaction
        const startAudio = () => {
            SoundEngine.ensureContext();
            window.removeEventListener('pointerdown', startAudio);
            window.removeEventListener('keydown', startAudio);
        };
        window.addEventListener('pointerdown', startAudio);
        window.addEventListener('keydown', startAudio);

        // Click sound feedback
        window.addEventListener('click', (e) => {
            // Exclude clicks directly on UI controls to prevent sound overlap
            if (!e.target.closest('#audio-controls')) {
                SoundEngine.playChime(660);
            }
        });

        // Audio UI Control Buttons
        const tempoBtn = document.getElementById('tempo-btn');
        const muteBtn = document.getElementById('mute-btn');

        tempoBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const newTempo = SoundEngine.currentTempoMode === 'low' ? 'high' : 'low';
            SoundEngine.setTempoMode(newTempo);
            tempoBtn.innerText = `🎵 Tempo: ${newTempo === 'low' ? 'Low' : 'High'}`;
            SoundEngine.playChime(newTempo === 'high' ? 880 : 523);
        });

        muteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMuted = SoundEngine.toggleMute();
            muteBtn.innerText = isMuted ? '🔇 Muted' : '🔊 Sound On';
        });
        
        await AssetLoader.loadAll();
        
        this.camera = new Camera(this);
        this.resonance = new Resonance(this);
        this.chat = new ChatUI(this);
        this.input = new Input(this);
        this.sceneManager = new SceneManager(this);
        
        this.sceneManager.switchScene('intro');
        
        requestAnimationFrame((t) => this.loop(t));
    },
    resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    loop(timestamp) {
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        
        this.update(dt);
        this.draw();
        
        requestAnimationFrame((t) => this.loop(t));
    },
    update(dt) {
        const safeDt = Math.min(dt, 0.1);
        this.camera.update(safeDt);
        this.sceneManager.update(safeDt);
    },
    draw() {
        ctx.fillStyle = '#0a0c10';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        this.camera.apply(ctx);
        this.sceneManager.draw(ctx);
        ctx.restore();
        
        this.sceneManager.drawUI(ctx);
    }
};

Game.init();
