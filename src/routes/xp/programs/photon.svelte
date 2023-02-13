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
            "name": "Portable Network Graphics",
            "mime": "image/png",
            "value": "image/png",
            "ext": ".png"
        },
        {
            "name": "JPEG images",
            "mime": "image/jpeg",
            "value": "image/jpeg",
            "ext": ".jpg"
        },
        {
            "name": "JPEG images",
            "mime": "image/jpeg",
            "value": "image/jpeg",
            "ext": ".jpeg"
        },
        {
            "name": "Windows OS/2 Bitmap Graphics",
            "mime": "image/bmp",
            "value": "image/bmp",
            "ext": ".bmp"
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
        title: fs_item == null ? 'Photon Editor' : fs_item.name,
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/Photon.png',
        id: id,
        exec_path
    };

    async function pick_file(){
        
        let selected_items = 
            await pick_file_dialog({node_ref: window.node_ref, filetypes_desc: 'Image Files', filetypes: supported_types.map(el => el.ext)})
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

    async function save_file(){
        if(fs_item != null){
            let ext = fs_item?.ext || '.png';
            let format = get_format(ext);
            console.log({format});

            let blob = utils.data_url_to_blob(iframe.contentWindow.imageEditor.toDataURL({format}));
            let file = new File([blob], fs_item.name);
            fs.save_file(fs_item.id, file);
            window.show_toast({message: 'Changes Saved!'})
        } else {
            save_file_as();
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
        
        let format = get_format(selected_filetype.ext);
        let blob = utils.data_url_to_blob(iframe.contentWindow.imageEditor.toDataURL({format}));

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

    function get_format(ext){
        if(ext == '.jpg' || ext == '.jpeg'){
            return 'jpeg';
        } else {
            return 'png'
        }
    }

    async function setup_photon(){
        iframe.contentWindow.setup_ui();
        
        if(fs_item != null){
            let file = await fs.get_file(fs_item.id);
            iframe.contentWindow.imageEditor.loadImageFromFile(file, fs_item.name);
        }
        iframe.contentWindow.about_func = () => {
            queueProgram.set({
                path: './programs/internet_explorer.svelte',
                fs_item: {url: 'https://ui.toast.com/tui-image-editor'}
            })
        }

        iframe.contentWindow.load_file_func = async () => {
            let file = await pick_file();
            iframe.contentWindow.imageEditor.loadImageFromFile(file, fs_item.name);
        }

        iframe.contentWindow.save_file_func = async () => {
            await save_file();
        }

        iframe.contentWindow.save_file_as_func = async () => {
            await save_file_as();
        }
        iframe_loaded = true; 
    }


</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-0 flex flex-col bg-black">
        
        <!-- svelte-ignore a11y-missing-attribute -->
        
        {#if !iframe_loaded}
        <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
            <DumbProgress style="width:150px;height:15px;"></DumbProgress>
        </div>
        {/if}
        
        <iframe src="/html/photon/app/index.html" bind:this={iframe} width="100%" height="100%" on:load={setup_photon}
            class="inset-0 absolute bg-black {iframe_loaded ? '' : 'opacity-0'}  {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}">
        </iframe>

    </div>
    
</Window>

<svelte:options accessors={true}></svelte:options>
