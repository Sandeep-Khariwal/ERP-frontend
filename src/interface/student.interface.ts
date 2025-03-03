import { AttendanceStatus } from "@/app/components/institute/insideBatch/AttendanceCard";

  export interface AttendanceInterface {
    _id:string;
    batchId:string;
    studentId:string;
    status:AttendanceStatus;
    date:Date;
  };

  interface StudentFeeRecord {
    _id: string;
    studentId: string;
    pricePaid: number;
    priceToBePaid: number;
    courseFeeDate: string;
    monthDate: Date;
    createdAt: Date;
    receiptNo: string;
    amountPaid?: string;
  }
export interface StudentsDataWithBatch {
    _id?: string;
    name: string;
    phoneNumber: string[];
    parentName: string;
    instituteId?: string;
    profilePic?: string;
    batchId?: {_id:string,name:string};
    attendance?: AttendanceInterface[];
    paymentRecords?: StudentFeeRecord[];
    totalFees?: number;
    dateOfBirth?: Date;
    address?: string;
    totalPaidFees?: number;
    uniqueRoll?: number;
    isInActive?: boolean;
    checked?: boolean;
    marks?: number;
    isError?: boolean;
    pdfLink?: string;
    pdfFileName?: string;
    testReportId?: string;
    totalRewardpoints?: number;
    noofGivenTests?: number;
    parentNumber?: string;
    gender?: string;
    standard?: string;
    source?: string;
    dateOfJoining?: Date;
    instituteBatches?: string[];
    additionalPhoneNumbers?: string[];
  }
