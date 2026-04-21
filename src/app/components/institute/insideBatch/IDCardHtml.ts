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
  } = data;

  // --- DYNAMIC SESSION LOGIC ---
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
  ">
    
    <div style="
      position: absolute;
      top: 18px;
      right: -35px;
      background: ${accentColor};
      color: white;
      padding: 6px 45px;
      transform: rotate(45deg);
      z-index: 10;
      font-size: 12px;
      font-weight: 900;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      letter-spacing: 1px;
    ">
      ${session}
    </div>
    
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

    <div style="
      position: relative;
      z-index: 2;
      padding: 20px 15px 10px;
      text-align: center;
      color: white;
    ">
      <img src="${window.location.origin}/logo%203.jpg" style="
        height: 55px; 
        width: 55px; 
        object-fit: contain; 
        background: white; 
        border-radius: 50%; 
        padding: 4px;
        margin-bottom: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      " />
      <h2 style="margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1.2px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
        ${schoolName}
      </h2>
      <p style="margin: 4px 0 0; font-size: 10px; opacity: 0.9; font-weight: 300; max-width: 80%; margin-left: auto; margin-right: auto;">
        ${schoolAddress}
      </p>
    </div>

    <div style="
      position: relative;
      z-index: 2;
      padding-top: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      
      <div style="
        width: 115px;
        height: 135px;
        border: 3px solid white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        background: #f0f0f0;
        outline: 2px solid ${accentColor};
      ">
        <img src="${window.location.origin}/pic.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <div style="text-align: center; margin-top: 12px;">
        <h1 style="margin: 0; font-size: 22px; color: ${primaryColor}; font-weight: 800; letter-spacing: -0.5px;">
          ${studentName.toUpperCase()}
        </h1>
        <div style="
          display: inline-block;
          background: ${primaryColor}15;
          color: ${primaryColor};
          padding: 3px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-top: 5px;
        ">
          STUDENT
        </div>
      </div>

      <div style="
        width: 100%; 
        padding: 20px 15px; 
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto auto;
        gap: 15px 10px;
      ">
        <div style="border-left: 3px solid ${accentColor}; padding-left: 8px;">
          <label style="display: block; color: ${primaryColor}; font-size: 9px; font-weight: 800; text-transform: uppercase;">Roll No</label>
          <span style="font-weight: 700; font-size: 13px;">${rollNo}</span>
        </div>
        <div style="border-left: 3px solid ${accentColor}; padding-left: 8px;">
          <label style="display: block; color: ${primaryColor}; font-size: 9px; font-weight: 800; text-transform: uppercase;">Class</label>
          <span style="font-weight: 700; font-size: 13px;">${className}</span>
        </div>
        <div style="border-left: 3px solid ${accentColor}; padding-left: 8px;">
          <label style="display: block; color: ${primaryColor}; font-size: 9px; font-weight: 800; text-transform: uppercase;">D.O.B</label>
          <span style="font-weight: 700; font-size: 13px;">${dob}</span>
        </div>

        <div style="border-left: 3px solid ${accentColor}; padding-left: 8px;">
          <label style="display: block; color: ${primaryColor}; font-size: 9px; font-weight: 800; text-transform: uppercase;">Reg No</label>
          <span style="font-weight: 700; font-size: 13px;">${entrollmentNum}</span>
        </div>
        <div style="border-left: 3px solid ${accentColor}; padding-left: 8px;">
          <label style="display: block; color: ${primaryColor}; font-size: 9px; font-weight: 800; text-transform: uppercase;">Phone</label>
          <span style="font-weight: 700; font-size: 13px;">${phone}</span>
        </div>
        <div style="border-left: 3px solid ${accentColor}; padding-left: 8px;">
          <label style="display: block; color: ${primaryColor}; font-size: 9px; font-weight: 800; text-transform: uppercase;">Address</label>
          <span style="font-weight: 700; font-size: 10px; line-height: 1.1; display: block; overflow: hidden; text-overflow: ellipsis;">${address}</span>
        </div>
      </div>
    </div>

    <div style="
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 65px;
      background: #f4f7f8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      border-top: 1px solid #eee;
    ">
       <div style="text-align: left;">
         <div style="font-size: 8px; color: ${primaryColor}; text-transform: uppercase; font-weight: 700;">School contact</div>
         <div style="font-size: 12px; color: ${primaryColor}; font-weight: 800;">
           ${institutePhoneNumber}
         </div>
       </div>
       
       <div style="text-align: center;">
         <div style="font-family: 'Brush Script MT', cursive; font-size: 18px; color: #222; margin-bottom: -5px;">Principal</div>
         <div style="width: 80px; height: 1px; background: ${primaryColor}; margin: 4px auto;"></div>
         <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #777;">Authorized</div>
       </div>
    </div>

  </div>
  `;
}