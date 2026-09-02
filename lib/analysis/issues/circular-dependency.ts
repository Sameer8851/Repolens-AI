import { readFile } from "fs/promises";
import { join, dirname, normalize, relative } from "path";

import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";

function normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, "/");
}

function resolveImportPath(
    currentFile: string,
    importPath: string,
    files: ScannedFile[],
): string | null {
    let targetPath: string;

    if (importPath.startsWith("@/")) {
        targetPath = importPath.slice(2);
    } else if (importPath.startsWith(".")) {
        targetPath = normalize(
            join(dirname(currentFile), importPath),
        );
    } else {
        return null;
    }

    targetPath = normalizePath(targetPath);

    const extensions = [
        "",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
    ];

    for (const extension of extensions) {
        const candidate = `${targetPath}${extension}`;

        if (
            files.some(
                (file) =>
                    normalizePath(file.path) === candidate,
            )
        ) {
            return candidate;
        }
    }

    const indexExtensions = [
        "index.ts",
        "index.tsx",
        "index.js",
        "index.jsx",
    ];

    for (const extension of indexExtensions) {
        const candidate = `${targetPath}/${extension}`;

        if (
            files.some(
                (file) =>
                    normalizePath(file.path) === candidate,
            )
        ) {
            return candidate;
        }
    }

    return null;
}

export async function detectCircularDependencies(repositoryPath: string, files: ScannedFile[]): Promise<RepositoryIssue[]> {
    const issues: RepositoryIssue[] = [];
    const graph = new Map<string, string[]>();
    for (const file of files) {
        if (
            !["ts", "tsx", "js", "jsx"].includes(file.extension)
        ) {
            continue;
        }

        const content = await readFile(
            join(repositoryPath, file.path),
            "utf-8",
        );
        const imports =
            content.match(
                /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
            ) ?? [];

        const dependencies: string[] = [];

        for (const importStatement of imports) {
            const match = importStatement.match(
                /["']([^"']+)["']/,
            );

            if (!match) {
                continue;
            }

            const importPath = match[1];

            const resolvedPath = resolveImportPath(
                file.path,
                importPath,
                files,
            );

            if (resolvedPath) {
                dependencies.push(resolvedPath);
            }
        }

        graph.set(
            normalizePath(file.path),
            dependencies,
        );
    }
    const visited = new Set<string>();
    const stack = new Set<string>();
    const reportedCycles = new Set<string>();

    function dfs(
        file: string,
        path: string[],
    ) {
        if (stack.has(file)) {
            const cycleStart = path.indexOf(file);

            if (cycleStart === -1) {
                return;
            }

            const cycle = [
                ...path.slice(cycleStart),
                file,
            ];

            const normalizedCycle = [...cycle]
                .sort()
                .join("->");

            if (reportedCycles.has(normalizedCycle)) {
                return;
            }

            reportedCycles.add(normalizedCycle);

            issues.push({
                type: "CIRCULAR_DEPENDENCY",
                category: "Architecture",
                severity: "HIGH",
                message: `Circular dependency detected: ${cycle.join(" → ")}`,
                filePath: file,
            });

            return;
        }

        if (visited.has(file)) {
            return;
        }

        visited.add(file);
        stack.add(file);

        const dependencies = graph.get(file) ?? [];

        for (const dependency of dependencies) {
            dfs(dependency, [...path, file]);
        }

        stack.delete(file);
    }

    for (const file of graph.keys()) {
        dfs(file, []);
    }

    return issues;
}