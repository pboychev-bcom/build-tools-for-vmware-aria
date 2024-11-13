import { copyFileSync, mkdirSync, readdirSync } from "fs";

// TODO: Replace with cpSync from the Node.js "fs" API when TypeScript and @types/node are bumped
export function cpSync(source: string, destination: string) {
    mkdirSync(destination, { recursive: true });
    for (const file of readdirSync(source)) {
        copyFileSync(`${source}/${file}`, `${destination}/${file}`);
    }
}

