import ApiHelper from "@/ApiHelper";

// 1. Create test metadata (first page)
export function CreateTestMeta(data: {
  batchId: string;
  subjectId: string;
  testName: string;
  maxMarks: number;
  totalTime: number;
  startTime: string;
  
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/onlinetest/createTest`, data)
      .then(resolve)
      .catch(reject);
  });
}

// 2. Create or Update one MCQ at a time
export function CreateTestQuestion(data: {
  question: {
    testId: string;
    question: string;
    options: { name: string; answer: boolean }[];
    correctAns: string;
    explanation?: string; 
  },
  questionId?: string; // Optional: include this for updates
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/onlinetestquestion/createQuestion`, data)
      .then(resolve)
      .catch(reject);
  });
}

// 3. CORRECTED: Update test using the new API endpoint with PUT method
export function UpdateTest(data: {
  testId: string;
  batchId?: string;
  subjectId?: string;
  testName?: string;
  name?: string;
  maxMarks?: number;
  totalTime?: number;
  testTime?: number;
  startTime?: string;
  endTime?: string;
}) {
  const { testId, ...updateData } = data;
  console.log("🚀 UpdateTest API called");
  console.log("📝 Test ID:", testId);
  console.log("📦 Update payload:", updateData);
  console.log("🌐 API URL:", `https://erp-backend-p5nc.onrender.com/api/v1/onlinetest/updateTest/${testId}`);
  
  return new Promise((resolve, reject) => {
    ApiHelper.put<any>(`https://erp-backend-p5nc.onrender.com/api/v1/onlinetest/updateTest/${testId}`, updateData)
      .then((response) => {
        console.log("✅ Test update successful:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("❌ Test update failed:", error);
        console.error("❌ Error details:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          url: `https://erp-backend-p5nc.onrender.com/api/v1/onlinetest/updateTest/${testId}`
        });
        reject(error);
      });
  });
}

// 4. Updated: Use new API for simple test updates
export function UpdateOnlineTest(data: {
  testId: string;
  batchId: string;
  subjectId: string;
  testName: string;
  maxMarks: number;
  testTime: number;
}) {
  console.log("📞 UpdateOnlineTest called with data:", data);
  
  // Convert testTime to totalTime for consistency
  return UpdateTest({
    testId: data.testId,
    batchId: data.batchId,
    subjectId: data.subjectId,
    name: data.testName,
    testName: data.testName, // Keep both for compatibility
    maxMarks: data.maxMarks,
    totalTime: data.testTime, // Use totalTime as the main field
    testTime: data.testTime,  // Keep testTime for backward compatibility
  });
}

// 5. Updated: Use new API for full test updates with timing
export function UpdateTestMeta(payload: {
  testId: string;
  batchId: string;
  subjectId: string;
  testName: string;
  maxMarks: number;
  totalTime: number;
  startTime: string;
  endTime: string;
}): Promise<any> {
  console.log("📞 UpdateTestMeta called with payload:", payload);
  
  return UpdateTest({
    testId: payload.testId,
    batchId: payload.batchId,
    subjectId: payload.subjectId,
    name: payload.testName,
    testName: payload.testName, // Keep both for compatibility
    maxMarks: payload.maxMarks,
    totalTime: payload.totalTime,
    startTime: payload.startTime,
    endTime: payload.endTime,
  });
}


export function SubmitStudentResponse(data: {
  optionId: string;
  pendingTime: number;
  questionId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${process.env.URL}/api/v1/onlinetestquestion/studentResponse/${data.questionId}`, data)
      .then(resolve)
      .catch(reject);
  });
}

export function SubmitTest(data: {
  testId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${process.env.URL}/api/v1/onlinetestresult/submitTest/${data.testId}`, {})
      .then(resolve)
      .catch(reject);
  });
}