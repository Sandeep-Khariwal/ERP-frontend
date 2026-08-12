import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  uploadMaterial,
  getOCRDocument,
  updateOCRText,
  generateQuestionPaper,
  saveDraft,
  updateQuestionPaper,
  getAllQuestionPapers,
  getQuestionPaper,
  generatePDF,
  downloadPDF,
  createExam,
  publishExam,
  GenerateParams,
  AIQuestionPaper,
} from "../axios/aiQuestionPaper/aiQuestionPaper.api";

// ─── Upload ────────────────────────────────────────────────────────────────────

export function useUploadMaterial() {
  return useMutation({
    mutationFn: ({
      files,
      instituteId,
      teacherId,
    }: {
      files: File[];
      instituteId: string;
      teacherId: string;
    }) => uploadMaterial(files, instituteId, teacherId),
  });
}

// ─── OCR ───────────────────────────────────────────────────────────────────────

export function useOCRDocument(id: string, instituteId: string) {
  return useQuery({
    queryKey: ["ocr-document", id],
    queryFn: () => getOCRDocument(id, instituteId),
    enabled: !!id && !!instituteId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === "pending" || status === "processing") return 3000;
      return false;
    },
  });
}

export function useUpdateOCRText() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      instituteId,
      extractedText,
    }: {
      id: string;
      instituteId: string;
      extractedText: string;
    }) => updateOCRText(id, instituteId, extractedText),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["ocr-document", variables.id] });
    },
  });
}

// ─── Generate ─────────────────────────────────────────────────────────────────

export function useGenerateQuestionPaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: GenerateParams) => generateQuestionPaper(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-papers"] });
    },
  });
}

// ─── Draft & CRUD ─────────────────────────────────────────────────────────────

export function useSaveDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<GenerateParams>) => saveDraft(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-papers"] });
    },
  });
}

export function useUpdatePaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      instituteId,
      teacherId,
      updates,
    }: {
      id: string;
      instituteId: string;
      teacherId: string;
      updates: Partial<AIQuestionPaper>;
    }) => updateQuestionPaper(id, instituteId, teacherId, updates),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["question-paper", variables.id] });
      qc.invalidateQueries({ queryKey: ["question-papers"] });
    },
  });
}

export function useQuestionPapers(params: {
  instituteId: string;
  teacherId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["question-papers", params],
    queryFn: () => getAllQuestionPapers(params),
    enabled: !!params.instituteId,
  });
}

export function useQuestionPaper(id: string, instituteId: string) {
  return useQuery({
    queryKey: ["question-paper", id],
    queryFn: () => getQuestionPaper(id, instituteId),
    enabled: !!id && !!instituteId,
  });
}

// ─── PDF ──────────────────────────────────────────────────────────────────────

export function useGeneratePDF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      instituteId,
      teacherId,
      instituteName,
      logoUrl,
    }: {
      id: string;
      instituteId: string;
      teacherId: string;
      instituteName: string;
      logoUrl?: string;
    }) => generatePDF(id, instituteId, teacherId, instituteName, logoUrl),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["question-paper", variables.id] });
    },
  });
}

export function useDownloadPDF() {
  return useMutation({
    mutationFn: ({
      id,
      instituteId,
      type,
    }: {
      id: string;
      instituteId: string;
      type: "paper" | "answer-key";
    }) => downloadPDF(id, instituteId, type),
  });
}

// ─── Exam ─────────────────────────────────────────────────────────────────────

export function useCreateExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      instituteId,
      teacherId,
    }: {
      id: string;
      instituteId: string;
      teacherId: string;
    }) => createExam(id, instituteId, teacherId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["question-paper", variables.id] });
    },
  });
}

export function usePublishExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      instituteId,
      teacherId,
    }: {
      id: string;
      instituteId: string;
      teacherId: string;
    }) => publishExam(id, instituteId, teacherId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["question-paper", variables.id] });
      qc.invalidateQueries({ queryKey: ["question-papers"] });
    },
  });
}
