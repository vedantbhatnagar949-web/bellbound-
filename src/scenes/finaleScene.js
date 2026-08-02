import { AssetLoader } from '../assetLoader.js';

export class FinaleScene {
    constructor(game) {
        this.game = game;
        this.timer = 0;
        this.state = 'start';
        this.bellY = -800;
        this.bellX = 0;
        this.flashAlpha = 0;
        this.creditsY = 600;
        this.outcome = 'wakes';
        this.aiEndingText = '';
    }
    enter(outcome = 'wakes') {
        this.game.camera.jumpTo(0, 0, 1);
        this.game.resonance.hide();
        this.timer = 0;
        this.outcome = outcome;
        this.state = outcome === 'trapped' ? 'start' : 'fetch_ai';
        this.bellY = -800;
        this.bellX = 0;
        this.flashAlpha = 0;
        this.creditsY = 600;
        this.aiEndingText = '';

        if (this.state === 'fetch_ai') {
            this.fetchAIEnding();
        }
    }
    async fetchAIEnding() {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    npc: 'villagers',
                    message: "The player has released you from emotional control by stopping the Resonance Core. Do you punish them for keeping you under control earlier, or do you forgive them?",
                    state: { solved: true }
                })
            });
            const data = await res.json();
            if (data.error) {
                this.aiEndingText = "The villagers wake up, confused but free. The future is uncertain.";
            } else {
                this.aiEndingText = data.reply;
            }
            this.state = 'restore';
            this.timer = 0;
        } catch (e) {
            this.aiEndingText = "The villagers wake up, confused but free. The future is uncertain.";
            this.state = 'restore';
            this.timer = 0;
        }
    }
    exit() { }
    update(dt) {
        this.timer += dt;

        if (this.state === 'start' && this.timer > 1.5) {
            this.state = 'climb';
            this.timer = 0;
        } else if (this.state === 'climb') {
            this.game.camera.setTarget(0, -800, 1.5);
            if (this.timer > 3) {
                this.state = 'laser_beam';
                this.timer = 0;
            }
        } else if (this.state === 'laser_beam') {
            // Resonance device shoots massive sky beam
            this.game.camera.setTarget(0, -200, 1.2);
            if (this.timer > 3.5) {
                this.state = 'sword_slash';
                this.timer = 0;
            }
        } else if (this.state === 'sword_slash') {
            // Player slashes the Bell rope & shatters Resonance core
            if (this.timer > 1.8) {
                this.state = 'roll';
                this.timer = 0;
            }
        } else if (this.state === 'roll') {
            this.bellY += 500 * dt;
            this.bellX += (Math.random() - 0.5) * 25;
            this.game.camera.setTarget(this.bellX, this.bellY, 2);
            if (this.bellY > 100) {
                this.state = 'crash';
                this.timer = 0;
            }
        } else if (this.state === 'crash') {
            this.flashAlpha += dt * 3;
            if (this.flashAlpha >= 1) {
                this.state = 'flash';
                this.timer = 0;
            }
        } else if (this.state === 'flash' && this.timer > 3) {
            this.state = 'restore';
            this.timer = 0;
        } else if (this.state === 'restore' && this.timer > 10) {
            this.state = 'credits';
        } else if (this.state === 'credits') {
            this.creditsY -= dt * 50;
        }
    }

    draw(ctx) {
        if (this.state === 'flash' || this.state === 'restore' || this.state === 'credits') {
            if (this.state === 'flash') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-2000, -2000, 4000, 4000);
            } else if (this.outcome === 'wakes') {
                // Glorious Evening Sky Restoration
                const grad = ctx.createLinearGradient(0, -1000, 0, 100);
                grad.addColorStop(0, '#1e1b4b');
                grad.addColorStop(0.5, '#be185d');
                grad.addColorStop(1, '#f97316');
                ctx.fillStyle = grad;
                ctx.fillRect(-2000, -2000, 4000, 4000);

                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(-2000, 100, 4000, 1000);
                const villageImg = AssetLoader.images['bg_village'];
                if (villageImg) ctx.drawImage(villageImg, -1000, -200, 2000, 800);
            } else {
                ctx.fillStyle = '#000000';
                ctx.fillRect(-2000, -2000, 4000, 4000);
            }
        } else {
            // Twilight Ancient Bell Tree background
            const skyGrad = ctx.createLinearGradient(0, -1500, 0, 500);
            skyGrad.addColorStop(0, '#0f172a');
            skyGrad.addColorStop(0.5, '#4c1d95');
            skyGrad.addColorStop(1, '#be185d');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(-2000, -2000, 4000, 4000);

            // Ancient Tree Trunk & Foliage
            ctx.fillStyle = '#31104b';
            ctx.fillRect(-300, -1200, 600, 1400);
            ctx.beginPath();
            ctx.fillStyle = '#831843';
            ctx.arc(0, -900, 500, 0, Math.PI * 2);
            ctx.fill();

            // Player Hero Silhouette standing at tree base
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 100, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-15, 114, 30, 45);
            ctx.shadowBlur = 0;

            // LASER BEAM STAGE: Resonance device unleashes massive skyward beam
            if (this.state === 'laser_beam') {
                const beamWidth = 60 + Math.sin(this.timer * 20) * 20;
                ctx.save();
                ctx.fillStyle = '#06b6d4';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 40;
                ctx.fillRect(-beamWidth / 2, -2000, beamWidth, 2150);
                
                // Core bright white inner laser
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-beamWidth / 6, -2000, beamWidth / 3, 2150);
                ctx.restore();
            }

            // SWORD SLASH STAGE: Player cuts bell rope & shatters resonance device
            if (this.state === 'sword_slash') {
                // Arcane Sword Arc Effect
                ctx.save();
                ctx.strokeStyle = '#fef08a';
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 30;
                ctx.lineWidth = 12;
                ctx.beginPath();
                ctx.arc(0, 80, 120, -Math.PI * 0.8, Math.PI * 0.2);
                ctx.stroke();

                // Shattered Resonance Case Fragments flying apart
                ctx.fillStyle = '#ef4444';
                const spread = this.timer * 300;
                ctx.fillRect(-50 - spread, 140 - spread * 0.5, 20, 20);
                ctx.fillRect(40 + spread, 140 - spread * 0.3, 25, 18);
                ctx.fillRect(-20 + spread * 0.7, 120 - spread, 15, 15);
                ctx.restore();
            } else if (this.state === 'roll' || this.state === 'crash') {
                // Shattered remnants on ground
                ctx.fillStyle = '#475569';
                ctx.fillRect(-80, 160, 30, 10);
                ctx.fillRect(50, 165, 40, 10);
            } else {
                // Intact Resonance device on ground before slash
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-100, 150, 200, 50);
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 15;
                ctx.fillRect(-20, 160, 40, 20);
                ctx.shadowBlur = 0;
            }

            // Falling Golden Bell
            const bellImg = AssetLoader.images['bell'];
            if (bellImg) {
                ctx.drawImage(bellImg, this.bellX - 100, this.bellY, 200, 200);
            } else {
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.moveTo(this.bellX - 100, this.bellY + 200);
                ctx.quadraticCurveTo(this.bellX, this.bellY, this.bellX + 100, this.bellY + 200);
                ctx.fill();
            }
        }
    }
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        if (!text) return;
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }

    drawUI(ctx) {
        if (this.flashAlpha > 0 && this.state !== 'restore' && this.state !== 'credits') {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(this.flashAlpha, 1)})`;
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        }

        if (this.state === 'restore' && this.outcome === 'wakes') {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '24px ui-serif, Georgia, serif';
            ctx.textAlign = 'center';
            this.wrapText(ctx, this.aiEndingText, this.game.canvas.width / 2, this.game.canvas.height / 2 - 50, 800, 32);
        }

        if (this.state === 'credits') {
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '40px ui-serif, Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText("BELL BOUND", this.game.canvas.width / 2, this.creditsY);
            ctx.font = 'italic 20px ui-serif, Georgia, serif';
            ctx.fillText("A game by the Team Game Knights", this.game.canvas.width / 2, this.creditsY + 80);
            ctx.fillText("Thank you for playing.", this.game.canvas.width / 2, this.creditsY + 160);
        }
    }
}
