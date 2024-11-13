import * as assert from "assert";
import { cpSync } from "../../src/lib/file-system";
import { existsSync, readdirSync, readFileSync, rmSync } from "fs";
import { join } from "path";

describe("Utils", () => {

    describe("File system", () => {

        describe("Copy files", () => {
            const src = "test/unit/file-system/copy-files/source";
            const dst = "test/unit/file-system/copy-files/destination/copy";
            if (existsSync(dst)) {
                rmSync(dst, { recursive: true });
            }
            cpSync(src, dst);

            const srcFiles = readdirSync(src);
            const dstFiles = readdirSync(dst);

            it("Destination folder is created successfully", () => {
                assert.equal(existsSync(dst), true, "Destination folder was not created recursively!")
            })

            it("Source and destination files list match", () => {
                assert.equal(JSON.stringify(srcFiles), JSON.stringify(dstFiles), "Source and destination folders should contain matching files!")
            })

            it("Source and destination files have matching contents", () => {
                for (const file of srcFiles) {
                    const srcFileContents = readFileSync(join(src, file)).toString();
                    const dstFileContents = readFileSync(join(dst, file)).toString();
                    assert.equal(srcFileContents, dstFileContents, "Source and destination file containts should match!");
                }
            })
        })


    })

})
