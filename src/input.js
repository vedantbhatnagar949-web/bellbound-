export class Input {
    constructor(game) {
        this.game = game;
        this.mouse = { x: 0, y: 0, worldX: 0, worldY: 0 };
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            const pt = this.game.camera.screenToWorld(e.clientX, e.clientY);
            this.mouse.worldX = pt.x;
            this.mouse.worldY = pt.y;
        });
        
        window.addEventListener('mousedown', (e) => {
            this.game.sceneManager.handleClick(this.mouse.worldX, this.mouse.worldY, e);
        });
        
        window.addEventListener('keydown', (e) => {
            this.game.resonance.handleInput(e.key.toLowerCase());
        });
    }
}
