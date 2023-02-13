<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import {onMount, tick } from 'svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import * as utils from '../../../lib/utils';
    import * as fs from '../../../lib/fs';
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';
    import { Archive } from '../../../lib/libarchive.js/main';
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let error;
    let encrypted = false;
    let cancelled = false;
    let password = '';

    export let options = {
        title: 'WinRAR',
        min_width: 250,
        min_height: 220,
        width: 250,
        height: 220,
        resizable: false,
        maximize_btn_disabled: true,
        icon: '/images/xp/icons/RAR.png',
        id: id,
        exec_path
    };

    Archive.init({
        workerUrl: '/js/libarchive.js/dist/worker-bundle.js'
    });


    onMount(async () => {
        
        if(fs_item){
            let file = await fs.get_file(fs_item.id);

            const archive = await Archive.open(file);
            encrypted =  await archive.hasEncryptedData();

            if(!encrypted){
                await extract(file);
            }
        }
        
    })


    export async function destroy(){
        cancelled = true;
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    async function decrypt(){
        encrypted = false;
        let file = await fs.get_file(fs_item.id);
        await extract(file, password);
    }

    async function extract(file, password=null){
        const archive = await Archive.open(file);
        if(password){
            await archive.usePassword(password);
        }
        try {
            let obj = await archive.extractFiles();
            for(let key of Object.keys(obj)){
                await save_to_disk(obj[key], fs_item.parent, key)
            }
        } catch (err) {
            console.log(err);
            error = err;
            return;
        }
        
        destroy();
    }

    async function save_to_disk(obj, parent_id, key){
        if(cancelled) return;

        if(obj instanceof File){
            let file = new File([obj], obj.name, {
                type: utils.ext_to_mime(obj.name) || obj.type
            });
            await fs.new_fs_item('file', utils.extname(key), utils.basename(key, utils.extname(key)), parent_id, file);
        } else {
            let folder_id = await fs.new_fs_item('folder', '', key, parent_id, null);
            for(let k of Object.keys(obj)){
                await save_to_disk(obj[k], folder_id, k);
            }
        }
    }


</script>



<Window options={options} bind:this={window} 
    on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 top-0 bg-xp-yellow">
        {#if !encrypted}
            <div class="absolute inset-4 flex flex-col overflow-hidden justify-between">
                <p class="my-2 text-[13px] text-ellipsis line-clamp-3">Extracting {fs_item ? fs_item.name : ''}...</p>
                <DumbProgress style="height:15px;margin:5px 0;flex-shrink:0;"></DumbProgress>
                <Button title="Cancel" on_click={destroy}></Button>
            </div>
        {:else}
            <div class="absolute inset-4 flex flex-col overflow-hidden justify-between">
                <p class="my-2 text-[13px]">Enter password:</p>
                <input autofocus bind:value={password} type="password" 
                    on:keydown={e => e.key == 'Enter' && decrypt()}
                    class="outline-none border border-slate-800 text-[11px] p-1">
                <div class="flex flex-row h-7 justify-evenly">
                    <Button title="OK" on_click={decrypt}></Button>
                    <Button title="Cancel" on_click={destroy}></Button>
                </div>
            </div>
        {/if}

        {#if error}
            <div class="absolute inset-4 bg-xp-yellow flex flex-col justify-between overflow-hidden">
                <div class="flex flex-row mt-2 items-center">
                    <img src="/images/xp/icons/Critical.png" class="w-8 h-8 mr-1" alt="">
                    <p class="font-bold text-[13px]">Error</p>
                </div>
                <p class="mb-2 text-[13px] text-ellipsis line-clamp-3">{error.message}</p>
                <Button title="OK" on_click={destroy}></Button>
            </div>
        {/if}
    </div>

</Window>


<svelte:options accessors={true}></svelte:options>