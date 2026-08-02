import { AssetLoader } from '../assetLoader.js';

export class LabScene {
    constructor(game) {
        this.game = game;
        this.notes = [
            { x: -200, y: 50, text: "Log 42: The Resonance Device doesn't heal. It overwrites.", read: false },
            { x: 100, y: -100, text: "Log 89: We are forcing them to feel what we want them to feel. We must stop.", read: false },
            { x: 300, y: 150, text: "Final Log: I hid the truth in the Bell Tree. Disconnect the device.", read: false }
        ];
    }
    enter() {
        this.game.camera.jumpTo(0, 0, 1);
    }
    exit() {}
    update(dt) {
        const scX = this.game.input.mouse.x / this.game.canvas.width - 0.5;
        const scY = this.game.input.mouse.y / this.game.canvas.height - 0.5;
        this.game.camera.setTarget(scX * 300, scY * 300, 1.1);
    }
    draw(ctx) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(-1000, -1000, 2000, 2000);
        
        // Draw Mother's Journal / Lab Workspace Table
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-600, -300, 1200, 600);

        // Ambient Lab Glow
        ctx.fillStyle = '#0891b2';
        ctx.globalAlpha = 0.08;
        ctx.fillRect(-400, -200, 100, 500);
        ctx.fillRect(300, -150, 80, 450);
        ctx.fillRect(-50, -250, 150, 550);
        ctx.globalAlpha = 1.0;

        // Wooden Desk Surface
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(-450, 80, 900, 240);
        ctx.fillStyle = '#31104b';
        ctx.fillRect(-450, 70, 900, 10);

        // Render Notes as Antique Leather-Bound SA Diary Pages
        for (const n of this.notes) {
            ctx.save();
            ctx.translate(n.x, n.y);

            // Diary Leather Cover Shadow & Backing
            ctx.fillStyle = '#451a03'; // Warm Aged Brown Leather
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 12;
            ctx.fillRect(-3, -3, 66, 86);
            ctx.shadowBlur = 0;

            // Aged Parchment Paper Page (Mother's Journal)
            ctx.fillStyle = n.read ? '#fef3c7' : '#fffbeb'; // Warm cream parchment
            ctx.fillRect(0, 0, 60, 80);

            // Red Silk Ribbon Bookmark
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(26, -5, 8, 90);

            // Journal Gold Foil Embossing
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1;
            ctx.strokeRect(3, 3, 54, 74);

            // Handwritten Cursive Script Mock Lines
            ctx.fillStyle = '#451a03';
            ctx.fillRect(10, 15, 40, 2);
            ctx.fillRect(10, 24, 38, 2);
            ctx.fillRect(10, 33, 40, 2);
            ctx.fillRect(10, 42, 32, 2);
            ctx.fillRect(10, 51, 36, 2);
            ctx.fillRect(10, 60, 24, 2);

            // Glowing Arcane Seal on read pages
            if (n.read) {
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 18;
                ctx.strokeStyle = '#0284c7';
                ctx.lineWidth = 2;
                ctx.strokeRect(-2, -2, 64, 84);
            }

            ctx.restore();
        }
    }
    handleClick(x, y) {
        let clickedNote = false;
        for(const n of this.notes) {
            if(x >= n.x && x <= n.x + 40 && y >= n.y && y <= n.y + 50) {
                n.read = true;
                this.game.resonance.showMessage(n.text, 6000);
                this.checkAllRead();
                clickedNote = true;
                return;
            }
        }
        
        if(!clickedNote && (x < -400 || x > 400 || y < -200 || y > 200)) {
            this.game.sceneManager.fadeOut();
            setTimeout(() => this.game.sceneManager.switchScene('village'), 1000);
        }
    }
    checkAllRead() {
        if(this.notes.every(n => n.read) && !this.game.state.labDiscovered) {
            this.game.resonance.revealStopButton();
        }
    }
}
