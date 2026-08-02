import { AssetLoader } from '../assetLoader.js';

export class ChildPuzzleScene {
    constructor(game) {
        this.game = game;
        this.gears = [
            { x: -100, y: 0, angle: 0, target: Math.PI/2, radius: 50, img: 'gear' },
            { x: 50, y: -20, angle: 0, target: Math.PI, radius: 40, img: 'gear' }
        ];
        this.spring = { x: -20, y: 50, connected: false, img: 'spring' };
        this.repaired = false;
    }
    enter() {
        this.game.camera.jumpTo(0, 0, 1.5);
        this.repaired = this.game.state.childPuzzleSolved;
    }
    exit() {}
    update(dt) {
        this.game.camera.setTarget(0, 0, 1.5);
        for(const g of this.gears) {
            if(g.animAngle !== undefined) {
                // Smoothly rotate towards animAngle
                const diff = g.animAngle - g.angle;
                if(Math.abs(diff) > 0.01) {
                    g.angle += diff * dt * 5;
                } else {
                    g.angle = g.animAngle;
                }
            }
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#05070a';
        ctx.fillRect(-1000, -1000, 2000, 2000);
        
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-300, -300, 200, 300);
        ctx.fillStyle = '#05070a';
        ctx.fillRect(-210, -300, 20, 300);
        ctx.fillRect(-300, -150, 200, 20);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(-300, -300);
        ctx.lineTo(-100, -300);
        ctx.lineTo(200, 400);
        ctx.lineTo(-200, 400);
        ctx.fill();
        
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-250, 80, 500, 300);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-150, 60, 300, 20);

        // Child Character Stage Platform on Left Side (Separate from Gears)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
        ctx.beginPath();
        ctx.ellipse(-320, 140, 90, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Realistic Ground Shadow under Child
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-320, 160, 55, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Render Child Character in full view
        const childImg = AssetLoader.images['npc_child'];
        if(childImg) {
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 12;
            ctx.drawImage(childImg, -360, 0, 80, 160);
            ctx.shadowBlur = 0;
        }

        // Chat Prompt Badge above Child
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-370, -25, 100, 22, 11);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Talk to Child", -320, -10);
        ctx.restore();
        
        for(const g of this.gears) {
            const img = AssetLoader.images[g.img];
            if(img) {
                ctx.save();
                ctx.translate(g.x, g.y);
                ctx.rotate(g.angle);
                if(Math.abs(g.angle % (Math.PI*2) - g.target) < 0.1) {
                    ctx.shadowColor = '#eab308';
                    ctx.shadowBlur = 20;
                }
                ctx.drawImage(img, -g.radius, -g.radius, g.radius*2, g.radius*2);
                ctx.restore();
            }
        }
        
        const spImg = AssetLoader.images[this.spring.img];
        if(spImg) {
            ctx.save();
            ctx.translate(this.spring.x, this.spring.y);
            if(this.spring.connected) {
                ctx.fillStyle = '#22c55e';
                ctx.shadowColor = '#22c55e';
                ctx.shadowBlur = 15;
            } else {
                ctx.fillStyle = '#ef4444';
            }
            ctx.fillRect(-5, -5, 10, 10);
            ctx.drawImage(spImg, 0, 0, 40, 20);
            ctx.restore();
        }
    }
    
    handleClick(x, y) {
        if(x > -360 && x < -280 && y > 0 && y < 160) {
            this.game.chat.show('child');
            return;
        }

        if(this.repaired) {
            this.game.sceneManager.fadeOut();
            setTimeout(() => this.game.sceneManager.switchScene('village'), 1000);
            return;
        }
        
        for(const g of this.gears) {
            if(Math.hypot(x - g.x, y - g.y) < g.radius) {
                if (g.animAngle === undefined) g.animAngle = g.angle;
                g.animAngle += Math.PI / 4;
                this.checkWinCondition();
                return;
            }
        }
        
        if(x > this.spring.x && x < this.spring.x + 40 && y > this.spring.y && y < this.spring.y + 20) {
            this.spring.connected = !this.spring.connected;
            this.checkWinCondition();
        }
    }

    checkWinCondition() {
        if (this.repaired) return;
        
        const g1Angle = this.gears[0].animAngle !== undefined ? this.gears[0].animAngle : this.gears[0].angle;
        const g2Angle = this.gears[1].animAngle !== undefined ? this.gears[1].animAngle : this.gears[1].angle;
        
        const g1Ok = Math.abs(g1Angle % (Math.PI*2) - this.gears[0].target) < 0.1;
        const g2Ok = Math.abs(g2Angle % (Math.PI*2) - this.gears[1].target) < 0.1;
        
        if (g1Ok && g2Ok && this.spring.connected) {
            this.repaired = true;
            this.game.state.childPuzzleSolved = true;
            this.game.resonance.showMessage("Child: Thank you... thank you so much! The music box is working again!", 5000);
            this.game.resonance.unlockEmotion('1', 'Hope');
            this.game.resonance.unlockEmotion('3', 'Acceptance');
            
            setTimeout(() => {
                this.game.sceneManager.fadeOut();
                setTimeout(() => this.game.sceneManager.switchScene('village'), 1000);
            }, 5000);
        }
    }
    
    handleEmotion(emotion) {
        if(emotion === 'Hope') {
            const g1Ok = Math.abs(this.gears[0].angle % (Math.PI*2) - this.gears[0].target) < 0.1;
            const g2Ok = Math.abs(this.gears[1].angle % (Math.PI*2) - this.gears[1].target) < 0.1;
            
            if(g1Ok && g2Ok && this.spring.connected) {
                this.game.resonance.showMessage("The child feels a surge of hope and finishes the mechanism. The music box plays a soft melody.");
                this.repaired = true;
                this.game.state.childPuzzleSolved = true;
                setTimeout(() => {
                    this.game.sceneManager.fadeOut();
                    setTimeout(() => this.game.sceneManager.switchScene('village'), 1000);
                }, 4000);
            } else {
                this.game.resonance.showMessage("You project Hope, but the broken mechanism holds the child back. Fix it first.");
            }
        } else {
            this.game.resonance.showMessage(`Projecting ${emotion} here doesn't seem right.`);
        }
    }
}
