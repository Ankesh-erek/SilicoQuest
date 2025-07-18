// Silico Character Animation Controller
class SilicoCharacter {
    constructor() {
        this.character = document.getElementById('silicoNarrator');
        this.eyes = this.character.querySelectorAll('.eye');
        this.mouth = this.character.querySelector('.silico-mouth');
        this.face = this.character.querySelector('.silico-face');
        
        this.currentAnimation = 'idle';
        this.animationInterval = null;
        
        this.init();
    }

    init() {
        // Start with idle animation
        this.animate('idle');
        
        // Add hover interactions
        this.character.addEventListener('mouseenter', () => {
            if (this.currentAnimation === 'idle') {
                this.animate('excited');
            }
        });
        
        this.character.addEventListener('mouseleave', () => {
            if (this.currentAnimation === 'excited') {
                this.animate('idle');
            }
        });
    }

    animate(animationType) {
        // Clear any existing animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = animationType;

        switch (animationType) {
            case 'idle':
                this.idleAnimation();
                break;
            case 'talking':
                this.talkingAnimation();
                break;
            case 'excited':
                this.excitedAnimation();
                break;
            case 'celebrating':
                this.celebratingAnimation();
                break;
            case 'thinking':
                this.thinkingAnimation();
                break;
            default:
                this.idleAnimation();
        }
    }

    idleAnimation() {
        // Reset to normal state
        this.resetCharacter();
        
        // Occasional blink and subtle float
        this.animationInterval = setInterval(() => {
            this.blink();
            this.character.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 3}px)`;
        }, 3000 + Math.random() * 2000);
    }

    talkingAnimation() {
        this.resetCharacter();
        
        let talkPhase = 0;
        this.animationInterval = setInterval(() => {
            // Animate mouth for talking
            const scaleY = 1 + Math.sin(talkPhase * 0.5) * 0.5;
            this.mouth.style.transform = `scaleY(${scaleY})`;
            this.mouth.style.borderRadius = `0 0 ${15 + Math.sin(talkPhase * 0.5) * 10}px ${15 - Math.sin(talkPhase * 0.5) * 10}px`;
            
            // Occasional blink while talking
            if (Math.random() < 0.1) {
                this.blink();
            }
            
            // Subtle bounce while talking
            this.character.style.transform = `translateY(${Math.sin(Date.now() / 200) * 2}px)`;

            talkPhase++;
        }, 150);
    }

    excitedAnimation() {
        this.resetCharacter();
        
        // Make eyes bigger and mouth wider
        this.eyes.forEach(eye => {
            eye.style.transform = 'scale(1.4)';
            eye.style.background = '#FFD700';
        });
        
        this.mouth.style.transform = 'scaleX(1.5) scaleY(1.3)';
        this.mouth.style.borderColor = '#FFD700';
        
        // Add bouncing effect
        let bouncePhase = 0;
        this.animationInterval = setInterval(() => {
            const bounce = Math.sin(bouncePhase) * 5;
            this.character.style.transform = `translateY(${bounce}px) rotate(${Math.sin(bouncePhase * 0.5) * 2}deg)`;
            bouncePhase += 0.3;
        }, 50);
    }

    celebratingAnimation() {
        this.resetCharacter();
        
        // Happy eyes and big smile
        this.eyes.forEach(eye => {
            eye.style.transform = 'scale(1.3)';
            eye.style.background = '#48bb78';
        });
        
        this.mouth.style.transform = 'scaleX(1.8) scaleY(1.6)';
        this.mouth.style.borderColor = '#48bb78';
        this.mouth.style.borderWidth = '3px';
        
        // Celebration particles effect
        this.createCelebrationParticles();
        
        // Wiggle and jump animation
        let wigglePhase = 0;
        this.animationInterval = setInterval(() => {
            const wiggle = Math.sin(wigglePhase) * 8;
            const jump = Math.abs(Math.sin(wigglePhase * 0.5)) * -10;
            this.character.style.transform = `translateY(${jump}px) rotate(${wiggle}deg) scale(1.1)`;
            wigglePhase += 0.4;
        }, 100);
    }

    thinkingAnimation() {
        this.resetCharacter();
        
        // Squinted eyes
        this.eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.5)';
        });
        
        // Smaller mouth
        this.mouth.style.transform = 'scale(0.8)';
        
        // Add thinking bubble effect
        this.createThinkingBubble();
        
        // Slow head tilt
        let tiltPhase = 0;
        this.animationInterval = setInterval(() => {
            const tilt = Math.sin(tiltPhase) * 10;
            this.character.style.transform = `rotate(${tilt}deg)`;
            tiltPhase += 0.1;
        }, 100);
    }

    blink() {
        this.eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.1)';
            setTimeout(() => {
                eye.style.transform = 'scaleY(1)';
            }, 150);
        });
    }

    resetCharacter() {
        // Reset all transformations and styles
        this.character.style.transform = '';
        this.eyes.forEach(eye => {
            eye.style.transform = '';
            eye.style.background = 'white';
        });
        this.mouth.style.transform = '';
        this.mouth.style.borderColor = 'white';
        this.mouth.style.borderWidth = '2px';
        
        // Remove any temporary elements
        this.removeTemporaryElements();
    }

    createCelebrationParticles() {
        const particleCount = 8;
        const container = this.character.parentElement;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
            `;
            
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = `translate(-50%, -50%)`;
            
            container.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { transform: `translate(-50%, -50%) translate(0, 0) scale(0)`, opacity: 1 },
                { transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentElement) {
                    particle.parentElement.removeChild(particle);
                }
            };
        }
    }

    createThinkingBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'thinking-bubble';
        bubble.innerHTML = '💭';
        bubble.style.cssText = `
            position: absolute;
            top: -30px;
            right: -20px;
            font-size: 2rem;
            animation: float 2s ease-in-out infinite;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.character.appendChild(bubble);
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    removeTemporaryElements() {
        // Remove celebration particles
        const particles = document.querySelectorAll('.celebration-particle');
        particles.forEach(particle => {
            if (particle.parentElement) {
                particle.parentElement.removeChild(particle);
            }
        });
        
        // Remove thinking bubble
        const thinkingBubble = this.character.querySelector('.thinking-bubble');
        if (thinkingBubble) {
            thinkingBubble.remove();
        }
    }

    getRandomColor() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Method to change Silico's appearance based on chapter
    evolveForChapter(chapterNumber) {
        const character = this.character.querySelector('.silico-character');
        
        // Remove previous crystals and sparkles
        if (character) {
            character.querySelectorAll('.silico-crystal, .silico-sparkle').forEach(e => e.remove());
        }
        // Reset previous styles
        character.style.clipPath = '';
        character.style.border = '';
        character.style.borderRadius = '50%';
        character.style.animation = '';
        
        switch (chapterNumber) {
            case 1:
                // Primitive Rock Form: stone body, glowing quartz eyes, crystals, sparkles, bouncy
                character.style.background = 'linear-gradient(135deg, #999, #ccc 60%, #777 100%)';
                character.style.clipPath = 'polygon(18% 0%, 82% 0%, 100% 22%, 98% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)';
                character.style.boxShadow = '0 12px 28px #0006, 0 0 0 4px #fff2 inset';
                character.style.border = '2px solid #aaa';
                character.style.borderRadius = '22% 38% 40% 30% / 30% 30% 60% 70%';
                character.style.animation = 'silicoBounce 1.8s infinite cubic-bezier(.5,1.8,.5,1)';
                // Add crystal pieces on back
                this.addCrystals(character);
                // Add sparkles
                this.addSparkles(character);
                // Eyes: glowing quartz
                this.eyes.forEach(eye => {
                    eye.style.background = 'radial-gradient(circle, #fff 60%, #b3e6ff 100%)';
                    eye.style.boxShadow = '0 0 12px #b3e6ff, 0 0 24px #fff8';
                    eye.style.animation = 'eyeGlow 2.5s infinite alternate';
                });
                break;
            case 2:
                // Molten Core Form
                character.style.background = 'radial-gradient(ellipse at center, #ff8c00 0%, #ff4500 50%, #8b0000 100%)';
                character.style.borderRadius = '40% 60% 45% 55% / 50% 55% 45% 50%';
                character.style.boxShadow = '0 0 35px #ff4500, 0 0 70px #ff8c00, inset 0 0 10px #ff8c00';
                character.style.animation = 'moltenFloat 3s infinite ease-in-out';
                this.addLavaVeins(character);
                this.addEmbersAndSteam(character);
                this.eyes.forEach(eye => {
                    eye.style.background = 'radial-gradient(circle, #ffdd00 60%, #ff8c00 100%)';
                    eye.style.boxShadow = '0 0 12px #ffdd00, 0 0 24px #ff8c00';
                    eye.style.animation = 'eyeGlow 2s infinite alternate';
                });
                break;
            case 3:
                // Crystal Growth Form
                character.style.background = 'linear-gradient(135deg, #9d50bb, #6e48aa)';
                character.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
                character.style.boxShadow = '0 0 25px #9d50bb, 0 0 50px #6e48aa, inset 0 0 15px #d8aaff';
                character.style.animation = 'crystalPulse 2.5s infinite';
                this.addFloatingHands(character);
                this.addSparkleTrail(character);
                this.eyes.forEach(eye => {
                    eye.style.background = 'radial-gradient(circle, #fff 60%, #d8aaff 100%)';
                    eye.style.boxShadow = '0 0 12px #d8aaff, 0 0 24px #fff8';
                    eye.style.animation = 'eyeGlow 2s infinite alternate';
                });
                break;
            case 4:
                // Techno-Tool Form
                character.style.background = 'linear-gradient(135deg, #f0f0f0, #b0b0b0)';
                character.style.borderRadius = '20px';
                character.style.boxShadow = '0 0 25px #c0c0c0, inset 0 0 15px #fff';
                this.addRoboticArms(character, true);
                this.addChestPanel(character, true);
                this.addWeldingVisor(character);
                this.eyes.forEach(eye => {
                    eye.style.background = 'radial-gradient(circle, #00ff00 60%, #00a000 100%)';
                    eye.style.boxShadow = '0 0 15px #00ff00, 0 0 30px #00ff00';
                    eye.style.animation = 'eyeGlow 1.8s infinite alternate';
                });
                break;
            case 5:
                // Circuit Designer Form
                character.style.background = '#1a1a1a';
                character.style.borderRadius = '25px';
                character.style.boxShadow = '0 0 25px #00ff00, inset 0 0 15px #00ff00';
                character.style.border = '2px solid #00ff00';
                this.addAnimatedGates(character);
                this.addTechGoggles(character);
                this.addBlueprintHologram(character);
                this.eyes.forEach(eye => {
                    eye.style.background = 'radial-gradient(circle, #fff 60%, #00ff00 100%)';
                    eye.style.boxShadow = '0 0 12px #00ff00, 0 0 24px #00ff00';
                    eye.style.animation = 'eyeGlow 2s infinite alternate';
                });
                break;
            case 6:
                // Connected circuits - network-like
                character.style.background = 'linear-gradient(135deg, #4169E1, #0000CD)';
                character.style.border = '2px solid #00BFFF';
                character.style.borderRadius = '20px';
                character.style.boxShadow = '0 5px 20px rgba(65, 105, 225, 0.6), inset 0 0 15px rgba(0, 191, 255, 0.3)';
                character.style.animation = 'circuit-pulse 2s infinite';
                break;
            case 7:
                // Brain/AI - neural network
                character.style.background = 'linear-gradient(135deg, #FF1493, #8A2BE2, #4169E1, #00CED1)';
                character.style.borderRadius = '60% 40% 40% 60% / 60% 30% 70% 40%';
                character.style.animation = 'brain-pulse 1.5s infinite';
                character.style.boxShadow = '0 5px 25px rgba(255, 20, 147, 0.6)';
                break;
            case 8:
                // Final evolved form - golden, radiant
                character.style.background = 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)';
                character.style.borderRadius = '50%';
                character.style.border = '3px solid #FFFF00';
                character.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)';
                character.style.animation = 'golden-glow 2s infinite';
                break;
        }
    }

    addCrystals(character) {
        const crystalData = [
            { left: '18%', top: '8%', size: 18, rotate: -18 },
            { left: '68%', top: '12%', size: 14, rotate: 12 },
            { left: '38%', top: '2%', size: 12, rotate: 0 },
            { left: '55%', top: '22%', size: 10, rotate: 24 }
        ];
        crystalData.forEach(c => {
            const crystal = document.createElement('div');
            crystal.className = 'silico-crystal';
            crystal.style.position = 'absolute';
            crystal.style.left = c.left;
            crystal.style.top = c.top;
            crystal.style.width = c.size + 'px';
            crystal.style.height = c.size + 'px';
            crystal.style.background = 'linear-gradient(45deg, #E6E6FA, #DDA0DD 80%, #fff 100%)';
            crystal.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            crystal.style.transform = `rotate(${c.rotate}deg)`;
            crystal.style.boxShadow = '0 0 8px #b3e6ff, 0 0 16px #fff8';
            crystal.style.opacity = '0.8';
            crystal.style.pointerEvents = 'none';
            crystal.style.zIndex = '1';
            crystal.style.animation = 'crystalSparkle 2.2s infinite';
            character.appendChild(crystal);
        });
    }

    addSparkles(character) {
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'silico-sparkle';
            sparkle.style.position = 'absolute';
            sparkle.style.left = `${15 + Math.random() * 70}%`;
            sparkle.style.top = `${10 + Math.random() * 70}%`;
            sparkle.style.width = '6px';
            sparkle.style.height = '6px';
            sparkle.style.background = 'radial-gradient(circle, #fff 60%, #b3e6ff 100%)';
            sparkle.style.borderRadius = '50%';
            sparkle.style.opacity = '0.7';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '2';
            sparkle.style.animation = `sparkleTwinkle 1.5s infinite ${Math.random()}s`;
            character.appendChild(sparkle);
        }
    }

    // Method to speak a message (visual feedback)
    speak(message, duration = 3000) {
        const speechBubble = document.getElementById('speechBubble');
        const narrationText = document.getElementById('narrationText');
        
        narrationText.textContent = message;
        this.animate('talking');
        
        setTimeout(() => {
            this.animate('idle');
        }, duration);
    }

    addLavaVeins(character) {
        const vein = document.createElement('div');
        vein.className = 'silico-lava-vein';
        vein.style.cssText = `
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" patternUnits="userSpaceOnUse" width="30" height="30"><path d="M15 0 V30 M0 15 H30" stroke="%23ffdd00" stroke-width="1" /></pattern></defs><rect width="100%" height="100%" fill="url(%23p)"/></svg>');
            background-size: 40px 40px;
            opacity: 0.4;
            mix-blend-mode: screen;
            animation: lavaVeinFlow 4s linear infinite;
            z-index: 1;
            border-radius: inherit;
        `;
        character.appendChild(vein);
    }

    addEmbersAndSteam(character) {
        // Embers
        for (let i = 0; i < 8; i++) {
            const ember = document.createElement('div');
            ember.className = 'silico-ember';
            ember.style.cssText = `
                position: absolute;
                width: ${4 + Math.random() * 4}px;
                height: ${4 + Math.random() * 4}px;
                background: #ffdd00;
                border-radius: 50%;
                box-shadow: 0 0 8px #ffdd00;
                bottom: 10%;
                left: ${10 + Math.random() * 80}%;
                animation: emberFloat ${2 + Math.random() * 3}s infinite ease-out;
                z-index: 3;
            `;
            character.appendChild(ember);
        }
        // Steam
        const steam1 = document.createElement('div');
        steam1.className = 'silico-steam';
        steam1.style.cssText = `
            position: absolute;
            top: -10px;
            left: 20%;
            width: 15px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            opacity: 0.3;
            filter: blur(5px);
            animation: steamRise 3s infinite ease-in-out 0.5s;
            z-index: 0;
        `;
        character.appendChild(steam1);

        const steam2 = document.createElement('div');
        steam2.className = 'silico-steam';
        steam2.style.cssText = `
            position: absolute;
            top: -15px;
            left: 60%;
            width: 20px;
            height: 25px;
            background: #fff;
            border-radius: 50%;
            opacity: 0.4;
            filter: blur(6px);
            animation: steamRise 3.5s infinite ease-in-out;
            z-index: 0;
        `;
        character.appendChild(steam2);
    }

    addFloatingHands(character) {
        const hand1 = document.createElement('div');
        hand1.className = 'silico-hand';
        hand1.style.cssText = `
            position: absolute;
            left: -30px;
            top: 40%;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #9d50bb, #d8aaff);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            box-shadow: 0 0 15px #d8aaff;
            animation: floatHand 3s infinite ease-in-out;
        `;
        character.appendChild(hand1);

        const hand2 = document.createElement('div');
        hand2.className = 'silico-hand';
        hand2.style.cssText = `
            position: absolute;
            right: -30px;
            top: 50%;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #9d50bb, #d8aaff);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            box-shadow: 0 0 15px #d8aaff;
            animation: floatHand 3s infinite ease-in-out 0.5s;
        `;
        character.appendChild(hand2);
    }

    addSparkleTrail(character) {
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'silico-sparkle-trail';
            sparkle.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                background: #d8aaff;
                border-radius: 50%;
                box-shadow: 0 0 8px #d8aaff;
                animation: sparkleTrail ${2 + Math.random() * 2}s infinite linear ${Math.random() * 2}s;
            `;
            character.appendChild(sparkle);
        }
    }

    addRoboticArms(character, enhanced = false) {
        const arm1 = document.createElement('div');
        arm1.className = 'silico-arm';
        arm1.style.cssText = `
            position: absolute;
            left: -50px;
            top: 45%;
            width: 50px;
            height: 12px;
            background: #b0b0b0;
            border-radius: 6px;
            animation: roboticArmMove 2.5s infinite ease-in-out;
        `;
        if (enhanced) {
            arm1.innerHTML = '<div style="width:12px;height:12px;background:red;border-radius:50%;animation:roboticToolSpin 1s linear infinite;"></div>'; // Mini-saw
        }
        character.appendChild(arm1);

        const arm2 = document.createElement('div');
        arm2.className = 'silico-arm';
        arm2.style.cssText = `
            position: absolute;
            right: -50px;
            top: 55%;
            width: 50px;
            height: 12px;
            background: #b0b0b0;
            border-radius: 6px;
            animation: roboticArmMove 2.5s infinite ease-in-out 0.5s;
        `;
        if (enhanced) {
            arm2.innerHTML = '<div style="width:15px;height:15px;background:blue;border-radius:50%;animation:roboticToolSpin 0.5s linear infinite;"></div>'; // Polisher
        }
        character.appendChild(arm2);
    }

    addChestPanel(character, enhanced = false) {
        const panel = document.createElement('div');
        panel.className = 'silico-chest-panel';
        panel.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 40px;
            background: #111;
            border: 2px solid #00ff00;
            border-radius: 8px;
            box-shadow: 0 0 20px #00ff00;
            animation: chestPanelGlow 1.8s infinite alternate;
        `;
        if (enhanced) {
            panel.innerHTML = '<div style="width:80%;height:80%;margin:10%;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjMDBmZjAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=) center/contain no-repeat;animation:waferIconSwitch 4s linear infinite;"></div>';
        }
        character.appendChild(panel);
    }

    addWeldingVisor(character) {
        const visor = document.createElement('div');
        visor.className = 'silico-visor';
        visor.style.cssText = `
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 30px;
            background: rgba(0, 255, 0, 0.2);
            border: 2px solid #00ff00;
            border-radius: 10px 10px 0 0;
            box-shadow: 0 0 15px #00ff00;
            animation: visorFlip 4s infinite alternate;
        `;
        character.appendChild(visor);
    }

    addAnimatedGates(character) {
        const andGate = document.createElement('div');
        andGate.className = 'silico-gate';
        andGate.textContent = 'AND';
        andGate.style.cssText = `
            position: absolute;
            left: 20%;
            top: 30%;
            color: #00ff00;
            font-size: 1rem;
            animation: gateGlow 2s infinite alternate;
        `;
        character.appendChild(andGate);

        const orGate = document.createElement('div');
        orGate.className = 'silico-gate';
        orGate.textContent = 'OR';
        orGate.style.cssText = `
            position: absolute;
            right: 20%;
            top: 50%;
            color: #00ff00;
            font-size: 1rem;
            animation: gateGlow 2s infinite alternate 1s;
        `;
        character.appendChild(orGate);
    }

    addTechGoggles(character) {
        const goggles = document.createElement('div');
        goggles.className = 'silico-goggles';
        goggles.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 20px;
            border: 2px solid #00ff00;
            border-radius: 10px;
            background: rgba(0, 255, 0, 0.1);
            box-shadow: 0 0 15px #00ff00;
        `;
        character.appendChild(goggles);
    }

    addBlueprintHologram(character) {
        const hologram = document.createElement('div');
        hologram.className = 'silico-hologram';
        hologram.style.cssText = `
            position: absolute;
            right: -80px;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iMzAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSIjMDBmZjAwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48L3N2Zz4=') center/contain no-repeat;
            opacity: 0.7;
            animation: hologramFlicker 3s infinite ease-in-out;
        `;
        character.appendChild(hologram);
    }
}

// Add character evolution animations
const evolutionStyle = document.createElement('style');
evolutionStyle.textContent = `
    @keyframes silicoBounce {
        0%, 100% { transform: translateY(0) scale(1, 1) rotate(0deg); }
        25% { transform: translateY(-12px) scale(1.05, 0.95) rotate(-1deg); }
        50% { transform: translateY(0) scale(0.98, 1.02) rotate(1deg); }
        75% { transform: translateY(-6px) scale(1.02, 0.98) rotate(0deg); }
    }
    @keyframes sparkleTwinkle {
        0%, 100% { opacity: 0.7; filter: blur(0px) brightness(1); transform: scale(1); }
        50% { opacity: 1; filter: blur(1px) brightness(1.8); transform: scale(1.2); }
    }
    @keyframes eyeGlow {
        0%, 100% { box-shadow: 0 0 12px #b3e6ff, 0 0 24px #fff8; }
        50% { box-shadow: 0 0 18px #b3e6ff, 0 0 32px #fff; }
    }
    @keyframes moltenFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.02); }
    }
    @keyframes lavaVeinFlow {
        0% { background-position: 0 0; }
        100% { background-position: 40px 40px; }
    }
    @keyframes emberFloat {
        0% { transform: translateY(0); opacity: 0.8; }
        100% { transform: translateY(-80px); opacity: 0; }
    }
    @keyframes steamRise {
        0% { transform: translateY(0) scale(1); opacity: 0.4; }
        100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
    }
    @keyframes crystalPulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2); }
    }
    @keyframes floatHand {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes sparkleTrail {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0; }
    }
    @keyframes roboticArmMove {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        50% { transform: translateX(-15px) rotate(-10deg); }
    }
    @keyframes roboticToolSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes chestPanelGlow {
        0%, 100% { box-shadow: 0 0 20px #00ff00; }
        50% { box-shadow: 0 0 35px #00ff00, 0 0 50px #fff; }
    }
    @keyframes waferIconSwitch {
        0%, 40% { background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjMDBmZjAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=); }
        60%, 100% { background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgc3Ryb2tlPSIjMDBmZjAwIiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=); }
    }
    @keyframes visorFlip {
        0%, 40% { transform: translateX(-50%) translateY(0) rotateX(0); }
        50% { transform: translateX(-50%) translateY(-20px) rotateX(90deg); }
        60%, 100% { transform: translateX(-50%) translateY(0) rotateX(0); }
    }
    @keyframes gateGlow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; text-shadow: 0 0 10px #00ff00; }
    }
    @keyframes hologramFlicker {
        0%, 100% { opacity: 0.7; transform: translateY(-50%) scale(1); }
        50% { opacity: 0.5; transform: translateY(-50%) scale(1.05); }
    }
    @keyframes heat-shimmer {
        0%, 100% { filter: brightness(1) blur(0px); }
        50% { filter: brightness(1.2) blur(1px); }
    }
    
    @keyframes crystal-sparkle {
        0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 5px rgba(221, 160, 221, 0.5)); 
            transform: rotate(0deg);
        }
        25% { 
            filter: brightness(1.3) drop-shadow(0 0 15px rgba(221, 160, 221, 0.8)); 
            transform: rotate(90deg);
        }
        50% { 
            filter: brightness(1.1) drop-shadow(0 0 10px rgba(221, 160, 221, 0.6)); 
            transform: rotate(180deg);
        }
        75% { 
            filter: brightness(1.3) drop-shadow(0 0 15px rgba(221, 160, 221, 0.8)); 
            transform: rotate(270deg);
        }
    }
    
    @keyframes circuit-pulse {
        0%, 100% { 
            box-shadow: 0 5px 20px rgba(65, 105, 225, 0.6), inset 0 0 15px rgba(0, 191, 255, 0.3);
        }
        50% { 
            box-shadow: 0 5px 30px rgba(65, 105, 225, 0.9), inset 0 0 25px rgba(0, 191, 255, 0.6);
        }
    }
    
    @keyframes brain-pulse {
        0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
        }
        50% { 
            transform: scale(1.05);
            filter: brightness(1.2);
        }
    }
    
    @keyframes golden-glow {
        0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4);
            transform: scale(1);
        }
        50% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6);
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(evolutionStyle);