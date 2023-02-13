<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms } from '../../../lib/store'

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let exec_path;

    let intro_player;
    let fullScreen = true;

    onMount(() => {
        intro_player.requestFullscreen();
        addEventListeners();
    })


    function addEventListeners(){
        document.removeEventListener('fullscreenchange', exit_full_screen);
        document.addEventListener('fullscreenchange', exit_full_screen);
    }

    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: 'Microsoft Windows XP Tour',
        min_width: 960,
        min_height:540,
        width: 960,
        height: 570,
        icon: '/images/xp/icons/TourXP.png',
        resizable:false,
        background: '#fff',
        id: id,
        exec_path
    };
    
    function exit_full_screen(){
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            ///fire your event
            fullScreen = false;
        } else {
            fullScreen = true;
        }
    }

</script>

<Window options={options} bind:this={window} on_click_close={destroy} on_click_maximize={() => intro_player.requestFullscreen()}>
    
    <div slot="content" bind:this={intro_player} class="absolute inset-1 flex flex-col bg-xp-yellow" style:background="{options.background}">
        <video autoplay playsinline class="absolute inset-0 {fullScreen ? 'object-cover' : 'object-cover'} w-full h-full">
            <source src="/video/xp_tour.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 border-l-4 border-r-4 border-white">

        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>