import * as assert from "assert";
import { cpSync, findFiles } from "../../src/lib/file-system";
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

        describe("Search for files using regular expressions", () => {

            const comparable = (strArr: string[]) => JSON.stringify(strArr.sort());
            const options = { path: "test/unit/file-system/find-files" };

            it("Finds files by name in path", () => {
                assert.equal(
                    comparable(findFiles([ "my.file" ], options)),
                    comparable([
                        "my.file"
                    ])
                )
            })

            it("Finds files by name in shallow nested path", () => {
                assert.equal(
                    comparable(findFiles([ "*/my.file" ], options)),
                    comparable([
                        "exclude/my.file",
                        "include/my.file"
                    ])
                )
            })

            it("Finds files in deep nested paths", () => {
                assert.equal(
                    comparable(findFiles([ "**/my.file" ], options)),
                    comparable([
                        "exclude/my.file",
                        "include/my.file",
                        "include/exclude/my.file",
                        "include/include/my.file",
                        "include/include/exclude/my.file"
                    ])
                )
            })

            it("Finds files in shallow and deep nested paths", () => {
                assert.equal(
                    comparable(findFiles([ "**my.file" ], options)),
                    comparable([
                        "my.file",
                        "exclude/my.file",
                        "include/my.file",
                        "include/exclude/my.file",
                        "include/include/my.file",
                        "include/include/exclude/my.file"
                    ])
                )
            })

            const excludeOptions = { ...options, exclude: [ "**/exclude/**", "exclude/**" ] };

            it("Finds files by name in shallow nested path with path exclusion", () => {
                assert.equal(
                    comparable(findFiles([ "*/my.file" ], excludeOptions)),
                    comparable([
                        "include/my.file"
                    ])
                )
            })

            it("Finds files in deep nested paths with path exclusion", () => {
                assert.equal(
                    comparable(findFiles([ "**/my.file" ], excludeOptions)),
                    comparable([
                        "include/my.file",
                        "include/include/my.file",
                    ])
                )
            })

            it("Finds files in shallow and deep nested paths with path exclusion", () => {
                assert.equal(
                    comparable(findFiles([ "**my.file" ], excludeOptions)),
                    comparable([
                        "my.file",
                        "include/my.file",
                        "include/include/my.file",
                    ])
                )
            })

            it("Finds all files in path", () => {
                assert.equal(
                    comparable(findFiles([ "**" ], options)),
                    comparable([
                        'another.file',
                        'my.file',
                        'exclude/another.file',
                        'exclude/my.file',
                        'include/another.file',
                        'include/my.file',
                        'include/exclude/another.file',
                        'include/exclude/my.file',
                        'include/include/another.file',
                        'include/include/my.file',
                        'include/include/exclude/another.file',
                        'include/include/exclude/my.file'
                      ])
                )
            })

        })

    })

})
