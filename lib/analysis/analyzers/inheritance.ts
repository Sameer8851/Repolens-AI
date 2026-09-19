import { ASTContext } from "../ast/engine";
import { ClassDeclaration } from "ts-morph";

export interface InheritanceMetric {
    path: string;
    classesWithInheritance: number;
    overriddenMethods: number;
}

export function analyzeInheritance(
    context: ASTContext,
): InheritanceMetric[] {
    const results: InheritanceMetric[] = [];

    for (const sourceFile of context.sourceFiles) {
        const classes = sourceFile.getClasses();

        let classesWithInheritance = 0;
        let overriddenMethods = 0;

        for (const cls of classes) {
            const baseClass = cls.getExtends();

            if (!baseClass) {
                continue;
            }

            classesWithInheritance++;

            const baseClassDeclaration =
                baseClass.getExpression().getSymbol()?.getDeclarations()[0];

            if (!baseClassDeclaration) {
                continue;
            }

            if (!ClassDeclaration.isClassDeclaration(baseClassDeclaration)) {
                continue;
            }

            const baseMethods = new Set(
                baseClassDeclaration.getMethods().map((method) => method.getName()),
            );

            for (const method of cls.getMethods()) {
                if (baseMethods.has(method.getName())) {
                    overriddenMethods++;
                }
            }
        }

        if (classesWithInheritance > 0) {
            results.push({
                path: sourceFile.getFilePath(),
                classesWithInheritance,
                overriddenMethods,
            });
        }
    }

    return results;
}