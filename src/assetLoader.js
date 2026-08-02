export const AssetLoader = {
    images: {},
    async loadImage(key, path, colorFallback = 'gray', width=256, height=256) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve(img);
            };
            img.onerror = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                this.drawCustomShape(ctx, key, width, height, colorFallback);
                this.images[key] = canvas;
                resolve(canvas);
            };
            img.src = path;
        });
    },
    drawCustomShape(ctx, key, w, h, color) {
        ctx.clearRect(0, 0, w, h);
        if (key === 'bg_sky') {
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0.0, '#1e1b4b'); // Deep twilight indigo
            grad.addColorStop(0.35, '#4c1d95'); // Dusk purple
            grad.addColorStop(0.65, '#be185d'); // Vibrant sunset magenta
            grad.addColorStop(0.85, '#f97316'); // Warm twilight orange
            grad.addColorStop(1.0, '#fef08a'); // Soft golden horizon glow
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        } else if (key === 'bg_clouds') {
            // Alto's Odyssey style soft layered clouds with warm golden sunset glow
            ctx.save();
            const cloudGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
            cloudGrad.addColorStop(0, 'rgba(253, 186, 116, 0.4)');
            cloudGrad.addColorStop(1, 'rgba(244, 114, 182, 0.05)');
            ctx.fillStyle = cloudGrad;
            
            // Soft sweeping cloud shapes
            ctx.beginPath();
            ctx.ellipse(w * 0.15, h * 0.25, 380, 50, -0.05, 0, Math.PI * 2);
            ctx.ellipse(w * 0.55, h * 0.2, 450, 65, 0.02, 0, Math.PI * 2);
            ctx.ellipse(w * 0.85, h * 0.35, 320, 45, -0.03, 0, Math.PI * 2);
            ctx.fill();

            // Low subtle dusk mist
            ctx.fillStyle = 'rgba(255, 237, 213, 0.15)';
            ctx.beginPath();
            ctx.ellipse(w * 0.3, h * 0.45, 500, 40, 0, 0, Math.PI * 2);
            ctx.ellipse(w * 0.75, h * 0.5, 420, 55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (key === 'bg_far_mountains') {
            // Far mountain range - elegant atmospheric purple silhouette with warm twilight lighting
            const grad = ctx.createLinearGradient(0, h * 0.2, 0, h);
            grad.addColorStop(0, '#3b0764');
            grad.addColorStop(0.7, '#2e1065');
            grad.addColorStop(1.0, '#1e1b4b');
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.moveTo(0, h);
            ctx.lineTo(0, h * 0.45);
            ctx.lineTo(w * 0.15, h * 0.28);
            ctx.lineTo(w * 0.32, h * 0.52);
            ctx.lineTo(w * 0.48, h * 0.22);
            ctx.lineTo(w * 0.68, h * 0.48);
            ctx.lineTo(w * 0.82, h * 0.18);
            ctx.lineTo(w, h * 0.42);
            ctx.lineTo(w, h);
            ctx.fill();

            // Soft golden rim lighting on far peak tips
            ctx.strokeStyle = 'rgba(254, 215, 170, 0.3)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(w * 0.08, h * 0.38); ctx.lineTo(w * 0.15, h * 0.28); ctx.lineTo(w * 0.22, h * 0.39);
            ctx.moveTo(w * 0.40, h * 0.34); ctx.lineTo(w * 0.48, h * 0.22); ctx.lineTo(w * 0.56, h * 0.36);
            ctx.moveTo(w * 0.74, h * 0.28); ctx.lineTo(w * 0.82, h * 0.18); ctx.lineTo(w * 0.90, h * 0.32);
            ctx.stroke();
        } else if (key === 'bg_near_mountains') {
            // Near mountain dunes - deep violet silhouetted terrain (Alto's Odyssey style)
            const grad = ctx.createLinearGradient(0, h * 0.3, 0, h);
            grad.addColorStop(0, '#581c87');
            grad.addColorStop(0.5, '#3b0764');
            grad.addColorStop(1.0, '#1e1b4b');
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.moveTo(0, h);
            ctx.lineTo(0, h * 0.6);
            ctx.quadraticCurveTo(w * 0.18, h * 0.35, w * 0.38, h * 0.65);
            ctx.quadraticCurveTo(w * 0.58, h * 0.4, w * 0.78, h * 0.7);
            ctx.quadraticCurveTo(w * 0.9, h * 0.48, w, h * 0.55);
            ctx.lineTo(w, h);
            ctx.fill();
        } else if (key === 'bg_village') {
            // Alto's Odyssey style village silhouette with cozy warm glowing windows
            ctx.fillStyle = '#1e1b4b'; // Deep twilight ground base
            ctx.fillRect(0, h * 0.75, w, h * 0.25);

            // Silhouetted cozy huts and roofs along the ridge
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.moveTo(0, h * 0.78);
            
            // Render a series of stylized chalets
            const houseWidths = [120, 160, 140, 190, 130, 170, 150, 180];
            let curX = 50;
            for (let i = 0; i < houseWidths.length; i++) {
                const hw = houseWidths[i];
                ctx.lineTo(curX, h * 0.78);
                ctx.lineTo(curX + hw * 0.1, h * 0.62);
                ctx.lineTo(curX + hw * 0.5, h * 0.48); // Roof peak
                ctx.lineTo(curX + hw * 0.9, h * 0.62);
                ctx.lineTo(curX + hw, h * 0.78);
                curX += hw + 90;
            }
            ctx.lineTo(w, h * 0.78);
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.fill();

            // Warm golden window lights scattering warm ambient glow
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 18;
            curX = 50;
            for (let i = 0; i < houseWidths.length; i++) {
                const hw = houseWidths[i];
                ctx.fillRect(curX + hw * 0.35, h * 0.64, 18, 24);
                ctx.fillRect(curX + hw * 0.6, h * 0.64, 18, 24);
                curX += hw + 90;
            }
            ctx.shadowBlur = 0;

            // Snow blanket over roofs with golden twilight tint
            ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
            curX = 50;
            for (let i = 0; i < houseWidths.length; i++) {
                const hw = houseWidths[i];
                ctx.beginPath();
                ctx.moveTo(curX + hw * 0.05, h * 0.62);
                ctx.lineTo(curX + hw * 0.5, h * 0.48);
                ctx.lineTo(curX + hw * 0.95, h * 0.62);
                ctx.lineTo(curX + hw * 0.9, h * 0.63);
                ctx.lineTo(curX + hw * 0.5, h * 0.5);
                ctx.lineTo(curX + hw * 0.1, h * 0.63);
                ctx.fill();
                curX += hw + 90;
            }
        } else if (key.startsWith('loc_')) {
            // Detailed Alto's Odyssey style location structures
            ctx.save();
            if (key === 'loc_child') {
                // Cozy Snowy Alpine Cottage
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, '#334155');
                grad.addColorStop(1, '#0f172a');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(w * 0.1, h); ctx.lineTo(w * 0.1, h * 0.45);
                ctx.lineTo(w * 0.5, h * 0.1); ctx.lineTo(w * 0.9, h * 0.45); ctx.lineTo(w * 0.9, h);
                ctx.fill();

                // Warm lit window
                ctx.fillStyle = '#f59e0b';
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.roundRect(w * 0.35, h * 0.5, w * 0.3, h * 0.3, 8);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Snow roof cap
                ctx.fillStyle = '#fef3c7';
                ctx.beginPath();
                ctx.moveTo(w * 0.05, h * 0.47); ctx.lineTo(w * 0.5, h * 0.08); ctx.lineTo(w * 0.95, h * 0.47);
                ctx.lineTo(w * 0.88, h * 0.52); ctx.lineTo(w * 0.5, h * 0.16); ctx.lineTo(w * 0.12, h * 0.52);
                ctx.fill();
            } else if (key === 'loc_engineer') {
                // Steampunk Workshop with mechanical chimney
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.moveTo(w * 0.05, h); ctx.lineTo(w * 0.05, h * 0.35);
                ctx.lineTo(w * 0.65, h * 0.15); ctx.lineTo(w * 0.95, h * 0.35); ctx.lineTo(w * 0.95, h);
                ctx.fill();

                // Chimney with warm orange glow
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(w * 0.72, h * 0.05, w * 0.12, h * 0.3);
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#f97316';
                ctx.shadowBlur = 12;
                ctx.fillRect(w * 0.74, h * 0.03, w * 0.08, h * 0.05);
                ctx.shadowBlur = 0;

                // Circular cyan energy window
                ctx.fillStyle = '#06b6d4';
                ctx.shadowColor = '#06b6d4';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(w * 0.38, h * 0.5, w * 0.18, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (key === 'loc_lab') {
                // Crystalline Frozen Lab dome
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, '#0284c7');
                grad.addColorStop(1, '#0f172a');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(w / 2, h * 0.75, w * 0.42, Math.PI, 0);
                ctx.fill();

                // Ice crystal spikes
                ctx.fillStyle = '#7dd3fc';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.75); ctx.lineTo(w * 0.28, h * 0.25); ctx.lineTo(w * 0.35, h * 0.75);
                ctx.moveTo(w * 0.45, h * 0.75); ctx.lineTo(w * 0.52, h * 0.15); ctx.lineTo(w * 0.6, h * 0.75);
                ctx.moveTo(w * 0.68, h * 0.75); ctx.lineTo(w * 0.74, h * 0.3); ctx.lineTo(w * 0.8, h * 0.75);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (key === 'loc_tree') {
                // Alto's Odyssey Style Majestic TALL Ancient Sacred Bell Tree
                ctx.save();

                // Tall Gnarled Organic Trunk & Spreading Roots
                const trunkGrad = ctx.createLinearGradient(0, 0, 0, h);
                trunkGrad.addColorStop(0, '#5b21b6');
                trunkGrad.addColorStop(0.5, '#31104b');
                trunkGrad.addColorStop(1, '#1e1b4b');
                ctx.fillStyle = trunkGrad;

                // Main soaring trunk structure
                ctx.beginPath();
                ctx.moveTo(w * 0.32, h);
                ctx.quadraticCurveTo(w * 0.36, h * 0.4, w * 0.42, h * 0.1);
                ctx.quadraticCurveTo(w * 0.5, 0, w * 0.58, h * 0.1);
                ctx.quadraticCurveTo(w * 0.64, h * 0.4, w * 0.68, h);
                ctx.fill();

                // Massive organic roots at base
                ctx.beginPath();
                ctx.moveTo(w * 0.35, h * 0.65); ctx.quadraticCurveTo(w * 0.2, h * 0.8, w * 0.02, h);
                ctx.lineTo(w * 0.18, h); ctx.quadraticCurveTo(w * 0.32, h * 0.85, w * 0.4, h * 0.72);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(w * 0.65, h * 0.65); ctx.quadraticCurveTo(w * 0.8, h * 0.8, w * 0.98, h);
                ctx.lineTo(w * 0.82, h); ctx.quadraticCurveTo(w * 0.68, h * 0.85, w * 0.6, h * 0.72);
                ctx.fill();

                // Layer 1: Massive Tall Canopy - Outer Deep Violet Foliage Cloud
                const outerGrad = ctx.createRadialGradient(w / 2, h * 0.22, 10, w / 2, h * 0.22, w * 0.55);
                outerGrad.addColorStop(0, '#be185d');
                outerGrad.addColorStop(0.6, '#831843');
                outerGrad.addColorStop(1, '#3b0764');
                ctx.fillStyle = outerGrad;

                ctx.beginPath();
                ctx.ellipse(w * 0.5, h * 0.22, w * 0.5, h * 0.26, 0, 0, Math.PI * 2);
                ctx.ellipse(w * 0.22, h * 0.28, w * 0.3, h * 0.2, 0, 0, Math.PI * 2);
                ctx.ellipse(w * 0.78, h * 0.28, w * 0.3, h * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();

                // Layer 2: Soaring Glowing Pink & Sunset Crimson Canopy
                ctx.fillStyle = '#db2777';
                ctx.beginPath();
                ctx.ellipse(w * 0.35, h * 0.16, w * 0.26, h * 0.16, 0, 0, Math.PI * 2);
                ctx.ellipse(w * 0.65, h * 0.16, w * 0.26, h * 0.16, 0, 0, Math.PI * 2);
                ctx.ellipse(w * 0.5, h * 0.1, w * 0.32, h * 0.14, 0, 0, Math.PI * 2);
                ctx.fill();

                // Layer 3: Warm Golden Canopy Top Highlights
                ctx.fillStyle = '#f472b6';
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.ellipse(w * 0.45, h * 0.06, w * 0.2, h * 0.08, 0, 0, Math.PI * 2);
                ctx.ellipse(w * 0.58, h * 0.08, w * 0.18, h * 0.07, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Floating Magic Petals / Spores
                ctx.fillStyle = '#fef08a';
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 12;
                for (let i = 0; i < 16; i++) {
                    const px = w * 0.15 + (i * 47) % (w * 0.7);
                    const py = h * 0.05 + (i * 31) % (h * 0.45);
                    ctx.beginPath();
                    ctx.arc(px, py, 3 + (i % 4), 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.shadowBlur = 0;

                // MASSIVE HANGING GOLDEN BELL (Prominent & Majestic)
                const bx = w / 2;
                const by = h * 0.32;
                const bw = 90;
                const bh = 100;

                // Heavy Iron Chain Hanging from Bough
                ctx.strokeStyle = '#475569';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(bx, h * 0.12);
                ctx.lineTo(bx, by);
                ctx.stroke();

                // Massive Brass Bell Body
                const bellGrad = ctx.createLinearGradient(bx - bw / 2, by, bx + bw / 2, by + bh);
                bellGrad.addColorStop(0, '#fef08a');
                bellGrad.addColorStop(0.4, '#f59e0b');
                bellGrad.addColorStop(0.8, '#d97706');
                bellGrad.addColorStop(1.0, '#78350f');
                ctx.fillStyle = bellGrad;

                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 30;

                ctx.beginPath();
                ctx.moveTo(bx - bw / 2, by + bh);
                ctx.quadraticCurveTo(bx - bw / 2, by + bh * 0.2, bx, by);
                ctx.quadraticCurveTo(bx + bw / 2, by + bh * 0.2, bx + bw / 2, by + bh);
                ctx.lineTo(bx - bw / 2, by + bh);
                ctx.fill();

                // Thick Brass Lip / Rim
                ctx.fillStyle = '#fef08a';
                ctx.beginPath();
                ctx.roundRect(bx - bw / 2 - 8, by + bh - 10, bw + 16, 16, 8);
                ctx.fill();

                // Swinging Clapper inside Bell
                ctx.fillStyle = '#451a03';
                ctx.beginPath();
                ctx.arc(bx, by + bh + 10, 14, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;
                ctx.restore();
            }
            ctx.restore();
        } else if (key.startsWith('npc_')) {
            // Detailed Realistic Human Character Renderings
            ctx.save();
            if (key === 'npc_child') {
                // Realistic Child Character: Wearing a cozy winter parka with hood & scarf, holding mother's music box
                
                // Shadow underneath
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath();
                ctx.ellipse(w * 0.5, h * 0.95, w * 0.35, h * 0.05, 0, 0, Math.PI * 2);
                ctx.fill();

                // Coat / Parka Body (Warm Crimson Winter Coat)
                ctx.fillStyle = '#9f1239';
                ctx.beginPath();
                ctx.roundRect(w * 0.28, h * 0.38, w * 0.44, h * 0.48, 16);
                ctx.fill();

                // Warm Wool Scarf (Golden Yellow)
                ctx.fillStyle = '#eab308';
                ctx.beginPath();
                ctx.roundRect(w * 0.26, h * 0.34, w * 0.48, h * 0.12, 8);
                ctx.fill();

                // Face (Natural Warm Skin Tone)
                ctx.fillStyle = '#fbcfe8';
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.25, w * 0.22, 0, Math.PI * 2);
                ctx.fill();

                // Cheeks (Rosy Winter Blush)
                ctx.fillStyle = '#f43f5e';
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(w * 0.38, h * 0.27, w * 0.05, 0, Math.PI * 2);
                ctx.arc(w * 0.62, h * 0.27, w * 0.05, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Eyes & Expressive Childish Eyebrows
                ctx.fillStyle = '#1e1b4b';
                ctx.beginPath();
                ctx.arc(w * 0.42, h * 0.23, w * 0.03, 0, Math.PI * 2);
                ctx.arc(w * 0.58, h * 0.23, w * 0.03, 0, Math.PI * 2);
                ctx.fill();

                // Winter Hood (Fur Lined)
                ctx.fillStyle = '#881337';
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.23, w * 0.28, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();
                ctx.fillStyle = '#fef3c7'; // White Fur Trim
                ctx.lineWidth = 6;
                ctx.strokeStyle = '#fef3c7';
                ctx.stroke();

                // Holding the Music Box in Hands
                ctx.fillStyle = '#78350f';
                ctx.fillRect(w * 0.36, h * 0.55, w * 0.28, h * 0.18);
                ctx.fillStyle = '#fbbf24'; // Brass lock
                ctx.fillRect(w * 0.46, h * 0.6, w * 0.08, h * 0.08);

                // Boots
                ctx.fillStyle = '#451a03';
                ctx.fillRect(w * 0.32, h * 0.84, w * 0.14, h * 0.12);
                ctx.fillRect(w * 0.54, h * 0.84, w * 0.14, h * 0.12);

            } else if (key === 'npc_engineer') {
                // Realistic Engineer Character: Wearing leather apron, goggles on forehead, toolbelt & gloves
                
                // Shadow
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath();
                ctx.ellipse(w * 0.5, h * 0.95, w * 0.35, h * 0.05, 0, 0, Math.PI * 2);
                ctx.fill();

                // Shirt / Tunic (Navy Blue Workwear)
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.roundRect(w * 0.25, h * 0.3, w * 0.5, h * 0.55, 12);
                ctx.fill();

                // Leather Apron (Brown)
                ctx.fillStyle = '#78350f';
                ctx.beginPath();
                ctx.roundRect(w * 0.3, h * 0.35, w * 0.4, h * 0.48, 8);
                ctx.fill();

                // Human Face (Mature Skin Tone)
                ctx.fillStyle = '#fed7aa';
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.2, w * 0.2, 0, Math.PI * 2);
                ctx.fill();

                // Beard / Stubble
                ctx.fillStyle = '#451a03';
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.23, w * 0.2, 0.2, Math.PI - 0.2);
                ctx.fill();

                // Brass Brass Steampunk Goggles on forehead
                ctx.fillStyle = '#d97706';
                ctx.fillRect(w * 0.3, h * 0.1, w * 0.4, h * 0.08);
                ctx.fillStyle = '#06b6d4'; // Glowing lenses
                ctx.shadowColor = '#06b6d4';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(w * 0.4, h * 0.14, w * 0.07, 0, Math.PI * 2);
                ctx.arc(w * 0.6, h * 0.14, w * 0.07, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Leather Gloves & Wrench Tool
                ctx.fillStyle = '#92400e';
                ctx.fillRect(w * 0.18, h * 0.5, w * 0.12, h * 0.15);
                ctx.fillStyle = '#94a3b8'; // Wrench metal
                ctx.fillRect(w * 0.12, h * 0.45, w * 0.08, h * 0.25);

                // Boots
                ctx.fillStyle = '#1c1917';
                ctx.fillRect(w * 0.3, h * 0.83, w * 0.16, h * 0.13);
                ctx.fillRect(w * 0.54, h * 0.83, w * 0.16, h * 0.13);
            }
            ctx.restore();
        } else if (key === 'gear') {
            // Glowing Brass & Copper Steampunk Gear
            ctx.save();
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, w * 0.44, 0, Math.PI * 2);
            ctx.fill();

            // Teeth
            for (let i = 0; i < 8; i++) {
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(i * Math.PI / 4);
                ctx.fillStyle = '#b45309';
                ctx.fillRect(-w * 0.08, -w * 0.5, w * 0.16, w * 0.2);
                ctx.restore();
            }

            // Inner core
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, w * 0.25, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, w * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (key === 'spring') {
            ctx.strokeStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.lineWidth = h * 0.25;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            for (let i = 1; i <= 5; i++) {
                ctx.lineTo(w * (i / 5), i % 2 === 0 ? h * 0.85 : h * 0.15);
            }
            ctx.stroke();
        } else if (key === 'bell') {
            // Golden Resonant Bell
            ctx.save();
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#fef08a');
            grad.addColorStop(0.5, '#f59e0b');
            grad.addColorStop(1, '#b45309');
            ctx.fillStyle = grad;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            ctx.moveTo(w * 0.15, h * 0.9);
            ctx.quadraticCurveTo(w * 0.15, h * 0.2, w * 0.5, h * 0.08);
            ctx.quadraticCurveTo(w * 0.85, h * 0.2, w * 0.85, h * 0.9);
            ctx.fill();

            // Clapper
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(w * 0.5, h * 0.92, w * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, w, h);
        }
    },
    async loadAll() {
        const toLoad = [
            { key: 'bg_sky', path: '/assets/backgrounds/sky.png', color: '#050a15', w: 1920, h: 1080 },
            { key: 'bg_clouds', path: '/assets/backgrounds/clouds.png', color: 'transparent', w: 1920, h: 1080 },
            { key: 'bg_far_mountains', path: '/assets/backgrounds/far_mountains.png', color: '#0a1525', w: 1920, h: 1080 },
            { key: 'bg_near_mountains', path: '/assets/backgrounds/near_mountains.png', color: '#102035', w: 1920, h: 1080 },
            { key: 'bg_village', path: '/assets/backgrounds/village.png', color: '#1a2a40', w: 2000, h: 800 },
            { key: 'bg_snow', path: '/assets/backgrounds/snow.png', color: 'transparent', w: 1920, h: 1080 },
            { key: 'loc_child', path: '/loc_child.jpg', color: '#4a3b32', w: 200, h: 200 },
            { key: 'loc_engineer', path: '/loc_engineer.jpg', color: '#3a3a3a', w: 250, h: 200 },
            { key: 'loc_lab', path: '/loc_lab.jpg', color: '#1a3a4a', w: 250, h: 200 },
            { key: 'loc_tree', path: '/assets/buildings/bell_tree.png', color: '#2a4a3a', w: 300, h: 300 },
            { key: 'npc_child', path: '/npc_child.jpg', color: '#7a5b52', w: 100, h: 200 },
            { key: 'npc_engineer', path: '/npc_engineer.jpg', color: '#6a6a5a', w: 120, h: 240 },
            { key: 'gear', path: '/circuit_gear.jpg', color: '#555', w: 100, h: 100 },
            { key: 'spring', path: '/assets/puzzle/spring.png', color: '#666', w: 40, h: 20 },
            { key: 'bell', path: '/assets/puzzle/bell.png', color: '#8a6a2a', w: 200, h: 200 }
        ];
        
        await Promise.all(toLoad.map(item => this.loadImage(item.key, item.path, item.color, item.w, item.h)));
    }
};
