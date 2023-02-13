<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import * as utils from '../../../lib/utils';
    import * as fs from '../../../lib/fs';
    import short from 'short-uuid';
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';
    import { html2docx, docx2html } from '../../../lib/docx';
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;
    let default_title = 'Microsoft Word';

    let iframe;
    let iframe_loaded = false;
    let dirty = false;

    let supported_types = [
        {
            "name": "Microsoft Word (OpenXML)",
            "mime": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "ext": ".docx"
        }
    ]
    supported_types = supported_types.map(el => {
        el.name = el.name + ' (' + el.ext + ')';
        return el;
    })

    $: {
        let title = '';
        if(fs_item) {
            title = fs_item.name;
        } else {
            title = default_title;
        }
        if(dirty){
            title += ' *';
        }
        if(window){
            window.update_title(title);
        }
        
    }

    export async function destroy(){
        if(iframe.contentWindow.is_dirty()){
            let no_action = () => {
                close_program()
            }
            let yes_action = async () => {
                await save_file();
                close_program();
            }
            confirm_exit({node_ref: window.node_ref, title: 'Save Changes', message: 'Do you want to save the changes you\'ve made before closing this document?', yes_action, no_action})
        } else {
            close_program();
        }
    }

    function close_program(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: default_title,
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/MSWord.png',
        id: id,
        exec_path
    };

    async function pick_file({filetypes_desc, filetypes}){
        
        let selected_items = 
            await pick_file_dialog({
                node_ref: window.node_ref, 
                filetypes_desc, 
                filetypes
            })
        let item = $hardDrive[selected_items[0]];
        return item ;
    }

    async function open_file(){
        console.log('open file')
        let item = await pick_file({filetypes_desc: 'Microsoft Word (OpenXML)', filetypes: ['.docx']});
        if(fs_item || dirty){
            queueProgram.set({
                path: './programs/microsoft_word.svelte',
                fs_item: item
            })
        } else {
            fs_item = item;
            let file = await fs.get_file(fs_item.id);
            let arrayBuffer = await file.arrayBuffer();
            let html = await docx2html(arrayBuffer);
            iframe.contentWindow.set_content(html);
        }
        
    }
    
    async function pick_file_dialog({node_ref, filetypes_desc, filetypes}){

        return new Promise(async (resolve, reject) => {
            const OpenModal = (await import('../../../lib/components/xp/OpenModal.svelte')).default;
            let modal = new OpenModal({
                target: node_ref,
                props:{filetypes, filetypes_desc}
            })
            modal.self = modal;
            modal.on_open = () => {
                resolve(modal.selected_items)
                modal.destroy();
            }
        })
    }

    async function save_file(){
        if(fs_item != null){
            let ext = fs_item?.ext || '.docx';
            let html = iframe.contentWindow.get_content();
            let blob = await html2docx(html);
            let file = new File([blob], fs_item.name);
            await fs.save_file(fs_item.id, file);
            window.show_toast({message: 'Changes Saved!'})
        } else {
            await save_file_as();
        }
    }

    async function save_file_as(){
        console.log(fs_item);
        let current_filetype = supported_types.find(el => el.ext == fs_item?.ext);
        if(current_filetype == null){
            current_filetype = supported_types[0]
        }

        let {parent_id, filename, selected_filetype} = await save_file_as_dialog({
            id: fs_item?.parent, node_ref: window.node_ref, filetypes: supported_types, current_filetype
        });
        let html = iframe.contentWindow.get_content();
        let blob = await html2docx(html);
        let file = new File([blob], filename);
        let new_id = short.generate();
        await fs.save_file_as(filename, selected_filetype.ext, file, parent_id, new_id);

        if(fs_item == null){
            fs_item = $hardDrive[new_id];
        }
        
    }

    async function save_file_as_dialog({node_ref, filetypes, id, current_filetype}){

        return new Promise(async (resolve, reject) => {
            const SaveModal = (await import('../../../lib/components/xp/SaveModal.svelte')).default;
            let modal = new SaveModal({
                target: node_ref,
                props:{filetypes, selected_filetype: current_filetype, id}
            })
            modal.self = modal;
            modal.on_save = () => {
                resolve({parent_id: modal.parent_id, filename: modal.filename, selected_filetype: modal.selected_filetype})
                modal.destroy();
            }
        })
    }

    async function setup_word(){
        if(fs_item){
            console.log(fs_item);
            let file = await fs.get_file(fs_item.id);
            let arrayBuffer = await file.arrayBuffer();
            let html = await docx2html(arrayBuffer);
            while(!iframe.contentWindow.initialized){
                console.log('wait');
                await utils.sleep(500);
            }
            iframe.contentWindow.set_content(html);
        }
        iframe.contentWindow.file_picker_callback = async (callback, value, meta) => {
            let item = await pick_file({filetypes_desc: 'Image Files', filetypes: ['.png', '.jpeg', '.jpg']});
            let file = await fs.get_file(item.id);
            let url = URL.createObjectURL(file);
            callback(url, {alt: fs.get_path(item.id)});
        }

        iframe.contentWindow.open_file = open_file;

        iframe.contentWindow.save_file = async () => {
            await save_file();
            iframe.contentWindow.set_dirty(false);
            dirty = false;
        }

        iframe.contentWindow.save_file_as = async () => {
            await save_file_as();
            iframe.contentWindow.set_dirty(false);
            dirty = false;
        }

        iframe.contentWindow.new_document = () => {
            queueProgram.set({
                path: './programs/microsoft_word.svelte'
            })
        }

        iframe.contentWindow.focus_window = () => {
            window.focus();
        }
        iframe.contentWindow.on_dirty = () => {
            dirty = true;
        }
        iframe.contentWindow.parent_key_event = on_key_pressed;
        
        iframe_loaded = true;
        setTimeout(() => {
            iframe.contentWindow.tinymce.activeEditor.focus();
        }, 500)

        
    }


    async function confirm_exit({node_ref, title, message, icon, yes_action, no_action}){
        const Dialog = (await import('../../../lib/components/xp/Dialog.svelte')).default;
            let buttons = [
                {
                    name: 'Save',
                    action: () => {
                        yes_action();
                        dialog.destroy();
                    },
                    focus: true
                },
                {
                    name: 'Don\'t Save',
                    action: () => {
                        no_action();
                        dialog.destroy();
                    }
                },
                {
                    name: 'Cancel',
                    action: () => {
                        dialog.destroy();
                    }
                }
            ]
            let dialog = new Dialog({
                target: node_ref,
                props:{
                    icon,
                    title,
                    message,
                    buttons,
                    button_align: 'center'
                }
            })
            dialog.self = dialog;
    }

    async function on_key_pressed(e){
        
        if(window.z_index != $zIndex) return;
        if(!(e.ctrlKey || e.metaKey)) return;

        console.log('keyevent receive in msword');

        if(e.key == 's'){
            e.preventDefault();
            await save_file();
            iframe.contentWindow.set_dirty(false);
            dirty = false;
        } else if(e.key == 'o'){
            e.preventDefault();
            open_file();
        }
    }

    function on_window_focused(){
        setTimeout(() => {
            if(iframe){
                iframe.contentWindow.tinymce.activeEditor.focus();
            }
        }, 500)
    }

</script>



<Window options={options} bind:this={window} on_click_close={destroy} on_focused={on_window_focused}>
    <div slot="content" class="absolute inset-0.5 top-0 flex flex-col">

        <div class="absolute inset-0 overflow-auto bg-slate-400 font-sans">
            {#if !iframe_loaded}
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
                <DumbProgress style="width:150px;height:15px;"></DumbProgress>
            </div>
            {/if}

            <iframe bind:this={iframe} src="/html/msword/index.html" class="w-full h-full {!iframe_loaded ? 'opacity-0' : ''}" 
            on:load={setup_word}></iframe>
        </div>

    </div>
    
</Window>


<svelte:options accessors={true}></svelte:options>
<svelte:window on:keydown={on_key_pressed} />