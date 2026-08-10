// // const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// const BASE_URL = `${process.env.URL}/api/v1/ai-question-paper`;
// import ApiHelper from "@/ApiHelper";

// export interface OCRDocument {
//   _id: string;
//   originalFileName: string;
//   s3Url: string;
//   mimeType: string;
//   size: number;
//   extractedText: string;
//   status: "pending" | "processing" | "completed" | "failed";
//   createdAt: string;
// }

// export interface QuestionOption {
//   label: string;
//   text: string;
// }

// export interface Question {
//   _id: string;
//   questionText: string;
//   type: "mcq" | "short" | "long" | "very_long";
//   marks: number;
//   difficulty: "easy" | "medium" | "hard";
//   options: QuestionOption[];
//   correctAnswer: string;
//   explanation: string;
//   bloomsLevel: string;
//   order: number;
// }

// export interface AnswerKey {
//   questionId: string;
//   answer: string;
//   marks: number;
// }

// export interface AIQuestionPaper {
//   _id: string;
//   title: string;
//   classId: string;
//   subjectId: string;
//   chapterName: string;
//   language: string;
//   difficulty: string;
//   totalMarks: number;
//   duration: number;
//   mcqCount: number;
//   shortCount: number;
//   longCount: number;
//   veryLongCount: number;
//   bloomsTaxonomy: string;
//   examType: string;
//   ocrDocumentIds: string[];
//   instructions: string[];
//   questions: Question[];
//   answerKey: AnswerKey[];
//   status: "draft" | "published" | "archived";
//   pdfUrl: string;
//   answerKeyPdfUrl: string;
//   createdAt: string;
// }

// export interface GenerateParams {
//   instituteId: string;
//   teacherId: string;
//   title: string;
//   classId: string;
//   className: string;
//   subjectId: string;
//   subject: string;
//   chapterName: string;
//   language: string;
//   difficulty: string;
//   totalMarks: number;
//   duration: number;
//   mcqCount: number;
//   shortCount: number;
//   longCount: number;
//   veryLongCount: number;
//   bloomsTaxonomy: string;
//   examType: string;
//   ocrDocumentIds: string[];
// }

// export async function uploadMaterial(files: File[], instituteId: string, teacherId: string) {
//   const formData = new FormData();
//   files.forEach((f) => formData.append("files", f));
//   formData.append("instituteId", instituteId);
//   formData.append("teacherId", teacherId);
//   const res = await fetch(`${BASE_URL}/ai-question-paper/upload`, { method: "POST", body: formData });
//   return res.json();
// }

// export async function getOCRDocument(id: string, instituteId: string) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/ocr/${id}?instituteId=${instituteId}`);
//   return res.json();
// }

// export async function updateOCRText(id: string, instituteId: string, extractedText: string) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/ocr/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ instituteId, extractedText }),
//   });
//   return res.json();
// }

// export async function generateQuestionPaper(params: GenerateParams) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/generate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(params),
//   });
//   return res.json();
// }

// export async function saveDraft(data: Partial<GenerateParams>) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/save-draft`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export async function updateQuestionPaper(id: string, instituteId: string, teacherId: string, updates: Partial<AIQuestionPaper>) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ instituteId, teacherId, ...updates }),
//   });
//   return res.json();
// }

// export async function getAllQuestionPapers(params: {
//   instituteId: string; teacherId?: string; page?: number; limit?: number; search?: string; status?: string;
// }) {
//   const query = new URLSearchParams({
//     instituteId: params.instituteId,
//     page: String(params.page || 1),
//     limit: String(params.limit || 10),
//     ...(params.teacherId && { teacherId: params.teacherId }),
//     ...(params.search && { search: params.search }),
//     ...(params.status && { status: params.status }),
//   });
//   const res = await fetch(`${BASE_URL}/ai-question-paper?${query}`);
//   return res.json();
// }

// export async function getQuestionPaper(id: string, instituteId: string) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/${id}?instituteId=${instituteId}`);
//   return res.json();
// }

// export async function generatePDF(id: string, instituteId: string, teacherId: string, instituteName: string, logoUrl?: string) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/${id}/generate-pdf`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ instituteId, teacherId, instituteName, logoUrl }),
//   });
//   return res.json();
// }

// export async function downloadPDF(id: string, instituteId: string, type: "paper" | "answer-key" = "paper") {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/${id}/download?instituteId=${instituteId}&type=${type}`);
//   return res.json();
// }

// export async function createExam(id: string, instituteId: string, teacherId: string) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/${id}/create-exam`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ instituteId, teacherId }),
//   });
//   return res.json();
// }

// export async function publishExam(id: string, instituteId: string, teacherId: string) {
//   const res = await fetch(`${BASE_URL}/ai-question-paper/${id}/publish`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ instituteId, teacherId }),
//   });
//   return res.json();
// }


import ApiHelper from "../../ApiHelper";

const BASE_URL = `${process.env.URL}/api/v1/ai-question-paper`;

// ---------- Interfaces ----------

export interface OCRDocument {
  _id: string;
  originalFileName: string;
  s3Url: string;
  mimeType: string;
  size: number;
  extractedText: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  _id: string;
  questionText: string;
  type: "mcq" | "short" | "long" | "very_long";
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  bloomsLevel: string;
  order: number;
}

export interface AnswerKey {
  questionId: string;
  answer: string;
  marks: number;
}

export interface AIQuestionPaper {
  _id: string;
  title: string;
  classId: string;
  subjectId: string;
  chapterName: string;
  language: string;
  difficulty: string;
  totalMarks: number;
  duration: number;
  mcqCount: number;
  shortCount: number;
  longCount: number;
  veryLongCount: number;
  bloomsTaxonomy: string;
  examType: string;
  ocrDocumentIds: string[];
  instructions: string[];
  questions: Question[];
  answerKey: AnswerKey[];
  status: "draft" | "published" | "archived";
  pdfUrl: string;
  answerKeyPdfUrl: string;
  createdAt: string;
}

export interface GenerateParams {
  instituteId: string;
  teacherId: string;
  title: string;
  classId: string;
  className: string;
  subjectId: string;
  subject: string;
  chapterName: string;
  language: string;
  difficulty: string;
  totalMarks: number;
  duration: number;
  mcqCount: number;
  shortCount: number;
  longCount: number;
  veryLongCount: number;
  bloomsTaxonomy: string;
  examType: string;
  ocrDocumentIds: string[];
}

// ---------- API Functions ----------

// POST /upload
export function uploadMaterial(
  files: File[],
  instituteId: string,
  teacherId: string
) {
  return new Promise((resolve, reject) => {
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("instituteId", instituteId);
      formData.append("teacherId", teacherId);

      ApiHelper.post(`${BASE_URL}/upload`, formData)
        .then((response) => resolve(response))
        .catch((error: any) => {
          console.log("UPLOAD MATERIAL ERROR :", error?.response || error);
          reject(error);
        });
    } catch (error: any) {
      console.log("UPLOAD MATERIAL ERROR (SYNC) :", error);
      reject(error);
    }
  });
}

// GET /ocr/:id
export function getOCRDocument(id: string, instituteId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${BASE_URL}/ocr/${id}?instituteId=${instituteId}`)
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("GET OCR DOCUMENT ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// PUT /ocr/:id
export function updateOCRText(
  id: string,
  instituteId: string,
  extractedText: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${BASE_URL}/ocr/${id}`, {
      instituteId,
      extractedText,
    })
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("UPDATE OCR TEXT ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// POST /generate
export function generateQuestionPaper(params: GenerateParams) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${BASE_URL}/generate`, params)
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("GENERATE QUESTION PAPER ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// POST /save-draft
export function saveDraft(data: Partial<GenerateParams>) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${BASE_URL}/save-draft`, data)
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("SAVE DRAFT ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// GET /
export function getAllQuestionPapers(params: {
  instituteId: string;
  teacherId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return new Promise((resolve, reject) => {
    try {
      const query = new URLSearchParams({
        instituteId: params.instituteId,
        page: String(params.page || 1),
        limit: String(params.limit || 10),
        ...(params.teacherId && { teacherId: params.teacherId }),
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
      });

      ApiHelper.get(`${BASE_URL}?${query}`)
        .then((response) => resolve(response))
        .catch((error: any) => {
          console.log("GET ALL QUESTION PAPERS ERROR :", error?.response || error);
          reject(error);
        });
    } catch (error: any) {
      console.log("GET ALL QUESTION PAPERS ERROR (SYNC) :", error);
      reject(error);
    }
  });
}

// GET /:id
export function getQuestionPaper(id: string, instituteId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`${BASE_URL}/${id}?instituteId=${instituteId}`)
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("GET QUESTION PAPER ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// PUT /:id
export function updateQuestionPaper(
  id: string,
  instituteId: string,
  teacherId: string,
  updates: Partial<AIQuestionPaper>
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`${BASE_URL}/${id}`, {
      instituteId,
      teacherId,
      ...updates,
    })
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("UPDATE QUESTION PAPER ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// POST /:id/generate-pdf
export function generatePDF(
  id: string,
  instituteId: string,
  teacherId: string,
  instituteName: string,
  logoUrl?: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${BASE_URL}/${id}/generate-pdf`, {
      instituteId,
      teacherId,
      instituteName,
      logoUrl,
    })
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("GENERATE PDF ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// GET /:id/download
export function downloadPDF(
  id: string,
  instituteId: string,
  type: "paper" | "answer-key" = "paper"
) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `${BASE_URL}/${id}/download?instituteId=${instituteId}&type=${type}`
    )
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("DOWNLOAD PDF ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// POST /:id/create-exam
export function createExam(
  id: string,
  instituteId: string,
  teacherId: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${BASE_URL}/${id}/create-exam`, {
      instituteId,
      teacherId,
    })
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("CREATE EXAM ERROR :", error?.response || error);
        reject(error);
      });
  });
}

// POST /:id/publish
export function publishExam(
  id: string,
  instituteId: string,
  teacherId: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`${BASE_URL}/${id}/publish`, {
      instituteId,
      teacherId,
    })
      .then((response) => resolve(response))
      .catch((error: any) => {
        console.log("PUBLISH EXAM ERROR :", error?.response || error);
        reject(error);
      });
  });
}