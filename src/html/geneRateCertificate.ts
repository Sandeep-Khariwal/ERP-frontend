export function generateCertificateHTML(data: any) {
  // Default values mapping incoming functional arguments
  const certificateData = {
    recipientName: data.recipientName || "Rahul Sharma",
    profilePic: data.profilePic || "",
    courseName: data.courseName || "ADCA",
    courseFullName: data.courseFullName || "( Advance Diploma In Computer Application)",
    issueDate: data.issueDate || "25 May 2024",
    authorizedSignatureName: data.authorizedSignatureName || "Amit Verma",
    logo: data.logo || "",
    qrCodeUrl: data.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Verified",
    instituteName: data.instituteName || "EDUSTART",
    instituteSubText: data.instituteSubText || "Edustart RN Computer And Vocational Training Institute Private Limited",
    instituteContact: data.instituteContact || "+919416059799",
  };

  // Safe fallback verification if signature parameter is a standard text string or an asset URL
  const isSignatureUrl =
    certificateData.authorizedSignatureName.startsWith("http://") ||
    certificateData.authorizedSignatureName.startsWith("https://") ||
    certificateData.authorizedSignatureName.startsWith("data:image/");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Premium Certificate of Achievement</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Great+Vibes&family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; }
      body, html {
        margin: 0;
        padding: 0;
        width: 1000px;
        height: 700px;
        background-color: #ffffff;
        font-family: 'Montserrat', sans-serif;
        -webkit-print-color-adjust: exact;
      }
      .cert-container {
        position: relative;
        width: 1000px;
        height: 700px;
        padding: 24px;
        background: #ffffff;
        overflow: hidden;
      }
      
      /* Outer Vintage Grid Borders */
      .outer-border {
        position: absolute;
        top: 20px; left: 20px; right: 20px; bottom: 20px;
        border: 2px solid #b8962e;
        pointer-events: none;
        z-index: 5;
      }
      .inner-border {
        position: absolute;
        top: 28px; left: 28px; right: 28px; bottom: 28px;
        border: 6px double #1a1a2e;
        pointer-events: none;
        z-index: 5;
      }

      /* Guilloche Structural Watermark Background Pattern */
      .watermark-bg {
        position: absolute;
        top: 34px; left: 34px; right: 34px; bottom: 34px;
        opacity: 0.04;
        background-image: 
          radial-gradient(circle at 50% 50%, transparent 60%, #1a1a2e 61%, transparent 65%),
          linear-gradient(45deg, rgba(26,26,46,0.1) 25%, transparent 25%, transparent 75%, rgba(26,26,46,0.1) 75%),
          linear-gradient(-45deg, rgba(26,26,46,0.1) 25%, transparent 25%, transparent 75%, rgba(26,26,46,0.1) 75%);
        background-size: 40px 40px, 60px 60px, 60px 60px;
        pointer-events: none;
        z-index: 1;
      }

      /* Balanced Safe Padding Frame pushed away from top border vector screens */
      .content {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 110px 90px 40px 90px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 10;
      }

      /* Premium Identity Header Layer Layout */
      .header-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 25px;
      }
      
      /* Generous top margin gap introduced to decouple logo from frame border */
      .header-logo-container {
        height: 65px;
        margin-top: 5px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .institute-logo {
        max-height: 65px;
        max-width: 180px;
        object-fit: contain;
      }
      .institute-title {
        font-family: 'Cinzel', serif;
        font-size: 26px;
        font-weight: 800;
        color: #1a1a2e;
        letter-spacing: 3px;
        line-height: 1.2;
        margin: 0 0 4px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
      }
      .institute-sub {
        font-size: 10px;
        font-weight: 600;
        color: #b8962e;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin: 0 0 4px 0;
        max-width: 650px;
        line-height: 1.4;
      }
      .institute-contact {
        font-size: 9px;
        font-weight: 500;
        color: #555555;
        letter-spacing: 1px;
        margin: 0;
      }

      /* Main Certificate Type Metadata Elements */
      .cert-type {
        font-family: 'Cinzel', serif;
        font-size: 34px;
        font-weight: 700;
        color: #1a1a2e;
        letter-spacing: 6px;
        margin-bottom: 5px;
        text-transform: uppercase;
      }
      .cert-subtitle {
        font-size: 11px;
        font-weight: 600;
        color: #b8962e;
        letter-spacing: 4px;
        text-transform: uppercase;
        margin-bottom: 25px;
      }
      .award-to {
        font-size: 13px;
        font-style: italic;
        color: #555555;
        margin-bottom: 12px;
      }

      /* Dynamic Side-By-Side Twin Node Structural Grid Rules */
      .identity-core-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        margin-bottom: 15px;
        width: 100%;
      }
      .profile-frame-holder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid #b8962e;
        padding: 3px;
        background: #fff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .student-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .recipient-name {
        font-family: 'Cinzel', serif;
        font-size: 32px;
        font-weight: 700;
        color: #1a1a2e;
        letter-spacing: 2px;
        border-bottom: 2px solid #b8962e;
        padding-bottom: 5px;
        white-space: nowrap;
      }
      
      .reason-text {
        font-size: 13px;
        color: #444444;
        text-align: center;
        max-width: 680px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .course-highlight {
        font-weight: 700;
        color: #1a1a2e;
      }
      .course-detail-span {
        display: block;
        font-size: 12px;
        color: #b8962e;
        font-weight: 600;
        margin-top: 4px;
        letter-spacing: 1px;
      }

      /* Premium Multi-Anchor Footer Blueprint */
      .footer-matrix {
        width: 100%;
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 0 10px;
      }
      .footer-block {
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      /* QR-Code Design Specifications */
      .qr-wrapper {
        width: 75px;
        height: 75px;
        border: 1px solid #e2e8f0;
        padding: 4px;
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }
      .qr-img {
        width: 100%;
        height: 100%;
      }
      .matrix-meta-label {
        font-size: 8px;
        font-weight: 700;
        color: #718096;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-top: 6px;
      }

      /* Date Block Rules */
      .date-numeric {
        font-size: 14px;
        font-weight: 700;
        color: #1a1a2e;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Absolute Vector Signatures Fallback Engine Layout */
      .signature-render-box {
        height: 35px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .signature-image-node {
        max-height: 35px;
        max-width: 160px;
        object-fit: contain;
      }
      .signature-text-fallback {
        font-family: 'Great Vibes', cursive;
        font-size: 20px;
        color: #1a1a2e;
        text-align: center;
        line-height: 1;
      }
      
      .sig-line {
        width: 100%;
        height: 1px;
        background: #333;
        margin-top: 2px;
      }
      .sig-label {
        font-size: 7px;
        font-weight: 800;
        letter-spacing: 1px;
        color: #1a1a2e;
        text-align: center;
        margin-top: 1px;
      }

      /* Custom Mini Corner Geometric Accents */
      .badge-seal {
        position: absolute;
        bottom: 45px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.12;
        z-index: 2;
      }
    </style>
  </head>
  <body>

    <div class="cert-container">
      <div class="outer-border"></div>
      <div class="inner-border"></div>
      <div class="watermark-bg"></div>

      <svg class="badge-seal" width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#b8962e" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#1a1a2e" stroke-width="1"/>
        <path d="M 50 10 L 58 35 L 85 35 L 63 50 L 72 75 L 50 60 L 28 75 L 37 50 L 15 35 L 42 35 Z" fill="#b8962e" opacity="0.3"/>
      </svg>

      <svg style="position:absolute; top:34px; left:34px; z-index:6;" width="70" height="70" viewBox="0 0 100 100">
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="#b8962e"/>
        <rect x="18" y="18" width="12" height="12" fill="#1a1a2e"/>
      </svg>
      <svg style="position:absolute; top:34px; right:34px; z-index:6; transform: rotate(90deg);" width="70" height="70" viewBox="0 0 100 100">
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="#b8962e"/>
        <rect x="18" y="18" width="12" height="12" fill="#1a1a2e"/>
      </svg>
      <svg style="position:absolute; bottom:34px; left:34px; z-index:6; transform: rotate(-90deg);" width="70" height="70" viewBox="0 0 100 100">
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="#b8962e"/>
        <rect x="18" y="18" width="12" height="12" fill="#1a1a2e"/>
      </svg>
      <svg style="position:absolute; bottom:34px; right:34px; z-index:6; transform: rotate(180deg);" width="70" height="70" viewBox="0 0 100 100">
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="#b8962e"/>
        <rect x="18" y="18" width="12" height="12" fill="#1a1a2e"/>
      </svg>

      <div class="content">
        <div class="header-wrapper">
          <div class="header-logo-container">
            ${
              certificateData.logo
                ? `<img src="${certificateData.logo}" class="institute-logo" alt="Logo" />`
                : `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8962e" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`
            }
          </div>
          <h1 class="institute-title">${certificateData.instituteName}</h1>
          <p class="institute-sub">${certificateData.instituteSubText}</p>
          <p class="institute-contact">Contact: ${certificateData.instituteContact}</p>
        </div>

        <div class="cert-type">Certificate of Achievement</div>
        <div class="cert-subtitle">Proudly Presented To</div>
        
        <div class="identity-core-row">
          ${
            certificateData.profilePic
              ? `<div class="profile-frame-holder">
                   <img src="${certificateData.profilePic}" class="student-avatar" alt="Student Profile" />
                 </div>`
              : ""
          }
          <div class="recipient-name">${certificateData.recipientName}</div>
        </div>

        <div class="reason-text">
          for successfully fulfilling the strict academic and practical curriculum standards mandated for the completion of 
          <span class="course-highlight">${certificateData.courseName}</span> 
          <span class="course-detail-span">${certificateData.courseFullName}</span>
          demonstrating excellent proficiency, dedication, and technical capability.
        </div>

        <div class="footer-matrix">
          <div class="footer-block">
            <div class="date-numeric">${certificateData.issueDate}</div>
            <div class="sig-line"></div>
            <div class="sig-label">DATE OF ISSUANCE</div>
          </div>

          <div class="footer-block">
            <div class="qr-wrapper">
              <img src="${certificateData.qrCodeUrl}" class="qr-img" alt="Verification QR Code" />
            </div>
            <div class="matrix-meta-label">SECURE VALIDATION</div>
          </div>

          <div class="footer-block">
            <div class="signature-render-box">
              ${
                isSignatureUrl
                  ? `<img src="${certificateData.authorizedSignatureName}" class="signature-image-node" alt="Signature" />`
                  : `<span class="signature-text-fallback">${certificateData.authorizedSignatureName}</span>`
              }
            </div>
            <div class="sig-line"></div>
            <div class="sig-label">AUTHORIZED SIGNATURE</div>
          </div>
        </div>

      </div>
    </div>

  </body>
  </html>
  `;
}