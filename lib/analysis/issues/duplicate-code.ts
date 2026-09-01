import { readFile } from "fs/promises";
import { join } from "path";


import { ScannedFile } from "../scanner/types";

import { RepositoryIssue } from "./types";

const BLOCK_SIZE = 6;

export async function detectDuplicateCode(repositoryPath: string, files: ScannedFile[]): Promise<RepositoryIssue[]> {
    const issues: RepositoryIssue[] = [];

    const blocks = new Map<string, { filePath: string, lineNumber: number }[]>();

    for (const file of files) {
        if (!["ts", "tsx", "js", "jsx"].includes(file.extension)) { continue; }
        const content = await readFile(join(repositoryPath, file.path), "utf-8");
        const lines = content.split(/\r?\n/);

        for (let i = 0; i <= lines.length - BLOCK_SIZE; i++) {
            const block = lines.slice(i, i + BLOCK_SIZE).
                map((line) => line.trim()).
                filter(Boolean).
                join("\n");
            if (!block) {
                continue;
            }

            const existing = blocks.get(block) ?? [];

            existing.push({
                filePath: file.path,
                lineNumber: i + 1,
            });

            blocks.set(block, existing);
        }
    }
    const reportedPairs = new Set<string>();

    for (const [, locations] of blocks) {
        if (locations.length < 2) {
            continue;
        }

        for (let i = 0; i < locations.length - 1; i++) {
            const first = locations[i];
            const second = locations[i + 1];

            if (first.filePath === second.filePath) {
                continue;
            }

            const pair = [
                first.filePath,
                second.filePath,
            ].sort().join("|");

            if (reportedPairs.has(pair)) {
                continue;
            }

            reportedPairs.add(pair);

            issues.push({
                type: "DUPLICATE_CODE",
                category: "Maintainability",
                severity: "MEDIUM",
                message: `Duplicate code detected between "${first.filePath}" and "${second.filePath}".`,
                filePath: second.filePath,
                lineNumber: second.lineNumber,
            });
        }
    }
    return issues;

}