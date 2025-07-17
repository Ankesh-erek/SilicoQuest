// Enhanced Game Loader with Improved Algorithms and UI
class EnhancedGameLoader extends GameLoader {
    constructor() {
        super();
        this.enhancedFeatures = true;
    }

    // Enhanced Chapter 3: Advanced Crystal Growing Game
    createPrecisionGame(gameData) {
        const gameArea = document.createElement('div');
        gameArea.className = 'precision-game-area';
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>🔬 Master the Czochralski method! Balance rotation speed, pull rate, and temperature to grow a perfect silicon crystal. Watch for real-time feedback!</p>
            </div>
            <div class="crystal-grower">
                <div class="crystal-display">
                    <div class="molten-pot">
                        <div class="molten-silicon" id="moltenSilicon">
                            <div class="temperature-display">1414°C</div>
                            <div class="molten-bubbles">
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                            </div>
                        </div>
                        <div class="crystal-rod" id="crystalRod">
                            <div class="seed-crystal">💎</div>
                        </div>
                        <div class="pulling-mechanism" id="pullingMech">
                            <div class="wire"></div>
                            <div class="motor">⚙️</div>
                        </div>
                    </div>
                    <div class="growth-progress">
                        <div class="progress-segments" id="progressSegments"></div>
                        <div class="growth-status" id="growthStatus">Ready to grow...</div>
                        <div class="quality-meter">
                            <div class="quality-bar" id="qualityBar"></div>
                            <span>Crystal Quality</span>
                        </div>
                    </div>
                </div>
                <div class="controls">
                    <div class="control-group">
                        <label>🔁 Rotation Speed</label>
                        <input type="range" id="rotationSpeed" min="10" max="100" value="50" step="1">
                        <span id="rotationValue">50 RPM</span>
                        <div class="optimal-zone">🎯 Optimal: 40-60 RPM</div>
                        <div class="control-indicator" id="rotationIndicator"></div>
                    </div>
                    <div class="control-group">
                        <label>🔼 Pull Rate</label>
                        <input type="range" id="pullRate" min="10" max="100" value="50" step="1">
                        <span id="pullValue">50 mm/h</span>
                        <div class="optimal-zone">🎯 Optimal: 45-55 mm/h</div>
                        <div class="control-indicator" id="pullIndicator"></div>
                    </div>
                    <div class="control-group">
                        <label>🌡️ Temperature</label>
                        <input type="range" id="temperature" min="1400" max="1500" value="1414" step="1">
                        <span id="tempValue">1414°C</span>
                        <div class="optimal-zone">🎯 Optimal: 1410-1420°C</div>
                        <div class="control-indicator" id="tempIndicator"></div>
                    </div>
                </div>
                <div class="crystal-stats">
                    <div>Segments Grown: <span id="segmentCount">0</span>/12</div>
                    <div>Perfect Segments: <span id="perfectCount">0</span></div>
                    <div>Overall Quality: <span id="overallQuality">0%</span></div>
                    <div>Growth Rate: <span id="growthRate">0 mm/min</span></div>
                </div>
                <div class="advanced-controls">
                    <button id="emergencyStop" class="emergency-btn">🛑 Emergency Stop</button>
                    <button id="autoOptimize" class="auto-btn">🤖 Auto-Optimize</button>
                    <div class="stability-meter">
                        <div class="stability-bar" id="stabilityBar"></div>
                        <span>Process Stability</span>
                    </div>
                </div>
            </div>
        `;

        // Add enhanced CSS for the crystal growing game
        const style = document.createElement('style');
        style.textContent = `
            .molten-silicon {
                position: relative;
                width: 120px;
                height: 60px;
                background: radial-gradient(circle, #FFD700, #FF6B35);
                border-radius: 50px;
                animation: moltenBubble 2s infinite;
                overflow: hidden;
            }
            
            .temperature-display {
                position: absolute;
                top: 5px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            
            .molten-bubbles {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            
            .bubble {
                position: absolute;
                width: 8px;
                height: 8px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: bubbleRise 2s infinite;
            }
            
            .bubble:nth-child(2) { left: 30%; animation-delay: 0.5s; }
            .bubble:nth-child(3) { left: 60%; animation-delay: 1s; }
            .bubble:nth-child(4) { left: 80%; animation-delay: 1.5s; }
            
            @keyframes bubbleRise {
                0% { bottom: 0; opacity: 0; transform: scale(0.5); }
                50% { opacity: 1; transform: scale(1); }
                100% { bottom: 100%; opacity: 0; transform: scale(0.3); }
            }
            
            .crystal-rod {
                position: absolute;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                background: linear-gradient(to top, #E6E6FA, #DDA0DD);
                border-radius: 10px 10px 5px 5px;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .seed-crystal {
                font-size: 1rem;
                margin-bottom: 5px;
                animation: seedSparkle 2s infinite;
            }
            
            @keyframes seedSparkle {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); filter: brightness(1.5); }
            }
            
            .pulling-mechanism {
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .wire {
                width: 2px;
                height: 30px;
                background: #708090;
                margin-bottom: 5px;
            }
            
            .motor {
                font-size: 1.2rem;
                animation: motorSpin 2s linear infinite;
            }
            
            @keyframes motorSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .quality-meter, .stability-meter {
                margin: 10px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .quality-bar, .stability-bar {
                height: 8px;
                background: #48bb78;
                border-radius: 4px;
                transition: all 0.3s ease;
                min-width: 0;
                width: 0%;
            }
            
            .control-group {
                margin: 15px 0;
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .control-group label {
                display: block;
                color: white;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .control-group input[type="range"] {
                width: 100%;
                margin: 10px 0;
                accent-color: #48bb78;
            }
            
            .optimal-zone {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.8);
                margin-top: 5px;
            }
            
            .control-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #e53e3e;
                margin-top: 5px;
                transition: all 0.3s ease;
            }
            
            .emergency-btn, .auto-btn {
                padding: 10px 15px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                margin: 5px;
                transition: all 0.3s ease;
            }
            
            .emergency-btn {
                background: #e53e3e;
                color: white;
            }
            
            .auto-btn {
                background: #805ad5;
                color: white;
            }
            
            .emergency-btn:hover, .auto-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);

        this.gameContainer.appendChild(gameArea);
        return this.initAdvancedCzochralskiGame();
    }

    initAdvancedCzochralskiGame() {
        let segmentsGrown = 0;
        let perfectSegments = 0;
        let gameCompleted = false;
        let processStability = 100;
        let overallQuality = 0;
        let autoOptimizeActive = false;
        let emergencyStopActive = false;
        const targetSegments = 12;
        
        const rotationSlider = document.getElementById('rotationSpeed');
        const pullSlider = document.getElementById('pullRate');
        const tempSlider = document.getElementById('temperature');
        const crystalRod = document.getElementById('crystalRod');
        const progressSegments = document.getElementById('progressSegments');
        const growthStatus = document.getElementById('growthStatus');
        const segmentCount = document.getElementById('segmentCount');
        const perfectCount = document.getElementById('perfectCount');
        const qualityBar = document.getElementById('qualityBar');
        const stabilityBar = document.getElementById('stabilityBar');
        const overallQualitySpan = document.getElementById('overallQuality');
        const growthRateSpan = document.getElementById('growthRate');

        // Enhanced growth algorithm with complex interdependencies
        const growSegment = () => {
            if (gameCompleted || segmentsGrown >= targetSegments || emergencyStopActive) return;

            const rotation = parseInt(rotationSlider.value);
            const pullRate = parseInt(pullSlider.value);
            const temperature = parseInt(tempSlider.value);
            
            // Complex optimal ranges with interdependencies
            const optimalRotation = { min: 40, max: 60 };
            const optimalPull = { min: 45, max: 55 };
            const optimalTemp = { min: 1410, max: 1420 };

            // Calculate quality factors (0-1 scale)
            const rotationFactor = this.calculateQualityFactor(rotation, optimalRotation);
            const pullFactor = this.calculateQualityFactor(pullRate, optimalPull);
            const tempFactor = this.calculateQualityFactor(temperature, optimalTemp);
            
            // Interdependency effects - rotation should be ~1.2x pull rate for optimal crystal structure
            const speedBalance = Math.abs(rotation - pullRate * 1.2);
            const balanceFactor = speedBalance < 10 ? 1.0 : Math.max(0.5, 1.0 - (speedBalance - 10) / 50);
            
            // Temperature stability effect
            const tempStability = Math.abs(temperature - 1415) < 3 ? 1.0 : 0.8;
            
            // Overall segment quality (0-1)
            const segmentQuality = (rotationFactor * pullFactor * tempFactor * balanceFactor * tempStability);
            
            // Update process stability based on quality
            const stabilityChange = (segmentQuality - 0.7) * 15;
            processStability = Math.max(0, Math.min(100, processStability + stabilityChange));
            
            // Determine segment type and feedback
            let segmentType, feedback, points, visualQuality;
            
            if (segmentQuality >= 0.9 && processStability > 80) {
                segmentType = 'perfect';
                feedback = '🌟 Exceptional crystal! Perfect atomic alignment achieved!';
                points = 10;
                perfectSegments++;
                visualQuality = 'perfect';
                this.playDingSound();
                this.createSparkleEffect();
            } else if (segmentQuality >= 0.75) {
                segmentType = 'good';
                feedback = '✅ High quality crystal segment with minimal defects!';
                points = 6;
                visualQuality = 'good';
            } else if (segmentQuality >= 0.5) {
                segmentType = 'fair';
                feedback = '⚠️ Acceptable quality - some crystal defects detected';
                points = 3;
                visualQuality = 'fair';
            } else {
                segmentType = 'poor';
                feedback = '❌ Poor quality - significant crystal structure problems!';
                points = 0;
                visualQuality = 'poor';
            }

            // Create enhanced visual segment with realistic properties
            const segment = document.createElement('div');
            segment.className = `crystal-segment ${segmentType}`;
            
            const segmentWidth = this.getSegmentWidth(rotation, pullRate);
            const segmentColor = this.getSegmentColor(segmentQuality, temperature);
            
            segment.style.cssText = `
                width: ${segmentWidth}px;
                height: 12px;
                background: ${segmentColor};
                margin: 1px auto;
                border-radius: 2px;
                animation: segmentGrow 0.8s ease-out;
                box-shadow: ${segmentQuality > 0.8 ? '0 0 8px rgba(221, 160, 221, 0.8)' : 'none'};
                position: relative;
                overflow: hidden;
                border: ${segmentQuality > 0.9 ? '1px solid rgba(255, 255, 255, 0.5)' : 'none'};
            `;
            
            // Add defect indicators for poor quality segments
            if (segmentQuality < 0.6) {
                const defectCount = Math.floor((1 - segmentQuality) * 3);
                for (let i = 0; i < defectCount; i++) {
                    const defect = document.createElement('div');
                    defect.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: ${Math.random() * 80}%;
                        width: 2px;
                        height: 100%;
                        background: #8B0000;
                        opacity: 0.7;
                    `;
                    segment.appendChild(defect);
                }
            }
            
            progressSegments.appendChild(segment);
            segmentsGrown++;

            // Update all displays and metrics
            segmentCount.textContent = segmentsGrown;
            perfectCount.textContent = perfectSegments;
            growthStatus.textContent = feedback;
            
            // Calculate and update quality metrics
            overallQuality = Math.round((perfectSegments / segmentsGrown) * 100);
            overallQualitySpan.textContent = `${overallQuality}%`;
            
            const currentGrowthRate = Math.round(pullRate * (segmentQuality + 0.5));
            growthRateSpan.textContent = `${currentGrowthRate} mm/min`;
            
            // Update visual quality and stability bars
            qualityBar.style.width = `${segmentQuality * 100}%`;
            qualityBar.style.background = this.getQualityBarColor(segmentQuality);
            
            stabilityBar.style.width = `${processStability}%`;
            stabilityBar.style.background = processStability > 70 ? '#48bb78' : processStability > 40 ? '#ed8936' : '#e53e3e';
            
            // Update score
            this.updateScore(points);
            this.showFeedback(feedback, segmentQuality > 0.75 ? 'success' : segmentQuality > 0.5 ? 'warning' : 'error');

            // Update crystal rod visual with realistic rotation
            crystalRod.style.height = `${segmentsGrown * 12}px`;
            crystalRod.style.transform = `rotate(${rotation * 3}deg)`;
            
            // Update molten silicon visuals based on temperature and rotation
            this.updateMoltenVisuals(temperature, rotation);

            // Check for game completion
            if (segmentsGrown >= targetSegments) {
                gameCompleted = true;
                let finalBonus = 0;
                
                if (perfectSegments === targetSegments) {
                    finalBonus = 25;
                    this.showFeedback('🏆 FLAWLESS CRYSTAL! Semiconductor grade perfection! +25 bonus!', 'success');
                } else if (overallQuality >= 80) {
                    finalBonus = 15;
                    this.showFeedback('💎 Excellent crystal quality! Industrial grade! +15 bonus!', 'success');
                } else if (overallQuality >= 60) {
                    finalBonus = 8;
                    this.showFeedback('✅ Good crystal quality! Usable for electronics! +8 bonus!', 'success');
                } else {
                    this.showFeedback('⚠️ Crystal completed but with defects. Practice makes perfect!', 'warning');
                }
                
                this.updateScore(finalBonus);
                setTimeout(() => {
                    this.completeGame(`Crystal complete! Quality: ${overallQuality}% | Perfect: ${perfectSegments}/${targetSegments}`);
                }, 2000);
            }
        };

        // Enhanced control updates with real-time feedback
        const updateDisplays = () => {
            const rotation = parseInt(rotationSlider.value);
            const pullRate = parseInt(pullSlider.value);
            const temperature = parseInt(tempSlider.value);
            
            document.getElementById('rotationValue').textContent = `${rotation} RPM`;
            document.getElementById('pullValue').textContent = `${pullRate} mm/h`;
            document.getElementById('tempValue').textContent = `${temperature}°C`;
            
            // Update control indicators with color coding
            this.updateControlIndicator('rotationIndicator', rotation, { min: 40, max: 60 });
            this.updateControlIndicator('pullIndicator', pullRate, { min: 45, max: 55 });
            this.updateControlIndicator('tempIndicator', temperature, { min: 1410, max: 1420 });
            
            // Update slider accent colors for immediate feedback
            this.updateSliderColor(rotationSlider, rotation, { min: 40, max: 60 });
            this.updateSliderColor(pullSlider, pullRate, { min: 45, max: 55 });
            this.updateSliderColor(tempSlider, temperature, { min: 1410, max: 1420 });
        };

        // Event listeners for all controls
        rotationSlider.addEventListener('input', updateDisplays);
        pullSlider.addEventListener('input', updateDisplays);
        tempSlider.addEventListener('input', updateDisplays);

        // Emergency stop functionality
        document.getElementById('emergencyStop').addEventListener('click', () => {
            emergencyStopActive = !emergencyStopActive;
            const btn = document.getElementById('emergencyStop');
            if (emergencyStopActive) {
                btn.textContent = '▶️ Resume Process';
                btn.style.background = '#48bb78';
                this.showFeedback('🛑 Emergency stop activated! Process halted for safety!', 'warning');
            } else {
                btn.textContent = '🛑 Emergency Stop';
                btn.style.background = '#e53e3e';
                this.showFeedback('▶️ Process resumed! Crystal growth continuing!', 'info');
            }
        });

        // Auto-optimize functionality with AI assistance
        document.getElementById('autoOptimize').addEventListener('click', () => {
            autoOptimizeActive = !autoOptimizeActive;
            const btn = document.getElementById('autoOptimize');
            if (autoOptimizeActive) {
                btn.textContent = '🔧 Manual Control';
                btn.style.background = '#4299e1';
                this.showFeedback('🤖 AI optimization system activated!', 'info');
                this.startAutoOptimization();
            } else {
                btn.textContent = '🤖 Auto-Optimize';
                btn.style.background = '#805ad5';
                this.showFeedback('🔧 Manual control restored!', 'info');
            }
        });

        // Start the growth process with variable timing
        const growthInterval = setInterval(() => {
            if (!gameCompleted && !emergencyStopActive) {
                growSegment();
            } else if (gameCompleted) {
                clearInterval(growthInterval);
            }
        }, 2500);

        updateDisplays();

        return {
            type: 'precision',
            cleanup: () => clearInterval(growthInterval)
        };
    }

    // Helper methods for enhanced crystal growing game
    calculateQualityFactor(value, optimal) {
        const center = (optimal.min + optimal.max) / 2;
        const range = optimal.max - optimal.min;
        const distance = Math.abs(value - center);
        
        if (distance <= range / 2) {
            return 1.0; // Perfect range
        } else {
            // Gradual degradation outside optimal range
            return Math.max(0.1, 1.0 - (distance - range / 2) / (range * 2));
        }
    }

    getSegmentWidth(rotation, pullRate) {
        // Realistic crystal diameter based on process parameters
        const baseWidth = 18;
        const rotationEffect = (rotation - 50) * 0.2; // Faster rotation = thinner
        const pullEffect = (pullRate - 50) * 0.15; // Faster pull = thicker
        return Math.max(12, Math.min(25, baseWidth - rotationEffect + pullEffect));
    }

    getSegmentColor(quality, temperature) {
        // Color based on crystal quality and temperature
        if (quality >= 0.9) {
            return 'linear-gradient(45deg, #E6E6FA, #DDA0DD, #9370DB)'; // Perfect crystal
        } else if (quality >= 0.75) {
            return 'linear-gradient(45deg, #E6E6FA, #C8A2C8)'; // Good quality
        } else if (quality >= 0.5) {
            return 'linear-gradient(45deg, #D3D3D3, #A9A9A9)'; // Fair quality
        } else {
            return 'linear-gradient(45deg, #8B4513, #A0522D)'; // Poor quality with defects
        }
    }

    getQualityBarColor(quality) {
        if (quality >= 0.8) return '#48bb78'; // Green for excellent
        if (quality >= 0.6) return '#ed8936'; // Orange for good
        return '#e53e3e'; // Red for poor
    }

    updateControlIndicator(indicatorId, value, optimal) {
        const indicator = document.getElementById(indicatorId);
        const isOptimal = value >= optimal.min && value <= optimal.max;
        
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${isOptimal ? '#48bb78' : '#e53e3e'};
            margin-top: 5px;
            box-shadow: 0 0 10px ${isOptimal ? 'rgba(72, 187, 120, 0.6)' : 'rgba(229, 62, 62, 0.6)'};
            animation: ${isOptimal ? 'pulse 2s infinite' : 'none'};
            transition: all 0.3s ease;
        `;
    }

    updateSliderColor(slider, value, optimal) {
        const isOptimal = value >= optimal.min && value <= optimal.max;
        slider.style.accentColor = isOptimal ? '#48bb78' : '#e53e3e';
    }

    updateMoltenVisuals(temperature, rotation) {
        const moltenSilicon = document.getElementById('moltenSilicon');
        const tempDisplay = moltenSilicon.querySelector('.temperature-display');
        
        tempDisplay.textContent = `${temperature}°C`;
        
        // Update bubbling intensity based on temperature
        const bubbles = moltenSilicon.querySelectorAll('.bubble');
        const intensity = Math.max(0.5, (temperature - 1400) / 100); // 0.5-1 scale
        
        bubbles.forEach((bubble, index) => {
            bubble.style.animationDuration = `${3 - intensity}s`;
            bubble.style.animationDelay = `${index * 0.3}s`;
        });
        
        // Update molten color based on temperature
        if (temperature > 1450) {
            moltenSilicon.style.background = 'radial-gradient(circle, #FF4500, #FF0000)';
        } else if (temperature > 1420) {
            moltenSilicon.style.background = 'radial-gradient(circle, #FF6B35, #FF4500)';
        } else if (temperature >= 1410) {
            moltenSilicon.style.background = 'radial-gradient(circle, #FFD700, #FF6B35)';
        } else {
            moltenSilicon.style.background = 'radial-gradient(circle, #FFA500, #FF8C00)';
        }
    }

    createSparkleEffect() {
        // Create sparkle effect for perfect crystals
        const container = document.getElementById('crystalRod');
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #FFD700;
                border-radius: 50%;
                pointer-events: none;
                animation: sparkleEffect 1s ease-out forwards;
            `;
            
            const angle = (i / 5) * Math.PI * 2;
            const distance = 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';
            sparkle.style.transform = `translate(-50%, -50%)`;
            
            container.appendChild(sparkle);
            
            sparkle.animate([
                { transform: `translate(-50%, -50%) translate(0, 0) scale(0)`, opacity: 1 },
                { transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (sparkle.parentElement) {
                    sparkle.parentElement.removeChild(sparkle);
                }
            };
        }
    }

    startAutoOptimization() {
        // AI system that gradually optimizes parameters
        const autoInterval = setInterval(() => {
            if (!document.getElementById('autoOptimize').textContent.includes('Manual')) {
                clearInterval(autoInterval);
                return;
            }

            const rotationSlider = document.getElementById('rotationSpeed');
            const pullSlider = document.getElementById('pullRate');
            const tempSlider = document.getElementById('temperature');

            // Target optimal values with some variation for realism
            const targetRotation = 50 + (Math.random() - 0.5) * 10;
            const targetPull = 50 + (Math.random() - 0.5) * 8;
            const targetTemp = 1415 + (Math.random() - 0.5) * 6;

            const currentRotation = parseInt(rotationSlider.value);
            const currentPull = parseInt(pullSlider.value);
            const currentTemp = parseInt(tempSlider.value);

            // Move toward optimal values gradually with some AI "learning"
            if (Math.abs(currentRotation - targetRotation) > 2) {
                rotationSlider.value = currentRotation + (targetRotation > currentRotation ? 2 : -2);
            }
            if (Math.abs(currentPull - targetPull) > 2) {
                pullSlider.value = currentPull + (targetPull > currentPull ? 2 : -2);
            }
            if (Math.abs(currentTemp - targetTemp) > 2) {
                tempSlider.value = currentTemp + (targetTemp > currentTemp ? 2 : -2);
            }

            // Trigger display updates
            rotationSlider.dispatchEvent(new Event('input'));
            pullSlider.dispatchEvent(new Event('input'));
            tempSlider.dispatchEvent(new Event('input'));

        }, 800);
    }
}

// Enhanced CSS for crystal growing game
const enhancedCrystalCSS = `
    @keyframes moltenBubble {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes segmentGrow {
        0% { height: 0; opacity: 0; transform: scaleY(0); }
        100% { height: 12px; opacity: 1; transform: scaleY(1); }
    }
    
    .crystal-grower {
        display: flex;
        gap: 20px;
        width: 100%;
        min-height: 350px;
    }
    
    .crystal-display {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .molten-pot {
        position: relative;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.1));
        border-radius: 15px;
        padding: 20px;
    }
    
    .controls {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .crystal-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin: 15px 0;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .crystal-stats div {
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .advanced-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
    }
    
    .progress-segments {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-height: 160px;
        max-height: 160px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow-y: auto;
    }
    
    .growth-status {
        color: white;
        font-weight: 600;
        text-align: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

// Add the enhanced CSS to the document
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = enhancedCrystalCSS;
document.head.appendChild(enhancedStyle);