class Win32 {

    constructor() {
        if(window != null){
            this.setup();
        }
    }

    setup() {
        let url = new URL(window.location.href);
        this.program_id = url.searchParams.get('program_id');
        this.parent_origin = url.searchParams.get('parent_origin');
    }

    send(data){
        if(this.program_id == null || this.parent_origin == null){
            this.setup();
        }
        window.parent.postMessage(data, this.parent_origin);
    }
    /**
     * Check for whether or not your webapp is running on win32.run
     * @returns {Bool}
     */
    is_it() {
        if(this.program_id == null || this.parent_origin == null){
            this.setup();
        }
        return this.parent_origin != null;
    }

    /**
     * @description Let the user pick files through win32.run Files Picker dialog.
     * @param {string} desc Description of the file type you want.
     * e.g. Image Files
     * @param {[string]} exts Acceptable file extensions, case-insensitive. Each extension starts with the dot character.
     * ```
     * e.g. ['.jpg','.jpeg','.png','.avif']
     * ```
     * Specify an empty array [] to accept any extension
     * @param {boolean} multiple Whether to accept multiple or single file. Default to true.
     * @returns {Promise<[Object]>} an array of win32 files. See {@link https://docs.win32.run/3rd-party-apps/pick-files#returns Docs}
     */
    async pick_files(desc = '', exts = [], multiple = true) {
        console.log(this.parent_origin)
        this.send({
            desc,
            exts,
            multiple,
            program_id: this.program_id,
            type: 'pick_files'
        });

        let promise = new Promise(resolve => {
            window.onmessage = ({ data }) => {
                if (data == null || typeof data !== 'object') return;
                let { type, files } = data;
                if (type == 'files_picked' && Array.isArray(files)) {
                    resolve(files)
                }
            }
        })
        return promise;
    }
    /**
     * Save content to a file without File Saving Dialog. Need to have a win32 file id first, which could obtain when you first save the file using or win32.pick_files win32.save_file_as
     * @param {File} file File object. See {@link https://developer.mozilla.org/en-US/docs/Web/API/File Mozilla Docs}
     * @param {String} id file id on win32.run
     * @returns {Promise<Void>}
     */
    async save_file(file, id) {
        this.send({
            file,
            fs_id: id,
            program_id: this.program_id,
            type: 'save_file'
        })

        let promise = new Promise(resolve => {
            window.onmessage = ({ data }) => {
                if (data == null || typeof data !== 'object') return;
                let { type, success } = data;
                if (type == 'file_saved') {
                    resolve()
                }
            }
        })
        return promise;
    }

    /**
     * Save a file to win32.run through File Saving Dialog
     * @param {File} file File object. See {@link https://developer.mozilla.org/en-US/docs/Web/API/File Mozilla Docs}
     * @param {[Object]} types list of saving formats. E.g.
     * ```
     * types = [
     *  {desc: 'Photos', mime: 'image/png', ext: '.png'},
     *  {desc: 'Bitmap', mime: 'image/bmp', ext: '.bmp'},
     * ]
     * ```
     * See {@link https://docs.win32.run Docs} for more details.
     * @returns {Promise<String>} id of the saved file, which later can be used to retrieve said file info with this.get_file(id)
     */
    async save_file_as(file, types) {
        this.send({
            file,
            types,
            program_id: this.program_id,
            type: 'save_file_as',
        })

        let promise = new Promise(resolve => {
            window.onmessage = ({ data }) => {
                if (data == null || typeof data !== 'object') return;
                let { type, fs_id } = data;
                if (type == 'file_saved_as') {
                    resolve(fs_id)
                }
            }
        })
        return promise;
    }

    /**
     * @description Get a file on win32.run by its id.
     * @param {String} id id of the file
     * @returns {Promise<Object>} a win32 file object. See {@link https://docs.win32.run/3rd-party-apps/pick-files#returns Docs}
     */
    async get_file(id) {
        this.send({
            fs_id: id,
            program_id: this.program_id,
            type: 'get_file'
        });

        let promise = new Promise(resolve => {
            window.onmessage = ({ data }) => {
                if (data == null || typeof data !== 'object') return;
                let { type, file } = data;
                if (type == 'file') {
                    resolve(file)
                }
            }
        })
        return promise;
    }
}