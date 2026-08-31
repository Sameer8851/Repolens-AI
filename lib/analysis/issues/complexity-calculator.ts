import { Node } from "ts-morph";

export function calculateComplexity(node: Node): number {
  let complexity = 1;

  node.forEachDescendant((child) => {
    const kind = child.getKindName();

    if (
      kind === "IfStatement" ||
      kind === "ForStatement" ||
      kind === "ForOfStatement" ||
      kind === "ForInStatement" ||
      kind === "WhileStatement" ||
      kind === "DoStatement" ||
      kind === "CaseClause" ||
      kind === "CatchClause" ||
      kind === "ConditionalExpression"
    ) {
      complexity++;
    }

    if (Node.isBinaryExpression(child)) {
      const operator = child
        .getOperatorToken()
        .getText();

      if (operator === "&&" || operator === "||") {
        complexity++;
      }
    }
  });

  return complexity;
}