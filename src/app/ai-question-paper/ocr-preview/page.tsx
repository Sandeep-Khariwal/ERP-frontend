import { Suspense } from "react";
import OCRPreviewPage from "../../components/ai-question-paper/OCRPreviewPage";

export default function Page() { return <Suspense fallback={null}><OCRPreviewPage /></Suspense>; }
