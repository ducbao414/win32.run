
<script>
   import { onMount } from 'svelte';

   let page;

   onMount(async () => {
    await load_page('./boot_manager.svelte');
    adjust_zoom();
   })


   async function load_page(url){
    //manually import modules cause Vite hasn't supported dynamically import with variables yet
    if(url == './boot_manager.svelte'){
        page = (await import('./boot_manager.svelte')).default;

    }
    else if(url == './index.svelte'){
        page = (await import('./index.svelte')).default;

    }
    else if(url == './installation/95/installing.svelte'){
        page = (await import('./installation/95/installing.svelte')).default;

    }
    else if(url == './installation/95/product_key_windows.svelte'){
        page = (await import('./installation/95/product_key_windows.svelte')).default;

    }
    else if(url == './installation/dos/copying.svelte'){
        page = (await import('./installation/dos/copying.svelte')).default;

    }
    else if(url == './installation/dos/eula.svelte'){
        page = (await import('./installation/dos/eula.svelte')).default;

    }
    else if(url == './installation/dos/format.svelte'){
        page = (await import('./installation/dos/format.svelte')).default;

    }
    else if(url == './installation/dos/partition.svelte'){
        page = (await import('./installation/dos/partition.svelte')).default;

    }
    else if(url == './installation/dos/restart.svelte'){
        page = (await import('./installation/dos/restart.svelte')).default;

    }
    else if(url == './installation/dos/starting.svelte'){
        page = (await import('./installation/dos/starting.svelte')).default;

    }
    else if(url == './installation/dos/welcome.svelte'){
        page = (await import('./installation/dos/welcome.svelte')).default;

    }
    else if(url == './xp/desktop.svelte'){
        page = (await import('./xp/desktop.svelte')).default;

    }
    else if(url == './xp/program_tray.svelte'){
        page = (await import('./xp/program_tray.svelte')).default;

    }
    else if(url == './xp/programs/display_properties.svelte'){
        page = (await import('./xp/programs/display_properties.svelte')).default;

    }
    else if(url == './xp/programs/internet_explorer.svelte'){
        page = (await import('./xp/programs/internet_explorer.svelte')).default;

    }
    else if(url == './xp/programs/my_computer.svelte'){
        page = (await import('./xp/programs/my_computer.svelte')).default;

    }
    else if(url == './xp/starting.svelte'){
        page = (await import('./xp/starting.svelte')).default;

    }
    else if(url == './xp/system_tray.svelte'){
        page = (await import('./xp/system_tray.svelte')).default;

    }
    else if(url == './xp/task_bar.svelte'){
        page = (await import('./xp/task_bar.svelte')).default;

    }
    else if(url == './xp/wallpaper.svelte'){
        page = (await import('./xp/wallpaper.svelte')).default;

    } else if(url == './xp/shutdown.svelte'){
        page = (await import('./xp/shutdown.svelte')).default;

    } else if(url == './xp/blackout.svelte'){
        page = (await import('./xp/blackout.svelte')).default;

    }
    
   }

   function adjust_zoom(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    let zoom = 1;
    if(width <= 800 || height <= 500){
        zoom = 0.8;
    } else if(width <= 900 || height <= 600){
        zoom = 0.9
    }
    document.body.style.zoom = zoom;
    for(let iframe of document.querySelectorAll('iframe')){
        try {
            iframe.contentDocument.body.style.zoom = zoom;
        } catch (error) {}
    }
   }

</script>

<svelte:head>
    <title>Microsoft Windows XP Professional</title>
</svelte:head>

<svelte:component this={page}  on:load_page={(e) => load_page(e.detail.url)}>
</svelte:component>
<svelte:window on:resize={adjust_zoom}></svelte:window>