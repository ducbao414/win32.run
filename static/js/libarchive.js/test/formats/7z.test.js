/* eslint-disable no-undef */
const {checksum} = require('../checksum');
const {navigate,inputFile,response,setup,cleanup} = require('../testutils');

let browser,page;

beforeAll(async () => {
    let tmp = await setup();
    browser = tmp.browser;
    page = tmp.page;
});

describe("Extract 7Z files with various compressions", () => {
    test("Extract 7Z with LZMA", async () => {
        await navigate(page);
        await inputFile('archives/7z/lzma.7z',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000);
    test("Extract 7Z with LZMA2", async () => {
        await navigate(page);
        await inputFile('archives/7z/lzma2.7z',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000);
    test("Extract 7Z with BZIP2", async () => {
        await navigate(page);
        await inputFile('archives/7z/bzip2.7z',page);
        const files = await response(page);
        expect(files).toEqual(checksum);
    }, 16000);
});

afterAll(() => {
    cleanup(browser);
});