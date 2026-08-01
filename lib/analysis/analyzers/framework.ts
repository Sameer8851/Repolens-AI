export interface DetectedFramework {
    name: string;
    version?: string;
    category: string;
}


const FRAMEWORKS: Record<
    string,
    {
        name: string;
        category: string;
    }
> = {
    next: {
        name: "Next.js",
        category: "Framework",
    },

    react: {
        name: "React",
        category: "UI",
    },

    express: {
        name: "Express",
        category: "Backend",
    },

    "@nestjs/core": {
        name: "NestJS",
        category: "Framework",
    },

    prisma: {
        name: "Prisma",
        category: "ORM",
    },

    tailwindcss: {
        name: "Tailwind CSS",
        category: "Styling",
    },

    clerk: {
        name: "Clerk",
        category: "Authentication",
    },

    bullmq: {
        name: "BullMQ",
        category: "Queue",
    },

    zod: {
        name: "Zod",
        category: "Validation",
    },

    mongoose: {
        name: "Mongoose",
        category: "ODM",
    },

    axios: {
        name: "Axios",
        category: "HTTP Client",
    },
};

export function analyzePackageJson(
    packageJson: string,
): DetectedFramework[] {
    const pkg = JSON.parse(packageJson);
    const dependencies = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
    };

    const frameworks: DetectedFramework[] = [];

    for (const [packageName, version] of Object.entries(dependencies)) {
        const framework = FRAMEWORKS[packageName];
        if (!framework) {
            continue;
        }
        frameworks.push({
            name: framework.name,
            category: framework.category,
            version: String(version),
        });
    }
    return frameworks;
}