// Chapter Management System
class ChapterManager {
    constructor(chapters) {
        this.chapters = chapters;
        this.currentChapter = 1;
        this.completedChapters = new Set();
        this.chapterProgress = {};
        
        this.init();
    }

    init() {
        // Initialize progress tracking for each chapter
        this.chapters.forEach(chapter => {
            this.chapterProgress[chapter.chapterNumber] = {
                narrationStage: 0,
                gameCompleted: false,
                timeSpent: 0,
                startTime: null
            };
        });

        // Load progress from localStorage if available
        this.loadProgress();
    }

    // Get chapter data by number
    getChapter(chapterNumber) {
        return this.chapters.find(ch => ch.chapterNumber === chapterNumber);
    }

    // Get current chapter data
    getCurrentChapter() {
        return this.getChapter(this.currentChapter);
    }

    // Set current chapter
    setCurrentChapter(chapterNumber) {
        if (chapterNumber >= 1 && chapterNumber <= this.chapters.length) {
            // Save time spent on previous chapter
            if (this.chapterProgress[this.currentChapter].startTime) {
                this.chapterProgress[this.currentChapter].timeSpent += 
                    Date.now() - this.chapterProgress[this.currentChapter].startTime;
            }

            this.currentChapter = chapterNumber;
            this.chapterProgress[chapterNumber].startTime = Date.now();
            this.saveProgress();
            return true;
        }
        return false;
    }

    // Mark chapter as completed
    completeChapter(chapterNumber) {
        this.completedChapters.add(chapterNumber);
        this.chapterProgress[chapterNumber].gameCompleted = true;
        
        // Save time spent
        if (this.chapterProgress[chapterNumber].startTime) {
            this.chapterProgress[chapterNumber].timeSpent += 
                Date.now() - this.chapterProgress[chapterNumber].startTime;
            this.chapterProgress[chapterNumber].startTime = null;
        }

        this.saveProgress();
        this.triggerChapterCompletionEvent(chapterNumber);
    }

    // Check if chapter is completed
    isChapterCompleted(chapterNumber) {
        return this.completedChapters.has(chapterNumber);
    }

    // Get completion percentage
    getCompletionPercentage() {
        return (this.completedChapters.size / this.chapters.length) * 100;
    }

    // Get next available chapter
    getNextChapter() {
        if (this.currentChapter < this.chapters.length) {
            return this.currentChapter + 1;
        }
        return null;
    }

    // Get previous chapter
    getPreviousChapter() {
        if (this.currentChapter > 1) {
            return this.currentChapter - 1;
        }
        return null;
    }

    // Update narration stage progress
    updateNarrationStage(chapterNumber, stage) {
        if (this.chapterProgress[chapterNumber]) {
            this.chapterProgress[chapterNumber].narrationStage = stage;
            this.saveProgress();
        }
    }

    // Get narration stage progress
    getNarrationStage(chapterNumber) {
        return this.chapterProgress[chapterNumber]?.narrationStage || 0;
    }

    // Check if all chapters are completed
    isQuestCompleted() {
        return this.completedChapters.size === this.chapters.length;
    }

    // Get chapter statistics
    getChapterStats(chapterNumber) {
        const progress = this.chapterProgress[chapterNumber];
        const chapter = this.getChapter(chapterNumber);
        
        if (!progress || !chapter) return null;

        return {
            chapterNumber,
            title: chapter.title,
            timeSpent: this.formatTime(progress.timeSpent),
            narrationProgress: `${progress.narrationStage + 1}/${chapter.narration.length}`,
            gameCompleted: progress.gameCompleted,
            completed: this.isChapterCompleted(chapterNumber)
        };
    }

    // Get overall quest statistics
    getQuestStats() {
        const totalTime = Object.values(this.chapterProgress)
            .reduce((sum, progress) => sum + progress.timeSpent, 0);

        return {
            chaptersCompleted: this.completedChapters.size,
            totalChapters: this.chapters.length,
            completionPercentage: this.getCompletionPercentage(),
            totalTimeSpent: this.formatTime(totalTime),
            currentChapter: this.currentChapter,
            questCompleted: this.isQuestCompleted()
        };
    }

    // Format time in milliseconds to readable format
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Save progress to localStorage
    saveProgress() {
        try {
            const progressData = {
                currentChapter: this.currentChapter,
                completedChapters: Array.from(this.completedChapters),
                chapterProgress: this.chapterProgress,
                lastSaved: Date.now()
            };
            localStorage.setItem('silicoquest_progress', JSON.stringify(progressData));
        } catch (error) {
            console.warn('Failed to save progress:', error);
        }
    }

    // Load progress from localStorage
    loadProgress() {
        try {
            const savedData = localStorage.getItem('silicoquest_progress');
            if (savedData) {
                const progressData = JSON.parse(savedData);
                
                this.currentChapter = progressData.currentChapter || 1;
                this.completedChapters = new Set(progressData.completedChapters || []);
                
                // Merge saved progress with initialized progress
                if (progressData.chapterProgress) {
                    Object.keys(progressData.chapterProgress).forEach(chapterNum => {
                        if (this.chapterProgress[chapterNum]) {
                            Object.assign(this.chapterProgress[chapterNum], 
                                         progressData.chapterProgress[chapterNum]);
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('Failed to load progress:', error);
        }
    }

    // Reset all progress
    resetProgress() {
        this.currentChapter = 1;
        this.completedChapters.clear();
        
        // Reset chapter progress
        this.chapters.forEach(chapter => {
            this.chapterProgress[chapter.chapterNumber] = {
                narrationStage: 0,
                gameCompleted: false,
                timeSpent: 0,
                startTime: null
            };
        });

        // Clear localStorage
        localStorage.removeItem('silicoquest_progress');
        
        this.triggerProgressResetEvent();
    }

    // Get chapter unlock status
    isChapterUnlocked(chapterNumber) {
        // First chapter is always unlocked
        if (chapterNumber === 1) return true;
        
        // Other chapters unlock when previous chapter is completed
        return this.isChapterCompleted(chapterNumber - 1);
    }

    // Get chapters summary for progress display
    getChaptersSummary() {
        return this.chapters.map(chapter => {
            const progress = this.chapterProgress[chapter.chapterNumber];
            return {
                number: chapter.chapterNumber,
                title: chapter.title,
                description: chapter.description,
                completed: this.isChapterCompleted(chapter.chapterNumber),
                unlocked: this.isChapterUnlocked(chapter.chapterNumber),
                current: chapter.chapterNumber === this.currentChapter,
                progress: progress ? {
                    narrationStage: progress.narrationStage,
                    totalNarrationStages: chapter.narration.length,
                    gameCompleted: progress.gameCompleted,
                    timeSpent: this.formatTime(progress.timeSpent)
                } : null
            };
        });
    }

    // Event system for chapter completion
    triggerChapterCompletionEvent(chapterNumber) {
        const event = new CustomEvent('chapterCompleted', {
            detail: {
                chapterNumber,
                chapter: this.getChapter(chapterNumber),
                stats: this.getChapterStats(chapterNumber),
                questCompleted: this.isQuestCompleted()
            }
        });
        document.dispatchEvent(event);
    }

    // Event for progress reset
    triggerProgressResetEvent() {
        const event = new CustomEvent('progressReset', {
            detail: {
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // Get hints for current chapter
    getChapterHints(chapterNumber) {
        const chapter = this.getChapter(chapterNumber);
        if (!chapter) return [];

        // Generate contextual hints based on chapter content
        const hints = [];
        
        switch (chapterNumber) {
            case 1:
                hints.push("Look for shiny, crystal-like rocks - those contain quartz!");
                hints.push("Quartz crystals are usually clear or white in color.");
                break;
            case 2:
                hints.push("Keep the temperature steady around 2000°C for best results.");
                hints.push("Watch the color changes - they indicate the reaction progress.");
                break;
            case 3:
                hints.push("Slow and steady wins the race - don't pull too fast!");
                hints.push("The rotation speed affects crystal quality.");
                break;
            case 4:
                hints.push("Precision is key - even tiny scratches can ruin a wafer.");
                hints.push("Take your time with the polishing process.");
                break;
            case 5:
                hints.push("AND gates need both inputs to be ON to produce output.");
                hints.push("OR gates produce output when any input is ON.");
                break;
            case 6:
                hints.push("Connect the outputs of one gate to inputs of another.");
                hints.push("Think about how you want the circuit to behave.");
                break;
            case 7:
                hints.push("Start with simple instructions like 'load' and 'add'.");
                hints.push("Programs are just sequences of simple steps.");
                break;
            case 8:
                hints.push("Review what you've learned - from sand to smart devices!");
                hints.push("Think about how silicon chips are used in everyday life.");
                break;
        }

        return hints;
    }

    // Export progress data for sharing or backup
    exportProgress() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            progress: {
                currentChapter: this.currentChapter,
                completedChapters: Array.from(this.completedChapters),
                chapterProgress: this.chapterProgress
            },
            stats: this.getQuestStats()
        };

        return JSON.stringify(exportData, null, 2);
    }

    // Import progress data
    importProgress(progressJson) {
        try {
            const importData = JSON.parse(progressJson);
            
            if (importData.version && importData.progress) {
                this.currentChapter = importData.progress.currentChapter || 1;
                this.completedChapters = new Set(importData.progress.completedChapters || []);
                
                if (importData.progress.chapterProgress) {
                    Object.assign(this.chapterProgress, importData.progress.chapterProgress);
                }

                this.saveProgress();
                return true;
            }
        } catch (error) {
            console.error('Failed to import progress:', error);
        }
        return false;
    }
}