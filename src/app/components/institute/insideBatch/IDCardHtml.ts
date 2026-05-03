type StudentIdCardData = {
  schoolName: string;
  schoolLogo: string;
  schoolAddress: string;
  institutePhoneNumber: string;
  studentName: string;
  studentPhoto: string;
  className: string;
  rollNo: string;
  entrollmentNum: string;
  dob: string;
  phone: string;
  address: string;
  principalSignature: string; // Add this for the signature URL/Base64
};



export function generateIdCardHTML(data: StudentIdCardData): string {
  const {
    schoolName,
    schoolAddress,
    institutePhoneNumber,
    studentName,
    className,
    rollNo,
    entrollmentNum,
    dob,
    phone,
    address,
    principalSignature
  } = data;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let session = "";
  if (currentMonth <= 2) {
    session = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
  } else {
    session = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  }

  const primaryColor = "#1a5f7a";
  const accentColor = "#ff9800";

  return `
  <div style="
    width: 350px;
    height: 550px;
    border-radius: 20px;
    overflow: hidden;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    background: #fff;
    position: relative;
    border: 1px solid #e0e0e0;
    color: #333;
    display: flex;
    flex-direction: column;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  ">
    
    <!-- SESSION BADGE -->
    <div style="
      position: absolute;
      top: 18px;
      right: -35px;
      background: ${accentColor};
      color: white;
      padding: 6px 45px;
      transform: rotate(45deg);
      z-index: 10;
      font-size: 11px;
      font-weight: 900;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      letter-spacing: 1px;
    ">
      ${session}
    </div>
    
    <!-- HEADER BACKGROUND -->
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 170px;
      background: linear-gradient(135deg, ${primaryColor} 0%, #2c3e50 100%);
      clip-path: ellipse(120% 100% at 50% 0%);
      z-index: 1;
    "></div>

    <!-- SCHOOL HEADER SECTION -->
    <div style="
      position: relative;
      z-index: 2;
      padding: 15px 15px 5px;
      text-align: center;
      color: white;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    ">
      <img src="${data.schoolLogo}" style="
        height: 50px; 
        width: 50px; 
        object-fit: contain; 
        background: white; 
        border-radius: 50%; 
        padding: 3px;
        margin-bottom: 5px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      " />
      <h2 style="
        margin: 0; 
        font-size: 14px; 
        text-transform: uppercase; 
        line-height: 1.2;
        max-height: 34px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      ">
        ${schoolName}
      </h2>
      <p style="
        margin: 2px 0 0; 
        font-size: 9px; 
        opacity: 0.9; 
        font-weight: 300; 
        max-width: 85%; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis;
      ">
        ${schoolAddress}
      </p>
    </div>

    <!-- MAIN BODY SECTION -->
    <div style="
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;
    ">
      
      <!-- PHOTO -->
      <div style="
        width: 110px;
        height: 130px;
        border: 3px solid white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        background: #f0f0f0;
        outline: 2px solid ${accentColor};
      ">
        <img src="${data.studentPhoto}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <!-- NAME & TAG -->
      <div style="text-align: center; margin-top: 8px; width: 90%;">
        <h1 style="
          margin: 0; 
          font-size: 20px; 
          color: ${primaryColor}; 
          font-weight: 800;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        ">
          ${studentName.toUpperCase()}
        </h1>
        <div style="
          display: inline-block;
          background: ${primaryColor}15;
          color: ${primaryColor};
          padding: 2px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          margin-top: 3px;
        ">
          STUDENT
        </div>
      </div>

      <!-- DATA MATRIX -->
      <div style="
        width: 100%; 
        padding: 15px 15px; 
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px 8px;
      ">
        <div style="border-left: 2px solid ${accentColor}; padding-left: 6px; overflow: hidden;">
          <label style="display: block; color: ${primaryColor}; font-size: 8px; font-weight: 800; text-transform: uppercase;">Roll No</label>
          <span style="font-weight: 700; font-size: 12px; white-space: nowrap;">${rollNo}</span>
        </div>
        <div style="border-left: 2px solid ${accentColor}; padding-left: 6px; overflow: hidden;">
          <label style="display: block; color: ${primaryColor}; font-size: 8px; font-weight: 800; text-transform: uppercase;">Class</label>
          <span style="font-weight: 700; font-size: 12px; white-space: nowrap;">${className}</span>
        </div>
        <div style="border-left: 2px solid ${accentColor}; padding-left: 6px; overflow: hidden;">
          <label style="display: block; color: ${primaryColor}; font-size: 8px; font-weight: 800; text-transform: uppercase;">D.O.B</label>
          <span style="font-weight: 700; font-size: 12px; white-space: nowrap;">${dob}</span>
        </div>

        <div style="border-left: 2px solid ${accentColor}; padding-left: 6px; overflow: hidden;">
          <label style="display: block; color: ${primaryColor}; font-size: 8px; font-weight: 800; text-transform: uppercase;">Reg No</label>
          <span style="font-weight: 700; font-size: 12px; white-space: nowrap;">${entrollmentNum}</span>
        </div>
        <div style="border-left: 2px solid ${accentColor}; padding-left: 6px; overflow: hidden;">
          <label style="display: block; color: ${primaryColor}; font-size: 8px; font-weight: 800; text-transform: uppercase;">Phone</label>
          <span style="font-weight: 700; font-size: 12px; white-space: nowrap;">${phone}</span>
        </div>
        <div style="border-left: 2px solid ${accentColor}; padding-left: 6px; overflow: hidden;">
          <label style="display: block; color: ${primaryColor}; font-size: 8px; font-weight: 800; text-transform: uppercase;">Address</label>
          <span style="
            font-weight: 700; 
            font-size: 9px; 
            line-height: 1.1; 
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          ">${address}</span>
        </div>
      </div>
    </div>

    <!-- FOOTER WITH SIGNATURE -->
    <div style="
      width: 100%;
      height: 75px;
      background: #f4f7f8;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 15px 10px;
      box-sizing: border-box;
      border-top: 1px solid #eee;
    ">
       <div style="text-align: left; max-width: 50%; padding-bottom: 5px;">
         <div style="font-size: 7px; color: ${primaryColor}; text-transform: uppercase; font-weight: 700;">Contact</div>
         <div style="font-size: 11px; color: ${primaryColor}; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
           ${institutePhoneNumber}
         </div>
       </div>
       
       <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
         <!-- Signature Image -->
         <img src="${principalSignature}" style="
           height: 35px; 
           max-width: 80px; 
           object-fit: contain; 
           margin-bottom: -5px;
           mix-blend-mode: multiply;
         " />
         <div style="width: 70px; height: 1px; background: ${primaryColor}; margin: 2px auto;"></div>
         <div style="font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #777; font-weight: 700;">Director or Principal</div>
       </div>
    </div>

  </div>
  `;
}