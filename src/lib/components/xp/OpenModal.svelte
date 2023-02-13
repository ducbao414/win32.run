<script>
    import Window from './Window.svelte';
    import { hardDrive, selectingItems} from '../../store';
    import {my_pictures_id, my_music_id, desktop_folder} from '../../system';
    import * as utils from '../../utils';
    import * as finder from '../../finder'

    import _, { find, isEqual, toLower } from 'lodash';
    import TitleBar from './TitleBar.svelte';
    import Viewer2 from './Viewer2.svelte';
    

    export let self;
    export let selected_items = [];

    export let viewer;
    export let filetypes = [];
    export let filetypes_desc = 'All Files';
    export let multiple = true;

    let left_side_places = [
        {
            id: desktop_folder,
            name: 'Desktop',
            icon: '/images/xp/icons/Desktop.png'
        },
        {
            id: my_pictures_id,
            name: 'My Pictures',
            icon: '/images/xp/icons/MyPictures.png'
        },
        {
            id: my_music_id,
            name: 'My Music',
            icon: '/images/xp/icons/MyMusic.png'
        },
        {
            id: null,
            name: 'My Computer',
            icon: '/images/xp/icons/MyComputer.png'
        }
    ]
    export function destroy(){
        console.log(self);
        self.$destroy();
    }

    export let on_open = () => {}

</script>

<div class="absolute inset-0 bg-slate-50/40 rounded-t-lg z-10" on:click|self={(e) => {
    e.target.querySelector('div').classList.add('animate-blink');
    setTimeout(() => {
        e.target.querySelector('div').classList.remove('animate-blink');
    }, 400);
}}>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
        style:width="600px" style:height="500px">
        <TitleBar options={{title: 'Open', maximize_btn: false, minimize_btn: false}} on_click_close={destroy}></TitleBar>
        <div class="grow p-2 pb-1  bg-xp-yellow overflow-hidden flex flex-row shadow-lg border-t-0 border-2 border-blue-600">
            <div class="shrink-0 pt-1 pr-1 w-[100px]">
                <div class="h-7 mr-2 flex flex-row justify-end items-center">
                    <span class="text-[11px] text-black">Look in:</span>
                </div>
                <div class="bg-xp-yellow-light shadow rounded w-full">
                    {#each left_side_places as place}
                        <div class="w-full h-[80px] flex flex-col items-center p-2 hover:bg-slate-100 rounded" 
                            on:click={() => viewer.open(place.id)}>
                            <div class="w-8 h-8 bg-contain bg-no-repeat" style:background-image="url({place.icon})"></div>
                            <span class="mt-1 text-[12px] text-black">{place.name}</span>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="grow flex flex-col relative">
                <Viewer2 bind:this={viewer} filetypes_desc={filetypes_desc} filetypes={filetypes.map(el => el.toLowerCase())} multiple={multiple}
                    on_open={() => {
                        selected_items = viewer.selectingItems;
                        on_open();
                    }}
                    on_cancel={destroy}>
                </Viewer2>
            </div>
        </div>
    </div>
</div>


<svelte:options accessors={true}></svelte:options>