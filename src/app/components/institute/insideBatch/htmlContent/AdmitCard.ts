import { UpcomingExaminationData } from "../ExaminationPage";

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
  principalSignature: string; 
  examsData: UpcomingExaminationData[];
};

export function GenerateAdmitCard(data: StudentIdCardData): string {
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
    principalSignature,
    examsData
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

  // Pure Black & White Palette for Printing
  const black = "#000000"; 
  const darkGray = "#333333";
  const lightGray = "#f2f2f2";
  const borderGray = "#cccccc";

  // Generate Examination Table Rows
  const examsHtml = examsData && examsData.length > 0 
    ? examsData.map((exam, index) => {
        const d = new Date(exam.startTime);
        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        
        // Convert milliseconds to minutes safely (if totalTime is > 10000 it assumes milliseconds)
        const durationInMinutes = exam.totalTime > 10000 
          ? Math.round(exam.totalTime / 60000) 
          : exam.totalTime;
        
        return `
          <tr style="border-bottom: 1px solid ${borderGray}; background: ${index % 2 === 0 ? '#ffffff' : '#fafafa'};">
            <td style="padding: 10px 15px; font-weight: 600; color: ${black};">${dateStr}</td>
            <td style="padding: 10px 15px; font-weight: bold; color: ${black};">${exam.subjectId?.name || '-'}</td>
            <td style="padding: 10px 15px; color: ${darkGray};">${exam.name}</td>
            <td style="padding: 10px 15px; font-weight: 600; color: ${darkGray};">${timeStr}</td>
            <td style="padding: 10px 15px; color: ${black}; font-weight: 600;">${durationInMinutes} Mins</td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="5" style="padding: 30px; text-align: center; color: ${darkGray}; font-style: italic;">No Upcoming Examinations Scheduled</td></tr>`;

  return `
  <div style="
    width: 800px;
    min-height: 600px;
    margin: 0 auto;
    background: #ffffff;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    position: relative;
    color: ${black};
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    box-sizing: border-box;
    padding: 20px;
  ">
    <div style="
      border: 2px solid ${black};
      position: relative;
      height: 100%;
    ">
      
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.04;
        z-index: 0;
        pointer-events: none;
      ">
        <img src="${data.schoolLogo}" crossorigin="anonymous" style="width: 400px; height: 400px; object-fit: contain; filter: grayscale(100%);" />
      </div>

      <div style="
        background: #ffffff;
        padding: 20px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${black};
        position: relative;
        z-index: 2;
        border-bottom: 2px solid ${black};
      ">
        <img src="${data.schoolLogo}" crossorigin="anonymous" style="
          height: 80px; 
          width: 80px; 
          object-fit: contain; 
          background: white; 
          filter: grayscale(100%);
        " />
        
        <div style="flex: 1; text-align: center; padding: 0 20px;">
          <h1 style="margin: 0 0 5px 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;">
            ${schoolName}
          </h1>
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: ${darkGray};">
            ${schoolAddress} | Contact: ${institutePhoneNumber}
          </p>
          <div style="display: inline-block; background: ${black}; color: white; padding: 6px 18px; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            Admit Card - Online Examination
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 11px; text-transform: uppercase; margin-bottom: 4px; font-weight: bold;">Session</div>
          <div style="font-size: 18px; font-weight: 900;">${session}</div>
        </div>
      </div>

      <div style="padding: 25px 30px; display: flex; gap: 30px; position: relative; z-index: 2; align-items: stretch;">
        
        <div style="
          width: 130px;
          height: 160px;
          border: 2px solid ${black};
          overflow: hidden;
          background: ${lightGray};
          flex-shrink: 0;
        ">
          <img src="${data.studentPhoto}" crossorigin="anonymous" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%);" />
        </div>

        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px 20px; align-content: center;">
          
          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 5px;">
            <span style="font-size: 10px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block;">Student Name</span>
            <span style="font-size: 16px; font-weight: 900; color: ${black};">${studentName.toUpperCase()}</span>
          </div>

          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 5px;">
            <span style="font-size: 10px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block;">Class / Batch</span>
            <span style="font-size: 14px; font-weight: bold; color: ${black};">${className}</span>
          </div>

          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 5px;">
            <span style="font-size: 10px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block;">Roll Number</span>
            <span style="font-size: 14px; font-weight: bold; color: ${black};">${rollNo}</span>
          </div>

          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 5px;">
            <span style="font-size: 10px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block;">Registration No.</span>
            <span style="font-size: 14px; font-weight: bold; color: ${black};">${entrollmentNum}</span>
          </div>

          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 5px;">
            <span style="font-size: 10px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block;">Date of Birth</span>
            <span style="font-size: 14px; font-weight: bold; color: ${black};">${dob}</span>
          </div>

          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 5px;">
            <span style="font-size: 10px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block;">Contact Number</span>
            <span style="font-size: 14px; font-weight: bold; color: ${black};">${phone}</span>
          </div>

        </div>
      </div>

      <div style="padding: 0 30px 20px; position: relative; z-index: 2;">
        <div style="border-left: 4px solid ${black}; background: ${lightGray}; padding: 8px 15px; margin-bottom: 15px; font-weight: 800; color: ${black}; font-size: 14px; text-transform: uppercase;">
          Examination Schedule
        </div>

        <table style="width: 100%; border-collapse: collapse; border: 1px solid ${black};">
          <thead>
            <tr style="background: ${black}; color: white; text-align: left;">
              <th style="padding: 10px 15px; font-size: 12px; text-transform: uppercase; border-right: 1px solid white;">Date</th>
              <th style="padding: 10px 15px; font-size: 12px; text-transform: uppercase; border-right: 1px solid white;">Subject</th>
              <th style="padding: 10px 15px; font-size: 12px; text-transform: uppercase; border-right: 1px solid white;">Test Name</th>
              <th style="padding: 10px 15px; font-size: 12px; text-transform: uppercase; border-right: 1px solid white;">Time</th>
              <th style="padding: 10px 15px; font-size: 12px; text-transform: uppercase;">Duration</th>
            </tr>
          </thead>
          <tbody style="font-size: 13px;">
            ${examsHtml}
          </tbody>
        </table>
      </div>

      <div style="padding: 0 30px 20px; position: relative; z-index: 2;">
        <p style="margin: 0; font-size: 11px; color: ${darkGray}; line-height: 1.5; border-top: 1px solid ${borderGray}; padding-top: 15px;">
          <strong style="color: ${black};">Important Instructions:</strong> 
          1. Students must bring this admit card to the examination hall. 2. Please report 15 minutes before the examination time. 3. Electronic devices are strictly prohibited.
        </p>
      </div>

      <div style="
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        position: relative;
        z-index: 2;
        margin-top: 20px;
      ">
        <div style="text-align: center; width: 150px;">
          <div style="height: 40px;"></div>
          <div style="border-top: 1px solid ${black}; padding-top: 5px; font-size: 10px; font-weight: bold; color: ${black}; text-transform: uppercase;">
            Student Signature
          </div>
        </div>

        <div style="text-align: center; width: 150px;">
          <img src="${principalSignature}" crossorigin="anonymous" style="
            height: 40px; 
            max-width: 100%; 
            object-fit: contain; 
            margin-bottom: 5px;
            filter: grayscale(100%) contrast(1000%);
          " />
          <div style="border-top: 1px solid ${black}; padding-top: 5px; font-size: 10px; font-weight: bold; color: ${black}; text-transform: uppercase;">
            Principal / Authority
          </div>
        </div>
      </div>

    </div>
  </div>
  `;
}