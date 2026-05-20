export function generateCertificateHTML(data: any) {
    // Default values mapping incoming functional arguments
    const certificateData = {
        recipientName: data.recipientName || "John Doe",
        profilePic: data.profilePic || "",
        courseName: data.courseName || "ADCA",
        courseFullName: data.courseFullName || "(Advance Diploma In Computer Application)",
        issueDate: data.issueDate || "25 May 2024",
        authorizedSignatureName: data.authorizedSignatureName || "Authorized Signatory",
        logo: data.logo || "",
        qrCodeUrl: data.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Verified",
        instituteName: data.instituteName || "EDUSTART",
        instituteSubText: data.instituteSubText || "Edustart RN Computer And Vocational Training Institute Private Limited",
        instituteContact: data.instituteContact || "+919416059799"
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Achievement</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap');

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #eef2f5;
                font-family: 'Montserrat', sans-serif;
                min-height: 100vh;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            /* Main Premium Container with Background Grid Pattern */
            .certificate-container {
                position: relative;
                width: 1000px;
                height: 700px;
                background: #ffffff;
                background-image: radial-gradient(rgba(197, 168, 128, 0.08) 1.5px, transparent 1.5px), 
                                  radial-gradient(rgba(11, 29, 51, 0.03) 1px, transparent 1px);
                background-size: 24px 24px;
                background-position: 0 0, 12px 12px;
                padding: 35px;
                overflow: hidden;
                box-shadow: 0px 25px 60px rgba(11, 29, 51, 0.15);
                
                /* Composite Double Frame Construction */
                border: 24px solid #0B1D33; 
                outline: 2px solid #C5A880;
                outline-offset: -10px;
            }

            /* Triple Line Inset Fillet Lines */
            .inner-border-line {
                position: absolute;
                top: 8px;
                left: 8px;
                right: 8px;
                bottom: 8px;
                border: 1px solid rgba(197, 168, 128, 0.4);
                pointer-events: none;
            }

            /* Elegant Vector Corner Accent Structures */
            .corner-decoration {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 2px solid #C5A880;
                z-index: 5;
            }
            .corner-tl { top: 14px; left: 14px; border-right: none; border-bottom: none; }
            .corner-tr { top: 14px; right: 14px; border-left: none; border-bottom: none; }
            .corner-bl { bottom: 14px; left: 14px; border-right: none; border-top: none; }
            .corner-br { bottom: 14px; right: 14px; border-left: none; border-top: none; }

            /* Main Layout Grid Flexbox */
            .certificate-content {
                position: relative;
                z-index: 10;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                border: 1px solid rgba(197, 168, 128, 0.6);
                padding: 20px 40px 25px 40px;
                background: rgba(255, 255, 255, 0.88);
            }

            /* Header Branding Components */
            .header-identity {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .institute-branding {
                display: flex;
                align-items: center;
                gap: 15px;
                flex: 1;
            }

            .inst-logo {
                width: 55px;
                height: 55px;
                object-fit: contain;
                filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.1));
            }

            .logo-placeholder {
                width: 55px;
                height: 55px;
                background: #0B1D33;
                color: #C5A880;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Cinzel', serif;
                font-weight: 700;
                font-size: 24px;
                border: 2px solid #C5A880;
            }

            .institute-text-block {
                text-align: left;
            }

            .inst-name {
                font-family: 'Cinzel', serif;
                font-weight: 700;
                font-size: 24px;
                color: #0B1D33;
                letter-spacing: 1px;
                line-height: 1.1;
            }

            .inst-sub {
                font-size: 9.5px;
                font-weight: 600;
                color: #555;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 3px;
                max-width: 480px;
            }

            /* New Style for Contact Text Details */
            .inst-contact {
                font-size: 9px;
                font-weight: 700;
                color: #C5A880;
                letter-spacing: 0.8px;
                margin-top: 2px;
            }

            /* Student Passport Photo Badge placement */
            .student-photo-container {
                width: 65px;
                height: 75px;
                border: 2px solid #C5A880;
                padding: 2px;
                background: white;
                box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
            }

            .student-photo {
                width: 100%;
                height: 100%;
                object-fit: cover;
                background: #f0f0f0;
            }

            /* Main Header Title Elements */
            .title-group {
                text-align: center;
                margin-top: -5px;
            }

            .main-title {
                font-family: 'Cinzel', serif;
                font-size: 44px;
                color: #0B1D33;
                letter-spacing: 10px;
                font-weight: 800;
                line-height: 1;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
            }

            .sub-title {
                font-size: 11px;
                letter-spacing: 6px;
                text-transform: uppercase;
                color: #C5A880;
                font-weight: 700;
                margin-top: 6px;
            }

            .presentation-sentence {
                color: #555;
                font-size: 12px;
                letter-spacing: 2px;
                text-transform: uppercase;
                font-weight: 500;
                margin: 5px 0;
            }

            /* Recipient Presentation Framework */
            .recipient-wrapper {
                text-align: center;
                width: 100%;
            }

            .recipient-name {
                font-family: 'Great Vibes', cursive;
                font-size: 58px;
                color: #0B1D33;
                line-height: 0.9;
                margin-bottom: 4px;
                font-weight: 500;
            }

            /* Ornate Axis Divider */
            .ornate-divider {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                width: 350px;
                margin: 4px auto;
            }
            .divider-wing {
                height: 1px;
                background: linear-gradient(to right, transparent, #C5A880, transparent);
                flex: 1;
            }
            .divider-center {
                color: #C5A880;
                font-size: 10px;
            }

            .completion-text {
                font-size: 13px;
                color: #666;
                font-style: italic;
                margin-top: 6px;
                font-weight: 500;
            }

            /* Modern Dual Layer Course Identification Badge */
            .course-badge {
                border-top: 1px solid rgba(197, 168, 128, 0.7);
                border-bottom: 1px solid rgba(197, 168, 128, 0.7);
                padding: 8px 45px;
                text-align: center;
                background: linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.06), transparent);
                margin: 5px 0;
            }

            .course-code {
                font-family: 'Cinzel', serif;
                font-weight: 700;
                font-size: 24px;
                color: #0B1D33;
                letter-spacing: 2px;
                line-height: 1.2;
            }

            .course-full {
                font-size: 11px;
                font-weight: 600;
                color: #444;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                margin-top: 2px;
            }

            .appreciation-statement {
                font-size: 12px;
                color: #4a5568;
                text-align: center;
                line-height: 1.6;
                max-width: 640px;
                font-weight: 500;
            }

            /* Clean Alignment Grid Base Footer Elements */
            .footer-alignment-panel {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-top: 10px;
            }

            .footer-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 200px;
            }

            /* QR Component styling */
            .qr-wrapper {
                border: 1px solid #C5A880;
                padding: 4px;
                background: white;
                transition: all 0.3s ease;
                box-shadow: 0px 3px 8px rgba(0,0,0,0.05);
            }
            .qr-wrapper img {
                width: 68px;
                height: 68px;
                display: block;
            }

            /* Shared Interactive Label Properties */
            .panel-annotation {
                font-size: 9.5px;
                color: #777;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                margin-top: 8px;
                font-weight: 700;
                text-align: center;
            }

            .date-display-field {
                text-align: center;
                font-size: 13px;
                color: #0B1D33;
                font-weight: 700;
                border-bottom: 1px solid #C5A880;
                padding-bottom: 5px;
                width: 140px;
                letter-spacing: 0.5px;
            }

            /* Modified Layout Handling for Real Signature Images */
            .signature-box-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                height: 50px;
                width: 160px;
            }
            .signature-image {
                max-width: 140px;
                max-height: 45px;
                object-fit: contain;
            }
            .signature-text-fallback {
                font-family: 'Great Vibes', cursive;
                font-size: 26px;
                color: #0B1D33;
                line-height: 1;
                font-weight: 600;
                text-align: center;
            }
            .signature-base-line {
                width: 150px;
                border-bottom: 1px solid #C5A880;
                margin-top: 2px;
            }

            @media print {
                body {
                    background: none;
                }
                .certificate-container {
                    box-shadow: none;
                    margin: 0;
                }
            }
        </style>
    </head>
    <body>

        <div class="certificate-container">
            <div class="inner-border-line"></div>
            <div class="corner-decoration corner-tl"></div>
            <div class="corner-decoration corner-tr"></div>
            <div class="corner-decoration corner-bl"></div>
            <div class="corner-decoration corner-br"></div>

            <div class="certificate-content">
                
                <div class="header-identity">
                    <div class="institute-branding">
                        ${certificateData.logo ? `
                            <img class="inst-logo" src="${certificateData.logo}" alt="Logo">
                        ` : `
                            <div class="logo-placeholder">✦</div>
                        `}
                        <div class="institute-text-block">
                            <h2 class="inst-name">${certificateData.instituteName}</h2>
                            <p class="inst-sub">${certificateData.instituteSubText}</p>
                            <p class="inst-contact">Contact: ${certificateData.instituteContact}</p>
                        </div>
                    </div>
                    
                    ${certificateData.profilePic ? `
                        <div class="student-photo-container">
                            <img class="student-photo" src="${certificateData.profilePic}" alt="Student Profile">
                        </div>
                    ` : ''}
                </div>

                <div class="title-group">
                    <h1 class="main-title">CERTIFICATE</h1>
                    <div class="sub-title">of achievement</div>
                </div>

                <div class="presentation-sentence">This certificate is proudly presented to</div>

                <div class="recipient-wrapper">
                    <h2 class="recipient-name">${certificateData.recipientName}</h2>
                    <div class="ornate-divider">
                        <div class="divider-wing"></div>
                        <div class="divider-center">✦</div>
                        <div class="divider-wing"></div>
                    </div>
                    <p class="completion-text">for successfully completing the designated course of study</p>
                </div>

                <div class="course-badge">
                    <h4 class="course-full">${certificateData.courseName}</h4>
                </div>

                <p class="appreciation-statement">
                    For outstanding academic performance, passing all structural examinations with distinct evaluation metrics, 
                    and fulfilling all core program specifications required by the institutional board committee.
                </p>

                <div class="footer-alignment-panel">
                    
                    <div class="footer-column">
                        <div class="qr-wrapper">
                            <img src="${certificateData.qrCodeUrl}" alt="Verification QR">
                        </div>
                        <p class="panel-annotation">Secure Verification</p>
                    </div>

                    <div class="footer-column" style="padding-bottom: 5px;">
                        <div class="date-display-field">${certificateData.issueDate}</div>
                        <p class="panel-annotation">Date of Issue</p>
                    </div>

                    <div class="footer-column">
                        <div class="signature-box-container">
                            ${(certificateData.authorizedSignatureName.startsWith('http://') || certificateData.authorizedSignatureName.startsWith('https://')) ? `
                                <img class="signature-image" src="${certificateData.authorizedSignatureName}" alt="Authorized Signature">
                            ` : `
                                <div class="signature-text-fallback">${certificateData.authorizedSignatureName}</div>
                            `}
                        </div>
                        <div class="signature-base-line"></div>
                        <p class="panel-annotation">Authorized Signatory</p>
                    </div>

                </div>

            </div>
        </div>

    </body>
    </html>
    `;
}