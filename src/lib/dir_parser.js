/**
 * Traversing directory using promises
 **/

const traverseDirectory = (entry) => {
    const reader = entry.createReader();
    return new Promise((resolveDirectory) => {
        const iterationAttempts = [];
        const errorHandler = () => {};

        function readEntries() {
            reader.readEntries((batchEntries) => {
                if (!batchEntries.length) {
                    resolveDirectory(Promise.all(iterationAttempts))
                } else {
                    iterationAttempts.push(Promise.all(batchEntries.map((batchEntry) => {
                        if (batchEntry.isDirectory) {
                            return traverseDirectory(batchEntry);
                        }
                        return Promise.resolve(batchEntry);
                    })));

                    readEntries();
                }
            }, errorHandler);
        }

        readEntries();
    });
}

const packageFile = (file, entry) => {
    let object =  {
        fileObject: file,
        fullPath: entry ? entry.fullPath : '',
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath 
    }
    return object;
}

const getFile = (entry) => {
    return new Promise((resolve) => {
        entry.file((file) => {
            resolve(packageFile(file, entry));
        })
    })
}

const handleFilePromises = (promises, fileList) => {
    return Promise.all(promises).then((files) => {
        files.forEach((file) => {
        	fileList.push(file);
        });
        return fileList;
    })
}

const getDataTransferFiles = (dataTransfer) => {
    const dataTransferFiles = [];
    const folderPromises = [];
    const filePromises = [];

    [].slice.call(dataTransfer.items).forEach((listItem) => {
        let supported_method;
        if(typeof listItem['webkitGetAsEntry'] === 'function'){
            supported_method = 'webkitGetAsEntry';
        } else {
            supported_method = 'getAsEntry'
        }
        
        const entry = listItem[supported_method]();

        if (entry) {
            if (entry.isDirectory) {
                folderPromises.push(traverseDirectory(entry));
            } else {
                filePromises.push(getFile(entry));
            }
        } else {
            dataTransferFiles.push(listItem);
        }
    });
    if (folderPromises.length) {
        const flatten = (array) => array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
        return Promise.all(folderPromises).then((fileEntries) => {
            const flattenedEntries = flatten(fileEntries);
            flattenedEntries.forEach((fileEntry) => {
                filePromises.push(getFile(fileEntry));
            });
            return handleFilePromises(filePromises, dataTransferFiles);
        });
    } else if (filePromises.length) {
        return handleFilePromises(filePromises, dataTransferFiles);
    }

    return Promise.resolve(dataTransferFiles);
} 

// Use this function by passing the drop or change event.
const getDroppedOrSelectedFiles = (event) => {
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.items) {
        return getDataTransferFiles(dataTransfer)
            .then((fileList) => {
                return Promise.resolve(fileList);
            })
    }

    const files = [];
    const dragDropFileList = dataTransfer && dataTransfer.files;
    const inputFieldFileList = event.target && event.target.files;
    const fileList = dragDropFileList || inputFieldFileList || [];

    for (let i = 0; i < fileList.length; i++) {
        files.push(packageFile(fileList[i]));
    }

    return Promise.resolve(files);
}



export async function parse_dir(e){
    let files = await getDroppedOrSelectedFiles(e);

    let result = {};
    for(let file of files){
        let comps = file.fullPath.split('/').filter(el => el != '');
        comps.reduce((r, el, index) => {
            if(index != comps.length - 1){
                if(r[el] == null){
                    r[el] = {}
                }
            } else {
                r[el] = file.fileObject;
            }
            return r[el];
        }, result);
    }
    return result;
}

