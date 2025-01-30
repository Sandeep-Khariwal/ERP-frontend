export interface Installment {
    _id?: string;
    name: string;
    dueDate: string;
    updatedAt?: string;
    status?: string;
    amount: number;
    amountPaid?: number;
    batch?: string;
    isDeleted?: boolean;
  }

  export interface FeeData {
    _id: string;
    monthDate: string;
    coursefees: number;
  }
  
  export enum FeeOptions {
    MONTHLY = "monthly",
    YEARLY = "yearly",
    QUARTERLY = "quarterly",
  }
  
  interface FeeOption {
    label: string;
    value: FeeOptions;
  }
  export const feeOptions: FeeOption[] = [
    { label: "Monthly", value: FeeOptions.MONTHLY },
    { label: "Yearly", value: FeeOptions.YEARLY },
    { label: "Quarterly", value: FeeOptions.QUARTERLY },
  ];

  export interface StudentData {
    name: string;
    parentName: string;
    dateOfBirth: Date;
    address: string;
    phoneNumber: string[];
    additionalPhoneNumbers: string[];
  }
  export interface StudentPayload {
    name: string;
    parentName: string;
    dateOfBirth: Date;
    address: string;
    phoneNumber: string[];
    parentNumber:string;
    gender:string;
    instituteId:string;
    batchId?:string
  }