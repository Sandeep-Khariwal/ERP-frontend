// // components/SalaryCard.tsx

// "use client";

// import { useAppSelector } from "@/app/redux/redux.hooks";
// import { GetTeacherPaymentHistory } from "@/axios/teacher/TeacherGetApi";
// import { Box, Flex, Stack, Text } from "@mantine/core";
// import { useEffect, useState } from "react";

// export interface Salary {
//   month: string;
//   baseSalary: number;
//   netSalary: number;
//   amountPaid: number;
//   salleryDate: string;
//   transactionReference: string;
//   salleryStatus: string;
//   salleryMode: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function SalaryCard(props: { teacherId: string }) {
//   const [salary, setSalary] = useState<Salary[]>([]);
  
//       const institute = useAppSelector(
//     (state: any) => state.instituteSlice.instituteDetails,
//   );
  
//     console.log("salery details :",  institute);

//   useEffect(() => {
//     if (props.teacherId) {
//       GetTeacherPaymentHistory(props.teacherId)
//         .then((x: any) => {
//           const { sallery } = x;
//           setSalary(sallery);
//           console.log("TEACHER HISTORY = ", x);
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     }
//   }, [props.teacherId]);

//   return (
//     <>
//       {salary.map((salary) => (
//         <Box
//           style={{
//             width: "100%",
//             border: "1px solid #e0e0e0",
//             borderRadius: "8px",
//             padding: "16px",
//             marginBottom: "12px",
//             backgroundColor: "#fafafa",
//             boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
//           }}
//         >
//           <Flex
//             direction={{ base: "column", sm: "row" }}
//             justify="space-between"
//             wrap="wrap"
//             style={{ gap: "10px" }}
//           >
//             {/* Section 1 */}
//             <Stack>
//               <Text style={{ fontWeight: 600, fontSize: "16px" }}>
//                <span style={{fontWeight:700}}> Month:</span> {salary.month}
//               </Text>
//               <Text><span style={{fontWeight:700}}>Base Salary: &#8377;</span> {salary.baseSalary}</Text>
//               <Text><span style={{fontWeight:700}}>Net Salary: &#8377;</span> {salary.netSalary}</Text>
//             </Stack>

//             {/* Section 2 */}
//             <Stack>
//                            <Text>
//                 <span style={{fontWeight:700}}>Status:</span>
//                 <span
//                   style={{
//                     color: salary.salleryStatus === "Paid" ? "green" : "red",
//                     fontWeight: 800,
//                   }}
//                 >
//                  {" "} {salary.salleryStatus}
//                 </span>
//               </Text>
//               <Text> <span style={{fontWeight:700}}>Amount Paid: &#8377; </span> {salary.amountPaid}</Text>
//               {/* <Text><span style={{fontWeight:700}}>Payment Mode:</span> {salary.salleryMode}</Text> */}
//          <Text>
//                 <span style={{fontWeight:700}}>Paid On: </span> {new Date(salary.salleryDate).toLocaleDateString()}
//               </Text>
//             </Stack>

//             {/* Section 3 */}
//             <Stack>
        
//               <Text style={{ fontSize: "12px", color: "#888" }}>
//                 <span style={{fontWeight:700}} >Created:</span> {new Date(salary.createdAt).toLocaleString()}
//               </Text>
//             </Stack>
//           </Flex>
//         </Box>
//       ))}
//     </>
//   );
// }


// components/SalaryCard.tsx

"use client";

import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetTeacherPaymentHistory } from "@/axios/teacher/TeacherGetApi";
import { Box, Button, Flex, Stack, Text } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createSalarySlipPdf } from "./CreateSalarySlipPdf";
import { GetInstituteBasicDetails, GetInstituteOverview } from "@/axios/institute/InstituteGetApi";

export interface Salary {
  _id?: string;
  month: string;
  baseSalary: number;
  netSalary: number;
  amountPaid: number;
  salleryDate: string;
  transactionReference: string;
  salleryStatus: string;
  salleryMode: string;
  createdAt: string;
  updatedAt: string;
  deductions?: {
    pf?: number;
    esi?: number;
    otherDeductions?: number;
    [key: string]: any;
  };
  instituteId?: string;
  teacherId?: string;
}

// Image to Base64 conversion helper
const getBase64Image = async (imgUrl: string): Promise<string> => {
  if (!imgUrl) return "";
  if (imgUrl.startsWith("data:image")) return imgUrl;
  try {
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(imgUrl);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return imgUrl;
  }
};

export default function SalaryCard(props: {
  teacherId: string;
  teacherName?: string;
  designation?: string;
  bankAccountNo?: string;
  payableDays?: number;
    instituteLogo?: string;
  instituteSignature?: string;
   instituteId: string;
}) {
  const [salary, setSalary] = useState<Salary[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [instituteData, setInstituteData] = useState<any>(null);

  console.log("instituute :", instituteData);
  


  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  console.log("salery details :", institute);

  // useEffect(() => {
  //   if (props.teacherId) {
  //     GetTeacherPaymentHistory(props.teacherId)
  //       .then((x: any) => {
  //         const { sallery } = x;
  //         setSalary(sallery);
  //         console.log("TEACHER HISTORY = ", x);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   }
  // }, [props.teacherId]);

  useEffect(() => {
  if (props.teacherId) {
    GetTeacherPaymentHistory(props.teacherId)
      .then((x: any) => {
        const { sallery } = x;
        setSalary(sallery);
        console.log("TEACHER HISTORY =", x);
      })
      .catch((e) => {
        console.log("Salary history error:", e);
      });
  }
}, [props.teacherId]);

// useEffect(() => {
//   if (props.instituteId) {
//     GetInstituteOverview(props.instituteId)
//       .then((x: any) => {
//         console.log("INSTITUTE OVERVIEW =", x);

//         const { institute } = x;

//         setInstituteData(institute);
//       })
//       .catch((e) => {
//         console.log("Institute overview error:", e);
//       });
//   }
// }, [props.instituteId]);

useEffect(() => {
  if (!props.instituteId) {
    console.error("Institute ID missing");
    return;
  }

  GetInstituteBasicDetails(props.instituteId)
    .then((response: any) => {
      console.log(
        "INSTITUTE BASIC DETAILS RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      const institute = response?.institute ?? null;

      console.log("INSTITUTE DATA SET:", institute);

      setInstituteData(institute);
    })
    .catch((error: any) => {
      console.error(
        "Institute Basic Details API Error:",
        error?.response?.data || error
      );

      setInstituteData(null);
    });
}, [props.instituteId]);


useEffect(() => {
  if (!props.instituteId) {
    console.error("Institute ID missing");
    return;
  }

  GetInstituteOverview(props.instituteId)
    .then((response: any) => {
      console.log(
        "FULL INSTITUTE RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      console.log("INSTITUTE OBJECT:", response?.institute);

      setInstituteData(response?.institute ?? null);
    })
    .catch((error: any) => {
      console.error("Institute API error:", error);
      setInstituteData(null);
    });
}, [props.instituteId]);



const handleDownloadSalarySlip = async (salaryItem: Salary) => {
  try {
    setDownloadingId(salaryItem._id || salaryItem.month);

    // -----------------------------------
    // Institute Logo & Signature
    // -----------------------------------

 
// const logoUrl = instituteData?.logo || "";
// const signatureUrl = instituteData?.signature || "";

// console.log("SALARY SLIP INSTITUTE DATA:", instituteData);

// const base64Logo = logoUrl
//   ? await getBase64Image(logoUrl)
//   : "";

// const base64Signature = signatureUrl
//   ? await getBase64Image(signatureUrl)
//   : "";

// const gstNo = instituteData?.gst?.number || "N/A";

// console.log("LOGO BASE64:", base64Logo);
// console.log("SIGNATURE BASE64:", base64Signature);
// console.log("GST NUMBER:", gstNo);

//     console.log("INSTITUTE DATA:", instituteData);

    
// const html = createSalarySlipPdf({
//   // Institute Details
//   instituteName: instituteData?.name || "Institute Name",
//   instituteAddress: instituteData?.address || "",
//   institutePhone: instituteData?.institutePhoneNumber || "",
//   instituteLogo: base64Logo,
//   instituteSignature: base64Signature,
//   gstNo: gstNo,

//   // Neeche aapka existing teacher aur salary data
//   // bilkul same rehne do
//   teacherName: props.teacherName || "N/A",
//   teacherId: salaryItem.teacherId || props.teacherId,
//   designation: props.designation || "Teacher",
//   bankAccountNo: props.bankAccountNo || "N/A",
//   payableDays: props.payableDays || 30,

//   salaryMonth: salaryItem.month,
//   salaryDate: salaryItem.salleryDate || salaryItem.createdAt,
//   baseSalary: salaryItem.baseSalary,
//   netSalary: salaryItem.netSalary,
//   amountPaid: salaryItem.amountPaid,

//   pfDeduction: salaryItem.deductions?.pf || 0,
//   esiDeduction: salaryItem.deductions?.esi || 0,
//   otherDeduction: salaryItem.deductions?.otherDeductions || 0,

//   salleryStatus: salaryItem.salleryStatus,
//   salleryMode: salaryItem.salleryMode,
//   transactionReference: salaryItem.transactionReference,
// });

const logoUrl = instituteData?.logo || "";
const signatureUrl = instituteData?.signature || "";

const base64Logo = logoUrl
  ? await getBase64Image(logoUrl)
  : "";

const base64Signature = signatureUrl
  ? await getBase64Image(signatureUrl)
  : "";

const html = createSalarySlipPdf({
  instituteName: instituteData?.name || "Institute Name",
  instituteAddress: instituteData?.address || "",
  institutePhone: instituteData?.institutePhoneNumber || "",
  instituteLogo: base64Logo,
  instituteSignature: base64Signature,
  gstNo: instituteData?.gst?.number || "N/A",

  teacherName: props.teacherName || "N/A",
  teacherId: salaryItem.teacherId || props.teacherId,
  designation: props.designation || "Teacher",
  bankAccountNo: props.bankAccountNo || "N/A",
  payableDays: props.payableDays || 30,

  salaryMonth: salaryItem.month,
  salaryDate: salaryItem.salleryDate || salaryItem.createdAt,
  baseSalary: salaryItem.baseSalary,
  netSalary: salaryItem.netSalary,
  amountPaid: salaryItem.amountPaid,

  pfDeduction: salaryItem.deductions?.pf || 0,
  esiDeduction: salaryItem.deductions?.esi || 0,
  otherDeduction: salaryItem.deductions?.otherDeductions || 0,

  salleryStatus: salaryItem.salleryStatus,
  salleryMode: salaryItem.salleryMode,
  transactionReference: salaryItem.transactionReference,
});

    // -----------------------------------
    // Print
    // -----------------------------------

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();

        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    }
  } catch (error) {
    console.error(
      "Error generating Salary Slip PDF:",
      error
    );
  } finally {
    setDownloadingId(null);
  }
};


  return (
    <>
      {salary.map((salaryItem, index) => (
        <Box
          key={salaryItem._id || index}
          style={{
            width: "100%",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            backgroundColor: "#fafafa",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            wrap="wrap"
            style={{ gap: "10px" }}
          >
            {/* Section 1 */}
            <Stack>
              <Text style={{ fontWeight: 600, fontSize: "16px" }}>
                <span style={{ fontWeight: 700 }}> Month:</span> {salaryItem.month}
              </Text>
              <Text>
                <span style={{ fontWeight: 700 }}>Base Salary: &#8377;</span>{" "}
                {salaryItem.baseSalary}
              </Text>
              <Text>
                <span style={{ fontWeight: 700 }}>Net Salary: &#8377;</span>{" "}
                {salaryItem.netSalary}
              </Text>
            </Stack>

            {/* Section 2 */}
            <Stack>
              <Text>
                <span style={{ fontWeight: 700 }}>Status:</span>
                <span
                  style={{
                    color: salaryItem.salleryStatus === "Paid" ? "green" : "red",
                    fontWeight: 800,
                  }}
                >
                  {" "}
                  {salaryItem.salleryStatus}
                </span>
              </Text>
              <Text>
                {" "}
                <span style={{ fontWeight: 700 }}>Amount Paid: &#8377; </span>{" "}
                {salaryItem.amountPaid}
              </Text>
              <Text>
                <span style={{ fontWeight: 700 }}>Paid On: </span>{" "}
                {new Date(salaryItem.salleryDate).toLocaleDateString()}
              </Text>
            </Stack>

            {/* Section 3 */}
            {/* <Stack justify="space-between" align={{ base: "flex-start", sm: "flex-end" }}> */}
            <Stack
  justify="space-between"
  align="flex-end"
>

              <Text style={{ fontSize: "12px", color: "#888" }}>
                <span style={{ fontWeight: 700 }}>Created:</span>{" "}
                {new Date(salaryItem.createdAt).toLocaleString()}
              </Text>

              {/* Download PDF Button */}
              <Button
                size="xs"
                variant="outline"
                color="blue"
                leftSection={<IconDownload size={16} />}
                loading={downloadingId === (salaryItem._id || salaryItem.month)}
                onClick={() => handleDownloadSalarySlip(salaryItem)}
              >
                Download Slip
              </Button>
            </Stack>
          </Flex>
        </Box>
      ))}
    </>
  );
}