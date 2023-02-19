<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import * as utils from '../../../lib/utils';
    import * as fs from '../../../lib/fs';
    import short from 'short-uuid';
    import * as finder from '../../../lib/finder'
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';
    import {onMount} from 'svelte';
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let webapp;
    let webapp_url;
    export let exec_path;

    let iframe;
    let iframe_loaded = false;
    let background = webapp?.background || '#ffffff';

    onMount(async () => {
        webapp_url = transform(webapp.url)
    })

    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: webapp.name,
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: webapp.icon,
        id: id,
        exec_path
    };


    async function setup_webapp(){
        iframe_loaded = true;
    }

    function on_window_focused(){
        setTimeout(() => {
            if(iframe){
                iframe.contentWindow.focus();
            }
        }, 500)
    }

    async function pick_files(desc='', exts=[], multiple=true){
        console.log(desc);
        console.log(exts)
        let selected_items = await pick_file_dialog({
            node_ref: window.node_ref,
            filetypes_desc: desc,
            filetypes: exts,
            multiple
        });
        console.log(selected_items)
        let files = [];
        for(let fs_id of selected_items){
            let file = await fs.get_file(fs_id);
            files.push({
                id: fs_id,
                win32_name: $hardDrive[fs_id].name,
                win32_path: finder.to_url(fs_id),
                file
            })
        }
        await send_message({type: 'files_picked', files });
    }

    async function save_file_as(file, supported_types){
        if(!(file instanceof File)) return;
        if(!Array.isArray(supported_types)) return;
        supported_types = supported_types.map(item => {
            item.name = item.desc + ` (${item.ext})`;
            return item;
        })

        let { parent_id, filename, selected_filetype } =
            await save_file_as_dialog({
                node_ref: window.node_ref,
                filetypes: supported_types,
                current_filetype: supported_types[0],
            });
        
        let new_id = short.generate();
        file = new File([file], filename, {type: selected_filetype.mime});
        await fs.save_file_as(
            filename,
            selected_filetype.ext,
            file,
            parent_id,
            new_id
        );
        await send_message({type: 'file_saved_as', fs_id: new_id});
    }

    async function save_file(file, fs_id){
        await fs.save_file(fs_id, file);
        await send_message({type: 'file_saved'})
    }


    async function get_file(fs_id){
        
        let fs_item = $hardDrive[fs_id];
        if(fs_id){
            let file = await fs.get_file(fs_id);
            await send_message({
                type: 'file', 
                file: {
                    win32_path: finder.to_url(fs_id),
                    win32_name: fs_item.name,
                    file
                }
            });
        }
    }

    async function pick_file_dialog({ node_ref, filetypes_desc, filetypes, multiple }) {
        return new Promise(async (resolve, reject) => {
            const OpenModal = (
                await import("../../../lib/components/xp/OpenModal.svelte")
            ).default;
            let modal = new OpenModal({
                target: node_ref,
                props: { filetypes, filetypes_desc, multiple },
            });
            modal.self = modal;
            modal.on_open = () => {
                resolve(modal.selected_items);
                modal.destroy();
            };
        });
    }

    async function save_file_as_dialog({
        node_ref,
        filetypes,
        id,
        current_filetype,
    }) {
        return new Promise(async (resolve, reject) => {
            const SaveModal = (
                await import("../../../lib/components/xp/SaveModal.svelte")
            ).default;
            let modal = new SaveModal({
                target: node_ref,
                props: { filetypes, selected_filetype: current_filetype, id },
            });
            modal.self = modal;
            modal.on_save = () => {
                resolve({
                    parent_id: modal.parent_id,
                    filename: modal.filename,
                    selected_filetype: modal.selected_filetype,
                });
                modal.destroy();
            };
        });
    }

    async function on_message({data}){
        if(data?.program_id != id) return;

        console.log(data)
        let {type} = data;
        if(type == 'pick_files'){
            await pick_files(data.desc, data.exts, data.multiple);

        } else if(type == 'save_file'){
            await save_file(data.file, data.fs_id);

        } else if(type == 'save_file_as'){
            await save_file_as(data.file, data.types);

        } else if(type == 'get_file'){
            await get_file(data.fs_id);
        }
    }

    function transform(url){
        url = new URL(url);
        url.searchParams.set('program_id', id);
        url.searchParams.set('parent_origin', utils.browser_window().location.origin);
        return url.href;
    }
    async function send_message(data){
        iframe.contentWindow.postMessage(data, (new URL(webapp_url)).origin);
    }

</script>



<Window options={options} bind:this={window} on_click_close={destroy} on_focused={on_window_focused}>
    <div slot="content" class="absolute inset-0.5 top-0 flex flex-col bg-slate-800">

        <div class="absolute inset-0 overflow-auto bg-slate-100 font-sans" style:background-color="{background}">

            {#if !iframe_loaded}
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
                <DumbProgress style="width:150px;height:15px;"></DumbProgress>
            </div>
            {/if}

            <!-- svelte-ignore a11y-missing-attribute -->
            <iframe 
                class="w-full h-full {!iframe_loaded ? 'hidden' : ''} {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" 
                bind:this={iframe} src={webapp_url} 
                allow="gamepad *;" frameborder="0" allowfullscreen
                style:background-color="{background}"
                on:load={setup_webapp}>
            </iframe>
        </div>

    </div>
    
</Window>

<svelte:window on:message={on_message}></svelte:window>
<svelte:options accessors={true}></svelte:options>