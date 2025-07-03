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
            case 'molten_silicon':
                this.createMoltenSilicon(stageContent);
                break;
            case 'crystal_growing':
                this.createCrystalGrowing(stageContent);
                break;
            case 'crystal_rotation':
                this.createCrystalRotation(stageContent);
                break;
            case 'silicon_ingot':
                this.createSiliconIngot(stageContent);
                break;
            case 'wafer_slicing':
                this.createWaferSlicing(stageContent);
                break;
            case 'wafer_polishing':
                this.createWaferPolishing(stageContent);
                break;
            case 'clean_wafer':
                this.createCleanWafer(stageContent);
                break;
            case 'logic_gates':
                this.createLogicGates(stageContent);
                break;
            case 'photolithography':
                this.createPhotolithography(stageContent);
                break;
            case 'individual_gates':
                this.createIndividualGates(stageContent);
                break;
            case 'alu_circuit':
                this.createALUCircuit(stageContent);
                break;
            case 'alu_construction':
                this.createALUConstruction(stageContent);
                break;
            case 'working_processor':
                this.createWorkingProcessor(stageContent);
                break;
            case 'instruction_set':
                this.createInstructionSet(stageContent);
                break;
            case 'visual_programming':
                this.createVisualProgramming(stageContent);
                break;
            case 'journey_recap':
                this.createJourneyRecap(stageContent);
                break;
            case 'silicon_applications':
                this.createSiliconApplications(stageContent);
                break;
            case 'celebration':
                this.createCelebration(stageContent);
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

    createMoltenSilicon(container) {
        const molten = document.createElement('div');
        molten.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: radial-gradient(circle, #FF6B35, #FF4500, #8B0000); border-radius: 15px; position: relative; overflow: hidden;">
                <div style="width: 120px; height: 120px; background: radial-gradient(circle, #FFD700, #FF6B35); border-radius: 50%; animation: moltenBubble 3s infinite; position: relative;">
                    <div style="position: absolute; top: 20%; left: 20%; width: 20px; height: 20px; background: #FFFF00; border-radius: 50%; animation: bubble1 2s infinite;"></div>
                    <div style="position: absolute; top: 60%; right: 25%; width: 15px; height: 15px; background: #FFA500; border-radius: 50%; animation: bubble2 2.5s infinite;"></div>
                    <div style="position: absolute; bottom: 30%; left: 50%; width: 18px; height: 18px; background: #FF4500; border-radius: 50%; animation: bubble3 1.8s infinite;"></div>
                </div>
                <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🌡️ 1414°C</div>
            </div>
        `;
        container.appendChild(molten);
    }

    createCrystalGrowing(container) {
        const growing = document.createElement('div');
        growing.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 15px; position: relative;">
                <div style="position: relative;">
                    <!-- Molten silicon pool -->
                    <div style="width: 100px; height: 40px; background: radial-gradient(ellipse, #FF6B35, #FF4500); border-radius: 50px; position: relative; animation: moltenGlow 2s infinite;">
                        <div style="position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 80px; height: 10px; background: rgba(255, 107, 53, 0.6); border-radius: 50px; animation: surfaceTension 1.5s infinite;"></div>
                    </div>
                    
                    <!-- Growing crystal -->
                    <div style="position: absolute; top: -60px; left: 50%; transform: translateX(-50%); width: 20px; height: 80px; background: linear-gradient(to top, #E6E6FA, #DDA0DD, #9370DB); border-radius: 10px 10px 5px 5px; animation: crystalGrow 4s infinite;">
                        <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 15px; height: 15px; background: #9370DB; border-radius: 50%; animation: seedCrystal 2s infinite;"></div>
                    </div>
                    
                    <!-- Pulling mechanism -->
                    <div style="position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 2px; height: 40px; background: #708090; animation: pulling 3s infinite;"></div>
                </div>
                
                <div style="position: absolute; top: 10px; right: 10px; color: #E6E6FA; font-size: 0.8rem; text-align: right;">
                    <div>🔄 Czochralski Process</div>
                    <div style="margin-top: 5px;">⬆️ Pulling Speed: 2mm/min</div>
                </div>
            </div>
        `;
        container.appendChild(growing);
    }

    createCrystalRotation(container) {
        const rotation = document.createElement('div');
        rotation.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative;">
                <div style="position: relative;">
                    <!-- Rotating crystal -->
                    <div style="width: 60px; height: 120px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); border-radius: 30px; animation: crystalRotate 2s linear infinite; position: relative; box-shadow: 0 0 20px rgba(147, 112, 219, 0.5);">
                        <!-- Crystal facets -->
                        <div style="position: absolute; top: 10%; left: 10%; width: 80%; height: 20%; background: rgba(255,255,255,0.3); border-radius: 50%; animation: facetShine 2s infinite;"></div>
                        <div style="position: absolute; top: 40%; right: 5%; width: 30%; height: 40%; background: rgba(255,255,255,0.2); border-radius: 50%; animation: facetShine 2s infinite 0.5s;"></div>
                        <div style="position: absolute; bottom: 20%; left: 15%; width: 70%; height: 15%; background: rgba(255,255,255,0.25); border-radius: 50%; animation: facetShine 2s infinite 1s;"></div>
                    </div>
                    
                    <!-- Rotation indicators -->
                    <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 80px; height: 20px; border: 2px dashed #48bb78; border-radius: 50%; animation: rotationIndicator 2s linear infinite;"></div>
                    <div style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); width: 80px; height: 20px; border: 2px dashed #48bb78; border-radius: 50%; animation: rotationIndicator 2s linear infinite reverse;"></div>
                </div>
                
                <!-- Control panel -->
                <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px; color: white; font-size: 0.8rem;">
                    <div>🔄 Rotation: <span style="color: #48bb78;">15 RPM</span></div>
                    <div>⬆️ Pull Rate: <span style="color: #48bb78;">2.5 mm/min</span></div>
                    <div>🌡️ Temp: <span style="color: #e53e3e;">1420°C</span></div>
                </div>
            </div>
        `;
        container.appendChild(rotation);
    }

    createSiliconIngot(container) {
        const ingot = document.createElement('div');
        ingot.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; position: relative;">
                <div style="position: relative;">
                    <!-- Silicon ingot -->
                    <div style="width: 80px; height: 160px; background: linear-gradient(to right, #E6E6FA, #DDA0DD, #E6E6FA); border-radius: 40px; position: relative; box-shadow: 0 10px 30px rgba(147, 112, 219, 0.3); animation: ingotShine 3s infinite;">
                        <!-- Crystal structure lines -->
                        <div style="position: absolute; top: 20%; left: 0; right: 0; height: 1px; background: rgba(147, 112, 219, 0.5);"></div>
                        <div style="position: absolute; top: 40%; left: 0; right: 0; height: 1px; background: rgba(147, 112, 219, 0.5);"></div>
                        <div style="position: absolute; top: 60%; left: 0; right: 0; height: 1px; background: rgba(147, 112, 219, 0.5);"></div>
                        <div style="position: absolute; top: 80%; left: 0; right: 0; height: 1px; background: rgba(147, 112, 219, 0.5);"></div>
                        
                        <!-- Highlight -->
                        <div style="position: absolute; top: 10%; left: 20%; width: 20%; height: 80%; background: rgba(255,255,255,0.4); border-radius: 20px; animation: highlight 2s infinite;"></div>
                    </div>
                    
                    <!-- Measurement indicators -->
                    <div style="position: absolute; left: -40px; top: 0; bottom: 0; width: 20px; border-left: 2px solid #4a5568; border-top: 2px solid #4a5568; border-bottom: 2px solid #4a5568;">
                        <div style="position: absolute; left: -30px; top: 50%; transform: translateY(-50%); color: #4a5568; font-size: 0.7rem; writing-mode: vertical-rl;">300mm</div>
                    </div>
                    
                    <div style="position: absolute; right: -40px; top: 50%; transform: translateY(-50%); color: #4a5568; font-size: 0.8rem; text-align: center;">
                        <div>💎 Silicon Ingot</div>
                        <div style="font-size: 0.7rem; margin-top: 5px;">99.9999% Pure</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(ingot);
    }

    createWaferSlicing(container) {
        const slicing = document.createElement('div');
        slicing.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative; overflow: hidden;">
                <div style="position: relative;">
                    <!-- Silicon ingot being sliced -->
                    <div style="width: 60px; height: 120px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 30px; position: relative;">
                        <!-- Cutting lines -->
                        <div style="position: absolute; top: 20%; left: -10px; right: -10px; height: 1px; background: #FFD700; box-shadow: 0 0 10px #FFD700; animation: cuttingLine 2s infinite;"></div>
                        <div style="position: absolute; top: 35%; left: -10px; right: -10px; height: 1px; background: #FFD700; box-shadow: 0 0 10px #FFD700; animation: cuttingLine 2s infinite 0.3s;"></div>
                        <div style="position: absolute; top: 50%; left: -10px; right: -10px; height: 1px; background: #FFD700; box-shadow: 0 0 10px #FFD700; animation: cuttingLine 2s infinite 0.6s;"></div>
                        <div style="position: absolute; top: 65%; left: -10px; right: -10px; height: 1px; background: #FFD700; box-shadow: 0 0 10px #FFD700; animation: cuttingLine 2s infinite 0.9s;"></div>
                        <div style="position: absolute; top: 80%; left: -10px; right: -10px; height: 1px; background: #FFD700; box-shadow: 0 0 10px #FFD700; animation: cuttingLine 2s infinite 1.2s;"></div>
                    </div>
                    
                    <!-- Diamond wire saw -->
                    <div style="position: absolute; left: -20px; top: 50%; width: 100px; height: 2px; background: linear-gradient(to right, transparent, #FFD700, transparent); animation: sawMovement 1.5s infinite;"></div>
                    
                    <!-- Sliced wafers -->
                    <div style="position: absolute; right: -80px; top: 20%; display: flex; flex-direction: column; gap: 3px;">
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3s infinite;"></div>
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3s infinite 0.5s;"></div>
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3s infinite 1s;"></div>
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3s infinite 1.5s;"></div>
                    </div>
                </div>
                
                <div style="position: absolute; top: 10px; left: 10px; color: white; font-size: 0.8rem; background: rgba(0,0,0,0.7); padding: 8px; border-radius: 5px;">
                    <div>💎 Diamond Wire Saw</div>
                    <div style="margin-top: 3px;">⚡ 0.1mm thickness</div>
                </div>
            </div>
        `;
        container.appendChild(slicing);
    }

    createWaferPolishing(container) {
        const polishing = document.createElement('div');
        polishing.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative;">
                <div style="position: relative;">
                    <!-- Polishing machine -->
                    <div style="width: 120px; height: 120px; background: radial-gradient(circle, #4a5568, #2d3748); border-radius: 50%; position: relative; animation: polishingRotate 2s linear infinite;">
                        <!-- Wafer being polished -->
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: radial-gradient(circle, #E6E6FA, #DDA0DD); border-radius: 50%; animation: waferPolish 2s infinite;">
                            <!-- Polishing compound -->
                            <div style="position: absolute; top: 20%; left: 20%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(255,255,255,0.8), transparent); border-radius: 50%; animation: polishingCompound 1s infinite;"></div>
                        </div>
                        
                        <!-- Polishing pads -->
                        <div style="position: absolute; top: 10%; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: #48bb78; border-radius: 50%; animation: polishingPad 2s infinite;"></div>
                        <div style="position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: #48bb78; border-radius: 50%; animation: polishingPad 2s infinite 1s;"></div>
                        <div style="position: absolute; left: 10%; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; background: #48bb78; border-radius: 50%; animation: polishingPad 2s infinite 0.5s;"></div>
                        <div style="position: absolute; right: 10%; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; background: #48bb78; border-radius: 50%; animation: polishingPad 2s infinite 1.5s;"></div>
                    </div>
                    
                    <!-- Sparkle effects -->
                    <div style="position: absolute; top: 20%; right: -20px; color: #FFD700; font-size: 1.5rem; animation: sparkle 1.5s infinite;">✨</div>
                    <div style="position: absolute; bottom: 30%; left: -20px; color: #FFD700; font-size: 1.2rem; animation: sparkle 1.5s infinite 0.5s;">✨</div>
                    <div style="position: absolute; top: 60%; right: -15px; color: #FFD700; font-size: 1rem; animation: sparkle 1.5s infinite 1s;">✨</div>
                </div>
                
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 5px;">
                    <div>🪞 Mirror Polish</div>
                    <div style="font-size: 0.7rem; margin-top: 2px;">Surface roughness: &lt;0.1nm</div>
                </div>
            </div>
        `;
        container.appendChild(polishing);
    }

    createCleanWafer(container) {
        const cleanWafer = document.createElement('div');
        cleanWafer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; position: relative;">
                <div style="position: relative;">
                    <!-- Perfect clean wafer -->
                    <div style="width: 120px; height: 120px; background: radial-gradient(circle, #E6E6FA, #DDA0DD, #E6E6FA); border-radius: 50%; position: relative; box-shadow: 0 0 30px rgba(147, 112, 219, 0.4); animation: perfectWafer 3s infinite;">
                        <!-- Mirror reflection -->
                        <div style="position: absolute; top: 20%; left: 20%; width: 30%; height: 30%; background: radial-gradient(circle, rgba(255,255,255,0.9), transparent); border-radius: 50%; animation: mirrorReflection 2s infinite;"></div>
                        
                        <!-- Crystal lattice pattern -->
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; opacity: 0.3;">
                            <div style="position: absolute; top: 0; left: 50%; width: 1px; height: 100%; background: #9370DB;"></div>
                            <div style="position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: #9370DB;"></div>
                            <div style="position: absolute; top: 25%; left: 50%; width: 1px; height: 50%; background: #9370DB; transform: rotate(45deg);"></div>
                            <div style="position: absolute; top: 25%; left: 50%; width: 1px; height: 50%; background: #9370DB; transform: rotate(-45deg);"></div>
                        </div>
                        
                        <!-- Cleanliness indicators -->
                        <div style="position: absolute; top: -10px; right: -10px; width: 20px; height: 20px; background: #48bb78; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; animation: cleanIndicator 2s infinite;">✓</div>
                    </div>
                    
                    <!-- Quality metrics -->
                    <div style="position: absolute; right: -100px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; font-size: 0.8rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <div style="color: #48bb78; font-weight: bold;">✅ Quality Check</div>
                        <div style="margin-top: 5px; color: #4a5568;">
                            <div>🪞 Surface: Perfect</div>
                            <div>🧹 Particles: 0</div>
                            <div>📏 Flatness: ±0.1μm</div>
                            <div>💎 Purity: 99.9999%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(cleanWafer);
    }

    createLogicGates(container) {
        const gates = document.createElement('div');
        gates.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative; padding: 20px;">
                <div style="display: flex; gap: 30px; align-items: center;">
                    <!-- AND Gate -->
                    <div style="position: relative;">
                        <div style="width: 60px; height: 40px; background: #4a5568; border-radius: 0 20px 20px 0; position: relative; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; animation: gateGlow 2s infinite;">
                            AND
                        </div>
                        <div style="position: absolute; left: -10px; top: 25%; width: 10px; height: 2px; background: #48bb78;"></div>
                        <div style="position: absolute; left: -10px; top: 75%; width: 10px; height: 2px; background: #48bb78;"></div>
                        <div style="position: absolute; right: -10px; top: 50%; width: 10px; height: 2px; background: #e53e3e; animation: outputSignal 1.5s infinite;"></div>
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.7rem;">AND</div>
                    </div>
                    
                    <!-- OR Gate -->
                    <div style="position: relative;">
                        <div style="width: 60px; height: 40px; background: #4a5568; border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; animation: gateGlow 2s infinite 0.5s;">
                            OR
                        </div>
                        <div style="position: absolute; left: -10px; top: 25%; width: 10px; height: 2px; background: #48bb78;"></div>
                        <div style="position: absolute; left: -10px; top: 75%; width: 10px; height: 2px; background: #48bb78;"></div>
                        <div style="position: absolute; right: -10px; top: 50%; width: 10px; height: 2px; background: #e53e3e; animation: outputSignal 1.5s infinite 0.3s;"></div>
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.7rem;">OR</div>
                    </div>
                    
                    <!-- NOT Gate -->
                    <div style="position: relative;">
                        <div style="width: 50px; height: 40px; background: #4a5568; clip-path: polygon(0% 50%, 100% 0%, 100% 100%); position: relative; display: flex; align-items: center; justify-content: center; animation: gateGlow 2s infinite 1s;"></div>
                        <div style="position: absolute; right: -15px; top: 50%; width: 8px; height: 8px; background: #4a5568; border-radius: 50%;"></div>
                        <div style="position: absolute; left: -10px; top: 50%; width: 10px; height: 2px; background: #48bb78;"></div>
                        <div style="position: absolute; right: -25px; top: 50%; width: 10px; height: 2px; background: #e53e3e; animation: outputSignal 1.5s infinite 0.7s;"></div>
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.7rem;">NOT</div>
                    </div>
                </div>
                
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center;">
                    <div>⚡ Basic Logic Gates</div>
                    <div style="font-size: 0.7rem; margin-top: 2px;">Building blocks of digital logic</div>
                </div>
            </div>
        `;
        container.appendChild(gates);
    }

    createPhotolithography(container) {
        const photo = document.createElement('div');
        photo.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative; overflow: hidden;">
                <div style="position: relative;">
                    <!-- UV Light source -->
                    <div style="position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 80px; height: 20px; background: linear-gradient(to bottom, #9f7aea, #805ad5); border-radius: 10px; animation: uvLight 2s infinite;">
                        <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 40px solid transparent; border-right: 40px solid transparent; border-top: 10px solid #805ad5; animation: lightBeam 2s infinite;"></div>
                    </div>
                    
                    <!-- Mask -->
                    <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 20px; background: #1a202c; border-radius: 5px; position: relative;">
                        <!-- Mask pattern -->
                        <div style="position: absolute; top: 50%; left: 20%; width: 8px; height: 8px; background: transparent; border: 1px solid #e2e8f0;"></div>
                        <div style="position: absolute; top: 50%; left: 40%; width: 8px; height: 8px; background: #e2e8f0;"></div>
                        <div style="position: absolute; top: 50%; left: 60%; width: 8px; height: 8px; background: transparent; border: 1px solid #e2e8f0;"></div>
                        <div style="position: absolute; top: 50%; left: 80%; width: 8px; height: 8px; background: #e2e8f0;"></div>
                    </div>
                    
                    <!-- Photoresist layer -->
                    <div style="width: 120px; height: 15px; background: linear-gradient(to bottom, #48bb78, #38a169); border-radius: 5px; position: relative; animation: photoresistExposure 3s infinite;">
                        <!-- Exposed areas -->
                        <div style="position: absolute; top: 0; left: 20%; width: 8px; height: 100%; background: rgba(255,255,255,0.6); animation: exposure 3s infinite;"></div>
                        <div style="position: absolute; top: 0; left: 60%; width: 8px; height: 100%; background: rgba(255,255,255,0.6); animation: exposure 3s infinite 0.5s;"></div>
                    </div>
                    
                    <!-- Silicon wafer -->
                    <div style="width: 140px; height: 10px; background: radial-gradient(ellipse, #E6E6FA, #DDA0DD); border-radius: 5px; margin-top: 2px; animation: waferBase 2s infinite;"></div>
                </div>
                
                <div style="position: absolute; top: 10px; left: 10px; color: white; font-size: 0.8rem; background: rgba(0,0,0,0.7); padding: 8px; border-radius: 5px;">
                    <div>💜 UV Lithography</div>
                    <div style="margin-top: 3px;">📐 Pattern Transfer</div>
                </div>
                
                <div style="position: absolute; bottom: 10px; right: 10px; color: #e2e8f0; font-size: 0.7rem; text-align: right;">
                    <div>Wavelength: 193nm</div>
                    <div>Resolution: 7nm</div>
                </div>
            </div>
        `;
        container.appendChild(photo);
    }

    createIndividualGates(container) {
        const individual = document.createElement('div');
        individual.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; position: relative; padding: 20px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%;">
                    <!-- Individual AND Gate -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 50px; height: 30px; background: linear-gradient(135deg, #4299e1, #3182ce); border-radius: 0 15px 15px 0; position: relative; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem; animation: individualGate 2s infinite; box-shadow: 0 5px 15px rgba(66, 153, 225, 0.3);">
                            AND
                            <div style="position: absolute; left: -8px; top: 20%; width: 8px; height: 2px; background: #48bb78;"></div>
                            <div style="position: absolute; left: -8px; top: 80%; width: 8px; height: 2px; background: #48bb78;"></div>
                            <div style="position: absolute; right: -8px; top: 50%; width: 8px; height: 2px; background: #e53e3e; animation: gateOutput 1.5s infinite;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.7rem; color: #4a5568; text-align: center;">
                            <div>Input A & B</div>
                            <div>Output: A AND B</div>
                        </div>
                    </div>
                    
                    <!-- Individual OR Gate -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 50px; height: 30px; background: linear-gradient(135deg, #48bb78, #38a169); border-radius: 15px; position: relative; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem; animation: individualGate 2s infinite 0.5s; box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);">
                            OR
                            <div style="position: absolute; left: -8px; top: 20%; width: 8px; height: 2px; background: #4299e1;"></div>
                            <div style="position: absolute; left: -8px; top: 80%; width: 8px; height: 2px; background: #4299e1;"></div>
                            <div style="position: absolute; right: -8px; top: 50%; width: 8px; height: 2px; background: #e53e3e; animation: gateOutput 1.5s infinite 0.3s;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.7rem; color: #4a5568; text-align: center;">
                            <div>Input A | B</div>
                            <div>Output: A OR B</div>
                        </div>
                    </div>
                    
                    <!-- Individual NOT Gate -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="position: relative;">
                            <div style="width: 40px; height: 30px; background: linear-gradient(135deg, #ed8936, #dd6b20); clip-path: polygon(0% 50%, 100% 0%, 100% 100%); animation: individualGate 2s infinite 1s; box-shadow: 0 5px 15px rgba(237, 137, 54, 0.3);"></div>
                            <div style="position: absolute; right: -12px; top: 50%; width: 6px; height: 6px; background: #ed8936; border-radius: 50%;"></div>
                            <div style="position: absolute; left: -8px; top: 50%; width: 8px; height: 2px; background: #4299e1;"></div>
                            <div style="position: absolute; right: -20px; top: 50%; width: 8px; height: 2px; background: #e53e3e; animation: gateOutput 1.5s infinite 0.7s;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.7rem; color: #4a5568; text-align: center;">
                            <div>Input A</div>
                            <div>Output: NOT A</div>
                        </div>
                    </div>
                </div>
                
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #4a5568; font-size: 0.8rem; text-align: center;">
                    <div>🔧 Individual Logic Gates</div>
                    <div style="font-size: 0.7rem; margin-top: 2px;">Ready to be connected into circuits</div>
                </div>
            </div>
        `;
        container.appendChild(individual);
    }

    createALUCircuit(container) {
        const alu = document.createElement('div');
        alu.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative; padding: 15px;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- Input A -->
                    <div style="position: absolute; left: 10px; top: 20%; color: #48bb78; font-size: 0.8rem; font-weight: bold;">
                        A: 1011
                        <div style="width: 30px; height: 2px; background: #48bb78; margin-top: 5px; animation: dataFlow 2s infinite;"></div>
                    </div>
                    
                    <!-- Input B -->
                    <div style="position: absolute; left: 10px; bottom: 20%; color: #4299e1; font-size: 0.8rem; font-weight: bold;">
                        B: 0110
                        <div style="width: 30px; height: 2px; background: #4299e1; margin-top: 5px; animation: dataFlow 2s infinite 0.5s;"></div>
                    </div>
                    
                    <!-- ALU Core -->
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 80px; height: 60px; background: linear-gradient(135deg, #805ad5, #9f7aea); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; animation: aluProcessing 3s infinite; box-shadow: 0 0 20px rgba(128, 90, 213, 0.5);">
                        ALU
                        <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: #e2e8f0;">Arithmetic Logic Unit</div>
                    </div>
                    
                    <!-- Operation Control -->
                    <div style="position: absolute; left: 50%; top: 10%; transform: translateX(-50%); color: #ed8936; font-size: 0.7rem; text-align: center;">
                        <div>Operation: ADD</div>
                        <div style="width: 2px; height: 20px; background: #ed8936; margin: 5px auto; animation: controlSignal 2s infinite;"></div>
                    </div>
                    
                    <!-- Internal Gates -->
                    <div style="position: absolute; left: 45%; top: 35%; width: 8px; height: 8px; background: #48bb78; border-radius: 2px; animation: internalGate 1.5s infinite;"></div>
                    <div style="position: absolute; left: 55%; top: 45%; width: 8px; height: 8px; background: #4299e1; border-radius: 2px; animation: internalGate 1.5s infinite 0.3s;"></div>
                    <div style="position: absolute; left: 50%; top: 55%; width: 8px; height: 8px; background: #ed8936; border-radius: 2px; animation: internalGate 1.5s infinite 0.6s;"></div>
                    <div style="position: absolute; left: 45%; top: 65%; width: 8px; height: 8px; background: #e53e3e; border-radius: 2px; animation: internalGate 1.5s infinite 0.9s;"></div>
                    
                    <!-- Output -->
                    <div style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #e53e3e; font-size: 0.8rem; font-weight: bold; text-align: right;">
                        <div style="width: 30px; height: 2px; background: #e53e3e; margin-bottom: 5px; animation: resultFlow 2s infinite 1.5s;"></div>
                        Result: 10001
                    </div>
                    
                    <!-- Connection lines -->
                    <div style="position: absolute; left: 40px; top: 25%; width: 60px; height: 2px; background: linear-gradient(to right, #48bb78, transparent); animation: connectionFlow 2s infinite;"></div>
                    <div style="position: absolute; left: 40px; bottom: 25%; width: 60px; height: 2px; background: linear-gradient(to right, #4299e1, transparent); animation: connectionFlow 2s infinite 0.5s;"></div>
                    <div style="position: absolute; right: 40px; top: 50%; width: 60px; height: 2px; background: linear-gradient(to left, #e53e3e, transparent); animation: connectionFlow 2s infinite 1.5s;"></div>
                </div>
            </div>
        `;
        container.appendChild(alu);
    }

    createALUConstruction(container) {
        const construction = document.createElement('div');
        construction.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative; padding: 10px;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- Construction Steps -->
                    <div style="position: absolute; left: 5%; top: 10%; display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; animation: constructionStep 4s infinite;">
                            <div style="width: 20px; height: 15px; background: #4299e1; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.6rem;">AND</div>
                            <div style="width: 20px; height: 2px; background: #48bb78;"></div>
                            <div style="color: #e2e8f0; font-size: 0.7rem;">Step 1</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 8px; animation: constructionStep 4s infinite 1s;">
                            <div style="width: 20px; height: 15px; background: #48bb78; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.6rem;">OR</div>
                            <div style="width: 20px; height: 2px; background: #4299e1;"></div>
                            <div style="color: #e2e8f0; font-size: 0.7rem;">Step 2</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 8px; animation: constructionStep 4s infinite 2s;">
                            <div style="width: 20px; height: 15px; background: #ed8936; clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"></div>
                            <div style="width: 20px; height: 2px; background: #ed8936;"></div>
                            <div style="color: #e2e8f0; font-size: 0.7rem;">Step 3</div>
                        </div>
                    </div>
                    
                    <!-- Assembly Area -->
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100px; height: 80px; border: 2px dashed #805ad5; border-radius: 10px; display: flex; align-items: center; justify-content: center; animation: assemblyArea 3s infinite;">
                        <div style="color: #805ad5; font-size: 0.8rem; text-align: center;">
                            <div>🔧 Assembly</div>
                            <div style="font-size: 0.6rem; margin-top: 3px;">Building ALU...</div>
                        </div>
                    </div>
                    
                    <!-- Completed ALU -->
                    <div style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 60px; height: 50px; background: linear-gradient(135deg, #805ad5, #9f7aea); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem; animation: completedALU 4s infinite 3s; opacity: 0;">
                        ALU
                        <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; color: #e2e8f0; white-space: nowrap;">Complete!</div>
                    </div>
                    
                    <!-- Progress indicators -->
                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px;">
                        <div style="width: 8px; height: 8px; background: #48bb78; border-radius: 50%; animation: progressDot 4s infinite;"></div>
                        <div style="width: 8px; height: 8px; background: #4299e1; border-radius: 50%; animation: progressDot 4s infinite 1s;"></div>
                        <div style="width: 8px; height: 8px; background: #ed8936; border-radius: 50%; animation: progressDot 4s infinite 2s;"></div>
                        <div style="width: 8px; height: 8px; background: #805ad5; border-radius: 50%; animation: progressDot 4s infinite 3s;"></div>
                    </div>
                    
                    <!-- Tools -->
                    <div style="position: absolute; top: 10px; right: 10px; color: #e2e8f0; font-size: 1.2rem; animation: tools 2s infinite;">🔧</div>
                    <div style="position: absolute; top: 30px; right: 30px; color: #e2e8f0; font-size: 1rem; animation: tools 2s infinite 0.5s;">⚡</div>
                </div>
            </div>
        `;
        container.appendChild(construction);
    }

    createWorkingProcessor(container) {
        const processor = document.createElement('div');
        processor.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative; padding: 15px;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- CPU Core -->
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100px; height: 80px; background: linear-gradient(135deg, #805ad5, #9f7aea); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; animation: processorPulse 2s infinite; box-shadow: 0 0 30px rgba(128, 90, 213, 0.6);">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem;">CPU</div>
                            <div style="font-size: 0.6rem; margin-top: 2px;">Silicon Brain</div>
                        </div>
                    </div>
                    
                    <!-- Data buses -->
                    <div style="position: absolute; left: 10px; top: 30%; width: 80px; height: 3px; background: linear-gradient(to right, #48bb78, #805ad5); animation: dataBus 1.5s infinite;"></div>
                    <div style="position: absolute; left: 10px; top: 50%; width: 80px; height: 3px; background: linear-gradient(to right, #4299e1, #805ad5); animation: dataBus 1.5s infinite 0.3s;"></div>
                    <div style="position: absolute; left: 10px; top: 70%; width: 80px; height: 3px; background: linear-gradient(to right, #ed8936, #805ad5); animation: dataBus 1.5s infinite 0.6s;"></div>
                    
                    <div style="position: absolute; right: 10px; top: 30%; width: 80px; height: 3px; background: linear-gradient(to left, #e53e3e, #805ad5); animation: dataBus 1.5s infinite 0.9s;"></div>
                    <div style="position: absolute; right: 10px; top: 50%; width: 80px; height: 3px; background: linear-gradient(to left, #38b2ac, #805ad5); animation: dataBus 1.5s infinite 1.2s;"></div>
                    <div style="position: absolute; right: 10px; top: 70%; width: 80px; height: 3px; background: linear-gradient(to left, #d69e2e, #805ad5); animation: dataBus 1.5s infinite 1.5s;"></div>
                    
                    <!-- Clock signal -->
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: #ffd700; font-size: 0.8rem; text-align: center; animation: clockSignal 1s infinite;">
                        <div>⏰ Clock: 3.2 GHz</div>
                        <div style="width: 40px; height: 2px; background: #ffd700; margin: 3px auto; animation: clockPulse 1s infinite;"></div>
                    </div>
                    
                    <!-- Performance indicators -->
                    <div style="position: absolute; bottom: 10px; left: 10px; color: #48bb78; font-size: 0.7rem;">
                        <div>🚀 Instructions/sec: 3.2B</div>
                        <div>⚡ Power: 65W</div>
                    </div>
                    
                    <div style="position: absolute; bottom: 10px; right: 10px; color: #e53e3e; font-size: 0.7rem; text-align: right;">
                        <div>🌡️ Temp: 45°C</div>
                        <div>🔋 Efficiency: 95%</div>
                    </div>
                    
                    <!-- Activity indicators -->
                    <div style="position: absolute; top: 20%; left: 20%; width: 6px; height: 6px; background: #48bb78; border-radius: 50%; animation: activityBlink 0.8s infinite;"></div>
                    <div style="position: absolute; top: 80%; right: 20%; width: 6px; height: 6px; background: #4299e1; border-radius: 50%; animation: activityBlink 0.8s infinite 0.2s;"></div>
                    <div style="position: absolute; top: 40%; left: 15%; width: 6px; height: 6px; background: #ed8936; border-radius: 50%; animation: activityBlink 0.8s infinite 0.4s;"></div>
                    <div style="position: absolute; top: 60%; right: 15%; width: 6px; height: 6px; background: #e53e3e; border-radius: 50%; animation: activityBlink 0.8s infinite 0.6s;"></div>
                </div>
            </div>
        `;
        container.appendChild(processor);
    }

    createInstructionSet(container) {
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; position: relative; padding: 15px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 100%;">
                    <!-- ADD Instruction -->
                    <div style="background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 10px; border-radius: 8px; text-align: center; animation: instructionDemo 3s infinite; box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);">
                        <div style="font-weight: bold; font-size: 0.8rem;">ADD</div>
                        <div style="font-size: 0.7rem; margin-top: 3px;">A + B → C</div>
                        <div style="font-size: 0.6rem; margin-top: 5px; opacity: 0.9;">5 + 3 = 8</div>
                    </div>
                    
                    <!-- STORE Instruction -->
                    <div style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white; padding: 10px; border-radius: 8px; text-align: center; animation: instructionDemo 3s infinite 0.5s; box-shadow: 0 5px 15px rgba(66, 153, 225, 0.3);">
                        <div style="font-weight: bold; font-size: 0.8rem;">STORE</div>
                        <div style="font-size: 0.7rem; margin-top: 3px;">Save → Memory</div>
                        <div style="font-size: 0.6rem; margin-top: 5px; opacity: 0.9;">Store 8 at address 100</div>
                    </div>
                    
                    <!-- LOAD Instruction -->
                    <div style="background: linear-gradient(135deg, #ed8936, #dd6b20); color: white; padding: 10px; border-radius: 8px; text-align: center; animation: instructionDemo 3s infinite 1s; box-shadow: 0 5px 15px rgba(237, 137, 54, 0.3);">
                        <div style="font-weight: bold; font-size: 0.8rem;">LOAD</div>
                        <div style="font-size: 0.7rem; margin-top: 3px;">Memory → Register</div>
                        <div style="font-size: 0.6rem; margin-top: 5px; opacity: 0.9;">Load from address 100</div>
                    </div>
                    
                    <!-- JUMP Instruction -->
                    <div style="background: linear-gradient(135deg, #805ad5, #9f7aea); color: white; padding: 10px; border-radius: 8px; text-align: center; animation: instructionDemo 3s infinite 1.5s; box-shadow: 0 5px 15px rgba(128, 90, 213, 0.3);">
                        <div style="font-weight: bold; font-size: 0.8rem;">JUMP</div>
                        <div style="font-size: 0.7rem; margin-top: 3px;">Go to line</div>
                        <div style="font-size: 0.6rem; margin-top: 5px; opacity: 0.9;">Jump to line 10</div>
                    </div>
                </div>
                
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #4a5568; font-size: 0.8rem; text-align: center;">
                    <div>📋 Basic Instruction Set</div>
                    <div style="font-size: 0.7rem; margin-top: 2px;">Commands that control the processor</div>
                </div>
            </div>
        `;
        container.appendChild(instructions);
    }

    createVisualProgramming(container) {
        const programming = document.createElement('div');
        programming.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative; padding: 15px;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- Code blocks -->
                    <div style="position: absolute; left: 10px; top: 20%; display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: #48bb78; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; animation: codeBlock 4s infinite; cursor: pointer; box-shadow: 0 3px 10px rgba(72, 187, 120, 0.3);">
                            START
                        </div>
                        <div style="background: #4299e1; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; animation: codeBlock 4s infinite 0.5s; cursor: pointer; box-shadow: 0 3px 10px rgba(66, 153, 225, 0.3);">
                            SET A = 5
                        </div>
                        <div style="background: #ed8936; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; animation: codeBlock 4s infinite 1s; cursor: pointer; box-shadow: 0 3px 10px rgba(237, 137, 54, 0.3);">
                            SET B = 3
                        </div>
                        <div style="background: #805ad5; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; animation: codeBlock 4s infinite 1.5s; cursor: pointer; box-shadow: 0 3px 10px rgba(128, 90, 213, 0.3);">
                            C = A + B
                        </div>
                        <div style="background: #e53e3e; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; animation: codeBlock 4s infinite 2s; cursor: pointer; box-shadow: 0 3px 10px rgba(229, 62, 62, 0.3);">
                            DISPLAY C
                        </div>
                    </div>
                    
                    <!-- Execution flow -->
                    <div style="position: absolute; left: 50%; top: 15%; transform: translateX(-50%); width: 2px; height: 70%; background: linear-gradient(to bottom, #48bb78, #e53e3e); animation: executionFlow 4s infinite;"></div>
                    
                    <!-- Execution pointer -->
                    <div style="position: absolute; left: 45%; top: 20%; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid #ffd700; animation: executionPointer 4s infinite;"></div>
                    
                    <!-- Output display -->
                    <div style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #1a202c; color: #48bb78; padding: 15px; border-radius: 8px; font-family: monospace; border: 2px solid #48bb78; animation: outputDisplay 4s infinite 3s;">
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-bottom: 5px;">Output:</div>
                        <div style="font-size: 1.2rem; font-weight: bold; animation: resultBlink 1s infinite 3s;">8</div>
                    </div>
                    
                    <!-- Drag and drop hint -->
                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center;">
                        <div>🖱️ Drag & Drop Programming</div>
                        <div style="font-size: 0.7rem; margin-top: 2px;">Build programs with visual blocks</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(programming);
    }

    createJourneyRecap(container) {
        const recap = document.createElement('div');
        recap.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; position: relative; padding: 15px; overflow: hidden;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- Journey timeline -->
                    <div style="position: absolute; left: 50%; top: 10%; bottom: 10%; width: 3px; background: linear-gradient(to bottom, #f4a460, #805ad5); border-radius: 2px;"></div>
                    
                    <!-- Journey steps -->
                    <div style="position: absolute; left: 20%; top: 15%; display: flex; align-items: center; gap: 10px; animation: journeyStep 6s infinite;">
                        <div style="width: 30px; height: 30px; background: #f4a460; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🏜️</div>
                        <div style="color: #4a5568; font-size: 0.8rem; font-weight: bold;">Sand</div>
                    </div>
                    
                    <div style="position: absolute; right: 20%; top: 30%; display: flex; align-items: center; gap: 10px; animation: journeyStep 6s infinite 1s;">
                        <div style="color: #4a5568; font-size: 0.8rem; font-weight: bold;">Crystal</div>
                        <div style="width: 30px; height: 30px; background: #dda0dd; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">💎</div>
                    </div>
                    
                    <div style="position: absolute; left: 20%; top: 45%; display: flex; align-items: center; gap: 10px; animation: journeyStep 6s infinite 2s;">
                        <div style="width: 30px; height: 30px; background: #4299e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🔧</div>
                        <div style="color: #4a5568; font-size: 0.8rem; font-weight: bold;">Wafer</div>
                    </div>
                    
                    <div style="position: absolute; right: 20%; top: 60%; display: flex; align-items: center; gap: 10px; animation: journeyStep 6s infinite 3s;">
                        <div style="color: #4a5568; font-size: 0.8rem; font-weight: bold;">Gates</div>
                        <div style="width: 30px; height: 30px; background: #48bb78; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">⚡</div>
                    </div>
                    
                    <div style="position: absolute; left: 20%; top: 75%; display: flex; align-items: center; gap: 10px; animation: journeyStep 6s infinite 4s;">
                        <div style="width: 30px; height: 30px; background: #805ad5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🧠</div>
                        <div style="color: #4a5568; font-size: 0.8rem; font-weight: bold;">Processor</div>
                    </div>
                    
                    <!-- Achievement badge -->
                    <div style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #ffd700, #ffed4e); color: #744210; padding: 8px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; animation: achievementBadge 2s infinite; box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);">
                        🏆 Journey Complete!
                    </div>
                    
                    <!-- Progress indicator -->
                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #4a5568; font-size: 0.8rem; text-align: center;">
                        <div>📈 From Sand to Silicon Brain</div>
                        <div style="font-size: 0.7rem; margin-top: 2px;">You've mastered the complete process!</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(recap);
    }

    createSiliconApplications(container) {
        const applications = document.createElement('div');
        applications.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative; padding: 15px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; height: 100%;">
                    <!-- Smartphone -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; animation: applicationDemo 4s infinite;">
                        <div style="width: 40px; height: 60px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 8px; position: relative; border: 2px solid #805ad5; animation: deviceGlow 2s infinite;">
                            <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 20px; height: 30px; background: #48bb78; border-radius: 2px; animation: screenActivity 1.5s infinite;"></div>
                            <div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 12px; height: 3px; background: #e2e8f0; border-radius: 2px;"></div>
                        </div>
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-top: 5px; text-align: center;">📱 Smartphone</div>
                    </div>
                    
                    <!-- Computer -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; animation: applicationDemo 4s infinite 0.5s;">
                        <div style="width: 50px; height: 35px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 5px; position: relative; border: 2px solid #4299e1; animation: deviceGlow 2s infinite 0.3s;">
                            <div style="position: absolute; top: 3px; left: 3px; right: 3px; bottom: 8px; background: #4299e1; border-radius: 2px; animation: screenActivity 1.5s infinite 0.3s;"></div>
                            <div style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 20px; height: 3px; background: #e2e8f0; border-radius: 1px;"></div>
                        </div>
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-top: 5px; text-align: center;">💻 Computer</div>
                    </div>
                    
                    <!-- Car -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; animation: applicationDemo 4s infinite 1s;">
                        <div style="width: 55px; height: 25px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 12px; position: relative; border: 2px solid #ed8936; animation: deviceGlow 2s infinite 0.6s;">
                            <div style="position: absolute; top: 3px; left: 8px; width: 15px; height: 8px; background: #ed8936; border-radius: 2px; animation: screenActivity 1.5s infinite 0.6s;"></div>
                            <div style="position: absolute; bottom: -3px; left: 8px; width: 6px; height: 6px; background: #2d3748; border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -3px; right: 8px; width: 6px; height: 6px; background: #2d3748; border-radius: 50%;"></div>
                        </div>
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-top: 5px; text-align: center;">🚗 Smart Car</div>
                    </div>
                    
                    <!-- Satellite -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; animation: applicationDemo 4s infinite 1.5s;">
                        <div style="width: 30px; height: 30px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 5px; position: relative; border: 2px solid #48bb78; animation: deviceGlow 2s infinite 0.9s;">
                            <div style="position: absolute; top: -5px; left: -8px; width: 15px; height: 3px; background: #48bb78; border-radius: 1px; transform: rotate(-30deg);"></div>
                            <div style="position: absolute; top: -5px; right: -8px; width: 15px; height: 3px; background: #48bb78; border-radius: 1px; transform: rotate(30deg);"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #48bb78; border-radius: 50%; animation: satelliteSignal 1s infinite;"></div>
                        </div>
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-top: 5px; text-align: center;">🛰️ Satellite</div>
                    </div>
                    
                    <!-- Medical Device -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; animation: applicationDemo 4s infinite 2s;">
                        <div style="width: 35px; height: 35px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 50%; position: relative; border: 2px solid #e53e3e; animation: deviceGlow 2s infinite 1.2s;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 15px; height: 2px; background: #e53e3e;"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2px; height: 15px; background: #e53e3e;"></div>
                            <div style="position: absolute; top: 3px; right: 3px; width: 6px; height: 6px; background: #e53e3e; border-radius: 50%; animation: heartbeat 1s infinite;"></div>
                        </div>
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-top: 5px; text-align: center;">🏥 Medical</div>
                    </div>
                    
                    <!-- Rocket -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; animation: applicationDemo 4s infinite 2.5s;">
                        <div style="width: 20px; height: 45px; background: linear-gradient(135deg, #4a5568, #2d3748); border-radius: 10px 10px 0 0; position: relative; border: 2px solid #ffd700; animation: deviceGlow 2s infinite 1.5s;">
                            <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); width: 8px; height: 15px; background: #ffd700; border-radius: 2px; animation: rocketThrust 0.5s infinite;"></div>
                            <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #ff6b35; animation: thrustFlame 0.3s infinite;"></div>
                        </div>
                        <div style="color: #e2e8f0; font-size: 0.7rem; margin-top: 5px; text-align: center;">🚀 Space</div>
                    </div>
                </div>
                
                <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center;">
                    <div>🌍 Silicon Powers Our World</div>
                    <div style="font-size: 0.7rem; margin-top: 2px;">From phones to rockets - everywhere!</div>
                </div>
            </div>
        `;
        container.appendChild(applications);
    }

    createCelebration(container) {
        const celebration = document.createElement('div');
        celebration.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700); border-radius: 15px; position: relative; padding: 15px; overflow: hidden;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- Confetti -->
                    <div style="position: absolute; top: 10%; left: 20%; color: #e53e3e; font-size: 1.5rem; animation: confetti1 3s infinite;">🎉</div>
                    <div style="position: absolute; top: 20%; right: 25%; color: #4299e1; font-size: 1.2rem; animation: confetti2 3s infinite 0.5s;">🎊</div>
                    <div style="position: absolute; top: 30%; left: 70%; color: #48bb78; font-size: 1.8rem; animation: confetti3 3s infinite 1s;">🎉</div>
                    <div style="position: absolute; top: 60%; left: 15%; color: #805ad5; font-size: 1.3rem; animation: confetti4 3s infinite 1.5s;">🎊</div>
                    <div style="position: absolute; top: 70%; right: 20%; color: #ed8936; font-size: 1.6rem; animation: confetti5 3s infinite 2s;">🎉</div>
                    <div style="position: absolute; top: 80%; left: 60%; color: #e53e3e; font-size: 1.1rem; animation: confetti6 3s infinite 2.5s;">🎊</div>
                    
                    <!-- Central celebration -->
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; animation: celebrationPulse 2s infinite;">
                        <div style="font-size: 3rem; margin-bottom: 10px; animation: trophy 2s infinite;">🏆</div>
                        <div style="color: #744210; font-size: 1.2rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">CONGRATULATIONS!</div>
                        <div style="color: #744210; font-size: 0.9rem; margin-top: 5px; font-weight: 600;">Silicon Quest Master!</div>
                    </div>
                    
                    <!-- Achievement stars -->
                    <div style="position: absolute; top: 15%; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
                        <div style="color: #ffd700; font-size: 1.5rem; animation: star1 2s infinite;">⭐</div>
                        <div style="color: #ffd700; font-size: 1.5rem; animation: star2 2s infinite 0.3s;">⭐</div>
                        <div style="color: #ffd700; font-size: 1.5rem; animation: star3 2s infinite 0.6s;">⭐</div>
                        <div style="color: #ffd700; font-size: 1.5rem; animation: star4 2s infinite 0.9s;">⭐</div>
                        <div style="color: #ffd700; font-size: 1.5rem; animation: star5 2s infinite 1.2s;">⭐</div>
                    </div>
                    
                    <!-- Fireworks -->
                    <div style="position: absolute; top: 25%; left: 10%; width: 20px; height: 20px; background: radial-gradient(circle, #e53e3e, transparent); border-radius: 50%; animation: firework1 4s infinite;"></div>
                    <div style="position: absolute; top: 40%; right: 15%; width: 25px; height: 25px; background: radial-gradient(circle, #4299e1, transparent); border-radius: 50%; animation: firework2 4s infinite 1s;"></div>
                    <div style="position: absolute; bottom: 30%; left: 25%; width: 18px; height: 18px; background: radial-gradient(circle, #48bb78, transparent); border-radius: 50%; animation: firework3 4s infinite 2s;"></div>
                    <div style="position: absolute; bottom: 20%; right: 30%; width: 22px; height: 22px; background: radial-gradient(circle, #805ad5, transparent); border-radius: 50%; animation: firework4 4s infinite 3s;"></div>
                    
                    <!-- Success message -->
                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: #744210; font-size: 0.8rem; text-align: center; font-weight: bold;">
                        <div>🎓 You've mastered the journey from sand to silicon!</div>
                        <div style="font-size: 0.7rem; margin-top: 2px;">Ready to claim your certificate?</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(celebration);
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
    
    /* New animations for additional visuals */
    @keyframes moltenBubble {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes bubble1 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
        50% { transform: translateY(-10px) scale(1.2); opacity: 0.8; }
    }
    
    @keyframes bubble2 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
        50% { transform: translateY(-8px) scale(1.1); opacity: 0.9; }
    }
    
    @keyframes bubble3 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
        50% { transform: translateY(-12px) scale(1.3); opacity: 0.7; }
    }
    
    @keyframes moltenGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.6); }
        50% { box-shadow: 0 0 40px rgba(255, 107, 53, 0.9); }
    }
    
    @keyframes surfaceTension {
        0%, 100% { transform: translateX(-50%) scaleX(1); }
        50% { transform: translateX(-50%) scaleX(1.1); }
    }
    
    @keyframes crystalGrow {
        0% { height: 60px; }
        50% { height: 80px; }
        100% { height: 60px; }
    }
    
    @keyframes seedCrystal {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.2); }
    }
    
    @keyframes pulling {
        0%, 100% { transform: translateX(-50%) translateY(0px); }
        50% { transform: translateX(-50%) translateY(-5px); }
    }
    
    @keyframes crystalRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes facetShine {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
    }
    
    @keyframes rotationIndicator {
        0% { transform: translateX(-50%) rotate(0deg); opacity: 0.5; }
        100% { transform: translateX(-50%) rotate(360deg); opacity: 0.5; }
    }
    
    @keyframes ingotShine {
        0%, 100% { box-shadow: 0 10px 30px rgba(147, 112, 219, 0.3); }
        50% { box-shadow: 0 15px 40px rgba(147, 112, 219, 0.6); }
    }
    
    @keyframes highlight {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.7; }
    }
    
    @keyframes cuttingLine {
        0% { opacity: 0; transform: scaleX(0); }
        50% { opacity: 1; transform: scaleX(1); }
        100% { opacity: 0; transform: scaleX(0); }
    }
    
    @keyframes sawMovement {
        0%, 100% { transform: translateX(0px); }
        50% { transform: translateX(10px); }
    }
    
    @keyframes waferSlide {
        0% { transform: translateX(0px); opacity: 0; }
        50% { transform: translateX(20px); opacity: 1; }
        100% { transform: translateX(40px); opacity: 0; }
    }
    
    @keyframes polishingRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes waferPolish {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
    }
    
    @keyframes polishingCompound {
        0%, 100% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes polishingPad {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes perfectWafer {
        0%, 100% { box-shadow: 0 0 30px rgba(147, 112, 219, 0.4); }
        50% { box-shadow: 0 0 50px rgba(147, 112, 219, 0.7); }
    }
    
    @keyframes mirrorReflection {
        0%, 100% { opacity: 0.9; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
    }
    
    @keyframes cleanIndicator {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes gateGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(74, 85, 104, 0.5); }
        50% { box-shadow: 0 0 20px rgba(74, 85, 104, 0.8); }
    }
    
    @keyframes outputSignal {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
    
    @keyframes uvLight {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes lightBeam {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.9; }
    }
    
    @keyframes photoresistExposure {
        0%, 100% { background: linear-gradient(to bottom, #48bb78, #38a169); }
        50% { background: linear-gradient(to bottom, #68d391, #48bb78); }
    }
    
    @keyframes exposure {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
    
    @keyframes waferBase {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.9; }
    }
    
    @keyframes individualGate {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes gateOutput {
        0% { opacity: 0.5; width: 8px; }
        50% { opacity: 1; width: 12px; }
        100% { opacity: 0.5; width: 8px; }
    }
    
    @keyframes dataFlow {
        0% { opacity: 0.5; transform: scaleX(0); }
        50% { opacity: 1; transform: scaleX(1); }
        100% { opacity: 0.5; transform: scaleX(0); }
    }
    
    @keyframes aluProcessing {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.02); }
    }
    
    @keyframes controlSignal {
        0% { opacity: 0.5; height: 20px; }
        50% { opacity: 1; height: 25px; }
        100% { opacity: 0.5; height: 20px; }
    }
    
    @keyframes internalGate {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes resultFlow {
        0% { opacity: 0; transform: scaleX(0); }
        50% { opacity: 1; transform: scaleX(1); }
        100% { opacity: 1; transform: scaleX(1); }
    }
    
    @keyframes connectionFlow {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
    }
    
    @keyframes constructionStep {
        0% { opacity: 0.3; transform: translateX(-10px); }
        25% { opacity: 1; transform: translateX(0px); }
        75% { opacity: 1; transform: translateX(0px); }
        100% { opacity: 0.3; transform: translateX(10px); }
    }
    
    @keyframes assemblyArea {
        0%, 100% { border-color: #805ad5; }
        50% { border-color: #9f7aea; }
    }
    
    @keyframes completedALU {
        0%, 75% { opacity: 0; transform: translateY(-50%) scale(0.8); }
        100% { opacity: 1; transform: translateY(-50%) scale(1); }
    }
    
    @keyframes progressDot {
        0%, 75% { opacity: 0.3; transform: scale(1); }
        100% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes tools {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(15deg); }
    }
    
    @keyframes processorPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.02); }
    }
    
    @keyframes dataBus {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
    }
    
    @keyframes clockSignal {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes clockPulse {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
    
    @keyframes activityBlink {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
    }
    
    @keyframes instructionDemo {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes codeBlock {
        0% { opacity: 0.7; transform: translateX(-5px); }
        25% { opacity: 1; transform: translateX(0px); }
        75% { opacity: 1; transform: translateX(0px); }
        100% { opacity: 0.7; transform: translateX(5px); }
    }
    
    @keyframes executionFlow {
        0% { background: linear-gradient(to bottom, #48bb78, transparent); }
        25% { background: linear-gradient(to bottom, #48bb78, #4299e1, transparent); }
        50% { background: linear-gradient(to bottom, #48bb78, #4299e1, #ed8936, transparent); }
        75% { background: linear-gradient(to bottom, #48bb78, #4299e1, #ed8936, #805ad5, transparent); }
        100% { background: linear-gradient(to bottom, #48bb78, #4299e1, #ed8936, #805ad5, #e53e3e); }
    }
    
    @keyframes executionPointer {
        0% { top: 20%; }
        25% { top: 35%; }
        50% { top: 50%; }
        75% { top: 65%; }
        100% { top: 80%; }
    }
    
    @keyframes outputDisplay {
        0%, 75% { opacity: 0; transform: translateY(-50%) scale(0.8); }
        100% { opacity: 1; transform: translateY(-50%) scale(1); }
    }
    
    @keyframes resultBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    @keyframes journeyStep {
        0% { opacity: 0.3; transform: scale(0.9); }
        16.67% { opacity: 1; transform: scale(1); }
        83.33% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.3; transform: scale(0.9); }
    }
    
    @keyframes achievementBadge {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes applicationDemo {
        0% { opacity: 0.6; transform: scale(0.95); }
        25% { opacity: 1; transform: scale(1); }
        75% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.6; transform: scale(0.95); }
    }
    
    @keyframes deviceGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(128, 90, 213, 0.3); }
        50% { box-shadow: 0 0 20px rgba(128, 90, 213, 0.6); }
    }
    
    @keyframes screenActivity {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes satelliteSignal {
        0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    }
    
    @keyframes heartbeat {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
    }
    
    @keyframes rocketThrust {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes thrustFlame {
        0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
        50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
    }
    
    @keyframes confetti1 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(50px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes confetti2 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(60px) rotate(-360deg); opacity: 0; }
    }
    
    @keyframes confetti3 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(40px) rotate(180deg); opacity: 0; }
    }
    
    @keyframes confetti4 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(55px) rotate(-180deg); opacity: 0; }
    }
    
    @keyframes confetti5 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(45px) rotate(270deg); opacity: 0; }
    }
    
    @keyframes confetti6 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(50px) rotate(-270deg); opacity: 0; }
    }
    
    @keyframes celebrationPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
    }
    
    @keyframes trophy {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
    
    @keyframes star1 {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(180deg); }
    }
    
    @keyframes star2 {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(-180deg); }
    }
    
    @keyframes star3 {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.3) rotate(360deg); }
    }
    
    @keyframes star4 {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.15) rotate(-360deg); }
    }
    
    @keyframes star5 {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.25) rotate(180deg); }
    }
    
    @keyframes firework1 {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes firework2 {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.3); }
    }
    
    @keyframes firework3 {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.4); }
    }
    
    @keyframes firework4 {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.6); }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.silicoQuest = new SilicoQuestApp();
});