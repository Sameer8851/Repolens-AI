export interface DetectedDependency {
  name: string;
  version: string;
  type: "PRODUCTION" | "DEVELOPMENT";
}

export function analyzeDependencies(
  packageJson: string,
): DetectedDependency[] {
  const parsed = JSON.parse(packageJson);

  const dependencies: DetectedDependency[] = [];

  for (const [name, version] of Object.entries(
    parsed.dependencies ?? {},
  )) {
    dependencies.push({
      name,
      version: version as string,
      type: "PRODUCTION",
    });
  }

  for (const [name, version] of Object.entries(
    parsed.devDependencies ?? {},
  )) {
    dependencies.push({
      name,
      version: version as string,
      type: "DEVELOPMENT",
    });
  }

  return dependencies;
}