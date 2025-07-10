// Comprehensive SilicoQuest Fixes
// This file contains all the fixes needed to make the webpage work properly

// Global variables to track application state
window.silicoQuest = null;
window.gameCompleted = false;
window.taskCompleted = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing SilicoQuest fixes...');
    initializeComprehensiveFixes();
});

function initializeComprehensiveFixes() {
    // Apply all fixes in sequence
    fixApplicationInitialization();
    fixNavigationButtons();
    fixWelcomePopup();
    fixCertificateModal();
    fixMissingVisualFunctions();
    fixGameCompletion();
    fixResponsiveLayout();
    addMissingAnimations();
    
    console.log('All SilicoQuest fixes applied successfully!');
}

// Fix 1: Application Initialization
function fixApplicationInitialization() {
    // Ensure the main app class is properly initialized
    if (typeof SilicoQuestApp !== 'undefined') {
        // Wait for all components to load
        setTimeout(() => {
            if (!window.silicoQuest) {
                window.silicoQuest = new SilicoQuestApp();
                console.log('SilicoQuest app initialized');
            }
        }, 500);
    } else {
        // Create a fallback app if the main class is missing
        createFallbackApp();
    }
}

// Fix 2: Navigation Button Fixes
function fixNavigationButtons() {
    // Ensure navigation buttons work properly
    const nextStageBtn = document.getElementById('nextStageBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');
    const backChapterBtn = document.getElementById('backChapterBtn');

    if (nextStageBtn) {
        nextStageBtn.addEventListener('click', function() {
            if (window.silicoQuest) {
                window.silicoQuest.nextStage();
            } else {
                handleFallbackNavigation('next');
            }
        });
    }

    if (nextChapterBtn) {
        nextChapterBtn.addEventListener('click', function() {
            if (window.silicoQuest) {
                window.silicoQuest.nextChapter();
            } else {
                handleFallbackNavigation('nextChapter');
            }
        });
    }

    if (backChapterBtn) {
        backChapterBtn.addEventListener('click', function() {
            if (window.silicoQuest) {
                window.silicoQuest.previousChapter();
            } else {
                handleFallbackNavigation('back');
            }
        });
    }
}

// Fix 3: Welcome Popup Fix
function fixWelcomePopup() {
    const welcomePopup = document.getElementById('welcomePopup');
    const appContainer = document.getElementById('app');

    if (welcomePopup && appContainer) {
        welcomePopup.addEventListener('click', function() {
            welcomePopup.style.display = 'none';
            appContainer.style.display = 'block';
            
            // Start the application
            if (window.silicoQuest) {
                window.silicoQuest.startApplication();
            } else {
                startFallbackApplication();
            }
        });
    }
}

// Fix 4: Certificate Modal Fixes
function fixCertificateModal() {
    const downloadCertBtn = document.getElementById('downloadCertBtn');
    const closeCertBtn = document.getElementById('closeCertBtn');
    const nameInput = document.getElementById('nameInput');
    const certificateModal = document.getElementById('certificateModal');

    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', function() {
            const name = nameInput ? nameInput.value.trim() : '';
            if (!name) {
                alert('Please enter your name to generate the certificate.');
                if (nameInput) nameInput.focus();
                return;
            }
            generateFallbackCertificate(name);
        });
    }

    if (closeCertBtn && certificateModal) {
        closeCertBtn.addEventListener('click', function() {
            certificateModal.style.display = 'none';
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (downloadCertBtn) {
                downloadCertBtn.disabled = this.value.trim().length === 0;
            }
        });
    }
}

// Fix 5: Missing Visual Functions
function fixMissingVisualFunctions() {
    // Add missing visual creation functions to the global scope
    window.createDesertScene = function(container) {
        const scene = document.createElement('div');
        scene.innerHTML = `
            <div style="width: 100%; height: 200px; background: linear-gradient(to bottom, #87CEEB 0%, #F4A460 70%); border-radius: 15px; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <!-- Sky -->
                <div style="position: absolute; top: 0; width: 100%; height: 70%; background: linear-gradient(to bottom, #87CEEB, #F0E68C);"></div>
                
                <!-- Sun -->
                <div style="position: absolute; top: 15%; right: 20%; width: 50px; height: 50px; background: radial-gradient(circle, #FFD700, #FFA500); border-radius: 50%; box-shadow: 0 0 30px #FFD700; animation: sunGlow 3s infinite;"></div>
                
                <!-- Desert dunes -->
                <div style="position: absolute; bottom: 0; width: 100%; height: 40%; background: #F4A460;"></div>
                <div style="position: absolute; bottom: 15%; left: 0; width: 40%; height: 25%; background: #DEB887; border-radius: 50% 50% 0 0; transform: scaleX(2);"></div>
                <div style="position: absolute; bottom: 10%; right: 0; width: 50%; height: 30%; background: #D2B48C; border-radius: 50% 50% 0 0; transform: scaleX(1.8);"></div>
                
                <!-- Quartz crystals -->
                <div style="position: absolute; bottom: 15%; left: 25%; width: 20px; height: 20px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalSparkle 2s infinite;"></div>
                <div style="position: absolute; bottom: 12%; right: 35%; width: 15px; height: 15px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalSparkle 2s infinite 0.5s;"></div>
                
                <!-- Desert text -->
                <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: #8B4513; font-weight: bold; font-size: 1rem; text-shadow: 1px 1px 2px rgba(255,255,255,0.5); background: rgba(255,255,255,0.8); padding: 5px 10px; border-radius: 10px;">🏜️ Silicon Desert - Source of All Computer Chips</div>
            </div>
        `;
        container.appendChild(scene);
    };

    window.createQuartzCrystal = function(container) {
        const crystal = document.createElement('div');
        crystal.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: radial-gradient(circle, rgba(230, 230, 250, 0.1), transparent); border-radius: 15px; position: relative;">
                <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                    <!-- Central crystal -->
                    <div style="width: 80px; height: 120px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); clip-path: polygon(50% 0%, 20% 30%, 0% 100%, 100% 100%, 80% 30%); animation: crystalPulse 3s infinite; box-shadow: 0 0 40px rgba(147, 112, 219, 0.6); position: relative; z-index: 2;">
                        <div style="position: absolute; top: 20%; left: 20%; width: 60%; height: 40%; background: rgba(255,255,255,0.4); clip-path: polygon(0% 0%, 100% 20%, 80% 100%, 0% 80%); animation: facetShimmer 2s infinite;"></div>
                    </div>
                    
                    <!-- Smaller crystals around -->
                    <div style="position: absolute; left: -30px; top: 20px; width: 25px; height: 40px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalPulse 3s infinite 0.5s; opacity: 0.8;"></div>
                    <div style="position: absolute; right: -25px; top: 30px; width: 20px; height: 35px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalPulse 3s infinite 1s; opacity: 0.7;"></div>
                </div>
                
                <!-- Information label -->
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 8px 12px; border-radius: 15px; font-size: 0.9rem; text-align: center;">
                    <div>💎 Pure Quartz Crystal</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">SiO₂ - Silicon Dioxide</div>
                </div>
            </div>
        `;
        container.appendChild(crystal);
    };

    // Add more visual functions as needed
    window.createRockCollection = function(container) {
        const rocks = document.createElement('div');
        rocks.innerHTML = `
            <div style="display: flex; justify-content: space-around; align-items: center; height: 200px; flex-wrap: wrap; background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(160, 82, 45, 0.1)); border-radius: 15px; padding: 20px; position: relative;">
                <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 8px 12px; border-radius: 10px; font-size: 0.9rem; text-align: center;">
                    🔍 Find the Quartz Crystals!
                </div>
                
                <!-- Regular rocks -->
                <div style="width: 50px; height: 50px; background: radial-gradient(circle at 30% 30%, #A0522D, #8B4513); border-radius: 60% 40% 40% 60%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: rockFloat 4s infinite; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🪨</div>
                
                <!-- Quartz crystal 1 -->
                <div style="width: 45px; height: 60px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); clip-path: polygon(50% 0%, 20% 30%, 0% 100%, 100% 100%, 80% 30%); animation: quartzGlow 2s infinite; box-shadow: 0 0 20px rgba(147, 112, 219, 0.6); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">💎</div>
                
                <!-- More rocks -->
                <div style="width: 48px; height: 48px; background: radial-gradient(circle at 40% 20%, #696969, #2F4F4F); border-radius: 50% 60% 40% 50%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: rockFloat 4s infinite 1s; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">🪨</div>
                
                <!-- Quartz crystal 2 -->
                <div style="width: 40px; height: 55px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); clip-path: polygon(50% 0%, 15% 35%, 0% 100%, 100% 100%, 85% 35%); animation: quartzGlow 2s infinite 0.5s; box-shadow: 0 0 20px rgba(147, 112, 219, 0.6); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">💎</div>
                
                <div style="width: 52px; height: 46px; background: radial-gradient(circle at 25% 35%, #CD853F, #A0522D); border-radius: 40% 60% 50% 40%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: rockFloat 4s infinite 2s; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">🪨</div>
            </div>
        `;
        container.appendChild(rocks);
    };
}

// Fix 6: Game Completion Handling
function fixGameCompletion() {
    // Add global game completion handler
    window.completeCurrentGame = function(score = 0) {
        window.gameCompleted = true;
        window.taskCompleted = true;
        
        // Update navigation buttons
        const nextStageBtn = document.getElementById('nextStageBtn');
        const nextChapterBtn = document.getElementById('nextChapterBtn');
        
        if (nextStageBtn) {
            nextStageBtn.style.display = 'none';
        }
        if (nextChapterBtn) {
            nextChapterBtn.style.display = 'inline-block';
        }
        
        // Update narration
        const narrationText = document.getElementById('narrationText');
        if (narrationText) {
            narrationText.textContent = `Great job! You completed this chapter with a score of ${score} points. Ready for the next challenge?`;
        }
        
        // Hide game area
        const gameArea = document.getElementById('gameArea');
        if (gameArea) {
            gameArea.style.display = 'none';
        }
        
        showFeedback('🎉 Chapter completed! Well done!', 'success');
    };
}

// Fix 7: Responsive Layout Fixes
function fixResponsiveLayout() {
    const style = document.createElement('style');
    style.id = 'responsive-fixes';
    style.textContent = `
        /* Enhanced responsive fixes */
        .silico-narrator {
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
            margin-bottom: 1rem;
            flex-shrink: 0;
            width: 100%;
            padding: 0 1rem;
        }
        
        .silico-narrator .speech-bubble {
            flex: 1;
            max-width: calc(100% - 140px);
            font-size: 1.1rem;
            line-height: 1.6;
            padding: 1.2rem;
            background: var(--glass-bg);
            backdrop-filter: blur(15px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            box-shadow: var(--shadow-light);
            color: white;
            font-weight: 500;
        }
        
        .visual-stage {
            min-height: 250px;
            max-height: 400px;
            margin-bottom: 1rem;
        }
        
        .navigation-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .silico-narrator {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
                align-items: center;
            }
            
            .silico-narrator .speech-bubble {
                max-width: 100%;
            }
            
            .navigation-controls {
                flex-direction: column;
                gap: 0.8rem;
            }
            
            .visual-stage {
                min-height: 200px;
                max-height: 300px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Fix 8: Missing Animations
function addMissingAnimations() {
    const style = document.createElement('style');
    style.id = 'missing-animations';
    style.textContent = `
        @keyframes sunGlow {
            0%, 100% { box-shadow: 0 0 30px #FFD700; }
            50% { box-shadow: 0 0 50px #FFD700, 0 0 70px #FFA500; }
        }
        
        @keyframes crystalSparkle {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 15px rgba(221, 160, 221, 0.8); }
        }
        
        @keyframes crystalPulse {
            0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 0 40px rgba(147, 112, 219, 0.6); 
            }
            50% { 
                transform: scale(1.05); 
                box-shadow: 0 0 60px rgba(147, 112, 219, 0.9), 0 0 80px rgba(221, 160, 221, 0.5); 
            }
        }
        
        @keyframes facetShimmer {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
        }
        
        @keyframes rockFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
        }
        
        @keyframes quartzGlow {
            0%, 100% { 
                box-shadow: 0 0 20px rgba(147, 112, 219, 0.6);
                transform: scale(1);
            }
            50% { 
                box-shadow: 0 0 30px rgba(147, 112, 219, 0.9), 0 0 40px rgba(221, 160, 221, 0.5);
                transform: scale(1.05);
            }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: scale(0.8); }
            15% { opacity: 1; transform: scale(1.1); }
            85% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.8); }
        }
    `;
    document.head.appendChild(style);
}

// Fallback Functions for when main app fails to load

function createFallbackApp() {
    console.log('Creating fallback app...');
    
    window.silicoQuest = {
        currentChapter: 1,
        currentStage: 0,
        gameCompleted: false,
        taskCompleted: false,
        
        startApplication: function() {
            this.loadChapter(1);
        },
        
        loadChapter: function(chapterNumber) {
            this.currentChapter = chapterNumber;
            this.currentStage = 0;
            this.gameCompleted = false;
            this.taskCompleted = false;
            
            // Update UI
            const chapterTitle = document.getElementById('chapterTitle');
            const chapterNumberEl = document.getElementById('chapterNumber');
            
            if (chapterTitle) chapterTitle.textContent = `Chapter ${chapterNumber}: Learning About Silicon`;
            if (chapterNumberEl) chapterNumberEl.textContent = `Chapter ${chapterNumber}`;
            
            this.loadNarrationStage();
            this.updateNavigationButtons();
        },
        
        loadNarrationStage: function() {
            const narrationText = document.getElementById('narrationText');
            const stageContent = document.getElementById('stageContent');
            
            if (narrationText) {
                const messages = [
                    "Welcome to SilicoQuest! Let's discover how sand becomes computer chips!",
                    "This is an amazing journey from desert sand to digital brains!",
                    "Click 'Next Stage' to continue learning about silicon!"
                ];
                narrationText.textContent = messages[this.currentStage] || messages[0];
            }
            
            if (stageContent) {
                this.loadVisual();
            }
        },
        
        loadVisual: function() {
            const stageContent = document.getElementById('stageContent');
            if (!stageContent) return;
            
            stageContent.innerHTML = '';
            
            if (this.currentChapter === 1) {
                if (typeof window.createDesertScene === 'function') {
                    window.createDesertScene(stageContent);
                } else {
                    this.createSimpleVisual(stageContent, '🏜️ Desert Scene');
                }
            } else {
                this.createSimpleVisual(stageContent, `📚 Chapter ${this.currentChapter} Content`);
            }
        },
        
        createSimpleVisual: function(container, text) {
            const visual = document.createElement('div');
            visual.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            `;
            visual.textContent = text;
            container.appendChild(visual);
        },
        
        nextStage: function() {
            if (this.currentStage < 2) {
                this.currentStage++;
                this.loadNarrationStage();
            } else {
                this.startGame();
            }
            this.updateNavigationButtons();
        },
        
        nextChapter: function() {
            if (!this.taskCompleted) {
                showTaskIncompletePopup();
                return;
            }
            
            if (this.currentChapter < 8) {
                this.loadChapter(this.currentChapter + 1);
            } else {
                this.showCertificateModal();
            }
        },
        
        previousChapter: function() {
            if (this.currentChapter > 1) {
                this.loadChapter(this.currentChapter - 1);
            }
        },
        
        startGame: function() {
            const gameArea = document.getElementById('gameArea');
            const gameContainer = document.getElementById('gameContainer');
            
            if (gameArea && gameContainer) {
                gameArea.style.display = 'block';
                gameContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: white;">
                        <h3>🎮 Interactive Game</h3>
                        <p>This is a simplified version of the game for Chapter ${this.currentChapter}</p>
                        <div style="margin: 2rem 0; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 15px;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🧠</div>
                            <p>Learning about silicon and computer chips!</p>
                        </div>
                        <button id="completeGameBtn" style="background: #48bb78; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; font-size: 1.1rem; cursor: pointer;">Complete Chapter</button>
                    </div>
                `;
                
                document.getElementById('completeGameBtn').addEventListener('click', () => {
                    this.completeGame();
                });
            }
        },
        
        completeGame: function() {
            this.gameCompleted = true;
            this.taskCompleted = true;
            
            const gameArea = document.getElementById('gameArea');
            if (gameArea) {
                gameArea.style.display = 'none';
            }
            
            const narrationText = document.getElementById('narrationText');
            if (narrationText) {
                narrationText.textContent = `Excellent work! You've completed Chapter ${this.currentChapter}. Ready for the next challenge?`;
            }
            
            this.updateNavigationButtons();
            showFeedback('🎉 Chapter completed successfully!', 'success');
        },
        
        updateNavigationButtons: function() {
            const nextStageBtn = document.getElementById('nextStageBtn');
            const nextChapterBtn = document.getElementById('nextChapterBtn');
            const backChapterBtn = document.getElementById('backChapterBtn');
            
            if (nextStageBtn) {
                nextStageBtn.style.display = (this.currentStage < 2 && !this.gameCompleted) ? 'inline-block' : 'none';
            }
            
            if (nextChapterBtn) {
                nextChapterBtn.style.display = this.taskCompleted ? 'inline-block' : 'none';
            }
            
            if (backChapterBtn) {
                backChapterBtn.style.display = this.currentChapter > 1 ? 'inline-block' : 'none';
            }
        },
        
        showCertificateModal: function() {
            const modal = document.getElementById('certificateModal');
            const completionDate = document.getElementById('completionDate');
            
            if (completionDate) {
                completionDate.textContent = new Date().toLocaleDateString();
            }
            
            if (modal) {
                modal.style.display = 'flex';
            }
        }
    };
}

function handleFallbackNavigation(action) {
    console.log('Handling fallback navigation:', action);
    
    switch (action) {
        case 'next':
            if (window.silicoQuest) {
                window.silicoQuest.nextStage();
            }
            break;
        case 'nextChapter':
            if (window.silicoQuest) {
                window.silicoQuest.nextChapter();
            }
            break;
        case 'back':
            if (window.silicoQuest) {
                window.silicoQuest.previousChapter();
            }
            break;
    }
}

function startFallbackApplication() {
    console.log('Starting fallback application...');
    
    if (!window.silicoQuest) {
        createFallbackApp();
    }
    
    window.silicoQuest.startApplication();
}

function showTaskIncompletePopup() {
    const popup = document.createElement('div');
    popup.className = 'task-incomplete-popup';
    popup.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1500;">
            <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center; max-width: 450px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                <h3 style="color: #e53e3e; margin-bottom: 1rem;">⚠️ Task Not Complete!</h3>
                <p style="color: #4a5568; margin-bottom: 1rem;">You need to complete the current chapter before moving to the next one.</p>
                <p style="color: #4a5568; margin-bottom: 2rem;">Please finish the activity first!</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="gotItBtn" style="background: #48bb78; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-size: 1rem; cursor: pointer;">Got it!</button>
                    <button id="skipBtn" style="background: #ed8936; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-size: 1rem; cursor: pointer;">Skip Chapter</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    popup.querySelector('#gotItBtn').addEventListener('click', () => {
        popup.remove();
    });
    
    popup.querySelector('#skipBtn').addEventListener('click', () => {
        if (window.silicoQuest) {
            window.silicoQuest.taskCompleted = true;
            window.silicoQuest.gameCompleted = true;
            window.silicoQuest.updateNavigationButtons();
        }
        popup.remove();
        showFeedback('Chapter skipped. You can continue to the next chapter.', 'info');
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 10000);
}

function generateFallbackCertificate(name) {
    const studentNameElement = document.getElementById('studentName');
    if (studentNameElement) {
        studentNameElement.textContent = name;
    }
    
    // Simple fallback certificate generation
    const certificateContent = `
Certificate of Completion

SilicoQuest: The Rock That Became a Brain

This certifies that ${name} has successfully completed
the SilicoQuest journey and learned how silicon transforms
from sand to the brain of computers.

Completion Date: ${new Date().toLocaleDateString()}

CSIR Jigyasa Science Outreach Program
    `;
    
    // Create a downloadable text file
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SilicoQuest_Certificate_${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showFeedback('🎉 Certificate downloaded successfully!', 'success');
}

function showFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${type}`;
    
    const colors = {
        success: 'background: #48bb78; color: white;',
        error: 'background: #e53e3e; color: white;',
        warning: 'background: #ed8936; color: white;',
        info: 'background: #4299e1; color: white;'
    };
    
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out;
        ${colors[type] || colors.info}
    `;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentElement) {
            feedback.parentElement.removeChild(feedback);
        }
    }, 3000);
}

// Audio control fix
function fixAudioControls() {
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            // Toggle mute state
            const isMuted = this.textContent === '🔇';
            this.textContent = isMuted ? '🔊' : '🔇';
            
            // You can add actual audio muting logic here
            console.log('Audio', isMuted ? 'unmuted' : 'muted');
        });
    }
}

// Initialize audio controls
document.addEventListener('DOMContentLoaded', function() {
    fixAudioControls();
});

console.log('Comprehensive SilicoQuest fixes loaded successfully!');