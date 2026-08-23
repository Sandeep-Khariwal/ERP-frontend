import {
  BookOpen,
  Backpack,
  GraduationCap,
  Globe,
  Calculator,
  Code2,
  Monitor,
  PencilLine,
  Atom,
  Baby,
  FlaskConical,
  Landmark,
} from "lucide-react";
import { ReactNode } from "react";

export interface BatchIconStyle {
  icon: ReactNode;
  bg: string;
}

const PALETTE = {
  blue: { bg: "#EAF1FF", fg: "#2F6FED" },
  purple: { bg: "#F1EBFF", fg: "#8B5CF6" },
  pink: { bg: "#FFEBF0", fg: "#F43F8C" },
  green: { bg: "#E6F8F1", fg: "#0EA872" },
  orange: { bg: "#FFF1E0", fg: "#F59E0B" },
  red: { bg: "#FFEBEA", fg: "#EF4444" },
};

/**
 * Picks a clean, contextually-relevant vector icon + soft pastel background
 * for a batch, based on its name and subject list. Falls back to a generic
 * school/book icon for anything that doesn't match a known category.
 */
export function getBatchIconStyle(
  name: string,
  subjects: string[] = [],
): BatchIconStyle {
  const haystack = `${name} ${subjects.join(" ")}`.toLowerCase();

  const has = (...needles: string[]) =>
    needles.some((n) => haystack.includes(n));

  if (has("web dev", "web-dev", "webdev", "html", "css", "javascript")) {
    return { icon: <Code2 size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
  }

  if (has("c/c++", "c++", " c ", "programming", "coding")) {
    return { icon: <Code2 size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
  }

  if (has("computer", "bca", "mca", "it ", " it", "computer science")) {
    return { icon: <Monitor size={26} color={PALETTE.purple.fg} />, bg: PALETTE.purple.bg };
  }

  if (has("science", "physics", "chemistry", "biology")) {
    return { icon: <FlaskConical size={26} color={PALETTE.green.fg} />, bg: PALETTE.green.bg };
  }

  if (has("g.k", "gk", "social science", "geography", "history", "economics", "civics")) {
    return { icon: <Landmark size={26} color={PALETTE.orange.fg} />, bg: PALETTE.orange.bg };
  }

  if (has("lkg", "ukg", "nursery", "kindergarten", "pre-primary", "kg")) {
    return { icon: <Baby size={26} color={PALETTE.pink.fg} />, bg: PALETTE.pink.bg };
  }

  if (has("12th", "class 12", "12", "graduation", "college", "senior")) {
    return { icon: <GraduationCap size={26} color={PALETTE.red.fg} />, bg: PALETTE.red.bg };
  }

  if (has("math", "mathematics", "calculus", "algebra")) {
    return { icon: <Calculator size={26} color={PALETTE.pink.fg} />, bg: PALETTE.pink.bg };
  }

  if (has("2nd", "class 2", "class 1", "primary", "junior")) {
    return { icon: <Backpack size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
  }

  if (has("english", "hindi", "language", "literature")) {
    return { icon: <PencilLine size={26} color={PALETTE.pink.fg} />, bg: PALETTE.pink.bg };
  }

  if (has("class 5", "class 10", "class 11")) {
    return { icon: <Globe size={26} color={PALETTE.green.fg} />, bg: PALETTE.green.bg };
  }

  // Generic fallback for standard classes / anything unmatched
  return { icon: <BookOpen size={26} color={PALETTE.blue.fg} />, bg: PALETTE.blue.bg };
}
