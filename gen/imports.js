import path from 'path';
import dir from 'node-dir';

(async () => {
    let files = dir.files('./src/routes/', {sync: true}).filter(file => path.extname(file) == '.svelte');
    let statements = '';
    for(let file of files){
        let import_path = file.split('src/routes/').join('./')
        statements = statements  + `
        else if(url == '${import_path}'){
            page = (await import('${import_path}')).default;
    
        }`
    }
    console.log(statements);
})()