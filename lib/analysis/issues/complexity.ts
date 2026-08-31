import { ASTContext } from "../ast/engine";
import { RepositoryIssue } from "./types";
import { calculateComplexity } from "./complexity-calculator";
import { SyntaxKind } from "ts-morph";

const HIGH_COMPLEXITY = 10;
const VERY_HIGH_COMPLEXITY = 20;

export function detectComplexity(
    context: ASTContext,
): RepositoryIssue[] {
    const issues: RepositoryIssue[] = [];

    for (const sourceFile of context.sourceFiles) {
        const functions = sourceFile.getFunctions();
        const classes = sourceFile.getClasses();
        const arrowFunctions = sourceFile.getDescendantsOfKind(
            SyntaxKind.ArrowFunction,
        );


        for (const fn of functions) {
            const complexity = calculateComplexity(fn);
            

            if (complexity > HIGH_COMPLEXITY) {
                const severity =
                    complexity > VERY_HIGH_COMPLEXITY
                        ? "HIGH"
                        : "MEDIUM";

                issues.push({
                    type: "HIGH_COMPLEXITY",
                    category: "Complexity",
                    severity,
                    message: `Function "${fn.getName() ?? "anonymous"}" has a cyclomatic complexity of ${complexity}.`,
                    filePath: sourceFile.getFilePath(),
                    lineNumber: fn.getStartLineNumber(),
                });
            }
        }
        for (const cls of classes) {
            const methods = cls.getMethods();

            for (const method of methods) {
                const complexity = calculateComplexity(method);

                

                if (complexity > HIGH_COMPLEXITY) {
                    const severity =
                        complexity > VERY_HIGH_COMPLEXITY
                            ? "HIGH"
                            : "MEDIUM";

                    issues.push({
                        type: "HIGH_COMPLEXITY",
                        category: "Complexity",
                        severity,
                        message: `Method "${cls.getName() ?? "Anonymous"}.${method.getName()}" has a cyclomatic complexity of ${complexity}.`,
                        filePath: sourceFile.getFilePath(),
                        lineNumber: method.getStartLineNumber(),
                    });
                }
            }
        }
        for (const arrowFunction of arrowFunctions) {
            const complexity = calculateComplexity(arrowFunction);

            

            if (complexity > HIGH_COMPLEXITY) {
                const severity =
                    complexity > VERY_HIGH_COMPLEXITY
                        ? "HIGH"
                        : "MEDIUM";

                issues.push({
                    type: "HIGH_COMPLEXITY",
                    category: "Complexity",
                    severity,
                    message: `Arrow function has a cyclomatic complexity of ${complexity}.`,
                    filePath: sourceFile.getFilePath(),
                    lineNumber: arrowFunction.getStartLineNumber(),
                });
            }
        }

    }

    return issues;
}