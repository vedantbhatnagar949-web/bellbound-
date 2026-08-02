export class ParticleSystem {
    constructor() {
        this.particles = [];
        // 400 Snowflakes + 100 Sunset Golden Embers
        for(let i=0; i<500; i++) {
            const isEmber = i > 400;
            this.particles.push({
                x: (Math.random() - 0.5) * 4500,
                y: (Math.random() - 0.5) * 3500,
                size: isEmber ? Math.random() * 2.5 + 1 : Math.random() * 3.5 + 1,
                speedY: isEmber ? -(Math.random() * 30 + 10) : Math.random() * 70 + 40,
                speedX: Math.random() * 50 + 15,
                opacity: Math.random() * 0.6 + 0.2,
                color: isEmber ? '#fef08a' : '#ffffff',
                isEmber: isEmber
            });
        }
    }
    update(dt, camera) {
        const time = Date.now() / 1000;
        for(const p of this.particles) {
            p.y += p.speedY * dt;
            p.x += (p.speedX + Math.sin(time * 2 + p.y * 0.008) * 35) * dt;
            
            if(p.isEmber) {
                if(p.y < camera.y - 1800) p.y = camera.y + 1800;
            } else {
                if(p.y > camera.y + 1800) p.y = camera.y - 1800;
            }
            if(p.x > camera.x + 2200) p.x = camera.x - 2200;
            if(p.x < camera.x - 2200) p.x = camera.x + 2200;
        }
    }
    draw(ctx) {
        for(const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            if(p.isEmber) {
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 8;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}
