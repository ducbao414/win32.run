<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import {onMount, tick } from 'svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import {get,set} from 'idb-keyval';
    import DumbProgress from "../../../lib/components/xp/DumbProgress.svelte";
    import * as utils from '../../../lib/utils';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;
    let swf_node;
    let swf_loaded = false;
    let browser_window;

    $: {
        if(fs_item && window) {
            window.update_title(fs_item.name)
        }
    }

    onMount(async () => {
        browser_window = utils.browser_window();

        if(fs_item != null){
            
            const ruffle = browser_window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            swf_node.appendChild(player);
            player.setAttribute('style', `width:100%;height:100%;`);

            let item = $hardDrive[fs_item.id];
        
            let url = null;

            if(item.storage_type == 'remote'){
                url = item.url;
            } else if (item.storage_type == 'local'){
                let file = await get(item.url);
                url = URL.createObjectURL(file);
            }
            player.load(url);
        } 
        swf_loaded = true;
        
    })

    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: fs_item == null ? 'Flash Player' : fs_item.name,
        min_width: 300,
        min_height: 200,
        width: 600,
        height: 400,
        icon: '/images/xp/icons/FlashPlayer.png',
        id: id,
        exec_path
    };

    function open_link(link){
        console.log(link)
        queueProgram.set({
            path: './programs/internet_explorer.svelte',
            fs_item: {url: link}
        })
    }

    function resize_window(width, height){
        console.log('resize_window', {width, height})
        let top = (parentNode.offsetHeight-height)/2;
        let left = (parentNode.offsetWidth-width)/2;
        window.set_position({top, left, width, height});
    }


</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 flex flex-col bg-xp-yellow-light overflow-hidden">
        

        {#if !swf_loaded}
            <div
                class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono"
            >
                <DumbProgress style="width:150px;height:15px;" />
            </div>
        {/if}

        {#if fs_item}
        <div bind:this={swf_node} class="absolute inset-0"></div>
        {:else}
        <div class="my-4 p-2 font-Trebuchet">
            <p >You can run flash .swf files on this version of Windows XP. Thanks to 
                <a class="text-blue-600 cursor-pointer" on:click={() => open_link('https://ruffle.rs/')}>
                    Ruffle.
                </a>
            </p>
            <p class="mt-2">
                Supports for ActionScript 3.0 is limited at the moment.
            </p>
            <p class="mt-2">
                If you don't have a flash .swf file, checkout out this 
                <a class="text-blue-600 cursor-pointer" href="https://archive.org/details/softwarelibrary_flash" target="_blank">
                    nostalgic archive
                </a>.
            </p>
        </div>
        {/if}
    </div>
    
</Window>

<svelte:options accessors={true}></svelte:options>

