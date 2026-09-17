export interface CouplingAnalysis {
  score: number;
  averageDependencies: number;
  findings: string[];
}

export function analyzeCoupling(
  graph: Map<string, string[]>
): CouplingAnalysis {
   const fileCount = graph.size;

  if (fileCount === 0) {
    return {
      score: 0,
      averageDependencies: 0,
      findings: ["No analyzable files were found."],
    };
  }
   let totalDependencies = 0;

  for (const dependencies of graph.values()) {
    totalDependencies += dependencies.length;
  }
   const averageDependencies =
    totalDependencies / fileCount;

    let score: number;
  const findings: string[] = [];
  if (averageDependencies <= 2) {
    score = 90;
    findings.push(
      "The repository has relatively low inter-file coupling.",
    );
  } else if (averageDependencies <= 4) {
    score = 70;
    findings.push(
      "The repository has moderate inter-file coupling.",
    );
  } else if (averageDependencies <= 6) {
    score = 50;
    findings.push(
      "The repository has relatively high inter-file coupling.",
    );
  } else {
    score = 30;
    findings.push(
      "The repository has very high inter-file coupling.",
    );
  }
  return {
    score,
    averageDependencies,
    findings,
  };
}