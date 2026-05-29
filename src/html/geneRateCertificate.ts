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

        .content {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 70px 20px;
        }

        .logo-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          margin-bottom: 4px;
        }

        .logo-emblem {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(145deg, #8b0000, #c0392b);
          border: 3px solid #b8962e;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 0 3px rgba(184,150,46,.3);
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .logo-star {
          position: absolute;
          top: -7px;
          font-size: 10px;
          color: #b8962e;
        }

        .logo-rn {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          letter-spacing: 1px;
          line-height: 1;
        }

        .logo-laurel {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .laurel-svg {
          width: 50px;
          height: 22px;
          fill: #b8962e;
        }

        .inst-name {
          font-family: 'Cinzel', serif;
          font-size: 21px;
          font-weight: 900;
          color: #8b0000;
          letter-spacing: 3px;
          line-height: 1;
        }

        .inst-sub {
          font-size: 9.5px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: .5px;
          text-align: center;
          line-height: 1.5;
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
          font-size: 44px;
          font-weight: 900;
          color: #1a1a2e;
          letter-spacing: 8px;
          line-height: 1;
          text-align: center;
          margin-bottom: 2px;
        }

        .cert-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: 7px;
          text-align: center;
          margin-bottom: 5px;
        }

        .presented-banner {
          background: linear-gradient(90deg, #8b0000, #c0392b, #8b0000);
          width: 100%;
          padding: 5px 0;
          text-align: center;
          margin-bottom: 8px;
        }
        .presented-banner span {
          font-family: 'Montserrat', sans-serif;
          font-size: 9.5px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 3px;
        }

        /* Middle Grid Layout supporting Student Image */
        .main-details-layout {
          display: grid;
          grid-template-columns: 1fr 110px;
          gap: 20px;
          width: 100%;
          align-items: center;
          margin-bottom: 4px;
        }

        .details-center-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-left: 110px; /* Counter-balance grid alignment offset */
        }

        .recipient-name {
          font-family: 'Great Vibes', cursive;
          font-size: 46px;
          color: #8b0000;
          line-height: 1.1;
          margin-bottom: 2px;
        }

        .completing-text {
          font-size: 10px;
          color: #333;
          letter-spacing: .5px;
          margin-bottom: 4px;
        }

        .course-box {
          border: 1.5px solid #b8962e;
          padding: 5px 24px;
          text-align: center;
          margin-bottom: 5px;
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
          font-size: 15px;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: 1px;
        }
        .course-full {
          font-size: 10px;
          font-weight: 600;
          color: #1a1a2e;
        }

        /* Profile Picture Frame Styling */
        .student-profile-frame {
          width: 95px;
          height: 115px;
          border: 2px solid #b8962e;
          border-radius: 6px;
          padding: 3px;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          justify-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-img-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 3px;
          background: #f3f3f3;
        }

        .body-text {
          font-size: 10px;
          color: #333;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 4px;
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
        }

        .qr-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .qr-box {
          width: 68px; height: 68px;
          border: 2px solid #8b0000;
          padding: 3px;
          background: #fff;
        }
        .qr-box img { display: block; width: 100%; height: 100%; object-fit: contain; }
        .qr-label {
          font-size: 7.5px;
          font-weight: 800;
          color: #8b0000;
          letter-spacing: 1.5px;
        }

        .date-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .date-icon { font-size: 16px; color: #8b0000; }
        .date-val {
          font-size: 11px;
          font-weight: 700;
          color: #1a1a2e;
        }
        .date-label {
          font-size: 8px;
          font-weight: 800;
          color: #8b0000;
          letter-spacing: 2px;
        }

        .medal-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .medal-outer {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f5d97a, #b8962e 60%, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #d4af37;
          box-shadow: 0 4px 12px rgba(0,0,0,.3);
          position: relative;
        }
        .medal-inner {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #1a1a2e, #0d0d1a);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #b8962e;
        }
        .medal-stars { font-size: 7px; color: #b8962e; letter-spacing: 1px; }
        .medal-text {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          font-weight: 700;
          color: #d4af37;
          line-height: 1.2;
          text-align: center;
        }
        .medal-ribbon {
          display: flex;
          gap: 4px;
          margin-top: -4px;
        }
        .medal-ribbon-piece {
          width: 12px; height: 22px;
          clip-path: polygon(0 0,100% 0,100% 80%,50% 100%,0 80%);
        }
        .medal-ribbon-l { background: #8b0000; }
        .medal-ribbon-r { background: #c0392b; }

        .sig-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .sig-name {
          font-family: 'Great Vibes', cursive;
          font-size: 22px;
          color: #1a1a2e;
        }
        .sig-line {
          width: 110px; height: 1px;
          background: #333;
        }
        .sig-label {
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #1a1a2e;
        }

        .badge-seal {
          position: absolute;
          top: 26px; right: 26px;
          z-index: 10;
          width: 75px; height: 75px;
        }

        /* Strict Overrides for High-Quality PDF Printing engines */
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
        <path d="M 0,0 L 72,0 C 36,0 0,36 0,72 Z" fill="#111111"/>
        <path d="M 0,0 L 170,0 C 130,0 90,10 60,30 C 30,50 10,85 0,130 L 0,72 C 0,36 36,0 72,0 Z" fill="#8b0000"/>
        <path d="M 100,0 L 210,0 C 170,0 135,12 105,34 C 72,58 48,100 0,180 L 0,130 C 10,85 30,50 60,30 C 90,10 130,0 170,0 Z" fill="#c0392b"/>
        <path d="M 200,0 L 225,0 C 188,0 155,14 126,38 C 96,63 70,110 0,210 L 0,180 C 48,100 72,58 105,34 C 135,12 170,0 210,0 Z" fill="#d4af37"/>
        <path d="M 216,0 L 250,0 C 212,0 178,15 148,40 C 115,68 86,118 0,240 L 0,210 C 70,110 96,63 126,38 C 155,14 188,0 225,0 Z" fill="#1a1a1a"/>
        <path d="M 242,0 L 262,0 C 224,0 190,16 160,42 C 126,70 95,122 0,258 L 0,240 C 86,118 115,68 148,40 C 178,15 212,0 250,0 Z" fill="#f5d97a"/>
        <path d="M 254,0 L 278,0 C 240,0 205,17 174,44 C 138,74 105,128 0,274 L 0,258 C 95,122 126,70 160,42 C 190,16 224,0 262,0 Z" fill="#a00000" opacity="0.45"/>

        <path d="M 794,562 L 722,562 C 758,562 794,526 794,490 Z" fill="#111111"/>
        <path d="M 794,562 L 624,562 C 664,562 704,552 734,532 C 764,512 784,477 794,432 L 794,490 C 794,526 758,562 722,562 Z" fill="#8b0000"/>
        <path d="M 694,562 L 584,562 C 624,562 659,550 689,528 C 722,504 746,462 794,382 L 794,432 C 784,477 764,512 734,532 C 704,552 664,562 624,562 Z" fill="#c0392b"/>
        <path d="M 594,562 L 569,562 C 606,562 639,548 668,524 C 698,499 724,452 794,352 L 794,382 C 746,462 722,504 689,528 C 659,550 624,562 584,562 Z" fill="#d4af37"/>
        <path d="M 578,562 L 544,562 C 582,562 616,547 646,522 C 679,494 708,444 794,322 L 794,352 C 724,452 698,499 668,524 C 639,548 606,562 569,562 Z" fill="#1a1a1a"/>
        <path d="M 552,562 L 532,562 C 570,562 604,546 634,520 C 668,492 699,440 794,304 L 794,322 C 708,444 679,494 646,522 C 616,547 582,562 544,562 Z" fill="#f5d97a"/>
        <path d="M 540,562 L 516,562 C 554,562 589,545 620,518 C 656,488 689,434 794,288 L 794,304 C 699,440 668,492 634,520 C 604,546 570,562 532,562 Z" fill="#a00000" opacity="0.45"/>

        <path d="M 794,0 L 722,0 C 758,0 794,36 794,72 Z" fill="#111111"/>
        <path d="M 794,0 L 630,0 C 666,0 700,12 724,34 C 752,58 768,96 794,148 L 794,72 C 794,36 758,0 722,0 Z" fill="#8b0000"/>
        <path d="M 642,0 L 560,0 C 596,0 628,12 652,36 C 678,62 696,104 794,192 L 794,148 C 768,96 752,58 724,34 C 700,12 666,0 630,0 Z" fill="#c0392b"/>
        <path d="M 572,0 L 548,0 C 582,0 614,12 638,36 C 664,62 684,106 794,204 L 794,192 C 696,104 678,62 652,36 C 628,12 596,0 560,0 Z" fill="#d4af37"/>
        <path d="M 556,0 L 528,0 C 562,0 596,13 620,38 C 648,66 668,112 794,216 L 794,204 C 684,106 664,62 638,36 C 614,12 582,0 548,0 Z" fill="#1a1a1a"/>
        <path d="M 536,0 L 516,0 C 550,0 582,13 606,38 C 634,66 656,114 794,224 L 794,216 C 668,112 648,66 620,38 C 596,13 562,0 528,0 Z" fill="#f5d97a"/>

        <g>
          <path d="M 4,542 Q 62,510 122,542" stroke="#b8962e" stroke-width="2" fill="none"/>
          <path d="M 4,528 Q 55,498 108,526" stroke="#d4af37" stroke-width="1.5" fill="none" opacity=".7"/>
          <path d="M 4,514 Q 50,488 96,512" stroke="#b8962e" stroke-width="1" fill="none" opacity=".5"/>
          <circle cx="20" cy="532" r="4.5" fill="#b8962e" opacity=".75"/>
          <circle cx="40" cy="519" r="3.5" fill="#d4af37" opacity=".65"/>
          <circle cx="12" cy="516" r="3"   fill="#b8962e" opacity=".5"/>
          <circle cx="60" cy="509" r="3"   fill="#d4af37" opacity=".55"/>
          <ellipse cx="28" cy="524" rx="7" ry="3.5" transform="rotate(-32 28 524)" fill="#b8962e" opacity=".3"/>
          <ellipse cx="50" cy="512" rx="6" ry="3"   transform="rotate(-42 50 512)" fill="#d4af37" opacity=".35"/>
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
                <span class="logo-star">★</span>
                <span class="logo-rn">RN</span>
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
              <div class="course-title">${certificateData.courseName}</div>
              <div class="course-full">${certificateData.courseFullName}</div>
            </div>
          </div>

          <div class="student-profile-frame">
            <img class="profile-img-element" 
                 src="${certificateData.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=240&q=80'}" 
                 alt="Student Photograph" />
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

            <div class="sig-name">
               <img src="${certificateData.authorizedSignatureName}" alt="Verification QR" />
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