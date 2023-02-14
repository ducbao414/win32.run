<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import Tab from '../../../lib/components/xp/Tab.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, wallpaper, hardDrive } from '../../../lib/store';
    import {get, set} from 'idb-keyval';
    import _, { isEqual } from 'lodash';
    import { wallpapers_folder } from '../../../lib/system';

    export let id;
    export let window;
    export let self;
    export let exec_path;

    let preview = $wallpaper;
    let wallpapers = $hardDrive[wallpapers_folder]
    .children
    .filter(el => $hardDrive[el].type == 'file');

    onMount(() => {
    })


    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    function apply(){
        wallpaper.set(preview);
        destroy();
    }

    export let options = {
        title: 'Display Properties',
        min_width: 400,
        min_height: 570,
        width: 400,
        height: 570,
        icon: null,
        id: id,
        resizable: false,
        maximize_btn: false,
        minimize_btn: false,
        exec_path
    };

    async function get_wallpaper_url(w){
        let fs_item = $hardDrive[w];
        console.log(fs_item);
        if(fs_item.storage_type == 'remote'){
            return fs_item.url;
        } else if (fs_item.storage_type == 'local'){
            let file = await get(fs_item.url);
            return URL.createObjectURL(file);
        }
    }


</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-1 p-2 pb-1 flex flex-col bg-xp-yellow overflow-hidden">
        <Tab size={'sm'} items={['Themes', 'Desktop', 'Screesaver', 'Appearance', 'Settings']} 
            selected={'Desktop'}>
        </Tab>
        <div class="w-full grow bg-[#fafaf9]  shadow-sm -mt-[1px] flex flex-col overflow-hidden">
            <div class="h-[250px] shrink-0 relative">
                <div class="absolute top-8 left-1/2 -translate-x-1/2 w-[190px] h-[190px]">
                    <div class="w-full h-full relative">
                        {#await get_wallpaper_url(preview)}
                            <div class="absolute bg-cover" 
                                style="inset:10px 10px 30px 10px;">
                            </div>
                        {:then url} 
                            <div class="absolute bg-cover" 
                                style="inset:10px 10px 30px 10px;"
                                style:background-image="url({url})">
                            </div>
                        {/await}
                        <div class="absolute inset-0 bg-cover bg-[url(/images/xp/crt_monitor.png)]">

                        </div>
                    </div>
                </div>
            </div>
            <div class="grow flex flex-row text-[13px] p-2 text-slate-800 overflow-hidden">
                <div class="grow flex flex-col overflow-hidden">
                    <span class="my-1">Background</span>
                    <div class="grow p-1 overflow-y-scroll overflow-x-hidden border border-slate-700">
                        {#each wallpapers as wallpaper}
                        <div class="w-full flex flex-row" on:click={() => preview = wallpaper}>
                            <img src="/images/xp/icons/JPG.png" class="w-[20px] h-[20px] shrink-0" alt="">
                            <p class="leading-[20px] ml-1 px-1 grow-0 line-clamp-1 {_.isEqual(preview, wallpaper) ? 'bg-blue-600 text-slate-50' : ''}">
                                {$hardDrive[wallpaper].basename}
                            </p>
                        </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <div class="shrink-0 flex flex-row justify-end items-center px-1 pt-2">
            <Button title="OK" style="margin-right:10px;" on_click={apply}></Button>
            <Button title="Cancel" on_click={destroy}></Button>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>