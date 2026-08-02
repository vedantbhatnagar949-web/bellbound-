export class IntroScene {
    constructor(game) {
        this.game = game;
        this.lines = [
            "Do emotions come from the heart?",
            "...or from the hands of someone else?",
            "What if you could choose?",
            "BELL BOUND"
        ];
        this.currentLine = 0;
        this.timer = 0;
        this.state = 'fade_in';
        this.alpha = 0;
    }
    enter() {
        this.game.camera.jumpTo(0, 0, 1);
        this.game.resonance.hide();
        this.currentLine = 0;
        this.timer = 0;
        this.alpha = 0;
        this.state = 'fade_in';
        this.game.sceneManager.overlayAlpha = 0;
    }
    exit() {}
    update(dt) {
        if(this.currentLine >= this.lines.length) return;
        
        const speed = 0.5;
        if(this.state === 'fade_in') {
            this.alpha += dt * speed;
            if(this.alpha >= 1) {
                this.alpha = 1;
                this.state = 'hold';
                this.timer = 0;
            }
        } else if(this.state === 'hold') {
            this.timer += dt;
            if(this.timer > 2 && this.currentLine < this.lines.length - 1) {
                this.state = 'fade_out';
            }
        } else if(this.state === 'fade_out') {
            this.alpha -= dt * speed;
            if(this.alpha <= 0) {
                this.alpha = 0;
                this.currentLine++;
                this.state = 'fade_in';
            }
        }
    }
    drawUI(ctx) {
        // Evening Twilight Gradient Background for Main Menu
        const menuGrad = ctx.createLinearGradient(0, 0, 0, this.game.canvas.height);
        menuGrad.addColorStop(0.0, '#1e1b4b');
        menuGrad.addColorStop(0.4, '#4c1d95');
        menuGrad.addColorStop(0.7, '#be185d');
        menuGrad.addColorStop(1.0, '#f97316');
        ctx.fillStyle = menuGrad;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        // Ambient Floating Particles in Title Screen
        const time = Date.now() / 1000;
        ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
        for (let i = 0; i < 30; i++) {
            const px = (Math.sin(i * 99 + time * 0.2) * 0.5 + 0.5) * this.game.canvas.width;
            const py = (Math.cos(i * 33 + time * 0.3) * 0.5 + 0.5) * this.game.canvas.height;
            const r = Math.sin(i + time) * 2 + 3;
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.currentLine < this.lines.length) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (this.currentLine === this.lines.length - 1) {
                // Title Screen "BELL BOUND"
                ctx.save();
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 30;
                ctx.fillStyle = `rgba(254, 243, 199, ${this.alpha})`;
                ctx.font = '900 64px ui-serif, Georgia, serif';
                ctx.fillText(this.lines[this.currentLine], this.game.canvas.width / 2, this.game.canvas.height / 2 - 40);
                ctx.restore();

                if (this.state === 'hold') {
                    // Modern Glassmorphic "BEGIN JOURNEY" Button
                    const btnWidth = 240;
                    const btnHeight = 52;
                    const btnX = this.game.canvas.width / 2 - btnWidth / 2;
                    const btnY = this.game.canvas.height / 2 + 50;

                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                    ctx.strokeStyle = 'rgba(254, 243, 199, 0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = '#f59e0b';
                    ctx.shadowBlur = Math.sin(time * 3) * 10 + 15;

                    ctx.beginPath();
                    ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 26);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();

                    ctx.font = 'bold 14px ui-sans-serif, system-ui, sans-serif';
                    ctx.fillStyle = '#fef3c7';
                    ctx.fillText("BEGIN JOURNEY", this.game.canvas.width / 2, btnY + btnHeight / 2 + 1);
                }
            } else {
                ctx.font = 'italic 28px ui-serif, Georgia, serif';
                ctx.fillStyle = `rgba(248, 250, 252, ${this.alpha * 0.95})`;
                ctx.fillText(this.lines[this.currentLine], this.game.canvas.width / 2, this.game.canvas.height / 2);
            }
        }
    }
    handleClick(x, y) {
        if(this.currentLine === this.lines.length - 1 && this.state === 'hold') {
            this.game.sceneManager.fadeOut();
            setTimeout(() => {
                this.game.sceneManager.switchScene('village');
            }, 2000);
        }
    }
}
