export class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZoom = 1;
        this.lerpSpeed = 1.5;
    }
    
    update(dt) {
        this.x += (this.targetX - this.x) * this.lerpSpeed * dt;
        this.y += (this.targetY - this.y) * this.lerpSpeed * dt;
        this.zoom += (this.targetZoom - this.zoom) * this.lerpSpeed * dt;
    }
    
    apply(ctx) {
        ctx.translate(this.game.canvas.width / 2, this.game.canvas.height / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.x, -this.y);
    }
    
    screenToWorld(sx, sy) {
        const cx = this.game.canvas.width / 2;
        const cy = this.game.canvas.height / 2;
        return {
            x: (sx - cx) / this.zoom + this.x,
            y: (sy - cy) / this.zoom + this.y
        };
    }

    setTarget(x, y, zoom = 1) {
        this.targetX = x;
        this.targetY = y;
        this.targetZoom = zoom;
    }
    
    jumpTo(x, y, zoom = 1) {
        this.x = this.targetX = x;
        this.y = this.targetY = y;
        this.zoom = this.targetZoom = zoom;
    }
}
