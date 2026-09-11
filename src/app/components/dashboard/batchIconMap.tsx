import {
  BookOpen,
  Backpack,
  GraduationCap,
  Code2,
  Monitor,
  Baby,
  Globe,
} from "lucide-react";
import { ReactNode } from "react";

export interface BatchIconStyle {
  icon: ReactNode;
  bg: string;
}

// Restrained, blue-forward palette. No red — red is reserved for
// errors/destructive actions elsewhere in the app.
const PALETTE = {
  blue: { bg: "#EAF1FF", fg: "#2F6FED" },
  navy: { bg: "#E9EDF7", fg: "#33415C" },
  purple: { bg: "#F1EBFF", fg: "#8B5CF6" },
  teal: { bg: "#E6F8F1", fg: "#0EA872" },
  pink: { bg: "#FCEBF3", fg: "#C2568A" },
};

/**
 * Picks a batch icon based on a single consistent strategy:
 *  - Real technology/vocational programs (Web Dev, C/C++, Basic Computer,
 *    BCA/MCA) get a technology or professional-education icon.
 *  - Everything else (LKG/UKG, Class 1-12) gets an icon from one
 *    consistent "education/learning" icon family, keyed off the grade
 *    tier rather than the subjects the class happens to study — so a
 *    class that teaches Maths never ends up with a calculator icon.
 */
export function getBatchIconStyle(
  name: string,
  _subjects: string[] = [],
): BatchIconStyle {
  const n = name.toLowerCase().trim();

  const has = (...needles: string[]) => needles.some((needle) => n.includes(needle));

  // ── Technology / vocational programs ──
  if (has("web dev", "web-dev", "webdev")) {
    return { icon: <Code2 size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
  }
  if (has("c/c++", "c++", "c/c", "programming", "coding")) {
    return { icon: <Code2 size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
  }
  if (has("basic computer", "computer science", "computer")) {
    return { icon: <Monitor size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
  }
  if (has("bca", "mca")) {
    // Academic/professional program rather than a raw tech icon.
    return { icon: <GraduationCap size={26} color={PALETTE.purple.fg} />, bg: PALETTE.purple.bg };
  }

  // ── Pre-primary ──
  if (has("lkg", "ukg", "nursery", "kindergarten", "pre-primary")) {
    return { icon: <Baby size={26} color={PALETTE.pink.fg} />, bg: PALETTE.pink.bg };
  }

  // ── Grade-tier education icon family (Class 1–12) ──
  const gradeMatch = n.match(/(?:class\s*)?(\d{1,2})(?:st|nd|rd|th)?/);
  const grade = gradeMatch ? parseInt(gradeMatch[1], 10) : null;

  if (grade !== null && grade >= 1 && grade <= 12) {
    if (grade <= 5) {
      // Primary — school/learning icon
      return { icon: <Backpack size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
    }
    if (grade <= 9) {
      // Middle/secondary — books/learning icon
      return { icon: <Globe size={26} color={PALETTE.teal.fg} />, bg: PALETTE.teal.bg };
    }
    if (grade === 10) {
      // Academic/book icon
      return { icon: <BookOpen size={26} color={PALETTE.navy.fg} />, bg: PALETTE.navy.bg };
    }
    if (grade === 11) {
      // Advanced academic/book icon
      return { icon: <GraduationCap size={26} color={PALETTE.purple.fg} />, bg: PALETTE.purple.bg };
    }
    // Class 12 — graduation/academic icon
    return { icon: <GraduationCap size={26} color={PALETTE.navy.fg} />, bg: PALETTE.navy.bg };
  }

  // Generic fallback for anything unmatched (custom-named batches etc.)
  return { icon: <BookOpen size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
}
