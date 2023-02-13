<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import * as fs from '../../../lib/fs';
    import short from 'short-uuid';
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let iframe;
    let iframe_loaded = false;
    let dirty = false;


    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: 'Koodo Reader',
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/Koodo.png',
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


    async function save_file_as(ab){
        console.log(fs_item);
        let supported_types = [
            {
                name: 'Document Format',
                ext: '.epub'
            }
        ]

        let {parent_id, filename, selected_filetype} = await save_file_as_dialog({
            id: fs_item?.parent, node_ref: window.node_ref, filetypes: supported_types
        });
        
        let file = new File([ab], filename);
        let new_id = short.generate();
        await fs.save_file_as(filename, selected_filetype.ext, file, parent_id, new_id);
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

    async function setup_koodo(){
        if(fs_item){
            console.log(fs_item);
            let file = await fs.get_file(fs_item.id);
            iframe.contentWindow.import_book(file);
        }
        iframe.contentWindow.on_import_click = async () => {
            let item = await pick_file({filetypes_desc: 'Supported Formats', filetypes: ['.epub', '.mobi', '.pdf', '.docx', '.html', '.azw3', '.txt', '.fb2', '.cbr', '.cbz', '.cbt', '.md', '.rtf', '.xml', '.xhtml', '.htm']});
            let file = await fs.get_file(item.id);
            iframe.contentWindow.import_book(file);
        }

        iframe.contentWindow.open_url = (url) => {
            queueProgram.set({
                path: './programs/internet_explorer.svelte',
                fs_item: {url}
            })
        }
        iframe.contentWindow.export_book = async (ab) => {
            await save_file_as(ab);
        }
        
        iframe_loaded = true;
        iframe.contentWindow.focus();
        
    }

    function on_window_focused(){
        console.log('koodo:on_window_focused')
        setTimeout(() => {
            if(iframe){
                iframe.contentWindow.focus();
            }
        }, 500)
    }


</script>



<Window options={options} bind:this={window} on_click_close={destroy} on_focused={on_window_focused}>
    <div slot="content" class="absolute inset-0 flex flex-col bg-slate-800">

        <div class="absolute inset-0 overflow-auto bg-slate-100 font-sans">

            {#if !iframe_loaded}
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
                <DumbProgress style="width:150px;height:15px;"></DumbProgress>
            </div>
            {/if}

            <iframe bind:this={iframe} src="/html/koodo/index.html" 
                class="w-full h-full {!iframe_loaded ? 'opacity-0' : ''} {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" 
                on:load={setup_koodo}></iframe>
        </div>

    </div>
    
</Window>


<svelte:options accessors={true}></svelte:options>