import ApiHelper from "@/ApiHelper";

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
export function GetAllTestsByBatchAndSubject(batchId: string, subjectId?: string): Promise<Test[]> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/allTests`, {
      params: { batchId, subjectId },
    })
      .then((res) => resolve(res as Test[]))
      .catch(reject);
  });
}


// ✅ Get all questions by test ID
export function GetAllQuestionsByTestId(testId: string): Promise<GetQuestionsResponse> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetestquestion/getAllQuestions/${testId}`)
      .then((res) => resolve(res as GetQuestionsResponse))
      .catch(reject);
  });
}

export function GetAllLiveTest(batchId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/getAllLiveTest?batchId=${batchId}`)
      .then(resolve)
      .catch(reject);
  });
}

export function GetOnlineTest(testId?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/getTest?testId=${testId}`)
      .then(resolve)
      .catch(reject);
  });
}


// ✅ Delete test by ID
export function DeleteTestById(testId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`${process.env.URL}/api/v1/onlinetest/deleteTest/${testId}`)
      .then(resolve)
      .catch(reject);
  });
}

// ✅ Delete a question by ID
export function DeleteTestQuestionById(questionId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`${process.env.URL}/api/v1/onlinetestquestion/deleteQuestion/${questionId}`)
      .then(resolve)
      .catch(reject);
  });
}

// ✅ Restore a deleted test
export function RestoreTestById(testId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/restoreTest/${testId}`)
      .then(resolve)
      .catch(reject);
  });
}


export function GetTestById(testId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetest/getTest/${testId}`)
      .then(resolve)
      .catch(reject);
  });
}


export function GetTestResult(testId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${process.env.URL}/api/v1/onlinetestresult/getResultById/${testId}`)
      .then(resolve)
      .catch(reject);
  });
}