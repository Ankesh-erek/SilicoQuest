// SilicoQuest Fixes and Enhancements

// Fix 1: Layout CSS fixes
const layoutFixes = `
/* Enhanced Silico Narrator - Fixed Layout */
.silico-narrator {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 1rem;
    animation: slideInLeft 0.8s ease-out;
    flex-shrink: 0;
    width: 100%;
    justify-content: flex-start;
    position: relative;
    padding: 0 1rem;
}

.silico-narrator .silico-character {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    animation: none;
}

.silico-narrator .speech-bubble {
    flex: 1;
    max-width: calc(100% - 140px);
    font-size: 1.1rem;
    line-height: 1.6;
    word-break: break-word;
    white-space: normal;
    position: static;
    z-index: 1;
    align-self: center;
    padding: 1.2rem;
    background: var(--glass-bg);
    backdrop-filter: blur(15px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: var(--shadow-light);
    color: white;
    font-weight: 500;
    margin-left: 1rem;
}

/* Enhanced Visual Stage - Fixed Layout */
.visual-stage {
    background: var(--glass-bg);
    backdrop-filter: blur(15px);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 1rem;
    height: auto;
    min-height: 250px;
    max-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
}

/* Certificate Modal Fixes */
.certificate-content {
    max-width: 90vw;
    max-height: 90vh;
    width: 700px;
    overflow-y: auto;
}

.certificate {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 2px solid var(--glass-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.certificate-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 1rem;
}

#nameInput {
    padding: 1rem;
    border: 2px solid var(--glass-border);
    border-radius: var(--border-radius-small);
    font-size: 1.1rem;
    font-family: 'Poppins', sans-serif;
    min-width: 250px;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    color: white;
    transition: var(--transition);
}

#nameInput::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

#nameInput:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 20px rgba(79, 172, 254, 0.3);
}

/* Responsive fixes */
@media (max-width: 768px) {
    .silico-narrator {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        align-items: center;
    }
    
    .silico-narrator .silico-character {
        width: 80px;
        height: 80px;
        align-self: center;
    }
    
    .silico-narrator .speech-bubble {
        max-width: 100%;
        margin-left: 0;
    }
    
    .visual-stage {
        min-height: 200px;
        max-height: 300px;
        padding: 1rem;
    }
    
    .certificate-content {
        width: 95vw;
        max-width: none;
    }
    
    .certificate {
        padding: 1.5rem;
    }
    
    .certificate-actions {
        flex-direction: column;
        gap: 1rem;
    }
    
    #nameInput {
        width: 100%;
        min-width: auto;
    }
}
`;

// Apply layout fixes
function applyLayoutFixes() {
    const existingStyle = document.getElementById('layout-fixes');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'layout-fixes';
    style.textContent = layoutFixes;
    document.head.appendChild(style);
}

// Fix 2: Enhanced popup management
function enhancePopupManagement() {
    // Prevent multiple popups
    window.activePopups = new Set();
    
    // Enhanced showTaskIncompletePopup
    if (window.silicoQuest) {
        window.silicoQuest.showTaskIncompletePopup = function() {
            // Prevent multiple popups
            if (window.activePopups.has('task-incomplete')) {
                return;
            }
            window.activePopups.add('task-incomplete');

            const popup = document.createElement('div');
            popup.className = 'task-incomplete-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h3>⚠️ Task Not Complete!</h3>
                    <p>You need to complete the current task before moving to the next chapter.</p>
                    <p>Please finish the game or activity first!</p>
                    <div class="popup-buttons">
                        <button class="complete-btn">Got it!</button>
                        <button class="skip-btn">Skip Game</button>
                    </div>
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
                max-width: 450px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            `;
            popup.querySelector('.popup-buttons').style.cssText = `
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1rem;
            `;
            popup.querySelector('.complete-btn').style.cssText = `
                background: #48bb78;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
            `;
            popup.querySelector('.skip-btn').style.cssText = `
                background: #ed8936;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
            `;
            
            // Event listeners
            popup.querySelector('.complete-btn').addEventListener('click', () => {
                popup.remove();
                window.activePopups.delete('task-incomplete');
            });
            
            popup.querySelector('.skip-btn').addEventListener('click', () => {
                window.silicoQuest.skipCurrentGame();
                popup.remove();
                window.activePopups.delete('task-incomplete');
            });
            
            document.body.appendChild(popup);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (popup.parentElement) {
                    popup.remove();
                    window.activePopups.delete('task-incomplete');
                }
            }, 10000);
        };

        // Add skip game functionality
        window.silicoQuest.skipCurrentGame = function() {
            // Mark game as completed with 0 score
            this.gameCompleted = true;
            this.taskCompleted = true;
            
            // Store chapter score as 0
            this.chapterScores[this.currentChapter] = 0;
            
            // Update navigation buttons
            this.updateNavigationButtons();
            
            // Show skip message
            const narrationText = document.getElementById('narrationText');
            if (narrationText) {
                narrationText.textContent = `Game skipped! You can continue to the next chapter. (Score: 0 points)`;
            }
            if (this.silicoCharacter) {
                this.silicoCharacter.animate('idle');
            }
            
            // Hide game area
            const gameArea = document.getElementById('gameArea');
            if (gameArea) {
                gameArea.style.display = 'none';
            }
        };
    }
}

// Fix 3: Enhanced certificate functionality
function enhanceCertificateModal() {
    if (window.silicoQuest) {
        window.silicoQuest.downloadCertificate = function() {
            const nameInput = document.getElementById('nameInput');
            const name = nameInput ? nameInput.value.trim() : '';
            
            if (!name) {
                alert('Please enter your name to generate the certificate.');
                if (nameInput) nameInput.focus();
                return;
            }

            const studentNameElement = document.getElementById('studentName');
            if (studentNameElement) {
                studentNameElement.textContent = name;
            }
            
            // Generate certificate
            this.generateFallbackCertificate(name);
        };

        window.silicoQuest.generateFallbackCertificate = function(name) {
            // Simple fallback certificate generation
            const certificateContent = `
Certificate of Completion

SilicoQuest: The Rock That Became a Brain

This certifies that ${name} has successfully completed
the SilicoQuest journey and learned how silicon transforms
from sand to the brain of computers.

Total Score: ${this.totalScore || 0} points
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
            
            alert('Certificate downloaded successfully!');
        };

        window.silicoQuest.closeCertificateModal = function() {
            const modal = document.getElementById('certificateModal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Fix 4: Add missing visual functions
function addMissingVisuals() {
    if (window.silicoQuest) {
        // Add the missing visual functions
        window.silicoQuest.createDesertScene = function(container) {
            const scene = document.createElement('div');
            scene.innerHTML = `
                <div style="width: 100%; height: 200px; background: linear-gradient(to bottom, #87CEEB 0%, #F4A460 70%); border-radius: 10px; position: relative; overflow: hidden;">
                    <div style="position: absolute; bottom: 0; width: 100%; height: 30%; background: #F4A460;"></div>
                    <div style="position: absolute; bottom: 10%; left: 20%; width: 60px; height: 60px; background: #DEB887; border-radius: 50%; animation: bounce 2s infinite;"></div>
                    <div style="position: absolute; top: 20%; right: 30%; width: 40px; height: 40px; background: #FFD700; border-radius: 50%; box-shadow: 0 0 20px #FFD700;"></div>
                    <div style="position: absolute; bottom: 20%; right: 20%; font-size: 2rem;">🏜️</div>
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: #2F4F4F; font-weight: bold; background: rgba(255,255,255,0.8); padding: 5px 10px; border-radius: 10px;">Desert Sand - Source of Silicon</div>
                </div>
            `;
            container.appendChild(scene);
        };

        window.silicoQuest.createQuartzCrystal = function(container) {
            const crystal = document.createElement('div');
            crystal.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f0f8ff, #e6f3ff); border-radius: 15px; position: relative;">
                    <div style="width: 80px; height: 120px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: sparkle 2s infinite; box-shadow: 0 0 30px rgba(221, 160, 221, 0.5);"></div>
                    <div style="font-size: 3rem; margin-left: 20px;">💎</div>
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: #4a5568; font-weight: bold; background: rgba(255,255,255,0.9); padding: 5px 10px; border-radius: 10px;">Pure Quartz Crystal (SiO₂)</div>
                </div>
            `;
            container.appendChild(crystal);
        };

        window.silicoQuest.createRockCollection = function(container) {
            const rocks = document.createElement('div');
            rocks.innerHTML = `
                <div style="display: flex; justify-content: space-around; align-items: center; height: 200px; flex-wrap: wrap; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; padding: 20px; position: relative;">
                    <div style="width: 50px; height: 50px; background: #8B4513; border-radius: 50%; margin: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🪨</div>
                    <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); margin: 10px; animation: glow 2s infinite; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">💎</div>
                    <div style="width: 45px; height: 45px; background: #696969; border-radius: 50%; margin: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🪨</div>
                    <div style="width: 55px; height: 55px; background: #A0522D; border-radius: 50%; margin: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">🪨</div>
                    <div style="width: 50px; height: 50px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); margin: 10px; animation: glow 2s infinite; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">💎</div>
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: #4a5568; font-weight: bold; background: rgba(255,255,255,0.9); padding: 5px 10px; border-radius: 10px;">Sort the Quartz from Other Rocks</div>
                </div>
            `;
            container.appendChild(rocks);
        };

        window.silicoQuest.createFurnaceExterior = function(container) {
            const furnace = document.createElement('div');
            furnace.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative;">
                    <div style="width: 150px; height: 180px; background: linear-gradient(to bottom, #708090, #2F4F4F); border-radius: 10px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 100px; height: 20px; background: #FF4500; border-radius: 10px; animation: flicker 1s infinite;"></div>
                        <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 80px; height: 60px; background: #FF6347; border-radius: 50%; animation: heat 2s infinite;"></div>
                        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 2rem;">🏭</div>
                        <div style="position: absolute; top: 10px; right: -120px; color: white; font-size: 0.8rem; background: rgba(0,0,0,0.7); padding: 8px; border-radius: 5px;">
                            <div>🌡️ Temperature: 2000°C</div>
                            <div>⚡ Electric Arc Furnace</div>
                            <div>🔥 Melting Quartz + Carbon</div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(furnace);
        };

        window.silicoQuest.createFurnaceInterior = function(container) {
            const interior = document.createElement('div');
            interior.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: radial-gradient(circle, #FF4500, #8B0000); border-radius: 15px; position: relative;">
                    <div style="width: 100px; height: 100px; background: radial-gradient(circle, #FFD700, #FF4500); border-radius: 50%; animation: melt 2s infinite; box-shadow: 0 0 50px #FF4500; position: relative;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem;">🔥</div>
                    </div>
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; background: rgba(0,0,0,0.7); padding: 8px 12px; border-radius: 10px; text-align: center;">
                        <div>⚗️ Chemical Reaction</div>
                        <div style="font-size: 0.8rem; margin-top: 3px;">SiO₂ + 2C → Si + 2CO</div>
                    </div>
                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: white; font-size: 0.8rem; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 8px;">
                        Producing Molten Silicon
                    </div>
                </div>
            `;
            container.appendChild(interior);
        };
    }
}

// Fix 5: Add bounce animation for desert scene
function addMissingAnimations() {
    const existingStyle = document.getElementById('missing-animations');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'missing-animations';
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize all fixes
function initializeFixes() {
    // Wait for the main app to load
    if (window.silicoQuest) {
        applyLayoutFixes();
        enhancePopupManagement();
        enhanceCertificateModal();
        addMissingVisuals();
        addMissingAnimations();
        console.log('SilicoQuest fixes applied successfully!');
    } else {
        // Retry after a short delay
        setTimeout(initializeFixes, 1000);
    }
}

// Start initialization
document.addEventListener('DOMContentLoaded', initializeFixes);

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFixes);
} else {
    initializeFixes();
}