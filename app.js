// SilicoQuest Main Application
class SilicoQuestApp {
    constructor() {
        this.currentChapter = 1;
        this.currentStage = 0;
        this.chapters = [];
        this.isAudioMuted = false;
        this.currentAudio = null;
        this.gameCompleted = false;
        this.chapterScores = {};
        this.totalScore = 0;
        this.taskCompleted = false;
        
        this.init();
    }

    async init() {
        try {
            // Load chapter data
            await this.loadChapterData();
            
            // Initialize components
            this.chapterManager = new ChapterManager(this.chapters);
            this.gameLoader = new GameLoader();
            this.certificate = new Certificate();
            this.silicoCharacter = new SilicoCharacter();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Show welcome popup
            this.showWelcomePopup();
            
        } catch (error) {
            console.error('Failed to initialize SilicoQuest:', error);
            this.showError('Failed to load the application. Please refresh the page.');
        }
    }

    async loadChapterData() {
        try {
            const response = await fetch('data/chapters.json');
            const data = await response.json();
            this.chapters = data.chapters;
        } catch (error) {
            console.error('Failed to load chapter data:', error);
            // Fallback to basic chapter structure if JSON fails
            this.chapters = this.createFallbackChapters();
        }
    }

    createFallbackChapters() {
        // Fallback chapter data in case JSON loading fails
        return [
            {
                chapterNumber: 1,
                title: "The Sand of Intelligence",
                narration: [
                    {
                        text: "Welcome to SilicoQuest! Let's discover how sand becomes the brain of computers!",
                        visual: "desert_scene",
                        duration: 5000
                    }
                ],
                game: { name: "Quartz Sorter", type: "sorting" }
            }
            // Add more fallback chapters as needed
        ];
    }

    setupEventListeners() {
        // Welcome popup click
        document.getElementById('welcomePopup').addEventListener('click', () => {
            this.startApplication();
        });

        // Navigation buttons
        document.getElementById('nextStageBtn').addEventListener('click', () => {
            this.nextStage();
        });

        document.getElementById('nextChapterBtn').addEventListener('click', () => {
            this.nextChapter();
        });

        document.getElementById('backChapterBtn').addEventListener('click', () => {
            this.previousChapter();
        });

        // Audio control
        document.getElementById('muteBtn').addEventListener('click', () => {
            this.toggleAudio();
        });

        // Certificate modal
        document.getElementById('downloadCertBtn').addEventListener('click', () => {
            this.downloadCertificate();
        });

        document.getElementById('closeCertBtn').addEventListener('click', () => {
            this.closeCertificateModal();
        });

        // Chapter indicators (will be set up after creation)
        this.setupChapterIndicators();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextStage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousChapter();
            }
        });
    }

    setupChapterIndicators() {
        const indicatorsContainer = document.getElementById('chapterIndicators');
        indicatorsContainer.innerHTML = '';

        this.chapters.forEach((chapter, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'chapter-indicator';
            indicator.textContent = `Ch ${chapter.chapterNumber}`;
            indicator.title = chapter.title;
            
            if (index === 0) {
                indicator.classList.add('active');
            }

            indicator.addEventListener('click', () => {
                if (index < this.currentChapter) {
                    this.goToChapter(index + 1);
                }
            });

            indicatorsContainer.appendChild(indicator);
        });
    }

    showWelcomePopup() {
        document.getElementById('welcomePopup').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    startApplication() {
        document.getElementById('welcomePopup').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        // Start with first chapter
        this.loadChapter(1);
        this.updateProgress();
    }

    loadChapter(chapterNumber) {
        const chapter = this.chapters.find(ch => ch.chapterNumber === chapterNumber);
        if (!chapter) {
            console.error(`Chapter ${chapterNumber} not found`);
            return;
        }

        this.currentChapter = chapterNumber;
        this.currentStage = 0;
        this.gameCompleted = false;
        this.taskCompleted = false;

        // Update UI
        document.getElementById('chapterTitle').textContent = chapter.title;
        document.getElementById('chapterNumber').textContent = `Chapter ${chapterNumber}`;

        // Evolve Silico's appearance for this chapter
        this.silicoCharacter.evolveForChapter(chapterNumber);

        // Load first narration stage
        this.loadNarrationStage(chapter.narration[0]);

        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update chapter indicators
        this.updateChapterIndicators();

        // Hide game area initially
        document.getElementById('gameArea').style.display = 'none';
    }

    loadNarrationStage(narrationData) {
        if (!narrationData) return;

        const speechBubble = document.getElementById('speechBubble');
        const narrationText = document.getElementById('narrationText');
        const stageContent = document.getElementById('stageContent');

        // Update text
        narrationText.textContent = narrationData.text;

        // Update visual
        this.loadVisual(narrationData.visual);

        // Play audio if available and not muted
        if (narrationData.voice && !this.isAudioMuted) {
            this.playAudio(narrationData.voice);
        }

        // Animate Silico character
        this.silicoCharacter.animate('talking');

        // Auto-advance after duration or show next button
        if (narrationData.duration) {
            setTimeout(() => {
                this.silicoCharacter.animate('idle');
            }, narrationData.duration);
        }
    }

    loadVisual(visualType) {
        const stageContent = document.getElementById('stageContent');
        
        // Clear previous content
        stageContent.innerHTML = '';

        // Create visual based on type
        switch (visualType) {
            case 'desert_scene':
                this.createDesertScene(stageContent);
                break;
            case 'quartz_crystal':
                this.createQuartzCrystal(stageContent);
                break;
            case 'rock_collection':
                this.createRockCollection(stageContent);
                break;
            case 'furnace_exterior':
                this.createFurnaceExterior(stageContent);
                break;
            case 'furnace_interior':
                this.createFurnaceInterior(stageContent);
                break;
            case 'control_panel':
                this.createControlPanel(stageContent);
                break;
            default:
                this.createDefaultVisual(stageContent, visualType);
        }
    }

    createDesertScene(container) {
        const scene = document.createElement('div');
        scene.innerHTML = `
            <div style="width: 100%; height: 200px; background: linear-gradient(to bottom, #87CEEB 0%, #F4A460 70%); border-radius: 10px; position: relative; overflow: hidden;">
                <div style="position: absolute; bottom: 0; width: 100%; height: 30%; background: #F4A460;"></div>
                <div style="position: absolute; bottom: 10%; left: 20%; width: 60px; height: 60px; background: #DEB887; border-radius: 50%; animation: bounce 2s infinite;"></div>
                <div style="position: absolute; top: 20%; right: 30%; width: 40px; height: 40px; background: #FFD700; border-radius: 50%; box-shadow: 0 0 20px #FFD700;"></div>
                <div style="position: absolute; bottom: 20%; right: 20%; font-size: 2rem;">🏜️</div>
            </div>
        `;
        container.appendChild(scene);
    }

    createQuartzCrystal(container) {
        const crystal = document.createElement('div');
        crystal.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                <div style="width: 80px; height: 120px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: sparkle 2s infinite; box-shadow: 0 0 30px rgba(221, 160, 221, 0.5);"></div>
                <div style="font-size: 3rem; margin-left: 20px;">💎</div>
            </div>
        `;
        container.appendChild(crystal);
    }

    createRockCollection(container) {
        const rocks = document.createElement('div');
        rocks.innerHTML = `
            <div style="display: flex; justify-content: space-around; align-items: center; height: 200px; flex-wrap: wrap;">
                <div style="width: 50px; height: 50px; background: #8B4513; border-radius: 50%; margin: 10px;">🪨</div>
                <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); margin: 10px; animation: glow 2s infinite;">💎</div>
                <div style="width: 45px; height: 45px; background: #696969; border-radius: 50%; margin: 10px;">🪨</div>
                <div style="width: 55px; height: 55px; background: #A0522D; border-radius: 50%; margin: 10px;">🪨</div>
                <div style="width: 50px; height: 50px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); margin: 10px; animation: glow 2s infinite;">💎</div>
            </div>
        `;
        container.appendChild(rocks);
    }

    createFurnaceExterior(container) {
        const furnace = document.createElement('div');
        furnace.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                <div style="width: 150px; height: 180px; background: linear-gradient(to bottom, #708090, #2F4F4F); border-radius: 10px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 100px; height: 20px; background: #FF4500; border-radius: 10px; animation: flicker 1s infinite;"></div>
                    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 80px; height: 60px; background: #FF6347; border-radius: 50%; animation: heat 2s infinite;"></div>
                    <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 2rem;">🏭</div>
                </div>
            </div>
        `;
        container.appendChild(furnace);
    }

    createFurnaceInterior(container) {
        const interior = document.createElement('div');
        interior.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: radial-gradient(circle, #FF4500, #8B0000); border-radius: 15px;">
                <div style="width: 100px; height: 100px; background: radial-gradient(circle, #FFD700, #FF4500); border-radius: 50%; animation: melt 2s infinite; box-shadow: 0 0 50px #FF4500;">
                    <div style="position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem;">🔥</div>
                </div>
            </div>
        `;
        container.appendChild(interior);
    }

    createControlPanel(container) {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative; padding: 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-around; align-items: center; height: 100%;">
                    <!-- Temperature Gauge -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 60px; height: 80px; background: #1a202c; border-radius: 10px; position: relative; border: 2px solid #4a5568;">
                            <div style="position: absolute; bottom: 5px; left: 5px; right: 5px; height: 60%; background: linear-gradient(to top, #e53e3e, #ff6b6b); border-radius: 5px; animation: tempGauge 3s infinite;"></div>
                        </div>
                        <span style="color: #e2e8f0; font-size: 0.8rem; margin-top: 5px;">TEMP</span>
                    </div>
                    
                    <!-- Pressure Gauge -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 60px; height: 60px; border: 3px solid #4a5568; border-radius: 50%; position: relative; background: #1a202c;">
                            <div style="position: absolute; top: 50%; left: 50%; width: 2px; height: 20px; background: #48bb78; transform-origin: bottom; transform: translate(-50%, -100%) rotate(45deg); animation: pressureNeedle 2s infinite;"></div>
                        </div>
                        <span style="color: #e2e8f0; font-size: 0.8rem; margin-top: 5px;">PRESSURE</span>
                    </div>
                    
                    <!-- Control Buttons -->
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="width: 40px; height: 40px; background: #48bb78; border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: controlBlink 1.5s infinite; box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);">
                            <span style="color: white; font-weight: bold; font-size: 0.8rem;">ON</span>
                        </div>
                        <div style="width: 40px; height: 40px; background: #e53e3e; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0.3;">
                            <span style="color: white; font-weight: bold; font-size: 0.7rem;">OFF</span>
                        </div>
                    </div>
                    
                    <!-- Status Display -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 80px; height: 40px; background: #1a202c; border: 1px solid #4a5568; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-family: monospace;">
                            <span style="color: #48bb78; font-size: 0.9rem; animation: statusBlink 2s infinite;">ACTIVE</span>
                        </div>
                        <span style="color: #e2e8f0; font-size: 0.8rem; margin-top: 5px;">STATUS</span>
                    </div>
                </div>
                
                <!-- Warning Lights -->
                <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                    <div style="width: 8px; height: 8px; background: #48bb78; border-radius: 50%; animation: warningLight1 1s infinite;"></div>
                    <div style="width: 8px; height: 8px; background: #ed8936; border-radius: 50%; animation: warningLight2 1.5s infinite;"></div>
                    <div style="width: 8px; height: 8px; background: #e53e3e; border-radius: 50%; animation: warningLight3 2s infinite;"></div>
                </div>
            </div>
        `;
        container.appendChild(panel);
    }

    createDefaultVisual(container, visualType) {
        const defaultDiv = document.createElement('div');
        defaultDiv.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); border-radius: 15px; font-size: 1.2rem; color: #666;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🔬</div>
                    <div>Visual: ${visualType}</div>
                </div>
            </div>
        `;
        container.appendChild(defaultDiv);
    }

    nextStage() {
        const currentChapterData = this.chapters.find(ch => ch.chapterNumber === this.currentChapter);
        if (!currentChapterData) return;

        if (this.currentStage < currentChapterData.narration.length - 1) {
            // Move to next narration stage
            this.currentStage++;
            this.loadNarrationStage(currentChapterData.narration[this.currentStage]);
        } else if (!this.gameCompleted && currentChapterData.game) {
            // Load the game
            this.loadGame(currentChapterData.game);
        } else if (!this.taskCompleted) {
            // Show popup to complete the task first
            this.showTaskIncompletePopup();
            return;
        } else {
            // Move to next chapter or show completion
            if (this.currentChapter < this.chapters.length) {
                this.nextChapter();
            } else {
                this.showCompletion();
            }
        }

        this.updateNavigationButtons();
    }

    nextChapter() {
        if (!this.taskCompleted) {
            this.showTaskIncompletePopup();
            return;
        }
        
        if (this.currentChapter < this.chapters.length) {
            // Mark current chapter as completed
            this.markChapterCompleted(this.currentChapter);
            this.loadChapter(this.currentChapter + 1);
            this.updateProgress();
        } else {
            this.showCompletion();
        }
    }

    markChapterCompleted(chapterNumber) {
        const indicators = document.querySelectorAll('.chapter-indicator');
        if (indicators[chapterNumber - 1]) {
            indicators[chapterNumber - 1].classList.add('completed');
        }
    }

    previousChapter() {
        if (this.currentChapter > 1) {
            this.loadChapter(this.currentChapter - 1);
            this.updateProgress();
        }
    }

    goToChapter(chapterNumber) {
        if (chapterNumber >= 1 && chapterNumber <= this.chapters.length) {
            this.loadChapter(chapterNumber);
            this.updateProgress();
        }
    }

    loadGame(gameData) {
        document.getElementById('gameArea').style.display = 'block';
        
        // Load the specific game
        this.gameLoader.loadGame(gameData, (completed, score) => {
            if (completed) {
                this.gameCompleted = true;
                this.taskCompleted = true;
                
                // Store chapter score
                this.chapterScores[this.currentChapter] = score || 0;
                this.totalScore += score || 0;
                
                this.updateNavigationButtons();
                
                // Show completion message with score
                this.showGameCompletionMessage(score);
            }
        });
    }

    showGameCompletionMessage(score) {
        const narrationText = document.getElementById('narrationText');
        if (!this.taskCompleted) { // Only show message once
            narrationText.textContent = `Excellent work! You scored ${score || 0} points! Ready for the next challenge?`;
            this.silicoCharacter.animate('celebrating');
        }
    }

    showTaskIncompletePopup() {
        const popup = document.createElement('div');
        popup.className = 'task-incomplete-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>⚠️ Task Not Complete!</h3>
                <p>You need to complete the current task before moving to the next chapter.</p>
                <p>Please finish the game or activity first!</p>
                <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
            </div>
        `;
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1500;
        `;
        popup.querySelector('.popup-content').style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        popup.querySelector('button').style.cssText = `
            background: #e53e3e;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        `;
        
        document.body.appendChild(popup);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 5000);
    }

    updateNavigationButtons() {
        const nextStageBtn = document.getElementById('nextStageBtn');
        const nextChapterBtn = document.getElementById('nextChapterBtn');
        const backChapterBtn = document.getElementById('backChapterBtn');

        const currentChapterData = this.chapters.find(ch => ch.chapterNumber === this.currentChapter);
        
        // Show/hide back button
        backChapterBtn.style.display = this.currentChapter > 1 ? 'block' : 'none';

        // Determine which next button to show
        if (this.currentStage < currentChapterData.narration.length - 1) {
            nextStageBtn.style.display = 'block';
            nextStageBtn.textContent = 'Next Stage →';
            nextChapterBtn.style.display = 'none';
        } else if (!this.gameCompleted && currentChapterData.game) {
            nextStageBtn.style.display = 'block';
            nextStageBtn.textContent = 'Start Game →';
            nextChapterBtn.style.display = 'none';
        } else if (this.currentChapter < this.chapters.length) {
            nextStageBtn.style.display = 'none';
            nextChapterBtn.style.display = 'block';
        } else {
            nextStageBtn.style.display = 'block';
            nextStageBtn.textContent = 'Complete Quest →';
            nextChapterBtn.style.display = 'none';
        }
    }

    updateChapterIndicators() {
        const indicators = document.querySelectorAll('.chapter-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            
            if (index + 1 === this.currentChapter) {
                indicator.classList.add('active');
            } else if (index + 1 < this.currentChapter) {
                indicator.classList.add('completed');
            }
        });
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progress = (this.currentChapter / this.chapters.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    showCompletion() {
        // Show certificate modal
        document.getElementById('certificateModal').style.display = 'flex';
        
        // Set completion date and score
        const now = new Date();
        document.getElementById('completionDate').textContent = now.toLocaleDateString();
        
        // Update certificate with total score
        const certificateBody = document.querySelector('.certificate-body');
        if (certificateBody) {
            const scoreInfo = document.createElement('div');
            scoreInfo.innerHTML = `
                <div style="background: rgba(72, 187, 120, 0.1); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                    <h4 style="color: #2d3748; margin-bottom: 0.5rem;">🏆 Achievement Score</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #48bb78; margin: 0;">${this.totalScore} / ${this.chapters.length * 100}</p>
                    <p style="font-size: 0.9rem; color: #718096; margin: 0.5rem 0 0 0;">Total points earned across all chapters</p>
                </div>
            `;
            certificateBody.appendChild(scoreInfo);
        }
        
        // Focus on name input
        document.getElementById('nameInput').focus();
    }

    downloadCertificate() {
        const name = document.getElementById('nameInput').value.trim();
        if (!name) {
            alert('Please enter your name to generate the certificate.');
            return;
        }

        document.getElementById('studentName').textContent = name;
        this.certificate.generateCertificate();
    }

    closeCertificateModal() {
        document.getElementById('certificateModal').style.display = 'none';
    }

    playAudio(audioSrc) {
        if (this.isAudioMuted) return;
        
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }

        // Check if audio file exists, if not use text-to-speech
        this.currentAudio = new Audio(audioSrc);
        
        this.currentAudio.addEventListener('error', () => {
            console.log('Audio file not found, using text-to-speech fallback');
            this.speakText(document.getElementById('narrationText').textContent);
        });
        
        this.currentAudio.play().catch(error => {
            console.log('Audio playback failed, using text-to-speech fallback:', error);
            this.speakText(document.getElementById('narrationText').textContent);
        });
    }

    speakText(text) {
        if (this.isAudioMuted || !('speechSynthesis' in window)) return;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to use a child-friendly voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        speechSynthesis.speak(utterance);
    }

    toggleAudio() {
        this.isAudioMuted = !this.isAudioMuted;
        const muteBtn = document.getElementById('muteBtn');
        muteBtn.textContent = this.isAudioMuted ? '🔇' : '🔊';

        if (this.isAudioMuted) {
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e53e3e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 2000;
            font-weight: 600;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 5000);
    }
}

// Add CSS animations for visuals
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(180deg); }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(221, 160, 221, 0.5); }
        50% { box-shadow: 0 0 40px rgba(221, 160, 221, 0.8); }
    }
    
    @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes heat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes melt {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(180deg); }
    }
    
    @keyframes tempGauge {
        0% { height: 40%; background: linear-gradient(to top, #4299e1, #63b3ed); }
        50% { height: 80%; background: linear-gradient(to top, #e53e3e, #ff6b6b); }
        100% { height: 40%; background: linear-gradient(to top, #4299e1, #63b3ed); }
    }
    
    @keyframes pressureNeedle {
        0% { transform: translate(-50%, -100%) rotate(-45deg); }
        50% { transform: translate(-50%, -100%) rotate(45deg); }
        100% { transform: translate(-50%, -100%) rotate(90deg); }
    }
    
    @keyframes controlBlink {
        0%, 100% { opacity: 1; box-shadow: 0 0 15px rgba(72, 187, 120, 0.5); }
        50% { opacity: 0.7; box-shadow: 0 0 25px rgba(72, 187, 120, 0.8); }
    }
    
    @keyframes statusBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    @keyframes warningLight1 {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    
    @keyframes warningLight2 {
        0%, 100% { opacity: 0.3; }
        33% { opacity: 1; }
        66% { opacity: 0.3; }
    }
    
    @keyframes warningLight3 {
        0%, 100% { opacity: 0.3; }
        25% { opacity: 1; }
        75% { opacity: 0.3; }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.silicoQuest = new SilicoQuestApp();
});