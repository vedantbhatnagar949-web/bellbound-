export class ParticleSystem {
    constructor() {
        this.particles = [];
        for(let i=0; i<250; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 4000,
                y: (Math.random() - 0.5) * 3000,
                size: Math.random() * 3 + 1,
                speedY: Math.random() * 60 + 40,
                speedX: Math.random() * 40 + 20,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }
    update(dt, camera) {
        const time = Date.now() / 1000;
        for(const p of this.particles) {
            p.y += p.speedY * dt;
            p.x += (p.speedX + Math.sin(time + p.y * 0.01) * 30) * dt;
            
            if(p.y > camera.y + 1500) p.y = camera.y - 1500;
            if(p.x > camera.x + 2000) p.x = camera.x - 2000;
        }
    }
    draw(ctx) {
        ctx.fillStyle = 'white';
        for(const p of this.particles) {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}
