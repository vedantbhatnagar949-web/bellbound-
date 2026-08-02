import { AssetLoader } from '../assetLoader.js';
import { ParticleSystem } from '../particleSystem.js';

export class VillageScene {
    constructor(game) {
        this.game = game;
        this.locations = [
            { id: 'child', x: -650, y: 240, w: 200, h: 200, img: 'loc_child', title: 'Child House' },
            { id: 'engineer', x: -350, y: 240, w: 240, h: 200, img: 'loc_engineer', title: 'Engineer Workshop' },
            { id: 'lab', x: -50, y: 210, w: 280, h: 220, img: 'loc_lab', title: 'Frozen Laboratory (Center)' },
            { id: 'tree', x: 380, y: 120, w: 320, h: 320, img: 'loc_tree', title: 'Bell Tree (Locked)' }
        ];
        this.hovered = null;
    }
    enter() {
        this.game.camera.jumpTo(0, 0, 1.2);
        this.game.camera.setTarget(0, 100, 0.8);
        this.game.resonance.show();
        
        if(!this.particles) {
            this.particles = new ParticleSystem();
        }
        
        if(this.game.state.engineerPuzzleSolved) {
            const lab = this.locations.find(l => l.id === 'lab');
            lab.title = "Frozen Laboratory";
        }
        if(this.game.state.labDiscovered) {
            const tree = this.locations.find(l => l.id === 'tree');
            tree.title = "Bell Tree";
            this.game.state.treeUnlocked = true;
        }
    }
    exit() {}
    update(dt) {
        this.particles.update(dt, this.game.camera);
        
        const mx = this.game.input.mouse.worldX;
        const my = this.game.input.mouse.worldY;
        
        this.hovered = null;
        for(const loc of this.locations) {
            if(mx >= loc.x && mx <= loc.x + loc.w && my >= loc.y && my <= loc.y + loc.h) {
                this.hovered = loc;
                break;
            }
        }
        
        const scX = this.game.input.mouse.x / this.game.canvas.width - 0.5;
        const scY = this.game.input.mouse.y / this.game.canvas.height - 0.5;
        
        this.game.camera.setTarget(scX * 200, 100 + scY * 100, 0.9);
    }
    
    drawParallaxLayer(ctx, imgKey, speedX, yOffset) {
        const img = AssetLoader.images[imgKey];
        if(!img) return;
        const cx = this.game.camera.x * speedX;
        const w = 1920; 
        const h = 1080;
        
        let startX = -w/2 - cx;
        ctx.drawImage(img, startX, -h/2 + yOffset, w, h);
    }

    draw(ctx) {
        // Evening sky gradient (dusk / twilight colors)
        const skyGrad = ctx.createLinearGradient(0, -1000, 0, 800);
        skyGrad.addColorStop(0.0, '#1e1b4b'); // Deep indigo / evening night sky top
        skyGrad.addColorStop(0.35, '#4c1d95'); // Rich purple dusk transition
        skyGrad.addColorStop(0.65, '#be185d'); // Vibrant evening magenta / crimson sunset hue
        skyGrad.addColorStop(0.85, '#f97316'); // Warm twilight orange horizon
        skyGrad.addColorStop(1.0, '#fef08a'); // Soft golden horizon glow
        ctx.fillStyle = skyGrad;
        ctx.fillRect(-2000, -2000, 4000, 4000);

        // CRAZY GSAP / ANIMEJS ANIMATED NORTHERN LIGHTS AURORA BOREALIS IN SKY
        const t = Date.now() / 1000;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 3; i++) {
            const auroraGrad = ctx.createLinearGradient(-1000, -600, 1000, -100);
            auroraGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
            auroraGrad.addColorStop(0.5, i % 2 === 0 ? 'rgba(34, 211, 238, 0.25)' : 'rgba(168, 85, 247, 0.25)');
            auroraGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
            ctx.fillStyle = auroraGrad;

            ctx.beginPath();
            ctx.moveTo(-1200, -600 + i * 80);
            for (let x = -1200; x <= 1200; x += 100) {
                const waveY = -450 + Math.sin(t * 1.5 + x * 0.003 + i) * 70 + Math.cos(t * 0.8 + x * 0.005) * 40;
                ctx.lineTo(x, waveY);
            }
            ctx.lineTo(1200, -100);
            ctx.lineTo(-1200, -100);
            ctx.fill();
        }
        ctx.restore();

        this.drawParallaxLayer(ctx, 'bg_sky', 0.1, 0);
        this.drawParallaxLayer(ctx, 'bg_clouds', 0.2, 0);
        this.drawParallaxLayer(ctx, 'bg_far_mountains', 0.3, 100);
        this.drawParallaxLayer(ctx, 'bg_near_mountains', 0.5, 200);
        
        const villageImg = AssetLoader.images['bg_village'];
        if(villageImg) ctx.drawImage(villageImg, -1000, -200, 2000, 800);
        
        for(const loc of this.locations) {
            const img = AssetLoader.images[loc.img];
            if(img) {
                ctx.save();
                if(loc.id === 'lab') {
                    // Firm Ground Shadow under Lab (No Floating)
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.beginPath();
                    ctx.ellipse(loc.x + loc.w / 2, loc.y + loc.h - 5, loc.w * 0.48, 14, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Subtle cyan interior energy glow from lab windows
                    ctx.shadowColor = '#06b6d4';
                    ctx.shadowBlur = 25;
                }

                if(this.hovered === loc) {
                    ctx.shadowColor = 'white';
                    ctx.shadowBlur = 20;
                }
                ctx.drawImage(img, loc.x, loc.y, loc.w, loc.h);
                ctx.restore();
            }
        }
        
        this.particles.draw(ctx);
        this.drawParallaxLayer(ctx, 'bg_snow', 1.2, 300);
    }
    
    drawUI(ctx) {
        if(this.hovered) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
            ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
            ctx.textAlign = 'center';
            const titleUpper = this.hovered.title.toUpperCase();
            const textWidth = ctx.measureText(titleUpper).width;
            const px = this.game.input.mouse.x;
            const py = this.game.input.mouse.y - 40;
            
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.roundRect(px - textWidth/2 - 16, py - 20, textWidth + 32, 28, 14);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText(titleUpper, px, py - 1);
        }
    }
    
    handleClick(x, y, e) {
        if(this.hovered) {
            if(this.hovered.id === 'child') {
                this.game.sceneManager.fadeOut();
                setTimeout(() => this.game.sceneManager.switchScene('child_puzzle'), 1000);
            } else if(this.hovered.id === 'engineer') {
                this.game.sceneManager.fadeOut();
                setTimeout(() => this.game.sceneManager.switchScene('engineer_puzzle'), 1000);
            } else if(this.hovered.id === 'lab') {
                if(this.game.state.engineerPuzzleSolved) {
                    this.game.sceneManager.fadeOut();
                    setTimeout(() => this.game.sceneManager.switchScene('lab'), 1000);
                } else {
                    this.game.resonance.showMessage("The door is frozen shut. Maybe the Engineer knows how to open it.");
                }
            } else if(this.hovered.id === 'tree') {
                if(this.game.state.treeUnlocked) {
                    this.game.sceneManager.fadeOut();
                    setTimeout(() => this.game.sceneManager.switchScene('finale'), 1000);
                } else {
                    this.game.resonance.showMessage("The path to the Bell Tree is blocked by heavy ice.");
                }
            }
        }
    }
}
