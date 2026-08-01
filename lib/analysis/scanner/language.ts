const LANGUAGE_MAP: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  py: "Python",
  java: "Java",
  cpp: "C++",
  cc: "C++",
  c: "C",
  go: "Go",
  rs: "Rust",
  php: "PHP",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  md: "Markdown",
  yml: "YAML",
  yaml: "YAML",
};

export function detectLanguage(extension: string) {
  return LANGUAGE_MAP[extension.toLowerCase()] ?? null;
}