// Game Loader and Mini-Game Manager
class GameLoader {
    constructor() {
        this.currentGame = null;
        this.gameContainer = document.getElementById('gameContainer');
        this.gameCompleteCallback = null;
        this.games = {};
        this.currentScore = 0;
        this.maxScore = 100;
        this.gameStartTime = null;
        
        this.init();
    }

    init() {
        // Register all available games
        this.registerGames();
    }

    registerGames() {
        // Register each mini-game with its implementation
        this.games = {
            'sorting': this.createSortingGame.bind(this),
            'control': this.createControlGame.bind(this),
            'precision': this.createPrecisionGame.bind(this),
            'slicing': this.createSlicingGame.bind(this),
            'puzzle': this.createPuzzleGame.bind(this),
            'connection': this.createConnectionGame.bind(this),
            'programming': this.createProgrammingGame.bind(this),
            'quiz': this.createQuizGame.bind(this),
            'matching': this.createMatchingGame.bind(this)
        };
    }

    loadGame(gameData, onComplete) {
        this.gameCompleteCallback = onComplete;
        this.currentScore = 0;
        this.maxScore = 100;
        this.gameStartTime = Date.now();
        this.gameCompleted = false; // Add flag to prevent multiple completions
        
        // Clear previous game
        this.gameContainer.innerHTML = '';
        
        // Create game header with score
        this.createGameHeader(gameData);
        
        // Load specific game based on type
        if (this.games[gameData.type]) {
            this.currentGame = this.games[gameData.type](gameData);
        } else {
            console.warn(`Game type '${gameData.type}' not found`);
            this.createDefaultGame(gameData);
        }
    }

    createGameHeader(gameData) {
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0; color: white; text-shadow: 0 2px 5px rgba(0,0,0,0.3);">${gameData.name}</h3>
                <div class="score-display" id="scoreDisplay">
                    <span style="font-weight: bold; color: white;">Score: </span>
                    <span id="currentScore" style="font-size: 1.2rem; color: #48bb78; font-weight: 700;">0</span>
                    <span style="color: #f0f8ff;">/${this.maxScore}</span>
                </div>
            </div>
            <p style="margin: 0 0 1rem 0; color: rgba(255,255,255,0.9);">${gameData.description}</p>
        `;
        header.style.cssText = `
            text-align: center;
            margin-bottom: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.1);
        `;
        this.gameContainer.appendChild(header);
    }

    // Chapter 1: Quartz Sorting Game
    createSortingGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'sorting-game-area';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Drag the quartz crystals (💎) to the collection box. Avoid the regular rocks!</p>
            </div>
            <div class="sorting-area" id="sortingArea">
                <div class="rocks-container" id="rocksContainer"></div>
                <div class="collection-box" id="collectionBox">
                    <p>Quartz Collection</p>
                    <div class="collected-count">0/6</div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .sorting-game-area {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .sorting-area {
                display: flex;
                justify-content: space-between;
                align-items: stretch;
                gap: 2rem;
                width: 100%;
                flex: 1;
            }
            .rocks-container {
                flex: 3;
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                padding: 1rem;
                background: rgba(139, 69, 19, 0.3);
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.1);
                overflow-y: auto;
            }
            .collection-box {
                flex: 1;
                background: rgba(72, 187, 120, 0.3);
                border: 3px dashed #48bb78;
                border-radius: 15px;
                padding: 1rem;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                transition: background 0.3s;
            }
            .collection-box.over {
                background: rgba(72, 187, 120, 0.5);
                transform: scale(1.05);
            }
            .rock-item {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                cursor: grab;
                transition: transform 0.2s, box-shadow 0.2s;
                user-select: none;
                animation: rock-appear 0.5s ease-out forwards;
            }
            .rock-item:hover {
                transform: scale(1.15);
                box-shadow: 0 0 20px rgba(255,255,255,0.5);
            }
            .rock-item.dragging {
                opacity: 0.5;
                transform: rotate(15deg) scale(1.2);
            }
            @keyframes rock-appear {
                from { opacity: 0; transform: scale(0.5); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        this.gameContainer.appendChild(gameArea);

        // Initialize sorting game logic
        return this.initSortingGame();
    }

    initSortingGame() {
        const rocksContainer = document.getElementById('rocksContainer');
        const collectionBox = document.getElementById('collectionBox');
        let collectedQuartz = 0;
        let wrongAttempts = 0;
        const targetQuartz = 6;
        const maxWrongAttempts = 3;

        // Create diverse particles with different shapes, colors, and properties
        const particles = [
            // Quartz crystals (correct ones)
            { type: 'quartz', emoji: '💎', color: '#E6E6FA', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '🔷', color: '#DDA0DD', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '💠', color: '#B19CD9', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '🔹', color: '#C8A2C8', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '💎', color: '#F0E6FF', shape: 'crystal', points: 20 },
            { type: 'quartz', emoji: '🔷', color: '#E6D7FF', shape: 'crystal', points: 20 },
            
            // Regular rocks (wrong ones)
            { type: 'granite', emoji: '🪨', color: '#8B4513', shape: 'round', points: -5 },
            { type: 'limestone', emoji: '🪨', color: '#D2B48C', shape: 'round', points: -5 },
            { type: 'sandstone', emoji: '🪨', color: '#F4A460', shape: 'round', points: -5 },
            { type: 'shale', emoji: '🪨', color: '#696969', shape: 'round', points: -5 },
            
            // Fool's gold and other minerals (tricky ones)
            { type: 'pyrite', emoji: '✨', color: '#FFD700', shape: 'cubic', points: -10 },
            { type: 'mica', emoji: '🪙', color: '#C0C0C0', shape: 'flaky', points: -10 },
            { type: 'feldspar', emoji: '🔸', color: '#FFA07A', shape: 'angular', points: -10 }
        ];

        // Shuffle particles
        particles.sort(() => Math.random() - 0.5);

        particles.forEach((particle, index) => {
            const particleElement = document.createElement('div');
            particleElement.className = `rock-item ${particle.type}`;
            particleElement.textContent = particle.emoji;
            particleElement.draggable = true;
            particleElement.dataset.type = particle.type;
            particleElement.dataset.points = particle.points;
            
            // Apply visual styling based on particle properties
            particleElement.style.background = particle.color;
            particleElement.style.border = particle.type === 'quartz' ? '2px solid #DDA0DD' : '1px solid #999';
            
            if (particle.shape === 'crystal') {
                particleElement.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                particleElement.style.animation = 'sparkle 3s infinite';
            } else if (particle.shape === 'cubic') {
                particleElement.style.borderRadius = '10%';
            } else if (particle.shape === 'flaky') {
                particleElement.style.borderRadius = '20% 80% 20% 80%';
            } else if (particle.shape === 'angular') {
                particleElement.style.clipPath = 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)';
            }

            // Drag events
            particleElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: particle.type,
                    points: particle.points
                }));
                particleElement.classList.add('dragging');
            });

            particleElement.addEventListener('dragend', () => {
                particleElement.classList.remove('dragging');
            });

            rocksContainer.appendChild(particleElement);
        });

        // Drop zone events
        collectionBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            collectionBox.style.background = 'rgba(72, 187, 120, 0.4)';
        });

        collectionBox.addEventListener('dragleave', () => {
            collectionBox.style.background = 'rgba(72, 187, 120, 0.2)';
        });

        collectionBox.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            collectionBox.style.background = 'rgba(72, 187, 120, 0.2)';

            // Remove the dragged element
            const draggedElement = document.querySelector('.rock-item.dragging');
            if (draggedElement) {
                draggedElement.remove();
            }

            if (data.type === 'quartz') {
                collectedQuartz++;
                this.updateScore(data.points);
                this.showFeedback('Perfect! That\'s pure quartz! ✨', 'success');
                
                // Update counter
                document.querySelector('.collected-count').textContent = `${collectedQuartz}/${targetQuartz}`;

                if (collectedQuartz >= targetQuartz) {
                    // Bonus points for completion
                    const timeBonus = Math.max(0, 30 - Math.floor((Date.now() - this.gameStartTime) / 1000));
                    this.updateScore(timeBonus);
                    
                    setTimeout(() => {
                        this.completeGame(`Excellent! You identified all quartz crystals! Final Score: ${this.currentScore}`);
                    }, 500);
                }
            } else {
                wrongAttempts++;
                this.updateScore(data.points);
                
                if (data.type === 'pyrite') {
                    this.showFeedback('That\'s fool\'s gold! Look for clear crystals! 🏆', 'warning');
                } else {
                    this.showFeedback(`That's ${data.type}, not quartz! Try again! 🪨`, 'error');
                }

                if (wrongAttempts >= maxWrongAttempts) {
                    this.showFeedback('Too many wrong attempts! Game over!', 'error');
                    setTimeout(() => {
                        this.completeGame(`Game completed with ${collectedQuartz} correct! Score: ${this.currentScore}`);
                    }, 2000);
                }
            }
        });

        return {
            type: 'sorting',
            reset: () => this.initSortingGame()
        };
    }

    // Chapter 2: Furnace Control Game
    createControlGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'control-game-area';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Control the furnace temperature to purify silicon. Keep it between 1800°C and 2200°C!</p>
            </div>
            <div class="furnace-control">
                <div class="furnace-display">
                    <div class="temperature-gauge">
                        <div class="temperature-bar" id="tempBar"></div>
                        <div class="temperature-reading" id="tempReading">1000°C</div>
                    </div>
                    <div class="furnace-visual" id="furnaceVisual">🏭</div>
                </div>
                <div class="controls">
                    <button id="heatUp" class="control-btn heat">🔥 Heat Up</button>
                    <button id="coolDown" class="control-btn cool">❄️ Cool Down</button>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="purificationProgress"></div>
                    <span>Purification Progress</span>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initControlGame();
    }

    initControlGame() {
        let temperature = 1000;
        let progress = 0;
        let gameCompleted = false;
        const targetTemp = { min: 1800, max: 2200 };
        const maxProgress = 100;

        const tempBar = document.getElementById('tempBar');
        const tempReading = document.getElementById('tempReading');
        const furnaceVisual = document.getElementById('furnaceVisual');
        const progressBar = document.getElementById('purificationProgress');
        const heatBtn = document.getElementById('heatUp');
        const coolBtn = document.getElementById('coolDown');

        const updateDisplay = () => {
            if (gameCompleted) return;
            
            tempReading.textContent = `${temperature}°C`;
            const tempPercent = Math.min((temperature / 3000) * 100, 100);
            tempBar.style.height = `${tempPercent}%`;
            
            // Color based on temperature
            if (temperature < targetTemp.min) {
                tempBar.style.background = '#4299e1';
                furnaceVisual.textContent = '🏭';
            } else if (temperature > targetTemp.max) {
                tempBar.style.background = '#e53e3e';
                furnaceVisual.textContent = '🔥';
            } else {
                tempBar.style.background = '#48bb78';
                furnaceVisual.textContent = '⚡';
                progress += 2;
                this.updateScore(2);
            }

            progressBar.style.width = `${Math.min(progress, maxProgress)}%`;

            if (progress >= maxProgress && !gameCompleted) {
                gameCompleted = true;
                this.completeGame('Perfect! You successfully purified the silicon!');
            }
        };

        heatBtn.addEventListener('click', () => {
            if (!gameCompleted) {
                temperature = Math.min(temperature + 100, 3000);
                updateDisplay();
            }
        });

        coolBtn.addEventListener('click', () => {
            if (!gameCompleted) {
                temperature = Math.max(temperature - 100, 0);
                updateDisplay();
            }
        });

        // Auto temperature decrease over time
        const tempInterval = setInterval(() => {
            if (temperature > 0 && !gameCompleted) {
                temperature = Math.max(temperature - 10, 0);
                updateDisplay();
            }
        }, 1000);

        updateDisplay();

        return {
            type: 'control',
            cleanup: () => clearInterval(tempInterval)
        };
    }

    // Chapter 3: Crystal Growing Game (Czochralski Balance Game)
    createPrecisionGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'precision-game-area';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>🔬 Simulate the Czochralski method! Balance rotation and pull speed to grow a perfect crystal rod.</p>
            </div>
            <div class="crystal-grower">
                <div class="crystal-display">
                    <div class="molten-pot">
                        <div class="molten-silicon">🔥</div>
                        <div class="crystal-rod" id="crystalRod"></div>
                    </div>
                    <div class="growth-progress">
                        <div class="progress-segments" id="progressSegments"></div>
                        <div class="growth-status" id="growthStatus">Ready to grow...</div>
                    </div>
                </div>
                <div class="controls">
                    <div class="control-group">
                        <label>🔁 Rotation Speed</label>
                        <input type="range" id="rotationSpeed" min="20" max="80" value="50">
                        <span id="rotationValue">50 RPM</span>
                        <div class="optimal-zone">Optimal: 40-60 RPM</div>
                    </div>
                    <div class="control-group">
                        <label>🔼 Pull Rate</label>
                        <input type="range" id="pullRate" min="20" max="80" value="50">
                        <span id="pullValue">50 mm/h</span>
                        <div class="optimal-zone">Optimal: 45-55 mm/h</div>
                    </div>
                </div>
                <div class="crystal-stats">
                    <div>Segments Grown: <span id="segmentCount">0</span>/10</div>
                    <div>Perfect Segments: <span id="perfectCount">0</span></div>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initCzochralskiGame();
    }

    initCzochralskiGame() {
        let segmentsGrown = 0;
        let perfectSegments = 0;
        let gameCompleted = false;
        const targetSegments = 10;
        
        const rotationSlider = document.getElementById('rotationSpeed');
        const pullSlider = document.getElementById('pullRate');
        const crystalRod = document.getElementById('crystalRod');
        const progressSegments = document.getElementById('progressSegments');
        const growthStatus = document.getElementById('growthStatus');
        const segmentCount = document.getElementById('segmentCount');
        const perfectCount = document.getElementById('perfectCount');

        const growSegment = () => {
            if (gameCompleted || segmentsGrown >= targetSegments) return;

            const rotation = parseInt(rotationSlider.value);
            const pullRate = parseInt(pullSlider.value);
            
            // Optimal ranges
            const optimalRotation = { min: 40, max: 60 };
            const optimalPull = { min: 45, max: 55 };

            // Determine segment quality
            let segmentQuality = 'perfect';
            let feedback = '';
            let points = 0;

            if (rotation < optimalRotation.min || pullRate < optimalPull.min) {
                segmentQuality = 'thick';
                feedback = 'Too slow! Crystal is getting thick and lumpy!';
                points = -2;
            } else if (rotation > optimalRotation.max || pullRate > optimalPull.max) {
                segmentQuality = 'thin';
                feedback = 'Too fast! Crystal rod is too thin!';
                points = -2;
            } else {
                segmentQuality = 'perfect';
                feedback = 'Perfect! Uniform crystal growth! ✨';
                points = 5;
                perfectSegments++;
                this.playDingSound();
            }

            // Create visual segment
            const segment = document.createElement('div');
            segment.className = `crystal-segment ${segmentQuality}`;
            segment.style.cssText = `
                width: ${segmentQuality === 'thick' ? '25px' : segmentQuality === 'thin' ? '15px' : '20px'};
                height: 15px;
                background: ${segmentQuality === 'perfect' ? 'linear-gradient(45deg, #E6E6FA, #DDA0DD)' : 
                           segmentQuality === 'thick' ? '#8B4513' : '#696969'};
                margin: 2px auto;
                border-radius: 3px;
                animation: segmentGrow 0.5s ease-out;
                box-shadow: ${segmentQuality === 'perfect' ? '0 0 10px rgba(221, 160, 221, 0.6)' : 'none'};
            `;
            
            progressSegments.appendChild(segment);
            segmentsGrown++;

            // Update displays
            segmentCount.textContent = segmentsGrown;
            perfectCount.textContent = perfectSegments;
            growthStatus.textContent = feedback;
            
            // Update score
            this.updateScore(points);
            this.showFeedback(feedback, segmentQuality === 'perfect' ? 'success' : 'warning');

            // Update crystal rod visual
            crystalRod.style.height = `${segmentsGrown * 15}px`;
            crystalRod.style.transform = `rotate(${rotation * 2}deg)`;

            // Check completion
            if (segmentsGrown >= targetSegments) {
                gameCompleted = true;
                const bonus = perfectSegments === targetSegments ? 10 : 0;
                if (bonus > 0) {
                    this.updateScore(bonus);
                    this.showFeedback('🏆 PERFECT CRYSTAL! Bonus +10 points!', 'success');
                }
                setTimeout(() => {
                    this.completeGame(`Crystal complete! Perfect segments: ${perfectSegments}/${targetSegments}`);
                }, 1500);
            }
        };

        // Update displays when sliders change
        const updateDisplays = () => {
            document.getElementById('rotationValue').textContent = `${rotationSlider.value} RPM`;
            document.getElementById('pullValue').textContent = `${pullSlider.value} mm/h`;
            
            // Visual feedback for optimal ranges
            const rotation = parseInt(rotationSlider.value);
            const pullRate = parseInt(pullSlider.value);
            
            rotationSlider.style.background = (rotation >= 40 && rotation <= 60) ? 
                'linear-gradient(to right, #48bb78, #48bb78)' : 
                'linear-gradient(to right, #e53e3e, #e53e3e)';
            
            pullSlider.style.background = (pullRate >= 45 && pullRate <= 55) ? 
                'linear-gradient(to right, #48bb78, #48bb78)' : 
                'linear-gradient(to right, #e53e3e, #e53e3e)';
        };

        rotationSlider.addEventListener('input', updateDisplays);
        pullSlider.addEventListener('input', updateDisplays);

        // Auto-grow segments every 2 seconds
        const growthInterval = setInterval(() => {
            if (!gameCompleted) {
                growSegment();
            } else {
                clearInterval(growthInterval);
            }
        }, 2000);

        updateDisplays();

        return {
            type: 'precision',
            cleanup: () => clearInterval(growthInterval)
        };
    }

    // Chapter 4: Slice & Polish the Wafer
    createSlicingGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'slicing-game-area';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>🪞 Slice the silicon ingot at the perfect moment, then polish the wafer to perfection!</p>
            </div>
            <div class="slicing-setup">
                <div class="ingot-display">
                    <div class="silicon-ingot" id="siliconIngot">
                        <div class="slice-line" id="sliceLine"></div>
                        <div class="timing-indicator" id="timingIndicator"></div>
                    </div>
                    <div class="slice-button-container">
                        <button id="sliceButton" class="slice-btn">🔪 SLICE NOW!</button>
                    </div>
                </div>
                <div class="wafer-polish" id="waferPolish" style="display: none;">
                    <div class="wafer" id="wafer">
                        <div class="scratches" id="scratches"></div>
                    </div>
                    <div class="polish-instructions">
                        <p>Move mouse left-right to polish away scratches!</p>
                        <div class="polish-progress">
                            <div class="polish-bar" id="polishBar"></div>
                        </div>
                    </div>
                </div>
                <div class="slicing-stats">
                    <div>Slices Made: <span id="sliceCount">0</span>/3</div>
                    <div>Perfect Slices: <span id="perfectSlices">0</span></div>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initSlicingGame();
    }

    initSlicingGame() {
        let currentSlice = 0;
        let perfectSlices = 0;
        let gameCompleted = false;
        let timingPosition = 0;
        let timingDirection = 1;
        let isPolishing = false;
        let polishProgress = 0;
        const totalSlices = 3;

        const sliceButton = document.getElementById('sliceButton');
        const timingIndicator = document.getElementById('timingIndicator');
        const sliceLine = document.getElementById('sliceLine');
        const waferPolish = document.getElementById('waferPolish');
        const wafer = document.getElementById('wafer');
        const scratches = document.getElementById('scratches');
        const polishBar = document.getElementById('polishBar');
        const sliceCount = document.getElementById('sliceCount');
        const perfectSlicesSpan = document.getElementById('perfectSlices');

        // Create scratches on wafer
        const createScratches = () => {
            scratches.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const scratch = document.createElement('div');
                scratch.className = 'scratch';
                scratch.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 30 + 10}px;
                    height: 2px;
                    background: rgba(139, 69, 19, 0.6);
                    top: ${Math.random() * 80 + 10}%;
                    left: ${Math.random() * 80 + 10}%;
                    transform: rotate(${Math.random() * 360}deg);
                    transition: opacity 0.3s;
                `;
                scratches.appendChild(scratch);
            }
        };

        // Timing game mechanics
        const updateTiming = () => {
            if (isPolishing || gameCompleted) return;

            timingPosition += timingDirection * 2;
            if (timingPosition >= 100) {
                timingPosition = 100;
                timingDirection = -1;
            } else if (timingPosition <= 0) {
                timingPosition = 0;
                timingDirection = 1;
            }

            timingIndicator.style.left = `${timingPosition}%`;
            
            // Green zone is 45-55%
            if (timingPosition >= 45 && timingPosition <= 55) {
                timingIndicator.style.background = '#48bb78';
                sliceLine.style.background = '#48bb78';
                sliceLine.style.boxShadow = '0 0 10px #48bb78';
            } else {
                timingIndicator.style.background = '#e53e3e';
                sliceLine.style.background = '#e53e3e';
                sliceLine.style.boxShadow = '0 0 10px #e53e3e';
            }
        };

        // Slice action
        const performSlice = () => {
            if (isPolishing || gameCompleted) return;

            const isGoodSlice = timingPosition >= 45 && timingPosition <= 55;
            currentSlice++;

            if (isGoodSlice) {
                perfectSlices++;
                this.updateScore(10);
                this.showFeedback('🪞 Perfect slice! Clean cut!', 'success');
                this.playDingSound();
            } else {
                this.updateScore(-5);
                this.showFeedback('❌ Uneven slice! Crystal cracked!', 'error');
            }

            // Update displays
            sliceCount.textContent = currentSlice;
            perfectSlicesSpan.textContent = perfectSlices;

            // Start polishing phase
            isPolishing = true;
            polishProgress = 0;
            waferPolish.style.display = 'block';
            sliceButton.style.display = 'none';
            createScratches();

            // Reset for next slice or complete
            setTimeout(() => {
                if (currentSlice >= totalSlices) {
                    gameCompleted = true;
                    const bonus = perfectSlices === totalSlices ? 15 : 0;
                    if (bonus > 0) {
                        this.updateScore(bonus);
                        this.showFeedback('🏆 ALL PERFECT SLICES! Bonus +15!', 'success');
                    }
                    setTimeout(() => {
                        this.completeGame(`Slicing complete! Perfect slices: ${perfectSlices}/${totalSlices}`);
                    }, 1500);
                } else {
                    // Reset for next slice
                    isPolishing = false;
                    waferPolish.style.display = 'none';
                    sliceButton.style.display = 'block';
                    timingPosition = 0;
                    timingDirection = 1;
                }
            }, 3000);
        };

        // Polish mechanics
        let lastMouseX = 0;
        let polishMovement = 0;

        const handlePolish = (e) => {
            if (!isPolishing) return;

            const currentMouseX = e.clientX;
            const movement = Math.abs(currentMouseX - lastMouseX);
            
            if (movement > 5) {
                polishMovement += movement;
                polishProgress = Math.min(100, polishMovement / 10);
                polishBar.style.width = `${polishProgress}%`;

                // Remove scratches gradually
                const scratchElements = scratches.querySelectorAll('.scratch');
                const scratchesToRemove = Math.floor((polishProgress / 100) * scratchElements.length);
                
                scratchElements.forEach((scratch, index) => {
                    if (index < scratchesToRemove) {
                        scratch.style.opacity = '0';
                    }
                });

                // Wafer becomes more reflective
                wafer.style.filter = `brightness(${1 + polishProgress / 100}) contrast(${1 + polishProgress / 200})`;

                if (polishProgress >= 100) {
                    this.updateScore(15);
                    this.showFeedback('✨ Perfect polish! Mirror finish achieved!', 'success');
                    wafer.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
                }
            }

            lastMouseX = currentMouseX;
        };

        // Event listeners
        sliceButton.addEventListener('click', performSlice);
        document.addEventListener('mousemove', handlePolish);

        // Start timing animation
        const timingInterval = setInterval(() => {
            updateTiming();
        }, 50);

        return {
            type: 'slicing',
            cleanup: () => {
                clearInterval(timingInterval);
                document.removeEventListener('mousemove', handlePolish);
            }
        };
    }

    // Chapter 5: Lithography Logic Painter (puzzle game)
    createPuzzleGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'puzzle-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>💡 Create circuit mask patterns using stencil pieces and UV light exposure!</p>
            </div>
            <div class="lithography-setup">
                <div class="stencil-palette">
                    <h4>Stencil Blocks</h4>
                    <div class="stencil-item" draggable="true" data-pattern="AND">
                        <div class="pattern-preview and-pattern">⚡</div>
                        <span>AND Gate</span>
                    </div>
                    <div class="stencil-item" draggable="true" data-pattern="OR">
                        <div class="pattern-preview or-pattern">⚡</div>
                        <span>OR Gate</span>
                    </div>
                    <div class="stencil-item" draggable="true" data-pattern="NOT">
                        <div class="pattern-preview not-pattern">⚡</div>
                        <span>NOT Gate</span>
                    </div>
                </div>
                <div class="wafer-workspace">
                    <div class="wafer-surface" id="waferSurface">
                        <div class="target-pattern" id="targetPattern"></div>
                        <div class="placed-patterns" id="placedPatterns"></div>
                    </div>
                    <div class="uv-controls">
                        <button id="exposeButton" class="expose-btn">🔦 EXPOSE UV LIGHT</button>
                        <div class="exposure-progress" id="exposureProgress"></div>
                    </div>
                </div>
                <div class="lithography-stats">
                    <div>Patterns Placed: <span id="patternCount">0</span></div>
                    <div>Correct Alignment: <span id="alignmentScore">0</span>%</div>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initLithographyGame();
    }

    initLithographyGame() {
        let patternsPlaced = 0;
        let correctPlacements = 0;
        let gameCompleted = false;
        const targetPatterns = [
            { type: 'AND', x: 30, y: 30 },
            { type: 'OR', x: 60, y: 50 },
            { type: 'NOT', x: 40, y: 70 }
        ];

        const waferSurface = document.getElementById('waferSurface');
        const placedPatterns = document.getElementById('placedPatterns');
        const targetPattern = document.getElementById('targetPattern');
        const exposeButton = document.getElementById('exposeButton');
        const patternCount = document.getElementById('patternCount');
        const alignmentScore = document.getElementById('alignmentScore');

        // Show target patterns as outlines
        targetPatterns.forEach(target => {
            const outline = document.createElement('div');
            outline.className = `target-outline ${target.type.toLowerCase()}`;
            outline.style.cssText = `
                position: absolute;
                left: ${target.x}%;
                top: ${target.y}%;
                width: 40px;
                height: 40px;
                border: 2px dashed #48bb78;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #48bb78;
                font-size: 0.8rem;
                background: rgba(72, 187, 120, 0.1);
            `;
            outline.textContent = target.type;
            targetPattern.appendChild(outline);
        });

        // Drag and drop mechanics
        document.querySelectorAll('.stencil-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    pattern: item.dataset.pattern,
                    id: Date.now()
                }));
            });
        });

        waferSurface.addEventListener('dragover', (e) => e.preventDefault());
        waferSurface.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const rect = waferSurface.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Create placed pattern
            const pattern = document.createElement('div');
            pattern.className = `placed-pattern ${data.pattern.toLowerCase()}`;
            pattern.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 40px;
                height: 40px;
                background: linear-gradient(45deg, #4169E1, #0000CD);
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
                cursor: move;
                box-shadow: 0 2px 10px rgba(65, 105, 225, 0.4);
                animation: patternPlace 0.3s ease-out;
            `;
            pattern.textContent = data.pattern;
            pattern.dataset.pattern = data.pattern;
            pattern.dataset.x = x;
            pattern.dataset.y = y;

            placedPatterns.appendChild(pattern);
            patternsPlaced++;
            patternCount.textContent = patternsPlaced;

            // Check alignment
            this.checkAlignment();
        });

        // UV Exposure
        exposeButton.addEventListener('click', () => {
            if (gameCompleted) return;

            this.performUVExposure();
        });

        this.checkAlignment = () => {
            const placedElements = placedPatterns.querySelectorAll('.placed-pattern');
            correctPlacements = 0;

            placedElements.forEach(placed => {
                const placedX = parseFloat(placed.dataset.x);
                const placedY = parseFloat(placed.dataset.y);
                const placedType = placed.dataset.pattern;

                // Check if within tolerance of any target
                const matchingTarget = targetPatterns.find(target => {
                    const distance = Math.sqrt(
                        Math.pow(target.x - placedX, 2) + Math.pow(target.y - placedY, 2)
                    );
                    return target.type === placedType && distance < 15; // 15% tolerance
                });

                if (matchingTarget) {
                    correctPlacements++;
                    placed.style.border = '2px solid #48bb78';
                    placed.style.boxShadow = '0 0 15px rgba(72, 187, 120, 0.6)';
                } else {
                    placed.style.border = '2px solid #e53e3e';
                    placed.style.boxShadow = '0 0 15px rgba(229, 62, 62, 0.6)';
                }
            });

            const alignment = patternsPlaced > 0 ? Math.round((correctPlacements / patternsPlaced) * 100) : 0;
            alignmentScore.textContent = alignment;
        };

        this.performUVExposure = () => {
            // UV light animation
            const uvLight = document.createElement('div');
            uvLight.className = 'uv-light';
            uvLight.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle, rgba(138, 43, 226, 0.3), transparent);
                animation: uvExposure 2s ease-in-out;
                pointer-events: none;
                z-index: 10;
            `;
            waferSurface.appendChild(uvLight);

            // Calculate score
            let score = correctPlacements * 5; // +5 per correct pattern
            const misaligned = patternsPlaced - correctPlacements;
            score -= misaligned * 3; // -3 per misaligned

            // Bonus for complex patterns (XOR simulation)
            if (correctPlacements >= 3) {
                score += 10;
                this.showFeedback('🧠 Complex XOR pattern created! Bonus +10!', 'success');
            }

            this.updateScore(score);

            setTimeout(() => {
                uvLight.remove();
                
                if (correctPlacements >= 2) {
                    gameCompleted = true;
                    this.showFeedback('💡 UV exposure complete! Logic gates printed!', 'success');
                    setTimeout(() => {
                        this.completeGame(`Lithography complete! Correct patterns: ${correctPlacements}/${targetPatterns.length}`);
                    }, 1500);
                } else {
                    this.showFeedback('❌ Poor alignment! Try repositioning patterns.', 'warning');
                }
            }, 2000);
        };

        return { 
            type: 'puzzle',
            checkAlignment: this.checkAlignment,
            performUVExposure: this.performUVExposure
        };
    }

    // Chapter 6: Logic Gate Builder (connection game)
    createConnectionGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'connection-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>🧠 Build logic circuits using gates (AND, OR, NOT) to match the required output!</p>
            </div>
            <div class="circuit-builder">
                <div class="gate-library">
                    <h4>Logic Gates</h4>
                    <div class="gate-item" draggable="true" data-gate="AND">
                        <div class="gate-symbol">⚡ AND</div>
                    </div>
                    <div class="gate-item" draggable="true" data-gate="OR">
                        <div class="gate-symbol">⚡ OR</div>
                    </div>
                    <div class="gate-item" draggable="true" data-gate="NOT">
                        <div class="gate-symbol">⚡ NOT</div>
                    </div>
                </div>
                <div class="circuit-workspace">
                    <div class="input-section">
                        <div class="input-pin" data-input="A">A</div>
                        <div class="input-pin" data-input="B">B</div>
                    </div>
                    <div class="circuit-canvas" id="circuitCanvas"></div>
                    <div class="output-section">
                        <div class="output-pin" id="outputPin">OUT</div>
                        <div class="output-led" id="outputLed"></div>
                    </div>
                </div>
                <div class="truth-table">
                    <h4>Target Truth Table</h4>
                    <table id="truthTable">
                        <tr><th>A</th><th>B</th><th>OUT</th></tr>
                        <tr><td>0</td><td>0</td><td id="out00">0</td></tr>
                        <tr><td>0</td><td>1</td><td id="out01">1</td></tr>
                        <tr><td>1</td><td>0</td><td id="out10">1</td></tr>
                        <tr><td>1</td><td>1</td><td id="out11">1</td></tr>
                    </table>
                </div>
                <div class="test-controls">
                    <button id="testCircuit" class="test-btn">▶️ Run Test</button>
                    <button id="clearCircuit" class="clear-btn">🗑️ Clear</button>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initConnectionGame();
    }

    initConnectionGame() {
        let placedGates = [];
        let connections = [];
        let gameCompleted = false;
        const targetTruthTable = [0, 1, 1, 1]; // OR gate behavior

        const circuitCanvas = document.getElementById('circuitCanvas');
        const outputLed = document.getElementById('outputLed');
        const testButton = document.getElementById('testCircuit');
        const clearButton = document.getElementById('clearCircuit');

        // Drag and drop for gates
        document.querySelectorAll('.gate-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    gate: item.dataset.gate,
                    id: Date.now()
                }));
            });
        });

        circuitCanvas.addEventListener('dragover', (e) => e.preventDefault());
        circuitCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const rect = circuitCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create gate element
            const gate = document.createElement('div');
            gate.className = `placed-gate ${data.gate.toLowerCase()}`;
            gate.style.cssText = `
                position: absolute;
                left: ${x - 30}px;
                top: ${y - 20}px;
                width: 60px;
                height: 40px;
                background: linear-gradient(45deg, #32CD32, #228B22);
                border: 2px solid #00FF00;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
                cursor: move;
                box-shadow: 0 2px 10px rgba(50, 205, 50, 0.4);
                animation: gatePlace 0.3s ease-out;
            `;
            gate.textContent = data.gate;
            gate.dataset.gate = data.gate;
            gate.dataset.id = data.id;

            circuitCanvas.appendChild(gate);
            placedGates.push({
                id: data.id,
                type: data.gate,
                element: gate,
                x: x - 30,
                y: y - 20
            });
        });

        // Test circuit functionality
        testButton.addEventListener('click', () => {
            if (gameCompleted) return;

            this.testLogicCircuit();
        });

        clearButton.addEventListener('click', () => {
            circuitCanvas.innerHTML = '';
            placedGates = [];
            connections = [];
            outputLed.style.background = '#666';
        });

        this.testLogicCircuit = () => {
            if (placedGates.length === 0) {
                this.showFeedback('❌ No gates placed! Add some logic gates first.', 'warning');
                return;
            }

            // Simulate circuit for all input combinations
            const results = [];
            const inputs = [[0,0], [0,1], [1,0], [1,1]];

            inputs.forEach(([a, b]) => {
                let output = this.simulateCircuit(a, b);
                results.push(output);
            });

            // Check if results match target
            const isCorrect = JSON.stringify(results) === JSON.stringify(targetTruthTable);
            
            if (isCorrect) {
                gameCompleted = true;
                this.updateScore(10);
                outputLed.style.background = '#48bb78';
                outputLed.style.boxShadow = '0 0 20px #48bb78';
                this.showFeedback('✅ Perfect! Circuit logic is correct!', 'success');
                
                // Bonus for solving without hints
                if (placedGates.length === 1) {
                    this.updateScore(10);
                    this.showFeedback('🧠 Solved with minimal gates! Bonus +10!', 'success');
                }

                setTimeout(() => {
                    this.completeGame('Logic circuit complete! You built a working OR gate!');
                }, 1500);
            } else {
                this.updateScore(-5);
                outputLed.style.background = '#e53e3e';
                outputLed.style.boxShadow = '0 0 20px #e53e3e';
                this.showFeedback('❌ Incorrect output! Check your logic.', 'error');
                
                // Show sparks animation for wrong connection
                this.showSparks();
            }
        };

        this.simulateCircuit = (inputA, inputB) => {
            // Simple simulation - for this demo, we'll check for OR gate
            const orGate = placedGates.find(gate => gate.type === 'OR');
            if (orGate) {
                return inputA || inputB ? 1 : 0;
            }
            
            const andGate = placedGates.find(gate => gate.type === 'AND');
            if (andGate) {
                return inputA && inputB ? 1 : 0;
            }

            return 0; // Default
        };

        this.showSparks = () => {
            for (let i = 0; i < 5; i++) {
                const spark = document.createElement('div');
                spark.className = 'spark';
                spark.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #FFD700;
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: sparkFly 1s ease-out forwards;
                    pointer-events: none;
                `;
                circuitCanvas.appendChild(spark);
                
                setTimeout(() => spark.remove(), 1000);
            }
        };

        return { 
            type: 'connection',
            testLogicCircuit: this.testLogicCircuit,
            simulateCircuit: this.simulateCircuit
        };
    }

    // Chapter 7: Mini CPU Test (Simple ALU Programming)
    createProgrammingGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'programming-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>⚙️ Send instructions to the CPU! Create programs to perform calculations and operations.</p>
            </div>
            <div class="cpu-simulator">
                <div class="instruction-palette">
                    <h4>Available Instructions</h4>
                    <div class="instruction-block" draggable="true" data-instruction="LOAD A">
                        <span class="opcode">LOAD A</span>
                        <small>Load value into register A</small>
                    </div>
                    <div class="instruction-block" draggable="true" data-instruction="LOAD B">
                        <span class="opcode">LOAD B</span>
                        <small>Load value into register B</small>
                    </div>
                    <div class="instruction-block" draggable="true" data-instruction="ADD">
                        <span class="opcode">ADD</span>
                        <small>Add A + B</small>
                    </div>
                    <div class="instruction-block" draggable="true" data-instruction="SUB">
                        <span class="opcode">SUB</span>
                        <small>Subtract A - B</small>
                    </div>
                    <div class="instruction-block" draggable="true" data-instruction="STORE">
                        <span class="opcode">STORE</span>
                        <small>Store result</small>
                    </div>
                    <div class="instruction-block" draggable="true" data-instruction="BLINK">
                        <span class="opcode">BLINK</span>
                        <small>Blink LED</small>
                    </div>
                </div>
                <div class="cpu-workspace">
                    <div class="program-editor">
                        <h4>Program Instructions</h4>
                        <div class="program-lines" id="programLines">
                            <div class="program-line" data-line="0">1. <span class="instruction-slot">Drop instruction here</span></div>
                            <div class="program-line" data-line="1">2. <span class="instruction-slot">Drop instruction here</span></div>
                            <div class="program-line" data-line="2">3. <span class="instruction-slot">Drop instruction here</span></div>
                            <div class="program-line" data-line="3">4. <span class="instruction-slot">Drop instruction here</span></div>
                        </div>
                    </div>
                    <div class="cpu-display">
                        <div class="registers">
                            <div class="register">A: <span id="regA">0</span></div>
                            <div class="register">B: <span id="regB">0</span></div>
                            <div class="register">Result: <span id="regResult">0</span></div>
                        </div>
                        <div class="output-display">
                            <div class="led-indicator" id="ledIndicator"></div>
                            <div class="text-output" id="textOutput">Ready to execute...</div>
                        </div>
                    </div>
                </div>
                <div class="execution-controls">
                    <div class="input-values">
                        <label>Value A: <input type="number" id="valueA" value="5" min="0" max="99"></label>
                        <label>Value B: <input type="number" id="valueB" value="3" min="0" max="99"></label>
                    </div>
                    <button id="executeProgram" class="execute-btn">▶️ Execute Program</button>
                    <button id="clearProgram" class="clear-btn">🗑️ Clear Program</button>
                </div>
                <div class="programming-stats">
                    <div>Programs Run: <span id="programCount">0</span></div>
                    <div>Successful Operations: <span id="successCount">0</span></div>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initCPUGame();
    }

    initCPUGame() {
        let program = ['', '', '', ''];
        let programsRun = 0;
        let successfulOps = 0;
        let gameCompleted = false;

        const programLines = document.getElementById('programLines');
        const executeButton = document.getElementById('executeProgram');
        const clearButton = document.getElementById('clearProgram');
        const regA = document.getElementById('regA');
        const regB = document.getElementById('regB');
        const regResult = document.getElementById('regResult');
        const ledIndicator = document.getElementById('ledIndicator');
        const textOutput = document.getElementById('textOutput');
        const valueA = document.getElementById('valueA');
        const valueB = document.getElementById('valueB');
        const programCount = document.getElementById('programCount');
        const successCount = document.getElementById('successCount');

        // Drag and drop for instructions
        document.querySelectorAll('.instruction-block').forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', block.dataset.instruction);
            });
        });

        document.querySelectorAll('.program-line').forEach(line => {
            line.addEventListener('dragover', (e) => e.preventDefault());
            line.addEventListener('drop', (e) => {
                e.preventDefault();
                const instruction = e.dataTransfer.getData('text/plain');
                const lineNum = parseInt(line.dataset.line);
                
                const slot = line.querySelector('.instruction-slot');
                slot.textContent = instruction;
                slot.style.background = 'rgba(72, 187, 120, 0.2)';
                slot.style.border = '1px solid #48bb78';
                program[lineNum] = instruction;
            });
        });

        // Execute program
        executeButton.addEventListener('click', () => {
            if (gameCompleted) return;
            this.executeProgram();
        });

        clearButton.addEventListener('click', () => {
            program = ['', '', '', ''];
            document.querySelectorAll('.instruction-slot').forEach(slot => {
                slot.textContent = 'Drop instruction here';
                slot.style.background = '';
                slot.style.border = '';
            });
            this.resetRegisters();
        });

        this.executeProgram = () => {
            const valA = parseInt(valueA.value);
            const valB = parseInt(valueB.value);
            let registerA = 0;
            let registerB = 0;
            let result = 0;
            let hasError = false;
            let operationPerformed = false;

            programsRun++;
            programCount.textContent = programsRun;

            // Execute each instruction
            program.forEach((instruction, index) => {
                if (!instruction || hasError) return;

                setTimeout(() => {
                    // Highlight current instruction
                    document.querySelectorAll('.program-line').forEach(line => {
                        line.style.background = '';
                    });
                    document.querySelector(`[data-line="${index}"]`).style.background = 'rgba(255, 215, 0, 0.3)';

                    switch (instruction) {
                        case 'LOAD A':
                            registerA = valA;
                            regA.textContent = registerA;
                            textOutput.textContent = `Loaded ${valA} into register A`;
                            this.animateRegister(regA);
                            break;
                        case 'LOAD B':
                            registerB = valB;
                            regB.textContent = registerB;
                            textOutput.textContent = `Loaded ${valB} into register B`;
                            this.animateRegister(regB);
                            break;
                        case 'ADD':
                            if (registerA !== 0 || registerB !== 0) {
                                result = registerA + registerB;
                                regResult.textContent = result;
                                textOutput.textContent = `${registerA} + ${registerB} = ${result}`;
                                operationPerformed = true;
                                this.animateRegister(regResult);
                            } else {
                                hasError = true;
                                textOutput.textContent = 'Error: Load values first!';
                            }
                            break;
                        case 'SUB':
                            if (registerA !== 0 || registerB !== 0) {
                                result = registerA - registerB;
                                regResult.textContent = result;
                                textOutput.textContent = `${registerA} - ${registerB} = ${result}`;
                                operationPerformed = true;
                                this.animateRegister(regResult);
                            } else {
                                hasError = true;
                                textOutput.textContent = 'Error: Load values first!';
                            }
                            break;
                        case 'STORE':
                            if (result !== 0) {
                                textOutput.textContent = `Result ${result} stored in memory`;
                                operationPerformed = true;
                            } else {
                                hasError = true;
                                textOutput.textContent = 'Error: No result to store!';
                            }
                            break;
                        case 'BLINK':
                            this.blinkLED();
                            textOutput.textContent = 'LED blinking...';
                            operationPerformed = true;
                            break;
                    }
                }, index * 1000);
            });

            // Check completion after all instructions
            setTimeout(() => {
                if (!hasError && operationPerformed) {
                    successfulOps++;
                    successCount.textContent = successfulOps;
                    this.updateScore(5);
                    this.showFeedback('⚙️ Program executed successfully!', 'success');

                    // Bonus for running all operations in one session
                    if (successfulOps >= 3) {
                        this.updateScore(10);
                        this.showFeedback('💾 All operations mastered! Bonus +10!', 'success');
                        gameCompleted = true;
                        setTimeout(() => {
                            this.completeGame(`CPU programming complete! Successful operations: ${successfulOps}`);
                        }, 1500);
                    }
                } else if (hasError) {
                    this.updateScore(-2);
                    this.showFeedback('❌ Program error! Check instruction order.', 'error');
                }

                // Clear highlighting
                document.querySelectorAll('.program-line').forEach(line => {
                    line.style.background = '';
                });
            }, program.filter(p => p).length * 1000 + 500);
        };

        this.resetRegisters = () => {
            regA.textContent = '0';
            regB.textContent = '0';
            regResult.textContent = '0';
            textOutput.textContent = 'Ready to execute...';
            ledIndicator.style.background = '#666';
        };

        this.animateRegister = (element) => {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#48bb78';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 300);
        };

        this.blinkLED = () => {
            let blinks = 0;
            const blinkInterval = setInterval(() => {
                ledIndicator.style.background = ledIndicator.style.background === 'rgb(72, 187, 120)' ? '#666' : '#48bb78';
                blinks++;
                if (blinks >= 6) {
                    clearInterval(blinkInterval);
                    ledIndicator.style.background = '#666';
                }
            }, 200);
        };

        return { 
            type: 'programming',
            executeProgram: this.executeProgram,
            resetRegisters: this.resetRegisters
        };
    }

    // Chapter 8: Knowledge Quiz
    createQuizGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'quiz-game-area';
        const questions = [
            {
                question: "What is the main ingredient in computer chips?",
                options: ["Carbon", "Silicon", "Iron", "Gold"],
                correct: 1
            },
            {
                question: "At what temperature is silicon purified?",
                options: ["1000°C", "1500°C", "2000°C", "3000°C"],
                correct: 2
            },
            {
                question: "What are the basic building blocks of computer logic?",
                options: ["Transistors", "Logic Gates", "Resistors", "Capacitors"],
                correct: 1
            }
        ];

        let currentQuestion = 0;
        let score = 0;

        const showQuestion = () => {
            const q = questions[currentQuestion];
            gameArea.innerHTML = `
                <div class="quiz-question">
                    <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
                    <p>${q.question}</p>
                    <div class="quiz-options">
                        ${q.options.map((option, index) => 
                            `<button class="quiz-option" data-answer="${index}">${option}</button>`
                        ).join('')}
                    </div>
                    <div class="quiz-score">Score: ${score}/${questions.length}</div>
                </div>
            `;

            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = parseInt(e.target.dataset.answer);
                    if (answer === q.correct) {
                        score++;
                        this.showFeedback('Correct! 🎉', 'success');
                    } else {
                        this.showFeedback('Not quite right. 🤔', 'warning');
                    }

                    setTimeout(() => {
                        currentQuestion++;
                        if (currentQuestion < questions.length) {
                            showQuestion();
                        } else {
                            this.completeGame(`Quiz completed! You scored ${score}/${questions.length}!`);
                        }
                    }, 1500);
                });
            });
        };

        this.gameContainer.appendChild(gameArea);
        showQuestion();

        return { type: 'quiz' };
    }

    // Chapter 8: From Chip to the World (Final Use Cases)
    createMatchingGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'matching-game';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>🌐 Match Silico chips to the devices they power! Drag chips onto the correct devices.</p>
            </div>
            <div class="matching-setup">
                <div class="chip-source">
                    <h4>Silicon Chips</h4>
                    <div class="chip-container">
                        <div class="silico-chip" draggable="true" data-chip="processor">
                            <div class="chip-icon">🧠</div>
                            <span>CPU Chip</span>
                        </div>
                        <div class="silico-chip" draggable="true" data-chip="memory">
                            <div class="chip-icon">💾</div>
                            <span>Memory Chip</span>
                        </div>
                        <div class="silico-chip" draggable="true" data-chip="sensor">
                            <div class="chip-icon">📡</div>
                            <span>Sensor Chip</span>
                        </div>
                        <div class="silico-chip" draggable="true" data-chip="graphics">
                            <div class="chip-icon">🎮</div>
                            <span>Graphics Chip</span>
                        </div>
                    </div>
                </div>
                <div class="device-targets">
                    <h4>Devices</h4>
                    <div class="devices-grid">
                        <div class="device-target" data-device="phone" data-accepts="processor,memory">
                            <div class="device-icon">📱</div>
                            <span>Smartphone</span>
                            <div class="chip-slots"></div>
                        </div>
                        <div class="device-target" data-device="satellite" data-accepts="processor,sensor">
                            <div class="device-icon">🛰️</div>
                            <span>Satellite</span>
                            <div class="chip-slots"></div>
                        </div>
                        <div class="device-target" data-device="medical" data-accepts="sensor,processor">
                            <div class="device-icon">🏥</div>
                            <span>Medical Scanner</span>
                            <div class="chip-slots"></div>
                        </div>
                        <div class="device-target" data-device="gaming" data-accepts="graphics,processor">
                            <div class="device-icon">🎮</div>
                            <span>Gaming Console</span>
                            <div class="chip-slots"></div>
                        </div>
                        <div class="device-target" data-device="ai" data-accepts="processor,memory">
                            <div class="device-icon">🤖</div>
                            <span>AI Robot</span>
                            <div class="chip-slots"></div>
                        </div>
                        <div class="device-target" data-device="car" data-accepts="sensor,processor">
                            <div class="device-icon">🚗</div>
                            <span>Smart Car</span>
                            <div class="chip-slots"></div>
                        </div>
                    </div>
                </div>
                <div class="matching-stats">
                    <div>Correct Matches: <span id="correctMatches">0</span></div>
                    <div>Time Remaining: <span id="timeRemaining">60</span>s</div>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(gameArea);
        return this.initMatchingGame();
    }

    initMatchingGame() {
        let correctMatches = 0;
        let totalMatches = 0;
        let gameCompleted = false;
        let timeRemaining = 60;
        const targetMatches = 8; // Need to match at least 8 chips correctly

        const correctMatchesSpan = document.getElementById('correctMatches');
        const timeRemainingSpan = document.getElementById('timeRemaining');

        // Start countdown timer
        const timer = setInterval(() => {
            timeRemaining--;
            timeRemainingSpan.textContent = timeRemaining;
            
            if (timeRemaining <= 0 && !gameCompleted) {
                gameCompleted = true;
                clearInterval(timer);
                this.endMatchingGame();
            }
        }, 1000);

        // Drag and drop mechanics
        document.querySelectorAll('.silico-chip').forEach(chip => {
            chip.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    chipType: chip.dataset.chip,
                    chipId: Date.now() + Math.random()
                }));
                
                // Add sparkle trail effect
                chip.style.filter = 'brightness(1.3) drop-shadow(0 0 10px #FFD700)';
            });

            chip.addEventListener('dragend', () => {
                chip.style.filter = '';
            });
        });

        document.querySelectorAll('.device-target').forEach(device => {
            device.addEventListener('dragover', (e) => {
                e.preventDefault();
                device.style.transform = 'scale(1.05)';
                device.style.boxShadow = '0 0 20px rgba(72, 187, 120, 0.6)';
            });

            device.addEventListener('dragleave', () => {
                device.style.transform = '';
                device.style.boxShadow = '';
            });

            device.addEventListener('drop', (e) => {
                e.preventDefault();
                device.style.transform = '';
                device.style.boxShadow = '';

                if (gameCompleted) return;

                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const acceptedChips = device.dataset.accepts.split(',');
                const isCorrectMatch = acceptedChips.includes(data.chipType);

                totalMatches++;

                if (isCorrectMatch) {
                    correctMatches++;
                    correctMatchesSpan.textContent = correctMatches;
                    this.updateScore(3);
                    this.showFeedback('🌟 Perfect match! Device powered up!', 'success');
                    this.animateDeviceSuccess(device);
                } else {
                    this.updateScore(-1);
                    this.showFeedback('❌ Wrong chip type! Try again!', 'error');
                    this.animateDeviceError(device);
                }

                // Check for completion
                if (correctMatches >= targetMatches) {
                    gameCompleted = true;
                    clearInterval(timer);
                    
                    // Time bonus
                    const timeBonus = Math.max(0, timeRemaining);
                    this.updateScore(timeBonus);
                    
                    if (timeBonus > 30) {
                        this.showFeedback('🌟 Speed bonus! +' + timeBonus + ' points!', 'success');
                    }

                    setTimeout(() => {
                        this.completeGame(`All devices powered! Matches: ${correctMatches}/${totalMatches}`);
                    }, 1500);
                }
            });
        });

        this.animateDeviceSuccess = (device) => {
            const deviceIcon = device.querySelector('.device-icon');
            
            // Device lights up and spins
            device.style.background = 'linear-gradient(45deg, #48bb78, #38a169)';
            device.style.animation = 'deviceActivate 1s ease-out';
            
            // Add working animation based on device type
            switch (device.dataset.device) {
                case 'satellite':
                    deviceIcon.style.animation = 'spin 2s linear infinite';
                    break;
                case 'phone':
                    deviceIcon.style.animation = 'phoneLight 1s infinite';
                    break;
                case 'medical':
                    deviceIcon.style.animation = 'pulse 1s infinite';
                    break;
                case 'gaming':
                    deviceIcon.style.animation = 'gameFlash 0.5s infinite';
                    break;
                case 'ai':
                    deviceIcon.style.animation = 'robotMove 2s infinite';
                    break;
                case 'car':
                    deviceIcon.style.animation = 'carDrive 1.5s infinite';
                    break;
            }
        };

        this.animateDeviceError = (device) => {
            device.style.animation = 'deviceShake 0.5s ease-out';
            setTimeout(() => {
                device.style.animation = '';
            }, 500);
        };

        this.endMatchingGame = () => {
            const finalScore = correctMatches >= 6 ? 'Great job!' : 'Good effort!';
            this.completeGame(`Time's up! ${finalScore} Matches: ${correctMatches}/${totalMatches}`);
        };

        return { 
            type: 'matching',
            endMatchingGame: this.endMatchingGame,
            animateDeviceSuccess: this.animateDeviceSuccess
        };
    }

    // Utility method to play ding sound
    playDingSound() {
        // Create a simple audio context for ding sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }

    createDefaultGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'default-game-area';
        gameArea.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: white;">
                <h3>${gameData.name}</h3>
                <p>${gameData.description}</p>
                <p style="margin-top: 2rem; font-style: italic;">This game is under construction. 🏗️</p>
                <button id="completeGameBtn" class="nav-btn next-btn" style="margin-top: 1rem;">Complete Chapter</button>
            </div>
        `;
        this.gameContainer.appendChild(gameArea);
        
        document.getElementById('completeGameBtn').addEventListener('click', () => {
            this.completeGame('Chapter completed!');
        });

        return { type: 'default' };
    }

    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `game-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;

        const colors = {
            success: 'background: #48bb78; color: white;',
            error: 'background: #e53e3e; color: white;',
            warning: 'background: #ed8936; color: white;',
            info: 'background: #4299e1; color: white;'
        };

        feedback.style.cssText += colors[type] || colors.info;
        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.parentElement.removeChild(feedback);
            }
        }, 2000);
    }

    updateScore(points) {
        this.currentScore = Math.max(0, Math.min(this.maxScore, this.currentScore + points));
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = this.currentScore;
            scoreElement.style.color = points > 0 ? '#48bb78' : '#e53e3e';
            setTimeout(() => {
                scoreElement.style.color = '#48bb78';
            }, 500);
        }
    }

    getScore() {
        return this.currentScore;
    }

    completeGame(message) {
        if (this.gameCompleted) return; // Prevent multiple completions
        this.gameCompleted = true;
        
        this.showFeedback(message, 'success');
        
        setTimeout(() => {
            if (this.gameCompleteCallback) {
                this.gameCompleteCallback(true, this.currentScore);
            }
        }, 2000);
    }

    // Cleanup method for games with intervals
    cleanup() {
        if (this.currentGame && this.currentGame.cleanup) {
            this.currentGame.cleanup();
        }
    }
}

// Add CSS for game feedback animation and all game styles
const gameStyle = document.createElement('style');
gameStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes segmentGrow {
        0% { transform: scaleY(0); opacity: 0; }
        100% { transform: scaleY(1); opacity: 1; }
    }
    
    @keyframes patternPlace {
        0% { transform: scale(0) rotate(180deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    
    @keyframes uvExposure {
        0% { opacity: 0; }
        50% { opacity: 0.8; }
        100% { opacity: 0; }
    }
    
    @keyframes gatePlace {
        0% { transform: scale(0.5) rotate(45deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    
    @keyframes sparkFly {
        0% { transform: scale(1) translate(0, 0); opacity: 1; }
        100% { transform: scale(0) translate(50px, -50px); opacity: 0; }
    }
    
    @keyframes deviceActivate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes deviceShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes phoneLight {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.5); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes gameFlash {
        0%, 100% { color: inherit; }
        50% { color: #FFD700; }
    }
    
    @keyframes robotMove {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    @keyframes carDrive {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(5px); }
    }
    
    .control-btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        cursor: pointer;
        margin: 0.5rem;
        transition: transform 0.2s;
    }
    
    .control-btn:hover {
        transform: scale(1.05);
    }
    
    .heat { background: #e53e3e; color: white; }
    .cool { background: #4299e1; color: white; }
    
    .progress-bar {
        width: 100%;
        height: 20px;
        background: #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 1rem;
        position: relative;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #48bb78, #38a169);
        width: 0%;
        transition: width 0.3s ease;
    }

    .quiz-game-area, .precision-game-area, .control-game-area, .default-game-area,
    .slicing-game-area, .connection-game, .programming-game, .matching-game {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        color: white;
        padding: 1rem;
        overflow-y: auto;
    }

    .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
        width: 100%;
        max-width: 400px;
    }

    .quiz-option {
        padding: 1rem;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px;
        background: rgba(255,255,255,0.1);
        color: white;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
    }

    .quiz-option:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.05);
    }

    .furnace-control, .crystal-grower {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .furnace-display, .crystal-display {
        font-size: 4rem;
    }

    .controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem;
    }

    /* Crystal Growing Game Styles */
    .molten-pot {
        position: relative;
        width: 100px;
        height: 60px;
        background: linear-gradient(to bottom, #FF4500, #8B0000);
        border-radius: 50px 50px 10px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .crystal-rod {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        background: linear-gradient(to top, #E6E6FA, #DDA0DD);
        border-radius: 3px;
        transition: height 0.5s ease;
    }

    .progress-segments {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        min-height: 200px;
        padding: 1rem;
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
        margin: 1rem 0;
    }

    .optimal-zone {
        font-size: 0.8rem;
        color: #48bb78;
        margin-top: 0.5rem;
    }

    /* Slicing Game Styles */
    .silicon-ingot {
        position: relative;
        width: 200px;
        height: 100px;
        background: linear-gradient(45deg, #C0C0C0, #808080);
        border-radius: 10px;
        margin: 2rem 0;
        overflow: hidden;
    }

    .slice-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 3px;
        left: 50%;
        transform: translateX(-50%);
        background: #e53e3e;
        transition: all 0.3s;
    }

    .timing-indicator {
        position: absolute;
        top: -10px;
        width: 10px;
        height: 10px;
        background: #e53e3e;
        border-radius: 50%;
        transition: all 0.1s;
    }

    .slice-btn {
        padding: 1rem 2rem;
        background: linear-gradient(45deg, #FF6B6B, #FF4757);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .slice-btn:hover {
        transform: scale(1.05);
    }

    .wafer {
        width: 150px;
        height: 150px;
        background: linear-gradient(45deg, #E6E6FA, #DDA0DD);
        border-radius: 50%;
        position: relative;
        margin: 1rem auto;
        transition: all 0.3s;
    }

    .scratches {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
    }

    .polish-progress {
        width: 200px;
        height: 10px;
        background: #333;
        border-radius: 5px;
        overflow: hidden;
        margin: 1rem 0;
    }

    .polish-bar {
        height: 100%;
        background: linear-gradient(90deg, #48bb78, #38a169);
        width: 0%;
        transition: width 0.3s;
    }

    /* Lithography Game Styles */
    .lithography-setup {
        display: flex;
        gap: 2rem;
        width: 100%;
        max-width: 1000px;
        flex-wrap: wrap;
    }

    .stencil-palette {
        flex: 1;
        min-width: 200px;
        background: rgba(0,0,0,0.2);
        padding: 1rem;
        border-radius: 10px;
    }

    .stencil-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        margin: 0.5rem 0;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        cursor: grab;
        transition: transform 0.2s;
    }

    .stencil-item:hover {
        transform: scale(1.05);
    }

    .wafer-workspace {
        flex: 2;
        min-width: 300px;
    }

    .wafer-surface {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, #2d3748, #1a202c);
        border-radius: 50%;
        position: relative;
        margin: 1rem auto;
        border: 2px solid #4a5568;
    }

    .expose-btn {
        padding: 1rem 2rem;
        background: linear-gradient(45deg, #8A2BE2, #4B0082);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        cursor: pointer;
        margin: 1rem 0;
    }

    /* Connection Game Styles */
    .circuit-builder {
        display: flex;
        gap: 2rem;
        width: 100%;
        max-width: 1000px;
        flex-wrap: wrap;
    }

    .gate-library {
        flex: 1;
        min-width: 200px;
        background: rgba(0,0,0,0.2);
        padding: 1rem;
        border-radius: 10px;
    }

    .gate-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        margin: 0.5rem 0;
        background: rgba(50, 205, 50, 0.2);
        border: 1px solid #32CD32;
        border-radius: 10px;
        cursor: grab;
        transition: transform 0.2s;
    }

    .gate-item:hover {
        transform: scale(1.05);
    }

    .circuit-workspace {
        flex: 2;
        min-width: 400px;
        display: flex;
        gap: 1rem;
    }

    .circuit-canvas {
        width: 300px;
        height: 200px;
        background: rgba(0,0,0,0.3);
        border: 2px dashed #666;
        border-radius: 10px;
        position: relative;
    }

    .output-led {
        width: 30px;
        height: 30px;
        background: #666;
        border-radius: 50%;
        margin: 1rem auto;
        transition: all 0.3s;
    }

    .truth-table {
        background: rgba(0,0,0,0.2);
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }

    .truth-table table {
        width: 100%;
        border-collapse: collapse;
    }

    .truth-table th, .truth-table td {
        padding: 0.5rem;
        border: 1px solid #666;
        text-align: center;
    }

    /* Programming Game Styles */
    .cpu-simulator {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 100%;
        max-width: 1000px;
    }

    .instruction-palette {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .instruction-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: rgba(72, 187, 120, 0.2);
        border: 1px solid #48bb78;
        border-radius: 10px;
        cursor: grab;
        transition: transform 0.2s;
        min-width: 120px;
    }

    .instruction-block:hover {
        transform: scale(1.05);
    }

    .cpu-workspace {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .program-editor {
        flex: 1;
        min-width: 300px;
    }

    .program-line {
        padding: 1rem;
        margin: 0.5rem 0;
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
        border: 2px dashed transparent;
        transition: all 0.3s;
    }

    .program-line:hover {
        border-color: #48bb78;
    }

    .instruction-slot {
        color: #999;
        font-style: italic;
    }

    .cpu-display {
        flex: 1;
        min-width: 250px;
    }

    .registers {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .register {
        padding: 1rem;
        background: rgba(0,0,0,0.3);
        border-radius: 10px;
        font-family: monospace;
        font-size: 1.2rem;
        text-align: center;
    }

    .led-indicator {
        width: 40px;
        height: 40px;
        background: #666;
        border-radius: 50%;
        margin: 1rem auto;
        transition: all 0.3s;
    }

    .text-output {
        padding: 1rem;
        background: rgba(0,0,0,0.3);
        border-radius: 10px;
        font-family: monospace;
        min-height: 60px;
        text-align: center;
    }

    /* Matching Game Styles */
    .matching-setup {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 100%;
        max-width: 1000px;
    }

    .chip-container {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .silico-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        border-radius: 10px;
        cursor: grab;
        transition: all 0.3s;
        min-width: 100px;
    }

    .silico-chip:hover {
        transform: scale(1.05);
    }

    .chip-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .devices-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .device-target {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: rgba(0,0,0,0.2);
        border: 2px dashed #666;
        border-radius: 10px;
        transition: all 0.3s;
        min-height: 120px;
        cursor: pointer;
    }

    .device-target:hover {
        border-color: #48bb78;
    }

    .device-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .execute-btn, .test-btn, .clear-btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        margin: 0.5rem;
        transition: transform 0.2s;
    }

    .execute-btn {
        background: linear-gradient(45deg, #48bb78, #38a169);
        color: white;
    }

    .test-btn {
        background: linear-gradient(45deg, #4299e1, #3182ce);
        color: white;
    }

    .clear-btn {
        background: linear-gradient(45deg, #e53e3e, #c53030);
        color: white;
    }

    .execute-btn:hover, .test-btn:hover, .clear-btn:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(gameStyle);