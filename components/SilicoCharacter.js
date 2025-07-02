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
        
        // Reset previous styles
        character.style.clipPath = '';
        character.style.border = '';
        character.style.borderRadius = '50%';
        character.style.animation = '';
        
        switch (chapterNumber) {
            case 1:
                // Stone/Rock shape - rough, angular
                character.style.background = 'linear-gradient(135deg, #8B4513, #A0522D)';
                character.style.clipPath = 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)';
                character.style.boxShadow = '0 5px 15px rgba(139, 69, 19, 0.4)';
                break;
            case 2:
                // Sand particles - granular, heated
                character.style.background = 'linear-gradient(135deg, #F4A460, #DEB887)';
                character.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
                character.style.boxShadow = '0 5px 15px rgba(244, 164, 96, 0.4)';
                character.style.animation = 'heat-shimmer 2s infinite';
                break;
            case 3:
                // Crystal structure - geometric, clear
                character.style.background = 'linear-gradient(135deg, #E6E6FA, #DDA0DD)';
                character.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                character.style.boxShadow = '0 5px 20px rgba(221, 160, 221, 0.6)';
                character.style.animation = 'crystal-sparkle 3s infinite';
                break;
            case 4:
                // Wafer - flat, metallic, precise
                character.style.background = 'linear-gradient(135deg, #C0C0C0, #808080)';
                character.style.borderRadius = '10px';
                character.style.transform = 'scaleY(0.3)';
                character.style.boxShadow = '0 2px 10px rgba(128, 128, 128, 0.5)';
                break;
            case 5:
                // Logic gates - circuit patterns
                character.style.background = 'linear-gradient(135deg, #32CD32, #228B22)';
                character.style.border = '3px solid #00FF00';
                character.style.borderRadius = '15px';
                character.style.boxShadow = '0 5px 15px rgba(50, 205, 50, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.2)';
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
}

// Add character evolution animations
const evolutionStyle = document.createElement('style');
evolutionStyle.textContent = `
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