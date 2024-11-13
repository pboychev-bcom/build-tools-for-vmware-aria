import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";

// TODO: Replace with cpSync from the Node.js "fs" API when TypeScript and @types/node are bumped
export function cpSync(source: string, destination: string) {
    mkdirSync(destination, { recursive: true });
    for (const file of readdirSync(source)) {
        copyFileSync(`${source}/${file}`, `${destination}/${file}`);
    }
}

interface FindFilesOptions {
    exclude?: RegExp[] | string[];
    maxDepth?: number;
    currentDepth?: number;
    path?: string;
    subPath?: string;
    absolute?: boolean;
}
export function findFiles(patterns: RegExp[] | string[], options: FindFilesOptions = {}): string[] {
    let result: string[] = [];

    const maxDepth = options.maxDepth || 10;
    const currentDepth = options.currentDepth || 0;

    if (currentDepth > maxDepth) {
        return result;
    }

    const subPath = options.subPath ? join("/", options.subPath) : "";
    const defaultPath = ".";
    const path = options.path || defaultPath;
    const exclude = options.exclude || [];
    const workPath = join(path, subPath);
    const files = [];
    const directories = [];

    for (const _path of readdirSync(workPath)) {
        const fullPath = workPath === defaultPath ? _path : join(workPath, _path);
        statSync(fullPath).isFile()
            ? files.push(fullPath.substring(path.length + 1))
            : directories.push(_path);
    }

    const buildRegEx = (pattern: string) => {
        const single = "{single}";
        const singleRegex = "[a-z0-9\.]*";
        const double = "{double}";
        const doubleRegex = "[a-z0-9\.\/]*";
        if (pattern.indexOf("**") !== -1) {
            pattern = pattern.split("**").join(double);
        }
        if (pattern.indexOf("*") !== -1) {
            pattern = pattern.split("*").join(single);
        }
        pattern = pattern.split(single).join(singleRegex);
        pattern = pattern.split(double).join(doubleRegex);
        return new RegExp("^" + pattern + "$", "gi");
    };
    const someMatch = (fileName: string, pattern: string|RegExp) =>
        (pattern instanceof RegExp ? pattern : buildRegEx(pattern)).test(fileName);
    const checkMatch = (fileName: string) =>
        patterns.some(pattern => someMatch(fileName, pattern)
        ) && (
            exclude.length === 0 ||
            !exclude.some(pattern => someMatch(fileName, pattern))
        );

    for (const file of files) {
        if (checkMatch(file)) {
            result.push(!!options.absolute ? resolve(file) : file);
        }
    }

    for (const dir of directories) {
        result = [
            ...result,
            ...findFiles(patterns, {
                ...options,
                currentDepth: currentDepth + 1,
                subPath: join(subPath, dir)
            })
        ];
    }

    return result;
}
