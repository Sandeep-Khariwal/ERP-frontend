import { getExamStartTime } from "@/app/helperFunction/Notification";
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

  // Pure Black & White Palette for Clean Printing
  const black = "#000000"; 
  const darkGray = "#333333";
  const lightGray = "#f2f2f2";
  const borderGray = "#cccccc";

  // Generate Examination Table Rows with Normal Formatting Spacing
  const examsHtml = examsData && examsData.length > 0 
    ? examsData.map((exam, index) => {
        const d = new Date(exam.startTime);
        
        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = getExamStartTime(d);
        
        const durationInMinutes = exam.totalTime > 10000 
          ? Math.round(exam.totalTime / 60000) 
          : exam.totalTime;
        
        return `
          <tr style="border-bottom: 1px solid ${borderGray}; background: ${index % 2 === 0 ? '#ffffff' : '#fafafa'}; font-size: 13px;">
            <td style="padding: 8px 12px; font-weight: 600; color: ${black};">${dateStr}</td>
            <td style="padding: 8px 12px; font-weight: bold; color: ${black};">${exam.subjectId?.name || '-'}</td>
            <td style="padding: 8px 12px; color: ${darkGray};">${exam.name}</td>
            <td style="padding: 8px 12px; font-weight: 600; color: ${darkGray};">${timeStr}</td>
            <td style="padding: 8px 12px; color: ${black}; font-weight: 600;">${durationInMinutes} Mins</td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="5" style="padding: 20px; text-align: center; color: ${darkGray}; font-style: italic; font-size: 13px;">No Upcoming Examinations Scheduled</td></tr>`;

  return `
  <div style="
    width: 100%;
    min-height: 380px;
    height: auto;
    margin: 0 auto;
    background: #ffffff;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    position: relative;
    color: ${black};
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    box-sizing: border-box;
    padding: 10px;
  ">
    <div style="
      border: 2px solid ${black};
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    ">
      
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.02;
        z-index: 0;
        pointer-events: none;
      ">
        <img src="${data.schoolLogo}" crossorigin="anonymous" style="width: 200px; height: 200px; object-fit: contain; filter: grayscale(100%);" />
      </div>

      <div style="
        background: #ffffff;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${black};
        position: relative;
        z-index: 2;
        border-bottom: 2px solid ${black};
      ">
        <img src="${data.schoolLogo}" crossorigin="anonymous" style="
          height: 48px; 
          width: 48px; 
          object-fit: contain; 
          background: white; 
          filter: grayscale(100%);
        " />
        
        <div style="flex: 1; text-align: center; padding: 0 12px;">
          <h1 style="margin: 0 0 3px 0; font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2;">
            ${schoolName}
          </h1>
          <p style="margin: 0 0 5px 0; font-size: 11px; font-weight: 600; color: ${darkGray};">
            ${schoolAddress} | Phone: ${institutePhoneNumber}
          </p>
          <div style="display: inline-block; background: ${black}; color: white; padding: 3px 10px; font-weight: bold; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase;">
            Admit Card - Online Examination
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; text-align: right; min-width: 140px; justify-content: flex-end;">
          <div>
            <div style="font-size: 9px; text-transform: uppercase; margin-bottom: 2px; font-weight: bold; line-height: 1;">Session</div>
            <div style="font-size: 14px; font-weight: 900;">${session}</div>
          </div>
          <div style="
            width: 55px;
            height: 66px;
            border: 1px solid ${black};
            overflow: hidden;
            background: ${lightGray};
            flex-shrink: 0;
          ">
            <img src="${data.studentPhoto}" crossorigin="anonymous" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%);" />
          </div>
        </div>
      </div>

      <div style="padding: 12px 14px 6px; position: relative; z-index: 2;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px 20px;">
          
          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 3px;">
            <span style="font-size: 9px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block; line-height: 1.2;">Student Name</span>
            <span style="font-size: 13px; font-weight: 900; color: ${black};">${studentName.toUpperCase()}</span>
          </div>
          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 3px;">
            <span style="font-size: 9px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block; line-height: 1.2;">Class / Batch</span>
            <span style="font-size: 12px; font-weight: bold; color: ${black};">${className}</span>
          </div>
          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 3px;">
            <span style="font-size: 9px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block; line-height: 1.2;">Roll Number</span>
            <span style="font-size: 12px; font-weight: bold; color: ${black};">${rollNo}</span>
          </div>

          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 3px;">
            <span style="font-size: 9px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block; line-height: 1.2;">Registration No.</span>
            <span style="font-size: 12px; font-weight: bold; color: ${black};">${entrollmentNum}</span>
          </div>
          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 3px;">
            <span style="font-size: 9px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block; line-height: 1.2;">Date of Birth</span>
            <span style="font-size: 12px; font-weight: bold; color: ${black};">${dob}</span>
          </div>
          <div style="border-bottom: 1px dotted ${darkGray}; padding-bottom: 3px;">
            <span style="font-size: 9px; color: ${darkGray}; text-transform: uppercase; font-weight: bold; display: block; line-height: 1.2;">Contact Number</span>
            <span style="font-size: 12px; font-weight: bold; color: ${black};">${phone}</span>
          </div>

        </div>
      </div>

      <div style="padding: 10px 14px 0; position: relative; z-index: 2;">
        <div style="border-left: 3px solid ${black}; background: ${lightGray}; padding: 3px 6px; margin-bottom: 6px; font-weight: 800; color: ${black}; font-size: 11px; text-transform: uppercase; line-height: 1.1;">
          Examination Schedule
        </div>

        <div style="border: 1px solid ${black};">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: ${black}; color: white; text-align: left; font-size: 11px;">
                <th style="padding: 6px 12px; text-transform: uppercase; border-right: 1px solid white;">Date</th>
                <th style="padding: 6px 12px; text-transform: uppercase; border-right: 1px solid white;">Subject</th>
                <th style="padding: 6px 12px; text-transform: uppercase; border-right: 1px solid white;">Test Name</th>
                <th style="padding: 6px 12px; text-transform: uppercase; border-right: 1px solid white;">Time</th>
                <th style="padding: 6px 12px; text-transform: uppercase;">Duration</th>
              </tr>
            </thead>
            <tbody>
              ${examsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <div style="padding: 10px 14px 0; position: relative; z-index: 2;">
        <p style="margin: 0; font-size: 10px; color: ${darkGray}; line-height: 1.4; border-top: 1px solid ${borderGray}; padding-top: 6px;">
          <strong style="color: ${black};">Instructions:</strong> 
          1. Bring this card to the hall. 2. Report 15 mins early. 3. Electronic devices are prohibited.
        </p>
      </div>

      <div style="
        padding: 14px 14px 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        position: relative;
        z-index: 2;
        margin-top: auto;
      ">
        <div style="text-align: center; width: 110px;">
          <div style="height: 25px;"></div>
          <div style="border-top: 1px solid ${black}; padding-top: 3px; font-size: 9px; font-weight: bold; color: ${black}; text-transform: uppercase; line-height: 1;">
            Student Sign
          </div>
        </div>

        <div style="text-align: center; width: 110px;">
          <img src="${principalSignature}" crossorigin="anonymous" style="
            height: 28px; 
            max-width: 100%; 
            object-fit: contain; 
            margin-bottom: 2px;
            filter: grayscale(100%) contrast(1000%);
          " />
          <div style="border-top: 1px solid ${black}; padding-top: 3px; font-size: 9px; font-weight: bold; color: ${black}; text-transform: uppercase; line-height: 1;">
            Authority Sign
          </div>
        </div>
      </div>

    </div>
  </div>
  `;
}