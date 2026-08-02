import { AssetLoader } from '../assetLoader.js';

export class EngineerPuzzleScene {
    constructor(game) {
        this.game = game;
        this.nodes = [
            { x: -100, y: 0, active: false },
            { x: 0, y: -80, active: false },
            { x: 100, y: 0, active: false },
            { x: 0, y: 80, active: false }
        ];
        this.repaired = false;
    }
    enter() {
        this.game.camera.jumpTo(0, 0, 1.2);
        this.repaired = this.game.state.engineerPuzzleSolved;
    }
    exit() {}
    update(dt) {}
    draw(ctx) {
        ctx.fillStyle = '#05070a';
        ctx.fillRect(-1000, -1000, 2000, 2000);
        
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-400, -300, 800, 600);
        
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(-200, -100, 80, 0, Math.PI, true);
        ctx.lineTo(-120, 100);
        ctx.lineTo(-280, 100);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(-200, -100);
        ctx.lineTo(100, 400);
        ctx.lineTo(-200, 400);
        ctx.fill();

        // Engineer Stage Platform on Left Side
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.beginPath();
        ctx.ellipse(-280, 140, 90, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Realistic Ground Shadow under Engineer
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-280, 160, 60, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        const engImg = AssetLoader.images['npc_engineer'];
        if(engImg) {
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 12;
            ctx.drawImage(engImg, -320, -10, 80, 160);
            ctx.shadowBlur = 0;
        }

        // Chat Badge above Engineer
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-335, -35, 110, 22, 11);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Talk to Mechanic", -280, -20);
        ctx.restore();
        
        ctx.fillStyle = '#020617';
        ctx.fillRect(-150, -120, 300, 240);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(-150, -120, 300, 240);
        
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
        ctx.lineTo(this.nodes[1].x, this.nodes[1].y);
        ctx.lineTo(this.nodes[2].x, this.nodes[2].y);
        ctx.lineTo(this.nodes[3].x, this.nodes[3].y);
        ctx.closePath();
        ctx.stroke();
        
        for(const n of this.nodes) {
            ctx.fillStyle = n.active ? '#22d3ee' : '#1e293b';
            ctx.beginPath();
            ctx.arc(n.x, n.y, 20, 0, Math.PI*2);
            ctx.fill();
            if(n.active) {
                ctx.shadowColor = '#22d3ee';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    handleClick(x, y) {
        if(x > -320 && x < -240 && y > -10 && y < 150) {
            this.game.chat.show('engineer');
            return;
        }
        
        if(this.repaired) {
            this.game.sceneManager.fadeOut();
            setTimeout(() => this.game.sceneManager.switchScene('village'), 1000);
            return;
        }
        for(const n of this.nodes) {
            if(Math.hypot(x - n.x, y - n.y) < 20) {
                n.active = !n.active;
            }
        }
    }
    handleEmotion(emotion) {
        if(emotion === 'Hope') {
            const allActive = this.nodes.every(n => n.active);
            if(allActive) {
                this.game.resonance.showMessage("The engineer feels sudden clarity. 'The machine... it works! I must show you the lab!'");
                this.repaired = true;
                this.game.state.engineerPuzzleSolved = true;
                setTimeout(() => {
                    this.game.sceneManager.fadeOut();
                    setTimeout(() => this.game.sceneManager.switchScene('village'), 1000);
                }, 4000);
            } else {
                this.game.resonance.showMessage("The circuit is incomplete. The engineer is too frustrated to feel Hope.");
            }
        } else {
            this.game.resonance.showMessage(`The engineer ignores your projection of ${emotion}.`);
        }
    }
}
