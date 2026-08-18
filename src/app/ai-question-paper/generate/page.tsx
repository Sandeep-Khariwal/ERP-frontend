import { Suspense } from "react";
import GenerateQuestionPaperPage from "../../components/ai-question-paper/GenerateQuestionPaperPage";

export default function Page() { return <Suspense fallback={null}><GenerateQuestionPaperPage /></Suspense>; }
