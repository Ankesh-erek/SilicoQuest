// Enhanced SilicoQuest Main Application with Improved Games and UI
class EnhancedSilicoQuestApp extends SilicoQuestApp {
    constructor() {
        super();
        this.enhancedFeatures = true;
        this.gameAnalytics = {
            totalPlayTime: 0,
            gamesCompleted: 0,
            averageScore: 0,
            strugglingAreas: [],
            strengths: []
        };
        this.adaptiveDifficulty = {
            enabled: true,
            currentLevel: 'normal', // easy, normal, hard
            adjustmentHistory: []
        };
    }

    async init() {
        try {
            // Load chapter data
            await this.loadChapterData();
            
            // Initialize enhanced components
            this.chapterManager = new ChapterManager(this.chapters);
            this.gameLoader = new EnhancedGameLoader(); // Use enhanced version
            this.certificate = new Certificate();
            this.silicoCharacter = new EnhancedSilicoCharacter(); // Use enhanced version
            
            // Setup event listeners
            this.setupEventListeners();
            this.setupEnhancedEventListeners();
            
            // Initialize analytics
            this.initializeAnalytics();
            
            // Show welcome popup
            this.showWelcomePopup();
            
        } catch (error) {
            console.error('Failed to initialize Enhanced SilicoQuest:', error);
            this.showError('Failed to load the application. Please refresh the page.');
        }
    }

    setupEnhancedEventListeners() {
        // Enhanced game completion handling
        document.addEventListener('gameComplete', (event) => {
            this.handleEnhancedGameCompletion(event.detail);
        });

        // Adaptive difficulty adjustment
        document.addEventListener('gameStruggle', (event) => {
            this.adjustDifficulty('easier', event.detail);
        });

        document.addEventListener('gameExcellence', (event) => {
            this.adjustDifficulty('harder', event.detail);
        });

        // Enhanced Silico interactions
        document.addEventListener('silicoInteraction', (event) => {
            this.handleSilicoInteraction(event.detail);
        });

        // Accessibility features
        document.addEventListener('keydown', (event) => {
            this.handleAccessibilityKeys(event);
        });

        // Performance monitoring
        this.startPerformanceMonitoring();
    }

    initializeAnalytics() {
        // Load previous analytics data
        const savedAnalytics = localStorage.getItem('silicoquest_analytics');
        if (savedAnalytics) {
            this.gameAnalytics = { ...this.gameAnalytics, ...JSON.parse(savedAnalytics) };
        }

        // Start session tracking
        this.sessionStartTime = Date.now();
        this.saveAnalyticsPeriodically();
    }

    handleEnhancedGameCompletion(gameData) {
        const { score, timeSpent, attempts, gameType } = gameData;
        
        // Update analytics
        this.gameAnalytics.gamesCompleted++;
        this.gameAnalytics.totalPlayTime += timeSpent;
        this.gameAnalytics.averageScore = 
            (this.gameAnalytics.averageScore * (this.gameAnalytics.gamesCompleted - 1) + score) / 
            this.gameAnalytics.gamesCompleted;

        // Analyze performance
        this.analyzePerformance(gameType, score, attempts, timeSpent);
        
        // Provide personalized feedback
        this.provideFeedback(gameType, score, attempts);
        
        // Adjust difficulty if needed
        this.considerDifficultyAdjustment(score, attempts);
        
        // Save analytics
        this.saveAnalytics();
    }

    analyzePerformance(gameType, score, attempts, timeSpent) {
        // Determine if this is a strength or struggling area
        if (score >= 80 && attempts <= 2) {
            if (!this.gameAnalytics.strengths.includes(gameType)) {
                this.gameAnalytics.strengths.push(gameType);
            }
            // Remove from struggling areas if present
            this.gameAnalytics.strugglingAreas = this.gameAnalytics.strugglingAreas.filter(area => area !== gameType);
        } else if (score < 60 || attempts > 3) {
            if (!this.gameAnalytics.strugglingAreas.includes(gameType)) {
                this.gameAnalytics.strugglingAreas.push(gameType);
            }
        }
    }

    provideFeedback(gameType, score, attempts) {
        let feedbackMessage = '';
        let emotion = 'neutral';

        if (score >= 90) {
            feedbackMessage = "🌟 Absolutely incredible! You're mastering this like a true expert!";
            emotion = 'excited';
        } else if (score >= 80) {
            feedbackMessage = "🏆 Excellent work! Your skills are really developing!";
            emotion = 'success';
        } else if (score >= 70) {
            feedbackMessage = "✅ Good job! You're on the right track!";
            emotion = 'success';
        } else if (score >= 60) {
            feedbackMessage = "👍 Not bad! With a bit more practice, you'll nail this!";
            emotion = 'thinking';
        } else {
            feedbackMessage = "🤔 This one's tricky! Let me give you some extra tips for next time.";
            emotion = 'thinking';
        }

        // Add attempt-based feedback
        if (attempts === 1) {
            feedbackMessage += " And you got it on the first try! 🎯";
        } else if (attempts <= 2) {
            feedbackMessage += " Great persistence! 💪";
        }

        this.silicoCharacter.speak(feedbackMessage, 4000, emotion);
    }

    adjustDifficulty(direction, gameData) {
        if (!this.adaptiveDifficulty.enabled) return;

        const currentLevel = this.adaptiveDifficulty.currentLevel;
        let newLevel = currentLevel;

        if (direction === 'easier' && currentLevel !== 'easy') {
            newLevel = currentLevel === 'hard' ? 'normal' : 'easy';
        } else if (direction === 'harder' && currentLevel !== 'hard') {
            newLevel = currentLevel === 'easy' ? 'normal' : 'hard';
        }

        if (newLevel !== currentLevel) {
            this.adaptiveDifficulty.currentLevel = newLevel;
            this.adaptiveDifficulty.adjustmentHistory.push({
                from: currentLevel,
                to: newLevel,
                reason: direction,
                timestamp: Date.now(),
                gameData
            });

            // Notify user of difficulty adjustment
            const difficultyMessages = {
                easy: "🎯 I've made this a bit easier to help you learn better!",
                normal: "⚖️ Adjusting difficulty to match your skill level!",
                hard: "🚀 You're doing so well, let's increase the challenge!"
            };

            this.silicoCharacter.speak(difficultyMessages[newLevel], 3000, 'thinking');
        }
    }

    considerDifficultyAdjustment(score, attempts) {
        // Auto-adjust difficulty based on performance patterns
        if (score >= 95 && attempts === 1) {
            // Too easy
            this.adjustDifficulty('harder', { score, attempts, reason: 'too_easy' });
        } else if (score < 50 && attempts > 3) {
            // Too hard
            this.adjustDifficulty('easier', { score, attempts, reason: 'too_hard' });
        }
    }

    handleSilicoInteraction(interactionData) {
        const { type, context } = interactionData;
        
        switch (type) {
            case 'hint_request':
                this.provideContextualHint(context);
                break;
            case 'encouragement_request':
                this.provideEncouragement(context);
                break;
            case 'explanation_request':
                this.provideExplanation(context);
                break;
            case 'celebration':
                this.celebrateAchievement(context);
                break;
        }
    }

    provideContextualHint(context) {
        const { gameType, currentStage, userProgress } = context;
        
        // Analyze user's current situation
        const strugglingTime = Date.now() - (context.lastProgressTime || Date.now());
        const isStruggling = strugglingTime > 30000; // 30 seconds without progress
        
        if (isStruggling) {
            // Provide more detailed hint
            this.silicoCharacter.provideSmartHint(gameType, {
                detailed: true,
                userProgress,
                strugglingTime
            });
        } else {
            // Provide gentle nudge
            this.silicoCharacter.provideSmartHint(gameType, {
                gentle: true,
                userProgress
            });
        }
    }

    provideEncouragement(context) {
        const encouragementMessages = [
            "💪 You're doing fantastic! Keep up the great work!",
            "🌟 Every expert was once a beginner. You're learning!",
            "🚀 Your progress is impressive! Trust in your abilities!",
            "✨ Remember, each challenge makes you stronger!",
            "🎯 You've got this! I believe in your potential!"
        ];

        // Personalize based on user's history
        if (this.gameAnalytics.strengths.length > 0) {
            encouragementMessages.push(
                `🏆 You've already mastered ${this.gameAnalytics.strengths.join(' and ')}! This is just another step!`
            );
        }

        const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        this.silicoCharacter.speak(message, 3000, 'success');
        this.silicoCharacter.createAdvancedParticles('celebration');
    }

    provideExplanation(context) {
        const { topic, chapterNumber } = context;
        
        const explanations = {
            1: {
                quartz: "💎 Quartz is silicon dioxide (SiO₂) - it's the raw material we need to extract pure silicon from!",
                sorting: "🔍 We're looking for quartz because it contains the silicon atoms we need for computer chips!"
            },
            2: {
                temperature: "🌡️ High temperature breaks the chemical bonds in quartz, separating silicon from oxygen!",
                purification: "⚗️ This process removes impurities, giving us pure silicon for electronics!"
            },
            3: {
                crystal_growth: "🔬 The Czochralski method grows perfect crystals by carefully controlling temperature and rotation!",
                rotation: "🔄 Rotation ensures even heat distribution and perfect crystal structure!"
            },
            4: {
                slicing: "🪞 We slice the crystal into thin wafers - these become the base for computer chips!",
                polishing: "✨ Mirror-perfect surfaces are essential for the tiny circuits we'll build on them!"
            },
            5: {
                logic_gates: "⚡ Logic gates are the building blocks of digital thinking - they process true/false decisions!",
                photolithography: "💡 We use light to 'print' tiny circuit patterns onto the silicon wafer!"
            },
            6: {
                circuits: "🔗 Connecting gates creates complex logic that can perform calculations!",
                alu: "🧠 The ALU (Arithmetic Logic Unit) is the calculator inside every processor!"
            },
            7: {
                programming: "💻 Programming gives instructions to our silicon brain - telling it what to think!",
                instructions: "📝 Each instruction is a simple command the processor can understand and execute!"
            },
            8: {
                applications: "🌐 Silicon chips now power everything from phones to space rockets!",
                journey: "🎉 You've witnessed the complete transformation from sand to silicon brain!"
            }
        };

        const chapterExplanations = explanations[chapterNumber] || explanations[1];
        const explanation = chapterExplanations[topic] || "🤔 That's a great question! Let me think about the best way to explain this...";
        
        this.silicoCharacter.speak(explanation, 4000, 'thinking');
    }

    celebrateAchievement(context) {
        const { achievementType, data } = context;
        
        switch (achievementType) {
            case 'perfect_score':
                this.silicoCharacter.speak("🏆 PERFECT SCORE! You're absolutely brilliant!", 3000, 'excited');
                this.silicoCharacter.createAdvancedParticles('celebration');
                break;
            case 'first_try':
                this.silicoCharacter.speak("🎯 First try! Your intuition is incredible!", 2500, 'success');
                this.silicoCharacter.createAdvancedParticles('sparkle');
                break;
            case 'improvement':
                this.silicoCharacter.speak("📈 Amazing improvement! You're really learning!", 2500, 'success');
                break;
            case 'persistence':
                this.silicoCharacter.speak("💪 Your persistence paid off! Never give up!", 2500, 'success');
                break;
        }
    }

    handleAccessibilityKeys(event) {
        // Enhanced keyboard navigation and accessibility
        switch (event.key) {
            case 'h':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.provideContextualHint({ gameType: 'current', currentStage: this.currentStage });
                }
                break;
            case 'e':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.provideEncouragement({});
                }
                break;
            case 's':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.skipCurrentGame();
                }
                break;
            case 'r':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.restartCurrentGame();
                }
                break;
        }
    }

    restartCurrentGame() {
        // Restart the current game
        const gameArea = document.getElementById('gameArea');
        if (gameArea && gameArea.style.display !== 'none') {
            // Clear current game
            this.gameLoader.cleanup();
            
            // Reload the game
            const currentChapter = this.chapters[this.currentChapter - 1];
            if (currentChapter && currentChapter.game) {
                this.gameLoader.loadGame(currentChapter.game, (completed, score) => {
                    this.handleGameCompletion(completed, score);
                });
            }
            
            this.silicoCharacter.speak("🔄 Game restarted! Let's try again!", 2000, 'thinking');
        }
    }

    startPerformanceMonitoring() {
        // Monitor app performance and user experience
        setInterval(() => {
            this.checkPerformanceMetrics();
        }, 10000); // Check every 10 seconds
    }

    checkPerformanceMetrics() {
        // Check for performance issues
        const now = performance.now();
        const memoryInfo = performance.memory;
        
        if (memoryInfo && memoryInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
            console.warn('High memory usage detected');
            this.optimizePerformance();
        }
        
        // Check for user inactivity
        const timeSinceLastInteraction = Date.now() - this.silicoCharacter.lastInteractionTime;
        if (timeSinceLastInteraction > 120000) { // 2 minutes
            this.handleUserInactivity();
        }
    }

    optimizePerformance() {
        // Clean up unused resources
        this.cleanupUnusedParticles();
        this.optimizeAnimations();
        
        // Reduce visual effects if needed
        if (this.adaptiveDifficulty.enabled) {
            document.body.classList.add('reduced-effects');
        }
    }

    cleanupUnusedParticles() {
        // Remove any lingering particle elements
        const particles = document.querySelectorAll('[class*="-particle"]');
        particles.forEach(particle => {
            if (particle.parentElement) {
                particle.parentElement.removeChild(particle);
            }
        });
    }

    optimizeAnimations() {
        // Reduce animation complexity for better performance
        const style = document.createElement('style');
        style.textContent = `
            .reduced-effects * {
                animation-duration: 0.5s !important;
                transition-duration: 0.2s !important;
            }
            .reduced-effects .particle {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    handleUserInactivity() {
        // Gentle reminder for inactive users
        const inactivityMessages = [
            "👋 Still there? I'm here whenever you're ready to continue!",
            "😊 Take your time! Learning at your own pace is perfect!",
            "🌟 Ready to continue our silicon adventure?",
            "💭 Need any help or have questions about what we've learned?"
        ];
        
        const message = inactivityMessages[Math.floor(Math.random() * inactivityMessages.length)];
        this.silicoCharacter.speak(message, 3000, 'thinking');
    }

    saveAnalyticsPeriodically() {
        // Save analytics data every 30 seconds
        setInterval(() => {
            this.saveAnalytics();
        }, 30000);
    }

    saveAnalytics() {
        // Save analytics to localStorage
        try {
            localStorage.setItem('silicoquest_analytics', JSON.stringify(this.gameAnalytics));
        } catch (error) {
            console.warn('Could not save analytics:', error);
        }
    }

    // Enhanced chapter loading with adaptive content
    loadChapter(chapterNumber) {
        super.loadChapter(chapterNumber);
        
        // Apply adaptive difficulty to chapter content
        this.applyAdaptiveDifficulty(chapterNumber);
        
        // Provide chapter-specific encouragement
        this.provideChapterIntroduction(chapterNumber);
    }

    applyAdaptiveDifficulty(chapterNumber) {
        const difficultyLevel = this.adaptiveDifficulty.currentLevel;
        
        // Adjust game parameters based on difficulty
        if (this.gameLoader.currentGame) {
            switch (difficultyLevel) {
                case 'easy':
                    this.gameLoader.currentGame.maxScore = 80; // Lower max score requirement
                    this.gameLoader.currentGame.timeLimit = null; // Remove time pressure
                    break;
                case 'normal':
                    this.gameLoader.currentGame.maxScore = 100;
                    this.gameLoader.currentGame.timeLimit = 300; // 5 minutes
                    break;
                case 'hard':
                    this.gameLoader.currentGame.maxScore = 120; // Bonus points available
                    this.gameLoader.currentGame.timeLimit = 180; // 3 minutes
                    break;
            }
        }
    }

    provideChapterIntroduction(chapterNumber) {
        const introductions = {
            1: "🏜️ Welcome to the silicon desert! Let's discover the hidden treasures in ordinary sand!",
            2: "🔥 Time to fire up the furnaces! We'll purify our silicon to perfection!",
            3: "💎 Now for the magic of crystal growth! Watch silicon transform into perfect structures!",
            4: "🪞 Precision is key here! We'll slice and polish our crystal to mirror perfection!",
            5: "⚡ The birth of digital logic! Let's create the building blocks of computer thinking!",
            6: "🔗 Connection time! We'll wire up our gates to create computational power!",
            7: "🧠 The moment of truth! Let's program our silicon brain and watch it think!",
            8: "🌟 The grand finale! See how your silicon creation powers the modern world!"
        };

        const introduction = introductions[chapterNumber] || "🚀 Ready for the next exciting challenge!";
        
        setTimeout(() => {
            this.silicoCharacter.speak(introduction, 3500, 'excited');
        }, 1000);
    }

    // Enhanced error handling with user-friendly messages
    showError(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-notification';
        errorContainer.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button class="error-dismiss">Got it!</button>
            </div>
        `;
        
        errorContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(229, 62, 62, 0.95);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            z-index: 2000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            animation: errorSlideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(errorContainer);
        
        errorContainer.querySelector('.error-dismiss').addEventListener('click', () => {
            errorContainer.style.animation = 'errorSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (errorContainer.parentElement) {
                    errorContainer.parentElement.removeChild(errorContainer);
                }
            }, 300);
        });
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (errorContainer.parentElement) {
                errorContainer.querySelector('.error-dismiss').click();
            }
        }, 5000);
    }
}

// Enhanced CSS for new features
const enhancedAppCSS = `
    @keyframes errorSlideIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes errorSlideOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .error-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
    }
    
    .error-icon {
        font-size: 3rem;
    }
    
    .error-message {
        font-size: 1.1rem;
        font-weight: 500;
        max-width: 400px;
        line-height: 1.4;
    }
    
    .error-dismiss {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .error-dismiss:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
    
    .reduced-effects * {
        animation-duration: 0.3s !important;
        transition-duration: 0.15s !important;
    }
    
    .reduced-effects .particle,
    .reduced-effects [class*="-particle"] {
        display: none !important;
    }
`;

// Add enhanced CSS
const enhancedAppStyle = document.createElement('style');
enhancedAppStyle.textContent = enhancedAppCSS;
document.head.appendChild(enhancedAppStyle);

// Initialize the enhanced application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if enhanced features are supported
    if (typeof EnhancedGameLoader !== 'undefined' && typeof EnhancedSilicoCharacter !== 'undefined') {
        window.silicoQuestApp = new EnhancedSilicoQuestApp();
    } else {
        // Fallback to regular app
        console.warn('Enhanced features not available, using standard version');
        window.silicoQuestApp = new SilicoQuestApp();
    }
});