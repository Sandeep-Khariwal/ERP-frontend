import ApiHelper from "../../ApiHelper";

export type Option = {
  name: string;
  answer: boolean;
};

export type Question = {
  _id: string;
  question: string;
  options: Option[];
  correctAns: string;
  explanation?: string;
  testId?: string; // optional if not returned in API
};

export type GetQuestionsResponse = {
  questions: Question[];
};

export type Test = {
  _id: string;
  name: string;
};

// ✅ Get all tests by subject
export function GetAllTestsByBatchAndSubject(
  batchId: string,
  subjectId?: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/allTests`, {
      params: { batchId, subjectId },
    })
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ✅ Get all questions by test ID
export function GetAllQuestionsByTestId(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/onlinetestquestion/getAllQuestions/${testId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetAllLiveTest(batchId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/onlinetest/getAllLiveTest?batchId=${batchId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetOnlineTest(testId?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/onlinetest/getTest?testId=${testId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ✅ Delete test by ID
export function DeleteTestById(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/onlinetest/deleteTest/${testId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ✅ Delete a question by ID
export function DeleteTestQuestionById(questionId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/onlinetestquestion/deleteQuestion/${questionId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

// ✅ Restore a deleted test
export function RestoreTestById(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/restoreTest/${testId}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetTestById(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/getTest/${testId}`)
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}

export function GetTestResult(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${process.env.URL}/api/v1/onlinetestresult/getResultById/${testId}`
    )
      .then((response: any) => resolve(response))
      .catch((error: any) => reject(error));
  });
}
