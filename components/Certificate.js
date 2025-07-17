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
                background: linear-gradient(135deg, #fdfdfd 0%, #f0f0f0 100%);
                border: 10px double #b8860b; /* Richer gold */
                border-radius: 20px;
                padding: 4rem;
                margin: 1rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255,255,255,0.5);
                min-height: 650px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-family: 'Cinzel', serif; /* Elegant, certificate-like font */
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
                    transparent 15px,
                    rgba(184, 134, 11, 0.03) 15px,
                    rgba(184, 134, 11, 0.03) 30px
                );
                z-index: 0;
            }

            .certificate::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-shadow: inset 0 0 50px rgba(0,0,0,0.1); /* Vignette effect */
                pointer-events: none;
            }

            .certificate > * {
                position: relative;
                z-index: 1;
            }

            .certificate-watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 6rem;
                color: rgba(184, 134, 11, 0.08);
                font-weight: bold;
                pointer-events: none;
                text-transform: uppercase;
                letter-spacing: 10px;
            }

            .certificate-logo {
                width: 150px;
                height: auto;
                margin: 0 auto 1.5rem;
                display: block;
                filter: drop-shadow(3px 3px 5px rgba(0,0,0,0.3));
                border: 2px solid #b8860b;
                border-radius: 50%;
                padding: 10px;
                background: white;
            }

            .certificate-header h1 {
                color: #001f3f;
                font-size: 3rem;
                margin-bottom: 0.5rem;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
                letter-spacing: 2px;
                text-transform: uppercase;
            }

            .certificate-header h2 {
                color: #4a5568;
                font-size: 2rem;
                margin-bottom: 2rem;
                font-style: italic;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }

            .certificate-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 2rem 0;
            }

            .certificate-body p {
                color: #333333;
                font-size: 1.4rem;
                margin-bottom: 1.5rem;
                line-height: 1.7;
            }

            .certificate-body h3 {
                color: #001f3f;
                font-size: 2.8rem;
                margin: 1.5rem 0;
                border-bottom: 3px solid #b8860b;
                padding-bottom: 0.7rem;
                font-weight: 700;
                text-decoration: underline;
                text-decoration-color: #b8860b;
                text-decoration-thickness: 2px;
            }

            .certificate-achievement {
                background: rgba(184, 134, 11, 0.1);
                border-radius: 15px;
                padding: 1.5rem;
                margin: 2rem 0;
                border: 1px dashed #b8860b;
            }

            .certificate-achievement ul {
                list-style-type: none;
                padding: 0;
                text-align: center;
                margin: 0 auto;
            }

            .certificate-achievement li {
                margin: 0.7rem 0;
                color: #001f3f;
                font-size: 1.2rem;
                position: relative;
                padding-left: 25px;
            }

            .certificate-achievement li::before {
                content: '★';
                position: absolute;
                left: 0;
                color: #b8860b;
            }

            .certificate-body ul {
                list-style-type: none;
                text-align: left;
                max-width: 600px;
                margin: 1.5rem auto;
                color: #4a5568;
                padding: 0;
            }

            .certificate-body li {
                margin: 0.5rem 0;
                position: relative;
                padding-left: 25px;
            }

            .certificate-body li::before {
                content: '◆';
                position: absolute;
                left: 0;
                color: #b8860b;
            }

            .certificate-date {
                margin: 2.5rem 0;
                font-size: 1.3rem;
                color: #001f3f;
                font-style: italic;
                background: rgba(184, 134, 11, 0.05);
                padding: 0.5rem;
                border-radius: 5px;
            }

            .certificate-id {
                font-size: 1rem;
                color: #666666;
                margin-top: 1.5rem;
                font-style: italic;
                letter-spacing: 1px;
            }

            .certificate-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 3rem;
                border-top: 3px double #b8860b;
                padding-top: 1.5rem;
            }

            .certificate-signature {
                text-align: left;
            }

            .certificate-signature p {
                color: #001f3f;
                font-weight: 600;
                font-size: 1.2rem;
                margin: 0.3rem 0;
                font-style: italic;
                text-decoration: underline;
                text-decoration-color: #b8860b;
            }

            .certificate-seal {
                width: 120px;
                height: auto;
                filter: drop-shadow(3px 3px 5px rgba(0,0,0,0.3));
                opacity: 0.9;
            }

            .certificate-quote {
                font-style: italic;
                color: #4a5568;
                font-size: 1.1rem;
                margin-top: 2rem;
                padding: 1rem;
                border-left: 4px solid #b8860b;
                background: rgba(184, 134, 11, 0.05);
            }

            @media print {
                .certificate {
                    border: 10px double #b8860b;
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

        // Load elegant font if needed
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }

    generateCertificate() {
        const studentName = document.getElementById('studentName').textContent;
        const completionDate = document.getElementById('completionDate').textContent;

        // Update certificate content with even more beautiful design
        this.certificateElement.innerHTML = `
            <div class="certificate-watermark">Authentic Certificate</div>

            <img src="assets/images/jigyasa_logo.png" alt="CSIR Logo" class="certificate-logo">

            <div class="certificate-header">
                <h1>Certificate of Excellence</h1>
                <h2>SilicoQuest: The Rock That Became a Brain</h2>
            </div>

            <div class="certificate-body">
                <p>Be it known that</p>
                <h3>${studentName}</h3>
                <p>has demonstrated exceptional dedication in completing this transformative educational journey, mastering the art and science of silicon technology.</p>
                
                <div class="certificate-achievement">
                    <p><strong>Distinguished Achievements:</strong></p>
                    <ul>
                        <li>Silicon Mastery Award 🏆</li>
                        <li>Expert in Chip Fabrication</li>
                        <li>Logic Gate Architect</li>
                        <li>Digital Innovation Pioneer</li>
                    </ul>
                </div>

                <p>Acquired Knowledge:</p>
                <ul>
                    <li>The alchemical transformation of quartz to silicon</li>
                    <li>Crystal cultivation and wafer artistry</li>
                    <li>Precision photolithography and etching</li>
                    <li>Transistor symphony and logic orchestration</li>
                    <li>Integrated circuit masterpiece creation</li>
                    <li>Silicon's evolution to artificial intelligence</li>
                </ul>

                <div class="certificate-date">
                    <p>Awarded on: ${completionDate}</p>
                </div>

                <p class="certificate-id">Verification ID: ${this.generateCertificateId()}</p>

                <p class="certificate-quote">"From humble sand to the pinnacle of innovation – your journey inspires the future."</p>
            </div>

            <div class="certificate-footer">
                <div class="certificate-signature">
                    <p>Director of Education</p>
                    <p>CSIR Jigyasa Science Outreach Program</p>
                </div>
                <img src="assets/images/jigyasa_seal.png" alt="Official Seal" class="certificate-seal">
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
                scale: 4, // Higher resolution for better print quality
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
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>SilicoQuest Certificate</title>
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    body { 
                        font-family: 'Cinzel', serif; 
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
                background: linear-gradient(135deg, #fdfdfd 0%, #f0f0f0 100%);
                border: 10px double #b8860b;
                border-radius: 20px;
                padding: 3rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                width: 1000px;
                height: 700px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                box-shadow: none;
            }

            .certificate-watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 6rem;
                color: rgba(184, 134, 11, 0.08);
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 10px;
            }

            .certificate-logo {
                width: 150px;
                height: auto;
                margin: 0 auto 1.5rem;
                display: block;
                border: 2px solid #b8860b;
                border-radius: 50%;
                padding: 10px;
                background: white;
            }

            .certificate-header h1 {
                color: #001f3f;
                font-size: 3rem;
                margin-bottom: 0.5rem;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            
            .certificate-header h2 {
                color: #4a5568;
                font-size: 2rem;
                margin-bottom: 2rem;
                font-style: italic;
            }
            
            .certificate-body h3 {
                color: #001f3f;
                font-size: 2.8rem;
                margin: 1.5rem 0;
                border-bottom: 3px solid #b8860b;
                padding-bottom: 0.7rem;
            }

            /* Add other styles as needed for print */
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
        const shareText = `🎓 Proud to have completed SilicoQuest: The Rock That Became a Brain! 

From sand to silicon brains – an incredible journey of discovery! 🧠✨

#SilicoQuest #STEMEducation #CSIRJigyasa`;

        if (navigator.share) {
            navigator.share({
                title: 'My SilicoQuest Certificate',
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
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

    getCertificateData() {
        const studentName = document.getElementById('studentName').textContent;
        const completionDate = document.getElementById('completionDate').textContent;
        
        return {
            studentName,
            completionDate,
            program: 'SilicoQuest: The Rock That Became a Brain',
            organization: 'CSIR Jigyasa Science Outreach Program',
            achievements: [
                'Silicon Mastery Award',
                'Completed Interactive Quest',
                'Chip Fabrication Expert',
                'Digital Innovation Pioneer'
            ],
            timestamp: new Date().toISOString(),
            certificateId: this.generateCertificateId()
        };
    }

    generateCertificateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `SQ-${timestamp}-${random}`.toUpperCase();
    }
}

// Add animations and font
 const certificateStyle = document.createElement('style');
certificateStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeInOut {
        0% { opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(certificateStyle);