export function generateCertificateHTML(data: any) {
  // Default values mapping incoming functional arguments
  const certificateData = {
    recipientName: data.recipientName || "Rahul Sharma",
    profilePic: data.profilePic || "",
    courseName: data.courseName || "ADCA",
    courseFullName:
      data.courseFullName || "( Advance Diploma In Computer Application)",
    issueDate: data.issueDate || "25 May 2024",
    authorizedSignatureName:
      data.authorizedSignatureName || "Amit Verma",
    logo: data.logo || "",
    qrCodeUrl:
      data.qrCodeUrl ||
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Verified",
    instituteName: data.instituteName || "EDUSTART",
    instituteSubText:
      data.instituteSubText ||
      "Edustart RN Computer And Vocational Training Institute Private Limited",
    instituteContact: data.instituteContact || "+919416059799",
  };

  // Safe fallback verification if signature parameter is a standard text string or a remote file asset image URL URL
  const isSignatureUrl =
    certificateData.authorizedSignatureName.startsWith("http://") ||
    certificateData.authorizedSignatureName.startsWith("https://") ||
    certificateData.authorizedSignatureName.startsWith("data:image/");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Certificate of Achievement – ${certificateData.instituteName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700;900&family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #e8e0d5;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Montserrat', sans-serif;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-scheme: light;
        }

        .cert-wrap {
          width: 794px;
          height: 562px;
          position: relative;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,.35);
        }

        .border-outer {
          position: absolute;
          inset: 12px;
          border: 2.5px solid #b8962e;
          z-index: 1;
          pointer-events: none;
        }
        .border-inner {
          position: absolute;
          inset: 16px;
          border: 1px solid #d4af37;
          z-index: 1;
          pointer-events: none;
        }

        /* Safe Zones content padding with increased top clearance to move logo away from border */
        .content {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 95px 20px; 
        }

        .logo-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          margin-bottom: 4px;
          width: 100%;
        }

        /* Added vertical margin to separate cleanly from outer layers and elements below */
        .logo-emblem {
          width: 80px;
          height: auto;
          max-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 4px 0;
        }

        .logo-img {
          width: 100%;
          height: auto;
          max-height: 100%;
          object-fit: contain;
        }

        .logo-text-placeholder {
          background: linear-gradient(145deg, #8b0000, #c0392b);
          border: 2.5px solid #b8962e;
          border-radius: 4px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 3px rgba(184,150,46,.2);
        }

        .logo-star {
          position: absolute;
          top: -6px;
          font-size: 9px;
          color: #b8962e;
        }

        .logo-rn {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 900;
          color: #fff;
          letter-spacing: 1px;
          line-height: 1;
        }

        .logo-laurel {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .laurel-svg {
          width: 45px;
          height: 20px;
          fill: #b8962e;
        }

        /* Increased top margin to distinctly isolate institute text from logo container */
        .inst-name {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 900;
          color: #8b0000;
          letter-spacing: 2.5px;
          line-height: 1.1;
          text-align: center;
          margin-top: 8px;
        }

        .inst-sub {
          font-size: 9px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: .3px;
          text-align: center;
          line-height: 1.3;
          max-width: 500px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          margin: 4px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #b8962e, transparent);
        }
        .divider-diamond {
          width: 6px; height: 6px;
          background: #b8962e;
          transform: rotate(45deg);
        }

        .cert-title {
          font-family: 'Cinzel', serif;
          font-size: 40px;
          font-weight: 900;
          color: #1a1a2e;
          letter-spacing: 7px;
          line-height: 1;
          text-align: center;
          margin-bottom: 2px;
        }

        .cert-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: 6px;
          text-align: center;
          margin-bottom: 6px;
        }

        .presented-banner {
          background: linear-gradient(90deg, #8b0000, #c0392b, #8b0000);
          width: 100%;
          padding: 4px 0;
          text-align: center;
          margin-bottom: 8px;
        }
        .presented-banner span {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 2.5px;
        }

        .main-details-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0px;
          width: 100%;
          align-items: center;
          margin-bottom: 4px;
        }

        .details-center-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-left: 0px; 
        }

        .recipient-name {
          font-family: 'Great Vibes', cursive;
          font-size: 44px;
          color: #8b0000;
          line-height: 1;
          margin-bottom: 2px;
        }

        .completing-text {
          font-size: 9.5px;
          color: #333;
          letter-spacing: .5px;
          margin-bottom: 4px;
        }

        .course-box {
          border: 1.5px solid #b8962e;
          padding: 4px 35px;
          text-align: center;
          margin-bottom: 4px;
          position: relative;
          background: #fff;
        }
        .course-box::before,
        .course-box::after {
          content: '';
          position: absolute;
          top: -1.5px; bottom: -1.5px;
          width: 8px;
          background: #fff;
          border-top: 1.5px solid #b8962e;
          border-bottom: 1.5px solid #b8962e;
        }
        .course-box::before { left: 12px; }
        .course-box::after  { right: 12px; }

        .course-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: .5px;
        }
        .course-full {
          font-size: 9.5px;
          font-weight: 600;
          color: #1a1a2e;
        }

        .body-text {
          font-size: 9.5px;
          color: #333;
          text-align: center;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .body-text strong {
          font-weight: 700;
          color: #1a1a2e;
        }

        .footer-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          margin-top: auto;
          padding: 0 10px;
        }

        .qr-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .qr-box {
          width: 60px; height: 60px;
          border: 1.5px solid #8b0000;
          padding: 2px;
          background: #fff;
        }
        .qr-box img { display: block; width: 100%; height: 100%; object-fit: contain; }
        .qr-label {
          font-size: 7px;
          font-weight: 800;
          color: #8b0000;
          letter-spacing: 1px;
        }

        .date-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding-bottom: 2px;
        }
        .date-icon { font-size: 14px; color: #8b0000; }
        .date-val {
          font-size: 10.5px;
          font-weight: 700;
          color: #1a1a2e;
        }
        .date-label {
          font-size: 7.5px;
          font-weight: 800;
          color: #8b0000;
          letter-spacing: 1.5px;
        }

        .medal-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .medal-outer {
          width: 62px; height: 62px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f5d97a, #b8962e 60%, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #d4af37;
          box-shadow: 0 3px 8px rgba(0,0,0,.25);
          position: relative;
        }
        .medal-inner {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #1a1a2e, #0d0d1a);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #b8962e;
        }
        .medal-stars { font-size: 6px; color: #b8962e; letter-spacing: .5px; }
        .medal-text {
          font-family: 'Cinzel', serif;
          font-size: 8px;
          font-weight: 700;
          color: #d4af37;
          line-height: 1.1;
          text-align: center;
        }
        .medal-ribbon {
          display: flex;
          gap: 3px;
          margin-top: -3px;
        }
        .medal-ribbon-piece {
          width: 10px; height: 18px;
          clip-path: polygon(0 0,100% 0,100% 80%,50% 100%,0 80%);
        }
        .medal-ribbon-l { background: #8b0000; }
        .medal-ribbon-r { background: #c0392b; }

        .sig-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 110px;
        }
        .sig-wrap {
          height: 35px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .sig-img-element {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        .sig-name-fallback {
          font-family: 'Great Vibes', cursive;
          font-size: 20px;
          color: #1a1a2e;
          text-align: center;
          line-height: 1;
        }
        .sig-line {
          width: 100%; height: 1px;
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

        .badge-seal {
          position: absolute;
          top: 24px; right: 24px;
          z-index: 10;
          width: 65px; height: 65px;
        }

        @media print {
          body {
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .cert-wrap {
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>

    <div class="cert-wrap">

      <svg style="position:absolute;top:0;left:0;width:794px;height:562px;z-index:2;pointer-events:none;"
           viewBox="0 0 794 562" xmlns="http://www.w3.org/2000/svg">
        
        <path d="M 0,0 L 50,0 C 25,0 0,25 0,50 Z" fill="#111111"/>
        <path d="M 0,0 L 110,0 C 85,0 60,8 40,22 C 20,36 8,55 0,85 L 0,50 C 0,25 25,0 50,0 Z" fill="#8b0000"/>
        <path d="M 70,0 L 140,0 C 115,0 92,8 72,24 C 50,40 34,65 0,120 L 0,85 C 8,55 20,36 40,22 C 60,8 85,0 110,0 Z" fill="#c0392b"/>
        <path d="M 130,0 L 150,0 C 125,0 102,10 82,26 C 62,42 45,72 0,140 L 0,120 C 34,65 50,40 72,24 C 92,8 115,0 140,0 Z" fill="#d4af37"/>
        <path d="M 142,0 L 165,0 C 140,0 118,10 98,28 C 76,46 56,78 0,160 L 0,140 C 45,72 62,42 82,26 C 102,10 125,0 150,0 Z" fill="#1a1a1a"/>
        <path d="M 158,0 L 172,0 C 148,0 126,11 106,29 C 84,48 64,80 0,172 L 0,160 C 56,160 76,46 98,28 C 118,10 140,0 165,0 Z" fill="#f5d97a"/>

        <path d="M 794,562 L 744,562 C 769,562 794,537 794,512 Z" fill="#111111"/>
        <path d="M 794,562 L 684,562 C 709,562 734,554 754,540 C 774,526 786,507 794,477 L 794,512 C 794,537 769,562 744,562 Z" fill="#8b0000"/>
        <path d="M 724,562 L 654,562 C 679,562 702,554 722,538 C 744,522 760,497 794,442 L 794,477 C 786,507 774,526 754,540 C 734,554 709,562 684,562 Z" fill="#c0392b"/>
        <path d="M 664,562 L 644,562 C 679,562 692,552 712,536 C 732,520 749,490 794,422 L 794,442 C 760,497 744,522 722,538 C 702,554 679,562 654,562 Z" fill="#d4af37"/>
        <path d="M 652,562 L 629,562 C 654,562 676,552 696,534 C 718,516 738,484 794,402 L 794,422 C 749,490 732,520 712,536 C 692,552 669,562 644,562 Z" fill="#1a1a1a"/>

        <path d="M 794,0 L 744,0 C 769,0 794,25 794,50 Z" fill="#111111"/>
        <path d="M 794,0 L 684,0 C 709,0 732,8 750,24 C 768,40 778,65 794,105 L 794,50 C 794,25 769,0 744,0 Z" fill="#8b0000"/>
        <path d="M 724,0 L 664,0 C 689,0 712,8 730,25 C 750,44 762,72 794,135 L 794,105 C 778,65 768,40 750,24 C 732,8 709,0 684,0 Z" fill="#c0392b"/>
        <path d="M 674,0 L 656,0 C 680,0 702,9 720,26 C 738,44 752,75 794,145 L 794,135 C 762,72 750,44 730,25 C 712,8 689,0 664,0 Z" fill="#d4af37"/>

        <g>
          <path d="M 4,542 Q 45,515 90,542" stroke="#b8962e" stroke-width="1.5" fill="none"/>
          <path d="M 4,530 Q 40,505 80,528" stroke="#d4af37" stroke-width="1" fill="none" opacity=".6"/>
          <circle cx="16" cy="535" r="3" fill="#b8962e" opacity=".7"/>
          <circle cx="32" cy="524" r="2.5" fill="#d4af37" opacity=".6"/>
        </g>
      </svg>

      <div class="border-outer"></div>
      <div class="border-inner"></div>

      <svg class="badge-seal" viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(37.5,37.5)">
          <g id="spoke"><rect x="-1" y="-37" width="2" height="10" rx="1" fill="#d4af37"/></g>
          <use href="#spoke" transform="rotate(22.5)"/>
          <use href="#spoke" transform="rotate(45)"/>
          <use href="#spoke" transform="rotate(67.5)"/>
          <use href="#spoke" transform="rotate(90)"/>
          <use href="#spoke" transform="rotate(112.5)"/>
          <use href="#spoke" transform="rotate(135)"/>
          <use href="#spoke" transform="rotate(157.5)"/>
          <use href="#spoke" transform="rotate(180)"/>
          <use href="#spoke" transform="rotate(202.5)"/>
          <use href="#spoke" transform="rotate(225)"/>
          <use href="#spoke" transform="rotate(247.5)"/>
          <use href="#spoke" transform="rotate(270)"/>
          <use href="#spoke" transform="rotate(292.5)"/>
          <use href="#spoke" transform="rotate(315)"/>
          <use href="#spoke" transform="rotate(337.5)"/>
        </g>
        <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#d4af37" stroke-width="2.5"/>
        <circle cx="37.5" cy="37.5" r="24" fill="url(#badgeGrad)" stroke="#b8962e" stroke-width="1.5"/>
        <text x="37.5" y="19" text-anchor="middle" font-size="7" fill="#b8962e">★ ★ ★</text>
        <rect x="27" y="22" width="21" height="15" rx="1" fill="#1a1a2e"/>
        <rect x="27" y="22" width="10" height="15" rx="1" fill="#2d2d4e"/>
        <rect x="36" y="22" width="1" height="15" fill="#b8962e"/>
        <polygon points="37.5,20 32,23 37.5,26 43,23" fill="#d4af37"/>
        <rect x="41" y="23" width="1.5" height="4" fill="#d4af37"/>
        <circle cx="37.5" cy="37.5" r="26" fill="none" stroke="#b8962e" stroke-width="0.7" stroke-dasharray="2,2"/>
        <defs>
          <radialGradient id="badgeGrad" cx="40%" cy="35%">
            <stop offset="0%" stop-color="#f5d97a"/>
            <stop offset="60%" stop-color="#b8962e"/>
            <stop offset="100%" stop-color="#8b6914"/>
          </radialGradient>
        </defs>
      </svg>

      <div class="content">

        <div class="logo-row">
          <div class="logo-laurel">
            <svg class="laurel-svg" viewBox="0 0 50 22">
              <path d="M48,11 C42,5 34,3 26,6 C32,2 40,2 48,8 Z" fill="#b8962e"/>
              <path d="M48,11 C42,15 34,17 26,14 C32,18 40,18 48,14 Z" fill="#b8962e"/>
              <path d="M38,11 C34,7 28,5 22,7 C27,4 35,5 38,11 Z" fill="#d4af37" opacity=".8"/>
              <path d="M38,11 C34,15 28,17 22,15 C27,17 35,17 38,11 Z" fill="#d4af37" opacity=".8"/>
              <path d="M28,11 C26,8 22,7 18,8 C22,6 28,8 28,11 Z" fill="#b8962e" opacity=".7"/>
              <path d="M28,11 C26,14 22,15 18,14 C22,16 28,14 28,11 Z" fill="#b8962e" opacity=".7"/>
              <line x1="48" y1="11" x2="18" y2="11" stroke="#8b6914" stroke-width=".8"/>
            </svg>
            
            <div class="logo-emblem">
              ${certificateData.logo ? `<img class="logo-img" src="${certificateData.logo}" alt="Logo"/>` : `
                <div class="logo-text-placeholder">
                  <span class="logo-star">★</span>
                  <span class="logo-rn">RN</span>
                </div>
              `}
            </div>
            
            <svg class="laurel-svg" viewBox="0 0 50 22" style="transform:scaleX(-1)">
              <path d="M48,11 C42,5 34,3 26,6 C32,2 40,2 48,8 Z" fill="#b8962e"/>
              <path d="M48,11 C42,15 34,17 26,14 C32,18 40,18 48,14 Z" fill="#b8962e"/>
              <path d="M38,11 C34,7 28,5 22,7 C27,4 35,5 38,11 Z" fill="#d4af37" opacity=".8"/>
              <path d="M38,11 C34,15 28,17 22,15 C27,17 35,17 38,11 Z" fill="#d4af37" opacity=".8"/>
              <path d="M28,11 C26,8 22,7 18,8 C22,6 28,8 28,11 Z" fill="#b8962e" opacity=".7"/>
              <path d="M28,11 C26,14 22,15 18,14 C22,16 28,14 28,11 Z" fill="#b8962e" opacity=".7"/>
              <line x1="48" y1="11" x2="18" y2="11" stroke="#8b6914" stroke-width=".8"/>
            </svg>
          </div>
          <div class="inst-name">${certificateData.instituteName}</div>
          <div class="inst-sub">${certificateData.instituteSubText}</div>
        </div>

        <div class="divider">
          <div class="divider-line"></div>
          <div class="divider-diamond"></div>
          <div class="divider-line"></div>
        </div>

        <div class="cert-title">CERTIFICATE</div>
        <div class="cert-subtitle">— &nbsp; OF &nbsp; ACHIEVEMENT &nbsp; —</div>

        <div class="presented-banner">
          <span>THIS CERTIFICATE IS PROUDLY PRESENTED TO</span>
        </div>

        <div class="main-details-layout">
          <div class="details-center-pane">
            <div class="recipient-name">${certificateData.recipientName}</div>
            <div class="completing-text">for successfully completing the course</div>

            <div class="course-box">
              <div class="course-title"> ${certificateData.courseName.split('-')[0]}</div>
              <div class="course-full">${certificateData.courseFullName}</div>
            </div>
          </div>
        </div>

        <div class="body-text">
          for his/her outstanding performance, dedication and hard work<br>
          in successfully completing the course.<br>
          <strong>We wish you all the best for your future endeavors.</strong>
        </div>

        <div class="footer-row">

          <div class="qr-block">
            <div class="qr-box">
              <img src="${certificateData.qrCodeUrl}" alt="Verification QR" />
            </div>
            <div class="qr-label">SCAN TO VERIFY</div>
          </div>

          <div class="date-block">
            <div class="date-icon">📅</div>
            <div class="date-val">${certificateData.issueDate}</div>
            <div class="date-label">DATE</div>
          </div>

          <div class="medal-block">
            <div class="medal-outer">
              <div class="medal-inner">
                <div class="medal-stars">★ ★ ★</div>
                <div class="medal-text">WELL<br>DONE</div>
              </div>
            </div>
            <div class="medal-ribbon">
              <div class="medal-ribbon-piece medal-ribbon-l"></div>
              <div class="medal-ribbon-piece medal-ribbon-r"></div>
            </div>
          </div>

          <div class="sig-block">
            <div class="sig-wrap">
              ${
                isSignatureUrl 
                  ? `<img class="sig-img-element" src="${certificateData.authorizedSignatureName}" alt="Signature" onerror="this.style.display='none'; document.getElementById('sigFallback').style.display='block';" />
                     <span id="sigFallback" class="sig-name-fallback" style="display:none;">Authorized</span>`
                  : `<span class="sig-name-fallback">${certificateData.authorizedSignatureName}</span>`
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