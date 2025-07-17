// Certificate Generation System
class Certificate {
    constructor() {
        this.certificateElement = document.getElementById('certificate');
        this.init();
    }

    init() {
        // Add certificate styles
        this.addCertificateStyles();
    }

    addCertificateStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .certificate {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border: 5px solid #4299e1;
                border-radius: 20px;
                padding: 3rem;
                margin: 1rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                min-height: 500px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            .certificate::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(66, 153, 225, 0.05) 10px,
                    rgba(66, 153, 225, 0.05) 20px
                );
                z-index: 0;
            }

            .certificate > * {
                position: relative;
                z-index: 1;
            }

            .certificate-header {
                margin-bottom: 2rem;
            }

            .certificate-header h1 {
                color: #2d3748;
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            }

            .certificate-header h2 {
                color: #4a5568;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                font-weight: 400;
            }

            .certificate-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 2rem 0;
            }

            .certificate-body p {
                color: #718096;
                font-size: 1.2rem;
                margin-bottom: 1rem;
                line-height: 1.6;
            }

            .certificate-body h3 {
                color: #2d3748;
                font-size: 2.5rem;
                margin: 2rem 0;
                border-bottom: 3px solid #4299e1;
                padding-bottom: 1rem;
                font-weight: 700;
            }

            .certificate-achievement {
                background: rgba(66, 153, 225, 0.1);
                border-radius: 15px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border-left: 5px solid #4299e1;
            }

            .certificate-date {
                margin: 2rem 0;
                font-size: 1.1rem;
                color: #4a5568;
            }

            .certificate-signature {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 2px solid #e2e8f0;
            }

            .certificate-signature p {
                color: #2d3748;
                font-weight: 600;
                font-size: 1.1rem;
            }

            
            .certificate-decorations {
                position: absolute;
                top: 20px;
                left: 20px;
                font-size: 2rem;
                opacity: 0.3;
            }

            .certificate-decorations:nth-child(2) {
                top: 20px;
                right: 20px;
                left: auto;
            }

            .certificate-decorations:nth-child(3) {
                bottom: 20px;
                left: 20px;
                top: auto;
            }

            .certificate-decorations:nth-child(4) {
                bottom: 20px;
                right: 20px;
                top: auto;
                left: auto;
            }

            @media print {
                .certificate {
                    border: 3px solid #4299e1;
                    box-shadow: none;
                    margin: 0;
                    min-height: auto;
                }
                
                .certificate-actions {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    generateCertificate() {
        const studentName = document.getElementById('studentName').textContent;
        const completionDate = document.getElementById('completionDate').textContent;

        // Update certificate content with enhanced design
        this.certificateElement.innerHTML = `
            <div class="certificate-decorations">🧠</div>
            <div class="certificate-decorations">💎</div>
            <div class="certificate-decorations">🔬</div>
            <div class="certificate-decorations">⚡</div>
            
            <div class="certificate-header">
                <div class="certificate-logo">🎓</div>
                <h1>Certificate of Completion</h1>
                <h2>SilicoQuest: The Rock That Became a Brain</h2>
            </div>

            <div class="certificate-body">
                <p>This certifies that</p>
                <h3>${studentName}</h3>
                <p>has successfully completed the SilicoQuest educational journey</p>
                
                <div class="certificate-achievement">
                    <p><strong>Achievement Unlocked:</strong></p>
                    <p>🏆 Silicon Science Explorer</p>
                    <p>Mastered the transformation from sand to silicon brain</p>
                </div>

                <p>Through interactive learning, you have discovered:</p>
                <ul style="text-align: left; max-width: 400px; margin: 1rem auto; color: #4a5568;">
                    <li>How quartz becomes pure silicon</li>
                    <li>The crystal growing process</li>
                    <li>Wafer fabrication techniques</li>
                    <li>Logic gate construction</li>
                    <li>Circuit design principles</li>
                    <li>Programming fundamentals</li>
                    <li>The silicon revolution's impact</li>
                </ul>

                <div class="certificate-date">
                    <p><strong>Completed on:</strong> ${completionDate}</p>
                </div>
            </div>

            <div class="certificate-signature">
                <p><strong>CSIR Jigyasa Science Outreach Program</strong></p>
                <p style="font-size: 0.9rem; color: #718096; margin-top: 0.5rem;">
                    Inspiring Scientific Curiosity in Young Minds
                </p>
            </div>
        `;

        // Generate and download the certificate
        this.downloadCertificateAsPDF();
    }

    async downloadCertificateAsPDF() {
        try {
            // Wait a moment for the certificate to render
            await new Promise(resolve => setTimeout(resolve, 500));

            // Use html2canvas to capture the certificate
            const canvas = await html2canvas(this.certificateElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: this.certificateElement.offsetWidth,
                height: this.certificateElement.offsetHeight
            });

            // Create PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit the page
            const imgWidth = 297; // A4 landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add the image to PDF
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                0,
                (210 - imgHeight) / 2, // Center vertically
                imgWidth,
                imgHeight
            );

            // Generate filename with student name and date
            const studentName = document.getElementById('studentName').textContent;
            const date = new Date().toISOString().split('T')[0];
            const filename = `SilicoQuest_Certificate_${studentName.replace(/\s+/g, '_')}_${date}.pdf`;

            // Download the PDF
            pdf.save(filename);

            // Show success message
            this.showDownloadSuccess();

        } catch (error) {
            console.error('Failed to generate certificate:', error);
            this.showDownloadError();
        }
    }

    // Alternative method using browser's print functionality
    printCertificate() {
        // Hide everything except the certificate
        const originalDisplay = document.body.style.display;
        const certificateModal = document.getElementById('certificateModal');
        
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>SilicoQuest Certificate</title>
                <style>
                    body { 
                        font-family: 'Poppins', Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px;
                        background: white;
                    }
                    ${this.getCertificateCSS()}
                </style>
            </head>
            <body>
                ${this.certificateElement.outerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    }

    getCertificateCSS() {
        // Return the certificate CSS for printing
        return `
            .certificate {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border: 10px solid #4299e1;
                border-radius: 20px;
                padding: 2rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                width: 1000px;
                height: 650px;
                box-shadow: none;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .certificate .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 500px;
                height: 500px;
                opacity: 0.1;
                transform: translate(-50%, -50%) rotate(-15deg);
                z-index: 0;
            }

            .certificate-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                margin-bottom: 1.5rem;
            }

            .certificate-logo {
                width: 150px;
                height: auto;
            }

            .certificate-header h1 {
                color: #2d3748;
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
            }
            
            .certificate-header h2 {
                color: #4a5568;
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                font-weight: 400;
            }
            
            .certificate-body h3 {
                color: #2d3748;
                font-size: 2.2rem;
                margin: 1.5rem 0;
                border-bottom: 3px solid #4299e1;
                padding-bottom: 1rem;
                font-weight: 700;
            }
        `;
    }

    showDownloadSuccess() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #48bb78;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 2000;
            animation: fadeInOut 3s ease-in-out;
        `;
        message.textContent = '🎉 Certificate downloaded successfully!';
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentElement) {
                message.parentElement.removeChild(message);
            }
        }, 3000);
    }

    showDownloadError() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e53e3e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 2000;
            animation: fadeInOut 3s ease-in-out;
        `;
        message.innerHTML = `
            ❌ Download failed. <br>
            <small>Try using the print option instead.</small>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentElement) {
                message.parentElement.removeChild(message);
            }
        }, 3000);
    }

    // Method to share certificate on social media
    shareCertificate() {
        const studentName = document.getElementById('studentName').textContent;
        const shareText = `🎓 I just completed SilicoQuest: The Rock That Became a Brain! 
        
I learned how sand transforms into the silicon chips that power our digital world. From quartz crystals to computer logic - what an amazing journey! 🧠💎

#SilicoQuest #STEM #Education #SiliconScience #CSIRJigyasa`;

        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'SilicoQuest Certificate',
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showMessage('Share text copied to clipboard! 📋', 'success');
            }).catch(() => {
                this.showMessage('Unable to copy share text', 'error');
            });
        }
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        const colors = {
            success: '#48bb78',
            error: '#e53e3e',
            info: '#4299e1'
        };
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 2000;
            animation: slideInRight 0.5s ease-out;
        `;
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentElement) {
                message.parentElement.removeChild(message);
            }
        }, 3000);
    }

    // Generate certificate data for API submission (if needed)
    getCertificateData() {
        const studentName = document.getElementById('studentName').textContent;
        const completionDate = document.getElementById('completionDate').textContent;
        
        return {
            studentName,
            completionDate,
            program: 'SilicoQuest: The Rock That Became a Brain',
            organization: 'CSIR Jigyasa Science Outreach Program',
            achievements: [
                'Silicon Science Explorer',
                'Completed 8 interactive chapters',
                'Mastered chip fabrication process',
                'Understanding of computer science fundamentals'
            ],
            timestamp: new Date().toISOString(),
            certificateId: this.generateCertificateId()
        };
    }

    generateCertificateId() {
        // Generate a unique certificate ID
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `SILICO-${timestamp}-${random}`.toUpperCase();
    }
}

// Add slide-in animation for messages
const certificateStyle = document.createElement('style');
certificateStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(certificateStyle);