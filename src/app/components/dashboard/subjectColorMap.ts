// Deterministic pastel color for a subject name, so the same subject
// always renders with the same badge color across the whole app.
const PALETTE = [
  { bg: "#EAF1FF", fg: "#2F6FED" }, // blue
  { bg: "#E6F8F1", fg: "#0EA872" }, // teal/green
  { bg: "#F1EBFF", fg: "#8B5CF6" }, // purple
  { bg: "#FFF4E0", fg: "#B98900" }, // amber
  { bg: "#FCEBF3", fg: "#C2568A" }, // pink
  { bg: "#E9EDF7", fg: "#33415C" }, // navy
];

export function getSubjectBadgeStyle(name: string): { bg: string; fg: string } {
  const key = (name || "").trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

// A few common subjects get a fixed, intuitive color instead of a hash
// (keeps things like "Physics"/"Maths" visually stable & sensible).
const FIXED: Record<string, { bg: string; fg: string }> = {
  physics: { bg: "#EAF1FF", fg: "#2F6FED" },
  mathematics: { bg: "#E6F8F1", fg: "#0EA872" },
  maths: { bg: "#E6F8F1", fg: "#0EA872" },
  chemistry: { bg: "#F1EBFF", fg: "#8B5CF6" },
  biology: { bg: "#E6F8F1", fg: "#0EA872" },
  english: { bg: "#FFF4E0", fg: "#B98900" },
  computer: { bg: "#FCEBF3", fg: "#C2568A" },
  "computer science": { bg: "#FCEBF3", fg: "#C2568A" },
};

export function subjectBadge(name: string) {
  const key = (name || "").trim().toLowerCase();
  return FIXED[key] || getSubjectBadgeStyle(name);
}
