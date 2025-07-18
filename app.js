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
        this.gameSkipped = false;
        this.currentGameScore = 0;
        this.popupTimeouts = new Map(); // Track popup timeouts to prevent spam
        
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

        // Skip game button
        document.getElementById('skipGameBtn').addEventListener('click', () => {
            this.skipCurrentGame();
        });

        // Audio control
        document.getElementById('muteBtn').addEventListener('click', () => {
            this.toggleAudio();
        });

        // Certificate modal
        document.getElementById('generateCertBtn').addEventListener('click', () => {
            this.generateCertificate();
        });

        document.getElementById('downloadCertBtn').addEventListener('click', () => {
            this.downloadCertificate();
        });

        document.getElementById('printCertBtn').addEventListener('click', () => {
            this.printCertificate();
        });

        document.getElementById('closeCertBtn').addEventListener('click', () => {
            this.closeCertificateModal();
        });

        // Name input for certificate
        document.getElementById('nameInput').addEventListener('input', (e) => {
            const generateBtn = document.getElementById('generateCertBtn');
            if (e.target.value.trim().length > 0) {
                generateBtn.disabled = false;
                generateBtn.style.opacity = '1';
            } else {
                generateBtn.disabled = true;
                generateBtn.style.opacity = '0.5';
            }
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
        
        // Trigger chapter-specific animation
        setTimeout(() => {
        switch (chapterNumber) {
        case 1:
        spawnFallingCrystals();
        break;
        case 2:
        spawnFallingFire();
        break;
        case 3:
        spawnRisingBubbles();
        break;
        case 4:
        spawnFallingSparks();
        break;
        case 5:
        spawnElectricZaps();
        break;
        case 6:
        spawnWireConnections();
        break;
        case 7:
        spawnFallingCode();
        break;
        case 8:
        spawnConfetti();
        break;
        }
        }, 800);

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
            <div style="width: 100%; height: 200px; border-radius: 15px; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: dayNightCycle 20s infinite linear;">
                <!-- Sky -->
                <div style="position: absolute; top: 0; width: 100%; height: 70%; background: linear-gradient(to bottom, #7ecfff 0%, #f0e68c 100%);" class="sky"></div>
                <!-- Atmospheric haze overlay -->
                <div style="position: absolute; top: 0; width: 100%; height: 100%; background: radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.01) 80%); pointer-events:none;"></div>
                <!-- Animated Clouds -->
                <div style="position: absolute; top: 18%; left: -80px; width: 70px; height: 30px; background: #fff; border-radius: 30px; opacity: 0.7; filter: blur(2px); animation: cloudMove1 18s linear infinite;"></div>
                <div style="position: absolute; top: 10%; left: -120px; width: 100px; height: 40px; background: #fff; border-radius: 40px; opacity: 0.5; filter: blur(3px); animation: cloudMove2 22s linear infinite;"></div>
                <!-- Sun -->
                <div style="position: absolute; top: 15%; right: 20%; width: 54px; height: 54px; background: radial-gradient(circle, #ffe066 60%, #ffa500 100%); border-radius: 50%; box-shadow: 0 0 40px #FFD700, 0 0 120px #fff7; animation: sunGlow 5s infinite, sunPath 20s infinite linear;"></div>
                <!-- Shooting Star -->
                <div style="position: absolute; top: 20%; left: -100px; width: 100px; height: 2px; background: linear-gradient(to right, white, transparent); animation: shootingStar 10s infinite linear 5s;"></div>
                <!-- Desert dunes (parallax) -->
                <div style="position: absolute; bottom: 0; width: 100%; height: 44%; background: linear-gradient(180deg, #f4a460 60%, #e2b07a 100%); border-radius: 0 0 15px 15px; box-shadow: 0 -8px 30px #e2b07a88; z-index:1; animation: duneParallax1 18s infinite alternate ease-in-out;" class="sand"></div>
                <div style="position: absolute; bottom: 12%; left: 0; width: 45%; height: 28%; background: linear-gradient(180deg, #deb887 60%, #e2b07a 100%); border-radius: 50% 50% 0 0; transform: scaleX(2); box-shadow: 0 0 30px #deb88788; z-index:2; animation: duneWave 6s infinite alternate, duneParallax2 22s infinite alternate-reverse;"></div>
                <div style="position: absolute; bottom: 8%; right: 0; width: 55%; height: 32%; background: linear-gradient(180deg, #d2b48c 60%, #e2b07a 100%); border-radius: 50% 50% 0 0; transform: scaleX(1.8); box-shadow: 0 0 30px #d2b48c88; z-index:2; animation: duneWave 7s infinite alternate-reverse, duneParallax3 20s infinite alternate;"></div>
                <!-- Animated Cactus -->
                <div style="position: absolute; bottom: 40px; left: 60px; width: 18px; height: 60px; background: #228B22; border-radius: 8px; box-shadow: 0 0 10px #228B22; animation: cactusWiggle 3s infinite alternate; z-index:3;">
                    <div style="position: absolute; left: -10px; top: 20px; width: 10px; height: 25px; background: #228B22; border-radius: 8px 8px 8px 8px  / 8px 8px 8px 8px; transform: rotate(-30deg);"></div>
                    <div style="position: absolute; right: -10px; top: 30px; width: 10px; height: 20px; background: #228B22; border-radius: 8px 8px 8px 8px  / 8px 8px 8px 8px; transform: rotate(30deg);"></div>
                </div>
                <!-- Realistic sand blowing in wind (curved, staggered) -->
                <svg style="position:absolute; bottom:70px; left:40px; width:120px; height:30px; pointer-events:none; z-index:4;" viewBox="0 0 120 30">
                    <path d="M10 10 Q40 0 80 10 Q100 15 110 5" stroke="#fff8" stroke-width="3" fill="none" style="opacity:0.7; animation: sandWindPath 3.5s infinite linear;"/>
                    <path d="M30 20 Q60 10 100 20" stroke="#fff6" stroke-width="2" fill="none" style="opacity:0.5; animation: sandWindPath 4.2s infinite linear 1.2s;"/>
                </svg>
                <svg style="position:absolute; bottom:100px; left:200px; width:80px; height:20px; pointer-events:none; z-index:4;" viewBox="0 0 80 20">
                    <path d="M0 10 Q30 0 80 10" stroke="#fff8" stroke-width="2" fill="none" style="opacity:0.6; animation: sandWindPath 3.8s infinite linear 0.7s;"/>
                </svg>
                <!-- Sand particles -->
                <div style="position: absolute; bottom: 20%; left: 30%; width: 4px; height: 4px; background: #F4A460; border-radius: 50%; animation: sandFloat 3s infinite ease-in-out;"></div>
                <div style="position: absolute; bottom: 25%; left: 60%; width: 3px; height: 3px; background: #DEB887; border-radius: 50%; animation: sandFloat 4s infinite ease-in-out 1s;"></div>
                <div style="position: absolute; bottom: 30%; left: 80%; width: 5px; height: 5px; background: #D2B48C; border-radius: 50%; animation: sandFloat 2.5s infinite ease-in-out 2s;"></div>
                <!-- Magnifying glass zooms in (realistic) -->
                <div id="magnifier" style="position: absolute; left: 60%; bottom: 30px; width: 64px; height: 64px; border-radius: 50%; border: 5px solid #b0b0b0; background: radial-gradient(circle at 30% 30%, #fff8 40%, #fff0 100%), rgba(255,255,255,0.18); box-shadow: 0 0 18px #fff8, 0 0 0 8px #fff2 inset, 0 8px 18px #aaa8; z-index: 10; cursor: pointer; animation: magnifierMove 6s infinite alternate; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <!-- Glass reflection -->
                    <div style="position:absolute; left:10px; top:8px; width:30px; height:10px; background:linear-gradient(90deg,#fff8,#fff0); border-radius:8px; opacity:0.5; transform:rotate(-18deg);"></div>
                    <!-- Revealed quartz crystals under magnifier -->
                    <div style="width: 32px; height: 32px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD 80%, #fff 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalShimmer 2.2s infinite; position: absolute; left: 12px; top: 12px; box-shadow: 0 0 18px #fff8;"></div>
                    <div style="width: 18px; height: 18px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD 80%, #fff 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalShimmer 2.2s infinite 0.7s; position: absolute; left: 30px; top: 28px; box-shadow: 0 0 8px #fff8;"></div>
                    <div style="position: absolute; left: 22px; top: 2px; color: #FFD700; font-size: 1.3rem; animation: sparkleFloat 1.5s infinite;">✨</div>
                </div>
                <!-- Quartz crystals scattered (background, not under magnifier) -->
                <div style="position: absolute; bottom: 15%; left: 25%; width: 20px; height: 20px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalSparkle 1.5s infinite;"></div>
                <div style="position: absolute; bottom: 12%; right: 35%; width: 15px; height: 15px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalSparkle 1.5s infinite 0.5s;"></div>
                <!-- Sparkle effects -->
                <div style="position: absolute; bottom: 50px; left: 120px; color: #FFD700; font-size: 1.2rem; animation: sparkleFloat 1.5s infinite;">✨</div>
                <div style="position: absolute; bottom: 80px; right: 100px; color: #FFD700; font-size: 1rem; animation: sparkleFloat 1.5s infinite 0.7s;">✨</div>
                <div style="position: absolute; bottom: 30px; left: 200px; color: #FFD700; font-size: 1.4rem; animation: sparkleFloat 1.5s infinite 1.4s;">✨</div>
                <!-- Desert text -->
                <div style="position: absolute; top: 10px; left: 10px; color: #8B4513; font-weight: bold; font-size: 0.9rem; text-shadow: 1px 1px 2px rgba(255,255,255,0.5); letter-spacing: 1px; animation: desertTextGlow 2s infinite alternate;">🏜️ Desert</div>
                <!-- Additional cool elements: Oasis -->
                <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 80px; height: 40px; background: radial-gradient(circle, #00BFFF 20%, transparent 70%); border-radius: 50% 50% 0 0; opacity: 0.8; animation: oasisRipple 3s infinite;">
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 10px; height: 20px; background: #228B22; border-radius: 5px;"></div>
                </div>
            </div>
        `;
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sunGlow {
                0%, 100% { box-shadow: 0 0 40px #FFD700, 0 0 120px #fff7; transform: scale(1); }
                50% { box-shadow: 0 0 70px #FFD700, 0 0 180px #FFA500, 0 0 120px #fff7; transform: scale(1.1); }
            }
            @keyframes sandFloat {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-20px) translateX(10px) rotate(180deg); opacity: 1; }
            }
            @keyframes sandWindPath {
                0% { opacity: 0.7; stroke-dashoffset: 0; }
                80% { opacity: 0.7; }
                100% { opacity: 0; stroke-dashoffset: 120; }
            }
            @keyframes crystalSparkle {
                0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
                50% { opacity: 1; transform: scale(1.15) rotate(10deg); box-shadow: 0 0 20px rgba(221, 160, 221, 0.9); }
            }
            @keyframes crystalShimmer {
                0%, 100% { filter: brightness(1) drop-shadow(0 0 0 #fff); }
                40% { filter: brightness(1.2) drop-shadow(0 0 8px #fff8); }
                60% { filter: brightness(1.5) drop-shadow(0 0 18px #fff); }
                80% { filter: brightness(1.2) drop-shadow(0 0 8px #fff8); }
            }
            @keyframes dayNightCycle {
                0%, 100% { background-color: #87CEEB; }
                50% { background-color: #000033; }
            }
            .sky { animation: skyColor 20s infinite linear; }
            @keyframes skyColor {
                0%, 100% { background: linear-gradient(to bottom, #7ecfff 0%, #f0e68c 100%); }
                50% { background: linear-gradient(to bottom, #000033, #1a1a4a); }
            }
            .sand { animation: sandColor 20s infinite linear; }
            @keyframes sandColor {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(0.4); }
            }
            @keyframes sunPath {
                0%, 100% { top: 15%; right: 20%; opacity: 1; }
                25% { top: 5%; right: 50%; opacity: 1; }
                50% { top: 15%; right: 80%; opacity: 0; }
                75% { top: 50%; right: 50%; opacity: 0; }
            }
            @keyframes shootingStar {
                0% { transform: translateX(0) translateY(0); opacity: 1; }
                100% { transform: translateX(400px) translateY(100px); opacity: 0; }
            }
            @keyframes cloudMove1 {
                0% { left: -80px; }
                100% { left: 100%; }
            }
            @keyframes cloudMove2 {
                0% { left: -120px; }
                100% { left: 100%; }
            }
            @keyframes duneWave {
                0% { transform: scaleX(2) translateY(0); }
                100% { transform: scaleX(2) translateY(-8px); }
            }
            @keyframes duneParallax1 {
                0% { transform: translateX(0); }
                100% { transform: translateX(18px); }
            }
            @keyframes duneParallax2 {
                0% { transform: scaleX(2) translateY(0) translateX(0); }
                100% { transform: scaleX(2) translateY(-8px) translateX(12px); }
            }
            @keyframes duneParallax3 {
                0% { transform: scaleX(1.8) translateY(0) translateX(0); }
                100% { transform: scaleX(1.8) translateY(-8px) translateX(-12px); }
            }
            @keyframes cactusWiggle {
                0% { transform: rotate(-2deg); }
                100% { transform: rotate(2deg); }
            }
            @keyframes sparkleFloat {
                0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.8; }
                50% { transform: translateY(-15px) rotate(200deg) scale(1.2); opacity: 1; }
            }
            @keyframes desertTextGlow {
                0% { text-shadow: 1px 1px 2px #fff, 0 0 8px #FFD700; }
                100% { text-shadow: 2px 2px 8px #FFD700, 0 0 16px #FFA500; }
            }
            @keyframes magnifierMove {
                0% { left: 60%; bottom: 30px; }
                40% { left: 60%; bottom: 30px; }
                60% { left: 40%; bottom: 60px; }
                100% { left: 40%; bottom: 60px; }
            }
            @keyframes oasisRipple {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(scene.firstElementChild);
    }

    createQuartzCrystal(container) {
        const crystal = document.createElement('div');
        crystal.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: radial-gradient(circle, rgba(230, 230, 250, 0.1), transparent); border-radius: 15px; position: relative; perspective: 1000px;">
                <!-- Main crystal structure -->
                <div style="position: relative; display: flex; align-items: center; justify-content: center; transform-style: preserve-3d; animation: rotateCrystal 20s infinite linear;">
                    <!-- Central crystal -->
                    <div style="width: 60px; height: 100px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); clip-path: polygon(50% 0%, 20% 30%, 0% 100%, 100% 100%, 80% 30%); animation: crystalPulse 2.5s infinite; box-shadow: 0 0 50px rgba(147, 112, 219, 0.8); position: relative; z-index: 2;">
                        <!-- Crystal facets -->
                        <div style="position: absolute; top: 20%; left: 20%; width: 60%; height: 40%; background: rgba(255,255,255,0.5); clip-path: polygon(0% 0%, 100% 20%, 80% 100%, 0% 80%); animation: facetShimmer 1.5s infinite;"></div>
                        <div style="position: absolute; top: 40%; right: 10%; width: 30%; height: 50%; background: rgba(255,255,255,0.4); clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%); animation: facetShimmer 1.5s infinite 0.5s;"></div>
                    </div>
                    
                    <!-- Smaller crystals around -->
                    <div style="position: absolute; left: -35px; top: 25px; width: 25px; height: 40px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalPulse 2.5s infinite 0.5s; opacity: 0.8; transform: rotateY(45deg) translateZ(20px);"></div>
                    <div style="position: absolute; right: -30px; top: 35px; width: 20px; height: 35px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalPulse 2.5s infinite 1s; opacity: 0.7; transform: rotateY(-45deg) translateZ(20px);"></div>
                    <div style="position: absolute; left: -20px; bottom: 15px; width: 18px; height: 30px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: crystalPulse 2.5s infinite 1.5s; opacity: 0.6; transform: rotateY(30deg) translateZ(30px);"></div>
                </div>
                
                <!-- Energy emanation -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 160px; height: 160px; border: 2px solid rgba(147, 112, 219, 0.4); border-radius: 50%; animation: energyRing 3s infinite linear;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 220px; height: 220px; border: 1px solid rgba(147, 112, 219, 0.3); border-radius: 50%; animation: energyRing 3s infinite linear 1s;"></div>
                
                <!-- Sparkle effects -->
                <div style="position: absolute; top: 20%; left: 20%; color: #FFD700; font-size: 1.2rem; animation: sparkleFloat 1.5s infinite;">✨</div>
                <div style="position: absolute; top: 30%; right: 25%; color: #FFD700; font-size: 1rem; animation: sparkleFloat 1.5s infinite 0.7s;">✨</div>
                <div style="position: absolute; bottom: 25%; left: 30%; color: #FFD700; font-size: 1.4rem; animation: sparkleFloat 1.5s infinite 1.4s;">✨</div>
                
                <!-- Information label -->
                <div style="position: absolute; bottom: 10px; left:100px; background: rgba(0,0,0,0.8); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.8rem; text-align: center; backdrop-filter: blur(5px);">
                    <div>💎 Pure Quartz Crystal</div>
                    <div style="font-size: 0.7rem; opacity: 0.8;">SiO₂ - Silicon Dioxide</div>
                </div>
            </div>
        `;
        
        // Add crystal-specific animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rotateCrystal {
                0% { transform: rotateY(0deg) rotateX(10deg); }
                100% { transform: rotateY(360deg) rotateX(10deg); }
            }
            @keyframes crystalPulse {
                0%, 100% { 
                    transform: scale(1); 
                    box-shadow: 0 0 40px rgba(147, 112, 219, 0.6); 
                }
                50% { 
                    transform: scale(1.08); 
                    box-shadow: 0 0 70px rgba(147, 112, 219, 1), 0 0 90px rgba(221, 160, 221, 0.7); 
                }
            }
            @keyframes facetShimmer {
                0%, 100% { opacity: 0.4; transform: skewX(-10deg); }
                50% { opacity: 0.8; transform: skewX(10deg); }
            }
            @keyframes energyRing {
                0% { 
                    transform: translate(-50%, -50%) scale(0.7); 
                    opacity: 0.9; 
                }
                100% { 
                    transform: translate(-50%, -50%) scale(1.3); 
                    opacity: 0; 
                }
            }
            @keyframes sparkleFloat {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg) scale(1); 
                    opacity: 0.8; 
                }
                50% { 
                    transform: translateY(-15px) rotate(200deg) scale(1.2); 
                    opacity: 1; 
                }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(crystal);
    }

    createRockCollection(container) {
        const rocks = document.createElement('div');
        rocks.innerHTML = `
            <div style="display: flex; justify-content: space-around; align-items: center; height: 200px; flex-wrap: wrap; background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(160, 82, 45, 0.1)); border-radius: 15px; padding: 20px; position: relative;">
                <!-- Ground/surface -->
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 30px; background: linear-gradient(to top, #8B4513, transparent); border-radius: 0 0 15px 15px;"></div>
                
                <!-- Regular rocks -->
                <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 45px; height: 45px; background: radial-gradient(circle at 30% 30%, #A0522D, #8B4513); border-radius: 60% 40% 40% 60%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: rockFloat 4s infinite;">
                        <div style="position: absolute; top: 15%; left: 20%; width: 8px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: #8B4513; margin-top: 5px; font-weight: bold;">Sandstone</div>
                </div>
                
                <!-- Quartz crystal 1 -->
                <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 35px; height: 50px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); clip-path: polygon(50% 0%, 20% 30%, 0% 100%, 100% 100%, 80% 30%); animation: quartzGlow 2s infinite; box-shadow: 0 0 20px rgba(147, 112, 219, 0.6); position: relative;">
                        <div style="position: absolute; top: 20%; left: 25%; width: 50%; height: 30%; background: rgba(255,255,255,0.4); clip-path: polygon(0% 0%, 100% 20%, 80% 100%, 0% 80%);"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: #9370DB; margin-top: 5px; font-weight: bold;">✨ Quartz</div>
                </div>
                
                <!-- Regular rock 2 -->
                <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 40px; height: 40px; background: radial-gradient(circle at 40% 20%, #696969, #2F4F4F); border-radius: 50% 60% 40% 50%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: rockFloat 4s infinite 1s;">
                        <div style="position: absolute; top: 25%; right: 20%; width: 6px; height: 6px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: #696969; margin-top: 5px; font-weight: bold;">Granite</div>
                </div>
                
                <!-- Regular rock 3 -->
                <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 48px; height: 42px; background: radial-gradient(circle at 25% 35%, #CD853F, #A0522D); border-radius: 40% 60% 50% 40%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: rockFloat 4s infinite 2s;">
                        <div style="position: absolute; top: 30%; left: 15%; width: 10px; height: 5px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: #CD853F; margin-top: 5px; font-weight: bold;">Limestone</div>
                </div>
                
                <!-- Quartz crystal 2 -->
                <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 30px; height: 45px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB); clip-path: polygon(50% 0%, 15% 35%, 0% 100%, 100% 100%, 85% 35%); animation: quartzGlow 2s infinite 0.5s; box-shadow: 0 0 20px rgba(147, 112, 219, 0.6); position: relative;">
                        <div style="position: absolute; top: 25%; right: 20%; width: 40%; height: 25%; background: rgba(255,255,255,0.3); clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%);"></div>
                    </div>
                    <div style="font-size: 0.7rem; color: #9370DB; margin-top: 5px; font-weight: bold;">✨ Quartz</div>
                </div>
                
                <!-- Instruction text -->
                <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 10px; font-size: 0.8rem; text-align: center;">
                    🔍 Find the Quartz Crystals!
                </div>
            </div>
        `;
        
        // Add rock collection animations
        const style = document.createElement('style');
        style.textContent = `
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
        `;
        document.head.appendChild(style);
        container.appendChild(rocks);
    }

    createFurnaceExterior(container) {
        const furnace = document.createElement('div');
        furnace.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 220px;">
                <div style="width: 180px; height: 180px; background: linear-gradient(180deg, #444 60%, #222 100%); border-radius: 18px 18px 30px 30px/22px 22px 40px 40px; position: relative; box-shadow: 0 10px 40px #0008, 0 0 0 6px #ff000033 inset; overflow: visible;">
                    <!-- Glowing pipes -->
                    <div style="position: absolute; left: -30px; top: 40px; width: 30px; height: 18px; background: linear-gradient(90deg, #ff4e00 60%, #fff0 100%); border-radius: 12px 0 0 12px; box-shadow: 0 0 18px #ff4e00, 0 0 8px #fff8; animation: pipeGlow 2s infinite alternate;"></div>
                    <div style="position: absolute; right: -30px; top: 80px; width: 30px; height: 18px; background: linear-gradient(270deg, #ff4e00 60%, #fff0 100%); border-radius: 0 12px 12px 0; box-shadow: 0 0 18px #ff4e00, 0 0 8px #fff8; animation: pipeGlow 2s infinite alternate 1s;"></div>
                    <!-- Glowing valves -->
                    <div style="position: absolute; left: 10px; top: 20px; width: 22px; height: 22px; background: radial-gradient(circle, #ff4e00 60%, #fff0 100%); border-radius: 50%; box-shadow: 0 0 18px #ff4e00, 0 0 8px #fff8; animation: valveGlow 1.5s infinite alternate;"></div>
                    <div style="position: absolute; right: 10px; top: 120px; width: 22px; height: 22px; background: radial-gradient(circle, #ff4e00 60%, #fff0 100%); border-radius: 50%; box-shadow: 0 0 18px #ff4e00, 0 0 8px #fff8; animation: valveGlow 1.5s infinite alternate 0.7s;"></div>
                    <!-- Furnace body details -->
                    <div style="position: absolute; left: 50%; top: 60px; transform: translateX(-50%); width: 120px; height: 80px; background: linear-gradient(180deg, #ff4e00 60%, #ffb300 100%); border-radius: 60px 60px 40px 40px/40px 40px 60px 60px; box-shadow: 0 0 40px #ff4e00, 0 0 80px #ffb300; opacity: 0.7; filter: blur(2px); animation: coreGlow 2.5s infinite alternate;"></div>
                    <!-- Steam -->
                    <div style="position: absolute; left: 30px; top: -30px; width: 30px; height: 40px; z-index: 2;">
                        <div style="position: absolute; left: 0; top: 0; width: 30px; height: 40px; background: radial-gradient(circle, #fff8 60%, #fff0 100%); border-radius: 50%; opacity: 0.7; animation: steamRise 2.2s infinite;"></div>
                    </div>
                    <div style="position: absolute; right: 30px; top: -20px; width: 24px; height: 32px; z-index: 2;">
                        <div style="position: absolute; left: 0; top: 0; width: 24px; height: 32px; background: radial-gradient(circle, #fff8 60%, #fff0 100%); border-radius: 50%; opacity: 0.5; animation: steamRise 2.7s infinite 1.1s;"></div>
                    </div>
                    <!-- Flames -->
                    <div style="position: absolute; left: 50%; bottom: -18px; transform: translateX(-50%); width: 60px; height: 38px; z-index: 3;">
                        <div style="position: absolute; left: 0; bottom: 0; width: 60px; height: 38px; background: radial-gradient(ellipse at 50% 80%, #ffb300 60%, #ff4e00 100%, #fff0 100%); border-radius: 50% 50% 60% 60%/60% 60% 100% 100%; opacity: 0.8; animation: flameFlicker 1.2s infinite alternate;"></div>
                        <div style="position: absolute; left: 18px; bottom: 8px; width: 24px; height: 18px; background: radial-gradient(ellipse at 50% 80%, #fff8 60%, #ffb300 100%, #fff0 100%); border-radius: 50% 50% 60% 60%/60% 60% 100% 100%; opacity: 0.7; animation: flameFlicker 1.5s infinite alternate 0.5s;"></div>
                    </div>
                    <!-- Sci-fi details -->
                    <div style="position: absolute; left: 50%; top: 10px; transform: translateX(-50%); color: #fff; font-size: 1.5rem; opacity: 0.15;">⚙️</div>
                    <div style="position: absolute; left: 50%; top: 30px; transform: translateX(-50%); color: #fff; font-size: 1.2rem; opacity: 0.12;">🔩</div>
                </div>
            </div>
        `;
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pipeGlow {
                0% { filter: brightness(1); }
                100% { filter: brightness(1.5) drop-shadow(0 0 12px #ff4e00); }
            }
            @keyframes valveGlow {
                0% { filter: brightness(1); }
                100% { filter: brightness(1.7) drop-shadow(0 0 18px #ff4e00); }
            }
            @keyframes coreGlow {
                0% { opacity: 0.7; filter: blur(2px) brightness(1); }
                100% { opacity: 1; filter: blur(3px) brightness(1.3); }
            }
            @keyframes steamRise {
                0% { opacity: 0.7; transform: translateY(0) scale(1); }
                60% { opacity: 0.5; transform: translateY(-20px) scale(1.1); }
                100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
            }
            @keyframes flameFlicker {
                0% { filter: brightness(1) blur(0px); }
                50% { filter: brightness(1.3) blur(1.5px); }
                100% { filter: brightness(1.1) blur(0.5px); }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(furnace);
    }

    createFurnaceInterior(container) {
        const interior = document.createElement('div');
        interior.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 220px; background: linear-gradient(180deg, #2d3748 60%, #8B0000 100%); border-radius: 18px; position: relative; overflow: visible;">
                <!-- Furnace cutaway body -->
                <div style="position: relative; width: 140px; height: 140px; background: linear-gradient(180deg, #444 60%, #222 100%); border-radius: 18px 18px 40px 40px/22px 22px 60px 60px; box-shadow: 0 10px 40px #0008, 0 0 0 6px #ff000033 inset; overflow: visible;">
                    <!-- Molten silicon pool -->
                    <div style="position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); width: 90px; height: 32px; background: radial-gradient(ellipse at 50% 60%, #FFD700 60%, #FF4500 100%); border-radius: 50px 50px 40px 40px/30px 30px 60px 60px; box-shadow: 0 0 40px #FFD700, 0 0 80px #FF4500; opacity: 0.85; filter: blur(0.5px);"></div>
                    <!-- Quartz chunk falling -->
                    <div style="position: absolute; left: 45px; top: 10px; width: 22px; height: 22px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD 80%, #fff 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); box-shadow: 0 0 8px #fff8; animation: dropQuartz 2.5s infinite;"></div>
                    <!-- Carbon chunk falling -->
                    <div style="position: absolute; left: 75px; top: 0px; width: 18px; height: 18px; background: linear-gradient(135deg, #444, #222 80%, #fff2 100%); border-radius: 6px; box-shadow: 0 0 6px #0008; animation: dropCarbon 2.5s infinite 1.2s;"></div>
                    <!-- Reaction sparks -->
                    <div style="position: absolute; left: 50%; bottom: 38px; transform: translateX(-50%); width: 60px; height: 30px; pointer-events:none;">
                        <div style="position: absolute; left: 10px; bottom: 0; width: 8px; height: 8px; background: radial-gradient(circle, #FFD700 60%, #FF4500 100%); border-radius: 50%; opacity: 0.8; animation: spark 1.2s infinite alternate;"></div>
                        <div style="position: absolute; left: 30px; bottom: 8px; width: 6px; height: 6px; background: radial-gradient(circle, #FFD700 60%, #FF4500 100%); border-radius: 50%; opacity: 0.7; animation: spark 1.5s infinite alternate 0.5s;"></div>
                        <div style="position: absolute; left: 20px; bottom: 12px; width: 5px; height: 5px; background: radial-gradient(circle, #FFD700 60%, #FF4500 100%); border-radius: 50%; opacity: 0.6; animation: spark 1.1s infinite alternate 0.8s;"></div>
                    </div>
                    <!-- Impurities escaping as smoke/gas -->
                    <div style="position: absolute; left: 60px; top: -30px; width: 24px; height: 40px; z-index: 2;">
                        <div style="position: absolute; left: 0; top: 0; width: 24px; height: 40px; background: radial-gradient(circle, #fff8 60%, #fff0 100%); border-radius: 50%; opacity: 0.7; animation: smokeRise 2.2s infinite;"></div>
                        <div style="position: absolute; left: 8px; top: 10px; width: 12px; height: 24px; background: radial-gradient(circle, #b0b0b0 60%, #fff0 100%); border-radius: 50%; opacity: 0.5; animation: smokeRise 2.7s infinite 1.1s;"></div>
                    </div>
                    <!-- Furnace wall (cutaway effect) -->
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; border: 4px solid #ff4e00; border-radius: 18px 18px 40px 40px/22px 22px 60px 60px; box-sizing: border-box; opacity: 0.3;"></div>
                </div>
                <!-- Labels -->
                <div style="position: absolute; left: 30px; top: 0px; color: #fff; font-size: 0.8rem; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 2px 8px;">Quartz</div>
                <div style="position: absolute; left: 100px; top: -10px; color: #fff; font-size: 0.8rem; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 2px 8px;">Carbon</div>
                <div style="position: absolute; left: 60px; top: -40px; color: #fff; font-size: 0.8rem; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 2px 8px;">Impurities</div>
            </div>
        `;
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dropQuartz {
                0% { top: 10px; opacity: 1; }
                30% { top: 60px; opacity: 1; }
                40% { top: 80px; opacity: 0.7; }
                100% { top: 80px; opacity: 0; }
            }
            @keyframes dropCarbon {
                0% { top: 0px; opacity: 1; }
                30% { top: 50px; opacity: 1; }
                40% { top: 80px; opacity: 0.7; }
                100% { top: 80px; opacity: 0; }
            }
            @keyframes spark {
                0% { opacity: 0.8; filter: blur(0px); }
                50% { opacity: 1; filter: blur(1.5px) brightness(1.5); }
                100% { opacity: 0.5; filter: blur(0.5px); }
            }
            @keyframes smokeRise {
                0% { opacity: 0.7; transform: translateY(0) scale(1); }
                60% { opacity: 0.5; transform: translateY(-20px) scale(1.1); }
                100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(interior);
    }

    createControlPanel(container) {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="width: 100%; height: 220px; background: linear-gradient(135deg, #232b3a, #3a4660 80%, #1a202c 100%); border-radius: 18px; position: relative; padding: 24px; box-shadow: 0 2px 18px #0008, 0 0 0 6px #48bb7833 inset; overflow: visible;">
                <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 100%;">
                    <!-- Temperature Gauge (animated) -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 60px; height: 100px; background: #181e2a; border-radius: 16px; position: relative; border: 2px solid #48bb78; box-shadow: 0 0 18px #48bb7888; overflow: hidden;">
                            <div style="position: absolute; left: 18px; top: 10px; width: 24px; height: 80px; background: #222; border-radius: 12px; border: 1px solid #48bb78; box-shadow: 0 0 8px #48bb78; overflow: hidden;">
                                <div class="tempBar" style="position: absolute; left: 0; bottom: 0; width: 100%; height: 60%; background: linear-gradient(to top, #e53e3e, #ffb300 60%, #48bb78 100%); border-radius: 0 0 12px 12px; box-shadow: 0 0 12px #e53e3e; animation: tempBarRise 4s infinite alternate;"></div>
                                <div class="tempBarOverlay" style="position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; pointer-events:none;"></div>
                            </div>
                            <div style="position: absolute; left: 50%; top: 0; transform: translateX(-50%); color: #fff; font-size: 0.7rem;">TEMP</div>
                        </div>
                        <span style="color: #48bb78; font-size: 0.9rem; margin-top: 8px; font-family: monospace;">Temperature</span>
                    </div>
                    <!-- Pressure Gauge (dial) -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 70px; height: 70px; border: 3px solid #48bb78; border-radius: 50%; position: relative; background: #181e2a; box-shadow: 0 0 12px #48bb7888;">
                            <div class="pressureNeedle" style="position: absolute; top: 50%; left: 50%; width: 4px; height: 28px; background: linear-gradient(180deg, #48bb78 60%, #fff0 100%); border-radius: 2px; transform-origin: bottom; transform: translate(-50%, -100%) rotate(45deg); animation: pressureNeedleMove 4s infinite alternate;"></div>
                            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: #48bb78; border-radius: 50%; box-shadow: 0 0 8px #48bb78; border: 2px solid #fff2;"></div>
                        </div>
                        <span style="color: #48bb78; font-size: 0.9rem; margin-top: 8px; font-family: monospace;">Pressure</span>
                    </div>
                    <!-- Futuristic Buttons -->
                    <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #48bb78, #38a169); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 18px #48bb78; animation: controlBlink 1.5s infinite; cursor: pointer;">
                            <span style="color: white; font-weight: bold; font-size: 1.1rem;">ON</span>
                        </div>
                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #e53e3e, #ffb300); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0.5; box-shadow: 0 0 8px #e53e3e; cursor: pointer;">
                            <span style="color: white; font-weight: bold; font-size: 1.1rem;">OFF</span>
                        </div>
                    </div>
                    <!-- Status Display -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 100px; height: 48px; background: #181e2a; border: 2px solid #48bb78; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: monospace; box-shadow: 0 0 8px #48bb78;">
                            <span class="statusText" style="color: #48bb78; font-size: 1.1rem; animation: statusBlink 2s infinite;">ACTIVE</span>
                        </div>
                        <span style="color: #48bb78; font-size: 0.9rem; margin-top: 8px; font-family: monospace;">Status</span>
                    </div>
                </div>
                <!-- Animated warning lights -->
                <div style="position: absolute; top: 18px; right: 24px; display: flex; gap: 10px;">
                    <div class="warningLightHot" style="width: 18px; height: 18px; background: #e53e3e; border-radius: 50%; box-shadow: 0 0 18px #e53e3e; animation: warningHot 4s infinite;"></div>
                    <div class="warningLightCold" style="width: 18px; height: 18px; background: #4299e1; border-radius: 50%; box-shadow: 0 0 18px #4299e1; animation: warningCold 4s infinite 2s;"></div>
                </div>
            </div>
        `;
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tempBarRise {
                0% { height: 30%; background: linear-gradient(to top, #4299e1, #48bb78 60%, #ffb300 100%); }
                40% { height: 60%; background: linear-gradient(to top, #e53e3e, #ffb300 60%, #48bb78 100%); }
                60% { height: 90%; background: linear-gradient(to top, #e53e3e, #ffb300 60%, #48bb78 100%); }
                80% { height: 60%; background: linear-gradient(to top, #e53e3e, #ffb300 60%, #48bb78 100%); }
                100% { height: 30%; background: linear-gradient(to top, #4299e1, #48bb78 60%, #ffb300 100%); }
            }
            @keyframes pressureNeedleMove {
                0% { transform: translate(-50%, -100%) rotate(30deg); }
                50% { transform: translate(-50%, -100%) rotate(90deg); }
                100% { transform: translate(-50%, -100%) rotate(45deg); }
            }
            @keyframes controlBlink {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.5) drop-shadow(0 0 12px #48bb78); }
            }
            @keyframes statusBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            @keyframes warningHot {
                0%, 60%, 100% { opacity: 0.2; filter: blur(0px); }
                20%, 40% { opacity: 1; filter: blur(2px) brightness(1.5); }
            }
            @keyframes warningCold {
                0%, 60%, 100% { opacity: 0.2; filter: blur(0px); }
                20%, 40% { opacity: 1; filter: blur(2px) brightness(1.5); }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(panel);
    }

    createMoltenSilicon(container) {
        const molten = document.createElement('div');
        molten.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 220px; background: linear-gradient(180deg, #2d3748 60%, #8B0000 100%); border-radius: 18px; position: relative; overflow: visible;">
                <!-- Crucible -->
                <div style="position: relative; width: 140px; height: 140px; background: linear-gradient(180deg, #444 60%, #222 100%); border-radius: 50% 50% 40px 40px/50% 50% 60px 60px; box-shadow: 0 10px 40px #0008, 0 0 0 6px #ff000033 inset; overflow: visible;">
                    <!-- Molten silicon bath with reflections -->
                    <div style="position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); width: 100px; height: 38px; background: radial-gradient(ellipse at 50% 60%, #FFD700 60%, #FF6B35 100%, #FF4500 100%); border-radius: 50px 50px 40px 40px/30px 30px 60px 60px; box-shadow: 0 0 40px #FFD700, 0 0 80px #FF4500; opacity: 0.95; filter: blur(0.5px); z-index:2;"></div>
                    <!-- Reflections -->
                    <div style="position: absolute; left: 60px; bottom: 38px; width: 30px; height: 10px; background: linear-gradient(90deg, #fff8 60%, #fff0 100%); border-radius: 8px; opacity: 0.5; filter: blur(1px); z-index:3; animation: reflectionMove 3s infinite alternate;"></div>
                    <!-- Robotic arm dipping seed crystal -->
                    <div style="position: absolute; left: 50%; top: 0; transform: translateX(-50%); width: 16px; height: 110px; z-index: 4;">
                        <!-- Arm -->
                        <div style="position: absolute; left: 6px; top: 0; width: 4px; height: 80px; background: linear-gradient(180deg, #bbb 60%, #888 100%); border-radius: 2px; box-shadow: 0 0 8px #fff8; animation: armDip 4s infinite alternate;"></div>
                        <!-- Seed crystal -->
                        <div style="position: absolute; left: 0px; top: 80px; width: 16px; height: 24px; background: linear-gradient(45deg, #E6E6FA, #DDA0DD 80%, #fff 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); box-shadow: 0 0 8px #fff8; animation: seedDip 4s infinite alternate;"></div>
                    </div>
                </div>
                <!-- Temperature label -->
                <div style="position: absolute; top: 18px; left: 50%; transform: translateX(-50%); color: #fff; font-weight: bold; text-shadow: 2px 2px 4px #0008; font-size: 1.1rem; background: rgba(0,0,0,0.4); border-radius: 8px; padding: 4px 16px;">🌡️ 1414°C</div>
            </div>
        `;
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes reflectionMove {
                0% { left: 60px; opacity: 0.5; }
                100% { left: 80px; opacity: 0.8; }
            }
            @keyframes armDip {
                0% { height: 60px; }
                100% { height: 80px; }
            }
            @keyframes seedDip {
                0% { top: 60px; }
                100% { top: 80px; }
            }
        `;
        document.head.appendChild(style);
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
                
                <div style="position: absolute; top: 10px; left: 100px; color: #E6E6FA; font-size: 0.8rem; text-align: right;">
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
                <div style="position: absolute; top: 10px; left: 100px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px; color: white; font-size: 0.8rem;">
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
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; width: 450px background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative;">
                <div style="position: relative; perspective: 800px;">
                    <!-- Silicon ingot being sliced -->
                    <div style="width: 60px; height: 120px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 30px; position: relative; transform-style: preserve-3d; animation: rotateIngot 10s infinite linear;">
                        <!-- Cutting lines -->
                        <div style="position: absolute; top: 20%; left: -10px; right: -10px; height: 2px; background: #FFD700; box-shadow: 0 0 12px #FFD700; animation: cuttingLine 2.5s infinite;"></div>
                        <div style="position: absolute; top: 35%; left: -10px; right: -10px; height: 2px; background: #FFD700; box-shadow: 0 0 12px #FFD700; animation: cuttingLine 2.5s infinite 0.4s;"></div>
                        <div style="position: absolute; top: 50%; left: -10px; right: -10px; height: 2px; background: #FFD700; box-shadow: 0 0 12px #FFD700; animation: cuttingLine 2.5s infinite 0.8s;"></div>
                        <div style="position: absolute; top: 65%; left: -10px; right: -10px; height: 2px; background: #FFD700; box-shadow: 0 0 12px #FFD700; animation: cuttingLine 2.5s infinite 1.2s;"></div>
                        <div style="position: absolute; top: 80%; left: -10px; right: -10px; height: 2px; background: #FFD700; box-shadow: 0 0 12px #FFD700; animation: cuttingLine 2.5s infinite 1.6s;"></div>
                    </div>
                    
                    <!-- Laser beam -->
                    <div style="position: absolute; left: -100px; top: 50%; width: 200px; height: 4px; background: linear-gradient(to right, transparent, #ff00ff, transparent); animation: laserBeam 2s infinite;"></div>

                    <!-- Sliced wafers -->
                    <div style="position: absolute; right: -120px; top: 20%; display: flex; flex-direction: column; gap: 5px; animation: floatWafers 5s infinite ease-in-out;">
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3.5s infinite;"></div>
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3.5s infinite 0.6s;"></div>
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3.5s infinite 1.2s;"></div>
                        <div style="width: 50px; height: 8px; background: linear-gradient(to right, #E6E6FA, #DDA0DD); border-radius: 25px; animation: waferSlide 3.5s infinite 1.8s;"></div>
                    </div>
                </div>
                
                <div style="position: absolute; bottom: 10px; right: 150px; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 5px;">
                    <div>💎 Diamond Wire Saw</div>
                    <div font-size: 0.7rem; margin-top: 2px;">⚡ 0.1mm thickness</div>
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
                
                <div style="position: absolute; bottom: 10px; left: 180px; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 5px;">
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
                    <div style="position: absolute; left: 180px; top: 50%; transform: translateY(-50%); background: #2d3748; padding: 10px; border-radius: 8px; font-size: 0.8rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <div style="color: #48bb78; font-weight: bold;">✅ Quality Check</div>
                        <div style="margin-top: 5px; color: #eff0f2ff;">
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
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #2d3748, #4a5568); border-radius: 15px; position: relative;">
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
                
                <div style="position: absolute; top: 10px; left: 180px; color: white; font-size: 0.8rem; background: rgba(0,0,0,0.7); padding: 8px; border-radius: 5px;">
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
            <div style="display: flex; justify-content: center; align-items: center; height: 250px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative; padding: 20px; perspective: 1000px;">
                <div style="position: relative; width: 100%; height: 100%; transform-style: preserve-3d; animation: rotateScene 30s infinite linear;">
                    <!-- Input A -->
                    <div style="position: absolute; left: 40px; top: 25%; color: #079442ff; font-size: 0.9rem; font-weight: bold; transform: translateZ(50px);">
                        A: 1011
                        <div style="width: 40px; height: 3px; background: #079442ff; margin-top: 5px; animation: dataFlow 2.5s infinite;"></div>
                    </div>
                    
                    <!-- Input B -->
                    <div style="position: absolute; left: 40px; bottom: 30%; color: #095694ff; font-size: 0.9rem; font-weight: bold; transform: translateZ(50px);">
                        B: 0110
                        <div style="width: 40px; height: 3px; background: #095694ff; margin-top: 5px; animation: dataFlow 2.5s infinite 0.5s;"></div>
                    </div>
                    
                    <!-- ALU Core -->
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) translateZ(20px); width: 100px; height: 80px; background: linear-gradient(135deg, #805ad5, #9f7aea); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; animation: aluProcessing 3.5s infinite; box-shadow: 0 0 30px rgba(128, 90, 213, 0.7);">
                        ALU
                    </div>
                    
                    <!-- Operation Control -->
                    <div style="position: absolute; left: 50%; top: 2%; transform: translateX(-50%) translateZ(30px); color: #ed8936; font-size: 0.8rem; text-align: center;">
                        <div>Operation: ADD</div>
                        <div style="width: 3px; height: 25px; background: #ed8936; margin: 5px auto; animation: controlSignal 2.5s infinite;"></div>
                    </div>
                    
                  
                    <!-- Output -->
                    <div style="position: absolute; left: -100px; top: 40%; transform: translateY(-50%) translateZ(50px); color: #e53e3e; font-size: 0.9rem; font-weight: bold; text-align: right;">
                        <div style="width: 40px; height: 3px; background: #e53e3e; margin-bottom: 5px; animation: resultFlow 2.5s infinite 1.8s;"></div>
                        Result: 10001
                    </div>
                    
                    <!-- Connection lines -->
                    <div style="position: absolute; left: 60px; top: 35%; width: 80px; height: 3px; background: linear-gradient(to right, #48bb78, transparent); animation: connectionFlow 2.5s infinite;"></div>
                    <div style="position: absolute; left: 60px; bottom: 35%; width: 80px; height: 3px; background: linear-gradient(to right, #4299e1, transparent); animation: connectionFlow 2.5s infinite 0.5s;"></div>
                    <div style="position: absolute; right: 60px; top: 50%; width: 80px; height: 3px; background: linear-gradient(to left, #e53e3e, transparent); animation: connectionFlow 2.5s infinite 1.8s;"></div>
                </div>
            </div>
        `;
        container.appendChild(alu);
    }
    
    createALUConstruction(container) {
        const construction = document.createElement('div');
        construction.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 250px; background: linear-gradient(135deg, #1a202c, #2d3748); border-radius: 15px; position: relative; padding: 20px; perspective: 1000px;">
                <div style="position: relative; width: 100%; height: 100%; transform-style: preserve-3d; animation: rotateScene 30s infinite linear;">
                    <!-- Construction Steps -->
                    <div style="position: absolute; left: 10%; top: 20%; display: flex; flex-direction: column; gap: 15px; transform: translateZ(40px);">
                        <div style="display: flex; align-items: center; gap: 10px; animation: constructionStep 5s infinite;">
                            <div style="width: 25px; height: 20px; background: #4299e1; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem;">AND</div>
                            <div style="width: 25px; height: 3px; background: #48bb78;"></div>
                            <div style="color: #e2e8f0; font-size: 0.8rem;">Step 1: Logic Gate</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 10px; animation: constructionStep 5s infinite 1.5s;">
                            <div style="width: 25px; height: 20px; background: #48bb78; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem;">OR</div>
                            <div style="width: 25px; height: 3px; background: #4299e1;"></div>
                            <div style="color: #e2e8f0; font-size: 0.8rem;">Step 2: Adder</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 10px; animation: constructionStep 5s infinite 3s;">
                            <div style="width: 25px; height: 20px; background: #ed8936; clip-path: polygon(0% 50%, 100% 0%, 100% 100%);"></div>
                            <div style="width: 25px; height: 3px; background: #ed8936;"></div>
                            <div style="color: #e2e8f0; font-size: 0.8rem;">Step 3: Control Unit</div>
                        </div>
                    </div>
                    
                    <!-- Assembly Area -->
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) translateZ(20px); width: 120px; height: 100px; border: 2px dashed #805ad5; border-radius: 15px; display: flex; align-items: center; justify-content: center; animation: assemblyArea 4s infinite;">
                        <div style="color: #805ad5; font-size: 0.9rem; text-align: center;">
                            <div>🔧 Assembly Area</div>
                            <div style="font-size: 0.7rem; margin-top: 5px;">Building ALU...</div>
                        </div>
                    </div>
                    
                    <!-- Completed ALU -->
                    <div style="position: absolute; right: 10%; top: 50%; transform: translateY(-50%) translateZ(40px); width: 80px; height: 60px; background: linear-gradient(135deg, #805ad5, #9f7aea); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem; animation: completedALU 5s infinite 4s; opacity: 0;">
                        ALU
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: #e2e8f0; white-space: nowrap;">Complete!</div>
                    </div>
                    
                    <!-- Progress indicators -->
                    <div style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
                        <div style="width: 10px; height: 10px; background: #48bb78; border-radius: 50%; animation: progressDot 5s infinite;"></div>
                        <div style="width: 10px; height: 10px; background: #4299e1; border-radius: 50%; animation: progressDot 5s infinite 1.5s;"></div>
                        <div style="width: 10px; height: 10px; background: #ed8936; border-radius: 50%; animation: progressDot 5s infinite 3s;"></div>
                        <div style="width: 10px; height: 10px; background: #805ad5; border-radius: 50%; animation: progressDot 5s infinite 4.5s;"></div>
                    </div>
                    
                    <!-- Tools -->
                    <div style="position: absolute; top: 15px; right: 15px; color: #e2e8f0; font-size: 1.5rem; animation: tools 2.5s infinite;">🔧</div>
                    <div style="position: absolute; top: 40px; right: 40px; color: #e2e8f0; font-size: 1.2rem; animation: tools 2.5s infinite 0.5s;">⚡</div>
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
                    <div style="position: absolute; top: 1px; left: 50%; transform: translateX(-50%); color: #ffd700; font-size: 0.8rem; text-align: center; animation: clockSignal 1s infinite;">
                        <div>⏰ Clock: 3.2 GHz</div>
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
                
                <div style="position: absolute; bottom: 200px; left: 50%; transform: translateX(-50%); color: #4a5568; font-size: 0.8rem; text-align: center;">
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
                    <div style="position: absolute; bottom: 10px; left: 200%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center;">
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
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 15px; position: relative; padding: 15px;">
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
                    <div style="position: absolute; top: 10px; left: 100px; background: linear-gradient(135deg, #ffd700, #ffed4e); color: #744210; padding: 8px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; animation: achievementBadge 2s infinite; box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);">
                        🏆 Journey Complete!
                    </div>
                    
                    <!-- Progress indicator -->
                    <div style="position: absolute; bottom: 10px; right: 100px; transform: translateX(-50%); color: #4a5568; font-size: 0.8rem; text-align: center;">
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
                
                <div style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.8rem; text-align: center;">
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
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700); border-radius: 15px; position: relative; padding: 15px;">
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
        // Reset game states
        this.gameCompleted = false;
        this.gameSkipped = false;
        this.taskCompleted = false;
        
        // Show game area
        document.getElementById('gameArea').style.display = 'block';
        
        // Update navigation to show skip button
        this.updateNavigationButtons();
        
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

    skipCurrentGame() {
        if (!this.gameCompleted) {
            // Get current score for this chapter (if any)
            const currentScore = this.chapterScores[this.currentChapter] || 0;
            
            // Show confirmation popup with current score info
            this.showSkipConfirmation(() => {
                // User confirmed skip
                this.gameSkipped = true;
                this.gameCompleted = true;
                this.taskCompleted = true; // Mark task as completed to allow progression
                
                // Keep any existing score, don't reset to 0
                if (!this.chapterScores[this.currentChapter]) {
                    this.chapterScores[this.currentChapter] = 0;
                }
                
                // Hide game area
                document.getElementById('gameArea').style.display = 'none';
                
                // Show skip message with current score
                const finalScore = this.chapterScores[this.currentChapter];
                this.showPopupMessage(`⏭️ Game skipped! Chapter score: ${finalScore} points`, 'warning', 3000);
                
                // Update navigation
                this.updateNavigationButtons();
                
                // Update progress
                this.updateProgress();
            }, currentScore);
        }
    }

    showSkipConfirmation(onConfirm, currentScore = 0) {
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-content" style="max-width: 450px;">
                <div class="popup-header">
                    <h2>⏭️ Skip Game?</h2>
                </div>
                <div class="popup-body">
                    <p>Are you sure you want to skip this game?</p>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                        <p><strong>📊 Current Chapter Score: ${currentScore} points</strong></p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">Your current score will be kept for certification.</p>
                    </div>
                    <p style="font-size: 0.9rem;">You can always come back to play this game later!</p>
                </div>
                <div class="popup-footer" style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                    <button id="confirmSkip" class="nav-btn" style="background: var(--secondary-gradient);">Yes, Skip</button>
                    <button id="cancelSkip" class="nav-btn" style="background: var(--success-gradient);">Continue Playing</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Add event listeners
        document.getElementById('confirmSkip').addEventListener('click', () => {
            document.body.removeChild(popup);
            onConfirm();
        });
        
        document.getElementById('cancelSkip').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
        
        // Close on overlay click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        });
    }

    showPopupMessage(message, type = 'info', duration = 3000) {
        // Prevent spam by checking if a similar message is already showing
        const messageKey = `${type}_${message}`;
        if (this.popupTimeouts.has(messageKey)) {
            return; // Don't show duplicate messages
        }
        
        const popup = document.createElement('div');
        popup.className = 'message-popup';
        
        const colors = {
            success: 'var(--warning-gradient)',
            warning: 'var(--secondary-gradient)',
            error: 'linear-gradient(135deg, #e53e3e, #c53030)',
            info: 'var(--success-gradient)'
        };
        
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 2000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 300px;
            word-wrap: break-word;
        `;
        popup.textContent = message;
        document.body.appendChild(popup);
        
        // Track this message
        this.popupTimeouts.set(messageKey, true);
        
        // Remove after duration
        setTimeout(() => {
            if (popup.parentElement) {
                popup.style.animation = 'slideOutRight 0.5s ease-in';
                setTimeout(() => {
                    if (popup.parentElement) {
                        document.body.removeChild(popup);
                    }
                }, 500);
            }
            this.popupTimeouts.delete(messageKey);
        }, duration);
    }

    updateNavigationButtons() {
        const nextStageBtn = document.getElementById('nextStageBtn');
        const nextChapterBtn = document.getElementById('nextChapterBtn');
        const backChapterBtn = document.getElementById('backChapterBtn');
        const skipGameBtn = document.getElementById('skipGameBtn');

        const currentChapterData = this.chapters.find(ch => ch.chapterNumber === this.currentChapter);
        
        // Show/hide back button
        backChapterBtn.style.display = this.currentChapter > 1 ? 'block' : 'none';

        // Determine which next button to show
        if (this.currentStage < currentChapterData.narration.length - 1) {
            nextStageBtn.style.display = 'block';
            nextStageBtn.textContent = 'Next Stage →';
            nextChapterBtn.style.display = 'none';
            skipGameBtn.style.display = 'none';
        } else if (!this.gameCompleted && currentChapterData.game) {
            nextStageBtn.style.display = 'block';
            nextStageBtn.textContent = 'Start Game →';
            nextChapterBtn.style.display = 'none';
            skipGameBtn.style.display = 'none';
        } else if (this.currentChapter < this.chapters.length) {
            nextStageBtn.style.display = 'none';
            nextChapterBtn.style.display = 'block';
            skipGameBtn.style.display = 'none';
        } else {
            nextStageBtn.style.display = 'block';
            nextStageBtn.textContent = 'Complete Quest →';
            nextChapterBtn.style.display = 'none';
            skipGameBtn.style.display = 'none';
        }
        
        // Show skip button only when game is active and visible
        const gameArea = document.getElementById('gameArea');
        if (gameArea && gameArea.style.display === 'block' && !this.gameCompleted && !this.gameSkipped) {
            skipGameBtn.style.display = 'block';
        } else {
            skipGameBtn.style.display = 'none';
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
        
        // Initialize certificate form
        document.getElementById('completionDate').textContent = new Date().toLocaleDateString();
        const generateBtn = document.getElementById('generateCertBtn');
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.5';
        document.getElementById('nameInput').focus();
        
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

    generateCertificate() {
        const nameInput = document.getElementById('nameInput');
        const studentName = nameInput.value.trim();
        
        if (!studentName) {
            this.showPopupMessage('Please enter your name first!', 'warning', 3000);
            nameInput.focus();
            return;
        }
        
        // Update certificate with student name
        document.getElementById('studentName').textContent = studentName;
        document.getElementById('completionDate').textContent = new Date().toLocaleDateString();
        
        // Show download and print buttons
        document.getElementById('downloadCertBtn').style.display = 'inline-block';
        document.getElementById('printCertBtn').style.display = 'inline-block';
        document.getElementById('generateCertBtn').style.display = 'none';
        
        // Show success message
        this.showPopupMessage('🎓 Certificate generated successfully!', 'success', 3000);
    }

    downloadCertificate() {
        if (this.certificate) {
            this.certificate.generateCertificate();
        } else {
            this.showPopupMessage('Certificate system not available', 'error', 3000);
        }
    }

    printCertificate() {
        if (this.certificate) {
            this.certificate.printCertificate();
        } else {
            // Fallback print functionality
            window.print();
        }
    }

    closeCertificateModal() {
        document.getElementById('certificateModal').style.display = 'none';
        
        // Reset certificate form
        document.getElementById('nameInput').value = '';
        document.getElementById('studentName').textContent = '[Enter your name above]';
        document.getElementById('generateCertBtn').style.display = 'inline-block';
        document.getElementById('generateCertBtn').disabled = true;
        document.getElementById('generateCertBtn').style.opacity = '0.5';
        document.getElementById('downloadCertBtn').style.display = 'none';
        document.getElementById('printCertBtn').style.display = 'none';
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