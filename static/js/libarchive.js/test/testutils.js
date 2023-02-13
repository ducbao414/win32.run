const StaticServer = require('static-server');
const puppeteer = require('puppeteer');
const port = 8787;
const width = 800;
const height = 600;
const server = new StaticServer({
    rootPath: '.',
    port: port,
    cors: '*',
});

const startServer = () => new Promise((resolve) => {
    server.start( () => {
        console.log('Server listening to', port);
        resolve();
    });
});

module.exports = {
    setup: async () => {
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.setViewport({ width, height });
        await startServer();
        page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i) console.log(`${i}: ${msg.args()[i]}`);
        });
        return {browser,page};
    },
    cleanup: (browser) => {
        server.stop();
        browser.close();
    },
    navigate: async function (page, path = 'index.html') {
        await page.goto(`http://127.0.0.1:${port}/test/files/${path}`);
    },
    inputFile: async function (file,page){
        const fileInp = await page.$('#file');
        fileInp.uploadFile('test/files/'+file);
    },
    response: async function (page){
        await page.waitForSelector('#done');
        return await page.evaluate(`window.obj`);
    }
};

