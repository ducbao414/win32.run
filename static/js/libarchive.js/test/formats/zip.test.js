/* eslint-disable no-undef */
const {checksum} = require('../checksum');
const {navigate,inputFile,response,setup,cleanup} = require('../testutils');

let browser,page;

beforeAll(async () => {
    let tmp = await setup();
    browser = tmp.browser;
    page = tmp.page;
});

describe("Extract ZIP files with various compressions", () => {
    test("Extract ZIP deflate", async () => {
        await navigate(page);
        await inputFile('archives/zip/deflate.zip',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000);
    /* test("Extract ZIP deflate64", async () => { // not support
        await navigate(page);
        await inputFile('archives/zip/deflate64.zip',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000); */
    test("Extract ZIP bzip2", async () => {
        await navigate(page);
        await inputFile('archives/zip/bzip2.zip',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000);
    test("Extract ZIP lzma", async () => {
        await navigate(page);
        await inputFile('archives/zip/lzma.zip',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000);
});

afterAll(() => {
    cleanup(browser);
});