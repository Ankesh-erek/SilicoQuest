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
                border: 8px double #b8860b; /* Slightly thinner border for better fit */
                border-radius: 15px;
                padding: 2.5rem; /* Reduced padding for better fit */
                margin: 0.5rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255,255,255,0.5);
                max-height: 580px; /* Reduced height to fit A4 landscape */
                min-height: 580px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-family: 'Cinzel', serif; /* Elegant, certificate-like font */
                box-sizing: border-box;
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

        // Update certificate content with optimized design for A4 landscape
        this.certificateElement.innerHTML = `
            <div class="certificate-watermark">Authentic Certificate</div>

            <img src="assets/images/jigyasa_logo.png" alt="CSIR Logo" class="certificate-logo">

            <div class="certificate-header">
                <h1>Certificate of Excellence</h1>
                <h2>SilicoQuest: The Rock That Became a Brain</h2>
            </div>

            <div class="certificate-body">
                <p>This certifies that</p>
                <h3>${studentName}</h3>
                <p>has successfully completed the SilicoQuest journey and mastered the transformation of silicon from sand to the brain of computers.</p>
                
                <div class="certificate-achievement">
                    <p><strong>Achievements Unlocked:</strong></p>
                    <ul>
                        <li>Silicon Mastery Award 🏆</li>
                        <li>Chip Fabrication Expert</li>
                        <li>Logic Gate Architect</li>
                        <li>Digital Innovation Pioneer</li>
                    </ul>
                </div>

                <div class="certificate-date">
                    <p>Completed on: ${completionDate}</p>
                </div>

                <p class="certificate-id">Certificate ID: ${this.generateCertificateId()}</p>

                <p class="certificate-quote">"From humble sand to the pinnacle of innovation"</p>
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
            // Store original styles
            const elem = this.certificateElement;
            const originalStyle = elem.style.cssText;
            
            // Set optimal dimensions for A4 landscape (297mm x 210mm)
            // Using 3.78 pixels per mm for good quality
            const a4LandscapeWidth = 297 * 3.78; // ~1123px
            const a4LandscapeHeight = 210 * 3.78; // ~794px
            
            // Apply temporary styles for PDF generation
            elem.style.cssText = `
                width: ${a4LandscapeWidth}px !important;
                height: ${a4LandscapeHeight}px !important;
                max-height: ${a4LandscapeHeight}px !important;
                min-height: ${a4LandscapeHeight}px !important;
                margin: 0 !important;
                padding: 30px !important;
                box-sizing: border-box !important;
                border: 6px double #b8860b !important;
                border-radius: 10px !important;
                overflow: hidden !important;
                font-size: 14px !important;
            `;
            
            // Adjust font sizes for better fit
            const headers = elem.querySelectorAll('h1, h2, h3');
            const originalFontSizes = [];
            headers.forEach((header, index) => {
                originalFontSizes[index] = header.style.fontSize;
                if (header.tagName === 'H1') {
                    header.style.fontSize = '2.2rem !important';
                } else if (header.tagName === 'H2') {
                    header.style.fontSize = '1.6rem !important';
                } else if (header.tagName === 'H3') {
                    header.style.fontSize = '2.2rem !important';
                }
            });
            
            // Adjust spacing for achievement section
            const achievement = elem.querySelector('.certificate-achievement');
            if (achievement) {
                achievement.style.margin = '1rem 0 !important';
                achievement.style.padding = '1rem !important';
            }
            
            // Adjust body content spacing
            const body = elem.querySelector('.certificate-body');
            if (body) {
                body.style.padding = '1rem 0 !important';
                const paragraphs = body.querySelectorAll('p');
                paragraphs.forEach(p => {
                    p.style.margin = '0.8rem 0 !important';
                    p.style.fontSize = '1.1rem !important';
                });
            }
            
            // Wait for styles to apply
            await new Promise(resolve => setTimeout(resolve, 300));

            // Capture with html2canvas
            const canvas = await html2canvas(elem, {
                scale: 2, // High quality
                useCORS: true,
                backgroundColor: '#ffffff',
                width: a4LandscapeWidth,
                height: a4LandscapeHeight,
                scrollX: 0,
                scrollY: 0
            });

            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Add image to PDF with exact A4 landscape dimensions
            pdf.addImage(
                canvas.toDataURL('image/png', 1.0),
                'PNG',
                0,
                0,
                297, // A4 landscape width in mm
                210  // A4 landscape height in mm
            );

            // Generate filename
            const studentName = document.getElementById('studentName').textContent;
            const date = new Date().toISOString().split('T')[0];
            const filename = `SilicoQuest_Certificate_${studentName.replace(/\s+/g, '_')}_${date}.pdf`;

            // Download the PDF
            pdf.save(filename);

            // Restore original styles
            elem.style.cssText = originalStyle;
            headers.forEach((header, index) => {
                header.style.fontSize = originalFontSizes[index];
            });

            // Show success message
            this.showDownloadSuccess();

        } catch (error) {
            console.error('Failed to generate certificate:', error);
            // Restore original styles in case of error
            const elem = this.certificateElement;
            elem.style.cssText = '';
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
        // Return optimized certificate CSS for printing in A4 landscape
        return `
            @page {
                size: A4 landscape;
                margin: 0.5in;
            }
            
            .certificate {
                background: linear-gradient(135deg, #fdfdfd 0%, #f0f0f0 100%);
                border: 8px double #b8860b;
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                width: 100%;
                max-width: 10in;
                height: 7in;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: none;
                box-sizing: border-box;
                font-family: 'Cinzel', serif;
            }

            .certificate-watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 4rem;
                color: rgba(184, 134, 11, 0.08);
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 8px;
            }

            .certificate-logo {
                width: 100px;
                height: auto;
                margin: 0 auto 1rem;
                display: block;
                border: 2px solid #b8860b;
                border-radius: 50%;
                padding: 8px;
                background: white;
            }

            .certificate-header h1 {
                color: #001f3f;
                font-size: 2.2rem;
                margin-bottom: 0.3rem;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            
            .certificate-header h2 {
                color: #4a5568;
                font-size: 1.6rem;
                margin-bottom: 1.5rem;
                font-style: italic;
            }
            
            .certificate-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 1rem 0;
            }
            
            .certificate-body p {
                color: #333333;
                font-size: 1.1rem;
                margin: 0.5rem 0;
                line-height: 1.4;
            }
            
            .certificate-body h3 {
                color: #001f3f;
                font-size: 2.2rem;
                margin: 1rem 0;
                border-bottom: 3px solid #b8860b;
                padding-bottom: 0.5rem;
                font-weight: 700;
            }

            .certificate-achievement {
                background: rgba(184, 134, 11, 0.1);
                border-radius: 10px;
                padding: 1rem;
                margin: 1rem 0;
                border: 1px dashed #b8860b;
            }

            .certificate-achievement ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
            }

            .certificate-achievement li {
                margin: 0.4rem 0;
                color: #001f3f;
                font-size: 1rem;
                position: relative;
                padding-left: 20px;
            }

            .certificate-achievement li::before {
                content: '★';
                position: absolute;
                left: 0;
                color: #b8860b;
            }

            .certificate-date {
                margin: 1rem 0;
                font-size: 1.1rem;
                color: #001f3f;
                font-style: italic;
                background: rgba(184, 134, 11, 0.05);
                padding: 0.4rem;
                border-radius: 5px;
            }

            .certificate-id {
                font-size: 0.9rem;
                color: #666666;
                margin: 0.5rem 0;
                font-style: italic;
            }

            .certificate-quote {
                font-style: italic;
                color: #4a5568;
                font-size: 1rem;
                margin: 1rem 0;
                padding: 0.8rem;
                border-left: 4px solid #b8860b;
                background: rgba(184, 134, 11, 0.05);
            }

            .certificate-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1.5rem;
                border-top: 3px double #b8860b;
                padding-top: 1rem;
            }

            .certificate-signature {
                text-align: left;
            }

            .certificate-signature p {
                color: #001f3f;
                font-weight: 600;
                font-size: 1rem;
                margin: 0.2rem 0;
                font-style: italic;
            }

            .certificate-seal {
                width: 80px;
                height: auto;
                opacity: 0.9;
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