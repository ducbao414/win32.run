import path from 'path';
import dir from 'node-dir';
import fs from 'fs';

let excluded_source_files = ['src/routes/xp/starting.svelte'];

let source_files = [
    ...dir.files('./src/', {sync: true}),
    'static/json/hard_drive.json',
    'svelte.config.js',
    'tailwind.config.cjs',
    'vite.config.js'
]
.filter(el => ['.js', '.json', '.svelte', '.css', '.cjs', '.html'].includes(path.extname(el)))
.filter(el => !excluded_source_files.includes(el));


(async () => {

    let remote_files = dir.files('./static/files/', {sync: true})
    .filter(file => ['.png', '.jpg', '.mp3'].includes(path.extname(file)))
    .filter(file => included(file))
    .map(file => file.replace(/^static/i, ''));
    
    let images = dir.files('./static/images/', {sync: true})
    .filter(file => ['.png', '.jpg', '.svg', '.gif'].includes(path.extname(file)))
    .filter(file => included(file))
    .map(file => file.replace(/^static/i, ''));

    let fonts = dir.files('./static/fonts/', {sync: true})
    .filter(file => ['.ttf'].includes(path.extname(file)))
    .filter(file => included(file))
    .map(file => file.replace(/^static/i, ''));

    let audios = dir.files('./static/audio/', {sync: true})
    .filter(file => ['.mp3', '.wav'].includes(path.extname(file)))
    .filter(file => included(file))
    .map(file => file.replace(/^static/i, ''));

    let empties = dir.files('./static/empty/', {sync: true})
    .filter(file => included(file))
    .map(file => file.replace(/^static/i, ''));


    let assets = {remote_files, images, audios, fonts, empties};
    for(let key of Object.keys(assets)){
        console.log('let ' + key + ' = ' + JSON.stringify(assets[key]) + ';\n');
    }
})()

function included(asset){
    let basename = path.basename(asset);
    for(let file of source_files){
        let content = fs.readFileSync(file, 'utf-8');
        if(content.includes(basename)) return true;
    }
    return false;
}