<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import RangeSlider from "svelte-range-slider-pips";
    import {onMount, tick } from 'svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive } from '../../../lib/store'
    import * as utils from '../../../lib/utils';
    import * as fs from '../../../lib/fs';
    import {tooltip} from '$lib/components/xp/tooltip.js';
    import {get,set} from 'idb-keyval';
    import toWebVTT from 'srt-webvtt';
    import _ from 'lodash';

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let supported_audio_types = ['.mp3', '.wav', '.ogg'];
    let supported_video_types = ['.mp4', '.wmv', '.webm', '.ogg'];

    let slider;

    let file_type;//'audio' or 'video';
    let player_node;
    let currentTime;
    let duration;
    let paused;
    let wmp_volume = 0.8;
    let loop = true;
    $: audio_volume = wmp_volume*$systemVolume;

    let subtitle_src;
    let fullscreen = false;
    let idle = false;
    let idle_timer;
    let content_node;
    let toast_node;
    

    onMount(async () => {
        await load_media(fs_item);
        
    })

    async function load_media(item){
        if(item == null) return;
        if(supported_audio_types.includes(item.ext)){
            file_type = 'audio';
        } else if(supported_video_types.includes(item.ext)){
            file_type = 'video';
        } else {
            return;
        }
        await tick();

        let url;
        if(item.storage_type == 'local'){
            let file = await get(item.url);
            url = URL.createObjectURL(file);

        } else if(item.storage_type == 'remote'){
            url = item.url;
        }
        
        subtitle_src = await find_subtitle(item);
        console.log({subtitle_src});
        player_node.src = url;
        player_node.play();
        window.update_title(item.name);

    }

    async function open_file(){
        const OpenModal = (await import('../../../lib/components/xp/OpenModal.svelte')).default;
        let modal = new OpenModal({
            target: window.node_ref,
            props:{filetypes: ['.mp3','.mp4', '.ogg', '.webm', '.wav', '.flac', '.aac'], filetypes_desc: 'Audio and Video Files'}
        })
        modal.self = modal;
        modal.on_open = () => {
            let item = $hardDrive[modal.selected_items[0]];
            load_media(item);
            modal.destroy();
        }
    }


    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
        clearTimeout(idle_timer);
    }

    export let options = {
        title: 'Media Player Classic',
        min_width: 500,
        min_height: 400,
        width: 700,
        height: 500,
        icon: '/images/xp/icons/MPC.png',
        id: id,
        exec_path
    };

    async function on_drop(e){
        e.preventDefault();
        for(let file of e.dataTransfer.files){
            console.log(file);
            if(supported_audio_types.includes(utils.extname(file.name))){

                file_type = 'audio';
                await tick();
                let url = URL.createObjectURL(file);
                player_node.src = url;
                player_node.play();
                break;

            } else if(supported_video_types.includes(utils.extname(file.name))){

                file_type = 'video';
                await tick();
                let url = URL.createObjectURL(file);
                player_node.src = url;
                player_node.play();
                break;
            } 
        }
    }

    function on_drop_over(e){
        e.preventDefault();
    }


    function play(){
        if(paused == null || paused){
            player_node.play();
        } else {
            player_node.pause();
        }
    }


    function stop(){
        // player_node.pause();
        player_node.src = '';
        file_type = '';
        window.update_title('Media Player Classic');
    }

    function seek(e){
        console.log(e);
        currentTime = e.detail.value;
    }

    function next5s(){
        currentTime = Math.min(currentTime+5, duration);
        console.log('next5s', currentTime);
    }

    function back5s(){
        currentTime = Math.max(currentTime-5, 0);
        console.log('back5s', currentTime);
    }

    function next15s(){
        currentTime = Math.min(currentTime+15, duration);
    }

    function back15s(){
        currentTime = Math.max(currentTime-15,0);
    }

    function on_key_pressed(e){
        console.log('keyevent receive in wmp');
        if(window.z_index != $zIndex || isNaN(duration)) return;
        console.log('not skip');
        e.preventDefault();
        if(e.key == 'ArrowRight'){
            next5s();
            toast('Forward 5s to ' + utils.format_time(currentTime));

        } else if(e.key == 'ArrowLeft'){
            back5s();
            toast('Rewind 5s to ' + utils.format_time(currentTime));

        } else if(e.key == 'ArrowUp'){
            wmp_volume = Math.min(1, wmp_volume + 0.05);
            toast('Volume: ' + _.round(wmp_volume*100));

        } else if(e.key == 'ArrowDown'){
            wmp_volume = Math.max(0, wmp_volume - 0.05);
            toast('Volume: ' + _.round(wmp_volume*100));

        } else if(e.key == ' '){
            play();
        }
    }

    function change_volume(e){
        wmp_volume = e.detail.value;
    }

    async function find_subtitle(item){
        try {
            let vtt = $hardDrive[item.parent]
            .children
            .map(id => $hardDrive[id])
            .find(el => el.basename == item.basename && el.ext == '.vtt');

            let srt = $hardDrive[item.parent]
            .children
            .map(id => $hardDrive[id])
            .find(el => el.basename == item.basename && el.ext == '.srt');
            
            if(vtt){
                let vtt_file = await fs.get_file(vtt.id);
                return URL.createObjectURL(vtt_file);

            } else if(srt){
                let srt_file = await fs.get_file(srt.id); 
                return (await toWebVTT(srt_file));

            } else {
                return null;
            }
        } catch (error) {
            return null;   
        }
    }


    function request_fullscreen(){
        content_node.requestFullscreen();
        idle = true;
        document.removeEventListener('fullscreenchange', exit_full_screen);
        document.addEventListener('fullscreenchange', exit_full_screen);
    }

    function exit_full_screen(){
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            ///fire your event
            fullscreen = false;
        } else {
            fullscreen = true;
        }
    }

    function on_user_active(e){
        clearTimeout(idle_timer);
        idle = false;

        idle_timer = setTimeout(() => {
            idle = true;
        }, 3000);
    }

    let toast_timeout;
    function toast(msg){
        clearTimeout(toast_timeout);

        toast_node.innerText = msg;
        toast_node.classList.remove('hidden');

        toast_timeout = setTimeout(() => {
            toast_node.classList.add('hidden');
        }, 1500);
    }
    

</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div bind:this={content_node} on:mousemove={on_user_active}
        slot="content" class="absolute inset-0 flex flex-col bg-xp-yellow overflow-hidden">

        <p class="z-10 absolute top-2 left-1/2 -translate-x-1/2 p-2 text-center hidden rounded bg-black/70 text-white font-sans" 
            bind:this={toast_node}>
        </p>

        {#if file_type == 'audio'}
        <audio src="" bind:this={player_node} loop={loop} bind:currentTime bind:duration bind:paused bind:volume={audio_volume}></audio>
        {:else if file_type == 'video'}
        <div class="grow overflow-hidden bg-black">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video class="w-full h-full" src="" bind:this={player_node} loop={loop} 
                bind:currentTime bind:duration bind:paused bind:volume={audio_volume}>
                <track
                    kind="subtitles"
                    src="{subtitle_src}"
                    default />
            </video>
        </div>
        {/if}
        

        {#if player_node == null}
        <div class="grow bg-black w-full flex flex-col items-center justify-center">
            <img src="/images/xp/icons/MPC.png" class="invert opacity-30" style="" width="150px" height="auto" alt="">
            <button on:click={open_file}
                class=" outline-none bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 rounded mt-8 text-slate-100 text-sm py-2 px-4">
                Open files...
            </button>
        </div>
        {:else if player_node != null && file_type == 'audio'}
        <div class="grow bg-black w-full">
            <iframe class="w-full h-full pointer-events-none" src="/html/visualizers/{utils.random_int(1,12)}.html"></iframe>
        </div>
        {/if}

        <div class="{fullscreen ? 'absolute bottom-0 left-0 right-0 h-[102px]' : 'shrink-0 w-full'} 
            {idle && fullscreen ? 'hidden' : ''}
            flex flex-col bg-xp-yellow">
            <div class="shrink-0 w-full">
                <RangeSlider max={parseInt(duration)} values={[parseInt(currentTime)]} bind:this={slider} 
                            id="wmp-slider" springValues={{ stiffness: 0.3, damping: 1 }} on:change={seek} />
            </div>
            <div class="shrink-0 w-full flex flex-row justify-between items-center">
                <div class="flex flex-row items-center">
    
                    <!-- play -->
                    <button use:tooltip tooltip="Play/Pause [Space]"  disabled={player_node == null || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" on:click={play}>
                        {#if player_node == null || paused == null || paused}
                            <!-- play icon -->
                            <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                            </svg>
                        {:else}
                            <!-- pause icon -->
                            <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
                            </svg>
                        {/if}
                    </button>
    
    
                    <!-- stop -->
                    <button use:tooltip tooltip="Close" disabled={player_node == null ||  paused == null || paused || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" on:click={stop}>
                        <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
                        </svg>
                    </button>
    
                    <!-- fast backward -->
                    <button use:tooltip tooltip="Rewind 15s" disabled={player_node == null || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" on:click={back15s}>
                        <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7V416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V214.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96V214.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96V416c0 12.4-7.2 23.7-18.4 29z"/>
                        </svg>
                    </button>
    
                    <!-- backward -->
                    <button use:tooltip tooltip="Rewind 5s [←]" disabled={player_node == null || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" on:click={back5s}>
                        <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/>
                        </svg>
                    </button>
    
                    <!-- forward -->
                    <button use:tooltip tooltip="Forward 5s [→]" disabled={player_node == null || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" on:click={next5s}>
                        <svg  class="w-full h-full fill-slate-900 group-disabled:fill-slate-400"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"/>
                        </svg>
                    </button>
    
                    <!-- fast forward -->
                    <button use:tooltip tooltip="Forward 15s" disabled={player_node == null || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" on:click={next15s}>
                        <svg class="w-full h-full fill-slate-900 group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z"/>
                        </svg>
                    </button>
    
                    <!-- loop -->
                    <button use:tooltip tooltip="Loop" disabled={player_node == null || isNaN(duration)} class="w-5 h-5 p-1 m-1 group outline-none" 
                        on:click={() => loop = !loop}>
                       
                        <svg class="w-full h-full fill-slate-900 {loop ? '' : 'fill-slate-400'} group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"/>
                        </svg>
                    </button>

                    <!-- fullscreen -->
                    <button use:tooltip tooltip="Fullscreen" disabled={player_node == null || isNaN(duration) || fullscreen} class="w-5 h-5 p-1 m-1 group outline-none" 
                        on:click={request_fullscreen}>
                       
                        <svg class="w-full h-full fill-slate-900  group-disabled:fill-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/>
                        </svg>
                    </button>
                </div>
                <div class="flex flex-row items-end">
                    <div class="w-4 h-4 mb-1 ">
                    </div>
                    <div class="w-[80px] h-[20px] mr-5 mb-1 relative">
                        <div class="absolute top-0 left-0"
                            style="width: 0px; height: 0px; border-style: solid; border-width: 0px 0px 20px 80px; border-color: transparent transparent rgb(215, 218, 218);">
                        </div>
                        <div class="absolute left-1 bottom-0 right-1">
                            <RangeSlider max={1} step={0.01} values={[wmp_volume]} springValues={{ stiffness: 0.9, damping: 1 }}
                             id="wmp-volume-slider" on:change={change_volume} />
                        </div>
                        
                    </div>
                </div>
            </div>
    
            <div class="shrink-0 bg-black flex flex-row justify-between items-center p-2 basis-8">
                
                {#if player_node != null}
                    {#if isNaN(duration)}
                        <div class="text-[12px] text-slate-50">Buffering...</div>
                    {:else}
                        <div class="text-[12px] text-slate-50">{paused == null || paused ? 'Paused' : 'Playing'}</div>
                        <div class="text-[12px] text-slate-50">{utils.format_time(currentTime)}/{utils.format_time(duration)}</div>
                    {/if}
                {:else}
                    <div class="text-[12px] text-slate-50">Closed</div>
                {/if}
            </div>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>

<svelte:window on:keydown={on_key_pressed} />
