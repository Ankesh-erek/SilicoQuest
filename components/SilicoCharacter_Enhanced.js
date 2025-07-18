// Enhanced Silico Character Animation Controller with Advanced Features
class EnhancedSilicoCharacter extends SilicoCharacter {
    constructor() {
        super();
        this.emotionalState = 'neutral';
        this.interactionCount = 0;
        this.lastInteractionTime = Date.now();
        this.personalityTraits = {
            enthusiasm: 0.8,
            helpfulness: 0.9,
            patience: 0.7,
            humor: 0.6
        };
        
        this.initEnhancedFeatures();
    }

    initEnhancedFeatures() {
        // Add advanced interaction listeners
        this.character.addEventListener('click', () => {
            this.handleDirectInteraction();
        });

        // Add idle behavior system
        this.startIdleBehaviorSystem();
        
        // Add contextual awareness
        this.startContextualAwareness();
    }

    // Enhanced method to speak a message with dynamic animations and emotions
    speak(message, duration = 3000, emotion = 'neutral') {
        const speechBubble = document.getElementById('speechBubble');
        const narrationText = document.getElementById('narrationText');
        
        // Update emotional state
        this.emotionalState = emotion;
        
        // Type out the message with realistic animation
        this.typeMessage(narrationText, message);
        
        // Choose animation based on emotion and message content
        let animationType = this.determineAnimationType(message, emotion);
        this.animate(animationType);
        
        // Add speech bubble effects
        this.addSpeechBubbleEffects(speechBubble, emotion);
        
        // Add voice-like visual feedback
        this.addVoiceVisualization(duration);
        
        setTimeout(() => {
            this.animate('idle');
            this.removeSpeechBubbleEffects(speechBubble);
        }, duration);

        // Track interaction for personality development
        this.interactionCount++;
        this.lastInteractionTime = Date.now();
    }

    // Determine animation type based on message content and emotion
    determineAnimationType(message, emotion) {
        // Celebration triggers
        if (message.includes('🏆') || message.includes('Perfect') || message.includes('Excellent') || 
            message.includes('Amazing') || message.includes('Outstanding')) {
            return 'celebrating';
        }
        
        // Thinking triggers
        if (message.includes('🤔') || message.includes('Think') || message.includes('?') || 
            message.includes('Hmm') || message.includes('Consider')) {
            return 'thinking';
        }
        
        // Excitement triggers
        if (message.includes('🌟') || message.includes('Wow') || message.includes('Incredible') || 
            message.includes('🎉') || emotion === 'excited') {
            return 'excited';
        }
        
        // Default to talking
        return 'talking';
    }

    // Type out message with realistic typing effect and pauses
    typeMessage(element, message, speed = 40) {
        element.textContent = '';
        let i = 0;
        
        const typeChar = () => {
            if (i < message.length) {
                const char = message.charAt(i);
                element.textContent += char;
                i++;
                
                // Variable speed based on character type
                let nextDelay = speed;
                if (char.match(/[.!?]/)) {
                    nextDelay = speed * 8; // Long pause for sentence endings
                } else if (char.match(/[,;:]/)) {
                    nextDelay = speed * 4; // Medium pause for commas
                } else if (char === ' ') {
                    nextDelay = speed * 1.5; // Short pause for spaces
                } else if (char.match(/[🎉🏆🌟💎⚡🔥💡🤔]/)) {
                    nextDelay = speed * 3; // Pause for emojis
                }
                
                setTimeout(typeChar, nextDelay);
            }
        };
        
        typeChar();
    }

    // Add dynamic effects to speech bubble based on emotion
    addSpeechBubbleEffects(speechBubble, emotion) {
        speechBubble.style.transition = 'all 0.3s ease';
        
        // Remove any existing animation classes
        speechBubble.classList.remove('excited-bubble', 'success-bubble', 'thinking-bubble', 'error-bubble');
        
        switch (emotion) {
            case 'excited':
                speechBubble.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))';
                speechBubble.style.borderColor = 'rgba(255, 215, 0, 0.6)';
                speechBubble.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)';
                speechBubble.classList.add('excited-bubble');
                break;
            case 'success':
                speechBubble.style.background = 'linear-gradient(135deg, rgba(72, 187, 120, 0.3), rgba(56, 161, 105, 0.2))';
                speechBubble.style.borderColor = 'rgba(72, 187, 120, 0.6)';
                speechBubble.style.boxShadow = '0 0 20px rgba(72, 187, 120, 0.4)';
                speechBubble.classList.add('success-bubble');
                break;
            case 'thinking':
                speechBubble.style.background = 'linear-gradient(135deg, rgba(128, 90, 213, 0.3), rgba(159, 122, 234, 0.2))';
                speechBubble.style.borderColor = 'rgba(128, 90, 213, 0.6)';
                speechBubble.style.boxShadow = '0 0 20px rgba(128, 90, 213, 0.4)';
                speechBubble.classList.add('thinking-bubble');
                break;
            case 'error':
                speechBubble.style.background = 'linear-gradient(135deg, rgba(229, 62, 62, 0.3), rgba(197, 48, 48, 0.2))';
                speechBubble.style.borderColor = 'rgba(229, 62, 62, 0.6)';
                speechBubble.style.boxShadow = '0 0 20px rgba(229, 62, 62, 0.4)';
                speechBubble.classList.add('error-bubble');
                break;
            default:
                speechBubble.style.background = 'var(--glass-bg)';
                speechBubble.style.borderColor = 'var(--glass-border)';
                speechBubble.style.boxShadow = 'var(--shadow-light)';
        }
    }

    // Add voice-like visualization during speech
    addVoiceVisualization(duration) {
        const voiceIndicator = document.createElement('div');
        voiceIndicator.className = 'voice-indicator';
        voiceIndicator.style.cssText = `
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 4px;
            background: linear-gradient(90deg, #4facfe, #00f2fe);
            border-radius: 2px;
            animation: voicePulse 0.5s ease-in-out infinite;
        `;
        
        this.character.appendChild(voiceIndicator);
        
        setTimeout(() => {
            if (voiceIndicator.parentElement) {
                voiceIndicator.parentElement.removeChild(voiceIndicator);
            }
        }, duration);
    }

    // Remove speech bubble effects
    removeSpeechBubbleEffects(speechBubble) {
        speechBubble.style.background = 'var(--glass-bg)';
        speechBubble.style.borderColor = 'var(--glass-border)';
        speechBubble.style.boxShadow = 'var(--shadow-light)';
        speechBubble.classList.remove('excited-bubble', 'success-bubble', 'thinking-bubble', 'error-bubble');
    }

    // Enhanced method to react to game events with personality
    reactToGameEvent(eventType, data = {}) {
        const responses = this.getPersonalizedResponses(eventType, data);
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        switch (eventType) {
            case 'game_start':
                this.speak(response.message, 2500, 'excited');
                this.animate('excited');
                this.createAdvancedParticles('sparkle');
                break;
            case 'correct_answer':
                this.speak(response.message, 2000, 'success');
                this.animate('celebrating');
                this.createAdvancedParticles('celebration');
                break;
            case 'wrong_answer':
                this.speak(response.message, 3000, 'thinking');
                this.animate('thinking');
                this.createAdvancedParticles('thinking');
                break;
            case 'game_complete':
                this.speak(response.message, 4000, response.emotion);
                this.animate('celebrating');
                if (data.score > 80) {
                    this.createAdvancedParticles('celebration');
                }
                break;
            case 'chapter_complete':
                this.speak(response.message, 3500, 'excited');
                this.animate('celebrating');
                this.createAdvancedParticles('celebration');
                break;
            case 'hint_request':
                this.speak(response.message, 3000, 'thinking');
                this.animate('thinking');
                break;
            case 'encouragement':
                this.speak(response.message, 2500, 'success');
                this.animate('excited');
                break;
        }
    }

    // Get personalized responses based on interaction history and personality
    getPersonalizedResponses(eventType, data) {
        const baseResponses = {
            game_start: [
                { message: "🎮 Ready for an amazing challenge? Let's dive in!", emotion: 'excited' },
                { message: "🌟 Time to put your skills to the test! You've got this!", emotion: 'excited' },
                { message: "⚡ Let's see what you can do! I believe in you!", emotion: 'excited' }
            ],
            correct_answer: [
                { message: "🌟 Brilliant work! You're really getting the hang of this!", emotion: 'success' },
                { message: "🏆 Perfect! Your understanding is growing stronger!", emotion: 'success' },
                { message: "✨ Excellent! That's exactly right!", emotion: 'success' },
                { message: "💎 Outstanding! You're becoming a true expert!", emotion: 'success' }
            ],
            wrong_answer: [
                { message: "🤔 Hmm, not quite there yet. Let's think about this differently!", emotion: 'thinking' },
                { message: "💡 Close, but let's try another approach. You're learning!", emotion: 'thinking' },
                { message: "🧠 That's okay! Every mistake is a step toward mastery!", emotion: 'thinking' },
                { message: "🔍 Let's examine this more carefully. You'll get it!", emotion: 'thinking' }
            ],
            game_complete: [
                { message: "🎉 Fantastic job completing this challenge!", emotion: 'success' },
                { message: "🏆 You've mastered this section brilliantly!", emotion: 'success' },
                { message: "⭐ Incredible work! You should be proud!", emotion: 'success' }
            ],
            chapter_complete: [
                { message: "🎊 Chapter conquered! You're on fire!", emotion: 'excited' },
                { message: "🚀 Amazing progress! Ready for the next adventure?", emotion: 'excited' },
                { message: "🌟 You've truly mastered this chapter! Onward!", emotion: 'excited' }
            ],
            hint_request: [
                { message: "💡 Here's a helpful hint to guide your way forward!", emotion: 'thinking' },
                { message: "🔍 Let me share some insight to help you succeed!", emotion: 'thinking' },
                { message: "🧠 Here's a tip that might illuminate the path!", emotion: 'thinking' }
            ],
            encouragement: [
                { message: "💪 You're doing great! Keep up the excellent work!", emotion: 'success' },
                { message: "🌟 Your progress is impressive! Stay focused!", emotion: 'success' },
                { message: "⚡ You've got the skills! Trust yourself!", emotion: 'success' }
            ]
        };

        // Modify responses based on interaction count and performance
        let responses = baseResponses[eventType] || baseResponses.encouragement;
        
        // Add personality-based modifications
        if (this.personalityTraits.enthusiasm > 0.7) {
            responses = responses.map(r => ({
                ...r,
                message: r.message.replace('!', '!!').replace('Great', 'Absolutely amazing')
            }));
        }
        
        if (this.interactionCount > 10 && this.personalityTraits.humor > 0.5) {
            // Add some humor for experienced users
            const humorousAdditions = [
                " You're becoming quite the silicon wizard! 🧙‍♂️",
                " At this rate, you'll be teaching me soon! 😄",
                " Your skills are evolving faster than my animations! 🚀"
            ];
            
            if (Math.random() < 0.3) {
                const randomAddition = humorousAdditions[Math.floor(Math.random() * humorousAdditions.length)];
                responses = responses.map(r => ({
                    ...r,
                    message: r.message + randomAddition
                }));
            }
        }
        
        return responses;
    }

    // Handle direct interaction with Silico
    handleDirectInteraction() {
        const interactionResponses = [
            "👋 Hi there! Need any help with your silicon journey?",
            "😊 Great to see you! How are you finding the challenges?",
            "🤗 Hello! I'm here whenever you need guidance!",
            "✨ Hey! Ready to learn something amazing about silicon?",
            "🎯 Hi! Want a hint for the current challenge?"
        ];
        
        const response = interactionResponses[Math.floor(Math.random() * interactionResponses.length)];
        this.speak(response, 2500, 'excited');
        this.animate('excited');
        this.createAdvancedParticles('sparkle');
    }

    // Idle behavior system for more lifelike character
    startIdleBehaviorSystem() {
        setInterval(() => {
            const timeSinceLastInteraction = Date.now() - this.lastInteractionTime;
            
            // If no interaction for a while, show idle behaviors
            if (timeSinceLastInteraction > 30000 && this.currentAnimation === 'idle') {
                const idleBehaviors = [
                    () => this.performIdleBlink(),
                    () => this.performIdleStretch(),
                    () => this.performIdleLookAround(),
                    () => this.performIdleHum()
                ];
                
                const randomBehavior = idleBehaviors[Math.floor(Math.random() * idleBehaviors.length)];
                randomBehavior();
            }
        }, 10000);
    }

    // Various idle behaviors
    performIdleBlink() {
        this.blink();
        setTimeout(() => this.blink(), 300);
    }

    performIdleStretch() {
        this.character.style.transform = 'scale(1.05) rotate(2deg)';
        setTimeout(() => {
            this.character.style.transform = 'scale(1) rotate(-1deg)';
            setTimeout(() => {
                this.character.style.transform = '';
            }, 500);
        }, 500);
    }

    performIdleLookAround() {
        const eyes = this.character.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.transform = 'translateX(3px)';
            setTimeout(() => {
                eye.style.transform = 'translateX(-3px)';
                setTimeout(() => {
                    eye.style.transform = '';
                }, 800);
            }, 800);
        });
    }

    performIdleHum() {
        const mouth = this.character.querySelector('.silico-mouth');
        mouth.style.animation = 'humming 2s ease-in-out';
        setTimeout(() => {
            mouth.style.animation = '';
        }, 2000);
    }

    // Contextual awareness system
    startContextualAwareness() {
        // Monitor game state and provide contextual reactions
        setInterval(() => {
            this.checkGameContext();
        }, 5000);
    }

    checkGameContext() {
        // Check if user seems stuck (no progress for a while)
        const gameArea = document.getElementById('gameArea');
        if (gameArea && gameArea.style.display !== 'none') {
            const timeSinceLastInteraction = Date.now() - this.lastInteractionTime;
            
            if (timeSinceLastInteraction > 45000) {
                this.offerContextualHelp();
            }
        }
    }

    offerContextualHelp() {
        const helpOffers = [
            "🤔 Need a hint? I'm here to help!",
            "💡 Feeling stuck? Let me give you a tip!",
            "🎯 Want me to explain this challenge?",
            "🔍 Should I break this down for you?"
        ];
        
        const offer = helpOffers[Math.floor(Math.random() * helpOffers.length)];
        this.speak(offer, 3000, 'thinking');
        this.animate('thinking');
    }

    // Enhanced particle effects with more variety and realism
    createAdvancedParticles(type = 'celebration') {
        const particleCount = this.getParticleCount(type);
        const container = this.character.parentElement;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `${type}-particle`;
            
            const particleConfig = this.getParticleConfig(type, i, particleCount);
            
            particle.style.cssText = `
                position: absolute;
                ${particleConfig.style}
                pointer-events: none;
                z-index: 10;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            container.appendChild(particle);
            
            // Apply animation
            particle.animate(particleConfig.animation.keyframes, particleConfig.animation.options).onfinish = () => {
                if (particle.parentElement) {
                    particle.parentElement.removeChild(particle);
                }
            };
        }
    }

    getParticleCount(type) {
        switch (type) {
            case 'celebration': return 15;
            case 'sparkle': return 8;
            case 'thinking': return 5;
            default: return 6;
        }
    }

    getParticleConfig(type, index, total) {
        switch (type) {
            case 'celebration':
                return this.getCelebrationParticleConfig(index, total);
            case 'sparkle':
                return this.getSparkleParticleConfig(index, total);
            case 'thinking':
                return this.getThinkingParticleConfig(index, total);
            default:
                return this.getCelebrationParticleConfig(index, total);
        }
    }

    getCelebrationParticleConfig(index, total) {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const color = colors[index % colors.length];
        const angle = (index / total) * Math.PI * 2;
        const distance = 60 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        return {
            style: `
                width: ${6 + Math.random() * 4}px;
                height: ${6 + Math.random() * 4}px;
                background: ${color};
                border-radius: 50%;
                box-shadow: 0 0 10px ${color};
            `,
            animation: {
                keyframes: [
                    { 
                        transform: `translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg)`, 
                        opacity: 1 
                    },
                    { 
                        transform: `translate(-50%, -50%) translate(${x * 0.6}px, ${y * 0.6}px) scale(1.5) rotate(180deg)`, 
                        opacity: 1,
                        offset: 0.4
                    },
                    { 
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(0.3) rotate(360deg)`, 
                        opacity: 0 
                    }
                ],
                options: {
                    duration: 1500 + Math.random() * 500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }
            }
        };
    }

    getSparkleParticleConfig(index, total) {
        const angle = (index / total) * Math.PI * 2;
        const distance = 25 + Math.random() * 25;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        return {
            style: `
                width: 6px;
                height: 6px;
                background: #FFD700;
                border-radius: 50%;
                box-shadow: 0 0 15px #FFD700;
            `,
            animation: {
                keyframes: [
                    { 
                        transform: `translate(-50%, -50%) scale(0)`, 
                        opacity: 0 
                    },
                    { 
                        transform: `translate(-50%, -50%) scale(2)`, 
                        opacity: 1,
                        offset: 0.2
                    },
                    { 
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(0)`, 
                        opacity: 0 
                    }
                ],
                options: {
                    duration: 1000,
                    easing: 'ease-out'
                }
            }
        };
    }

    getThinkingParticleConfig(index, total) {
        const x = (Math.random() - 0.5) * 60;
        const y = -30 - Math.random() * 40;
        
        return {
            style: `
                width: 4px;
                height: 4px;
                background: #9370DB;
                border-radius: 50%;
                opacity: 0.8;
            `,
            animation: {
                keyframes: [
                    { 
                        transform: `translate(-50%, -50%) translate(0, 0) scale(0)`, 
                        opacity: 0 
                    },
                    { 
                        transform: `translate(-50%, -50%) translate(${x * 0.3}px, ${y * 0.3}px) scale(1.2)`, 
                        opacity: 0.9,
                        offset: 0.3
                    },
                    { 
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(0.5)`, 
                        opacity: 0 
                    }
                ],
                options: {
                    duration: 2500 + Math.random() * 1000,
                    easing: 'ease-out'
                }
            }
        };
    }

    // Method to provide smart, contextual hints
    provideSmartHint(gameType, gameState = {}) {
        const hints = this.getContextualHints(gameType, gameState);
        const hint = hints[Math.floor(Math.random() * hints.length)];
        
        this.speak(hint, 3500, 'thinking');
        this.animate('thinking');
        this.createAdvancedParticles('thinking');
    }

    getContextualHints(gameType, gameState) {
        const hintDatabase = {
            sorting: [
                "💡 Look for the sparkling, translucent crystals - those are quartz!",
                "🔍 Quartz crystals have a distinctive geometric shape and shine!",
                "✨ The clear or purple-tinted stones are what you're looking for!",
                "💎 Quartz feels different from regular rocks - it's harder and more crystalline!"
            ],
            control: [
                "🌡️ Keep the temperature in the green zone for optimal results!",
                "⚖️ Balance is crucial - watch both temperature and pressure!",
                "🎯 The indicators will guide you to the perfect settings!",
                "⚡ Small adjustments work better than big changes!"
            ],
            precision: [
                "🔄 Rotation and pull speed must work in harmony!",
                "⚙️ Try the auto-optimize feature if you're struggling!",
                "📊 Watch the quality meter for real-time feedback!",
                "🎯 The optimal zones are marked - stay within them!",
                "🌡️ Temperature stability is just as important as speed!"
            ],
            slicing: [
                "⏰ Timing is everything - wait for the perfect moment!",
                "🎯 Click when the indicator is in the green zone!",
                "✨ For polishing, move your mouse smoothly back and forth!",
                "🪞 The goal is a mirror-perfect surface!"
            ],
            puzzle: [
                "🧩 Match the pattern shown in the target outline!",
                "🔧 Each piece has a specific place - think logically!",
                "💡 Logic gates have specific functions - AND, OR, NOT!",
                "🎯 Drag and drop pieces to their correct positions!"
            ],
            connection: [
                "🔗 Connect gates to create the desired logic function!",
                "⚡ Test your circuit to see if it produces the right output!",
                "🧠 Think about what each gate does: AND needs both inputs true!",
                "🔧 The truth table shows you what output you need!"
            ],
            programming: [
                "📝 Follow the logical sequence: Load data, process it, store result!",
                "🤖 Each instruction has a specific purpose in the program!",
                "⚡ Try building simple programs first, then combine them!",
                "💻 Think like a computer - step by step execution!"
            ],
            matching: [
                "🎯 Match chips to devices that actually need them!",
                "💻 Smartphones need both processors and memory chips!",
                "🚗 Cars need sensors to detect their environment!",
                "🎮 Gaming devices need powerful graphics chips!",
                "🤖 AI systems need specialized processing chips!"
            ]
        };

        return hintDatabase[gameType] || hintDatabase.sorting;
    }
}

// Enhanced CSS for new Silico features
const enhancedSilicoCSS = `
    @keyframes voicePulse {
        0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.7; }
        50% { transform: translateX(-50%) scaleX(1.5); opacity: 1; }
    }
    
    @keyframes excitedBubble {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes successGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(72, 187, 120, 0.4); }
        50% { box-shadow: 0 0 30px rgba(72, 187, 120, 0.7); }
    }
    
    @keyframes thinkingPulse {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.01); opacity: 1; }
    }
    
    @keyframes humming {
        0%, 100% { transform: scaleY(1); }
        25% { transform: scaleY(1.2); }
        50% { transform: scaleY(0.8); }
        75% { transform: scaleY(1.1); }
    }
    
    .excited-bubble {
        animation: excitedBubble 0.6s ease-in-out infinite;
    }
    
    .success-bubble {
        animation: successGlow 2s ease-in-out infinite;
    }
    
    .thinking-bubble {
        animation: thinkingPulse 3s ease-in-out infinite;
    }
    
    .error-bubble {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
`;

// Add the enhanced CSS to the document
const enhancedSilicoStyle = document.createElement('style');
enhancedSilicoStyle.textContent = enhancedSilicoCSS;
document.head.appendChild(enhancedSilicoStyle);