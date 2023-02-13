<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import * as utils from '../../../lib/utils';
    import * as fs from '../../../lib/fs';
    import short from 'short-uuid';
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let supported_types = [
        {
            "name": "Adobe Portable Document Format",
            "mime": "application/pdf",
            "ext": ".pdf"
        }
    ]
    supported_types = supported_types.map(el => {
        el.name = el.name + ' (' + el.ext + ')';
        return el;
    })

    let iframe;
    let iframe_loaded = false;

    $: {
        if(fs_item && window) {
            window.update_title(fs_item.name)
        }
    }

    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: fs_item == null ? 'Foxit Reader' : fs_item.name,
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/FoxitReader.png',
        id: id,
        exec_path
    };

    async function pick_file(){
        
        let selected_items = 
            await pick_file_dialog({
                node_ref: window.node_ref, 
                filetypes_desc: 'Adobe Portable Document Format', 
                filetypes: supported_types.map(el => el.ext)
            })
        fs_item = $hardDrive[selected_items[0]];
        let file = await fs.get_file(selected_items[0]);
        console.log({fs_item});
        return file;
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

    async function save_file_as(){
        console.log(fs_item);
        let current_filetype = supported_types.find(el => el.ext == fs_item?.ext);
        if(current_filetype == null){
            current_filetype = supported_types[0]
        }

        let {parent_id, filename, selected_filetype} = await save_file_as_dialog({
            id: fs_item?.parent, node_ref: window.node_ref, filetypes: supported_types, current_filetype
        });
        
       
        let blob = await iframe.contentWindow.PDFViewerApplication.pdfDocument.saveDocument();

        let file = new File([blob], filename, {type: utils.ext_to_mime(filename)});
        let new_id = short.generate();
        await fs.save_file_as(filename, selected_filetype.ext, file, parent_id, new_id);
        fs_item = $hardDrive[new_id];
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

    async function setup_foxit_reader(){
        iframe.contentWindow.setup_ui();
        
        if(fs_item != null){
            let file = await fs.get_file(fs_item.id);
            iframe.contentWindow.open(file);
        } else {
            let file = await fs.file_from_url('/files/FoxitReader30_Manual.pdf');
            iframe.contentWindow.open(file);
        }

        iframe.contentWindow.open_file_func = async () => {
            let file = await pick_file();
            iframe.contentWindow.open(file);
        }

        iframe.contentWindow.save_file_as_func = async () => {
            await save_file_as();
        }
        iframe_loaded = true;
        
    }

</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-slate-50">
        
        <!-- svelte-ignore a11y-missing-attribute -->
        
        {#if !iframe_loaded}
        <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
            <DumbProgress style="width:150px;height:15px;"></DumbProgress>
        </div>
        {/if}
        
        <iframe src="/html/foxit_reader/web/viewer.html" bind:this={iframe} width="100%" height="100%" on:load={setup_foxit_reader}
            class="inset-0 absolute bg-black {iframe_loaded ? '' : 'opacity-0'}  {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}">
        </iframe>

    </div>
    
</Window>


<svelte:options accessors={true}></svelte:options>

