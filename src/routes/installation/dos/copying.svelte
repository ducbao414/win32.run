<script>
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    import { faker } from '@faker-js/faker';
    import * as utils from '../../../lib/utils';
    
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    let dispatcher = createEventDispatcher();

    let status_bar;

    let progress = 0;
    let destroyed = false;

    onMount(async () => {
        
        copy_files();
        update_progress();
        
    })

    onDestroy(() => {
        destroyed = true;
    })

    async function update_progress(){
        while(progress < 100){
            await utils.sleep(utils.random_int(1,10)*10);
            progress = Math.min(100, progress + utils.random_int(1, 10)/12);
            
        }
        dispatcher('load_page', {url: './installation/dos/restart.svelte'});
    }

    async function copy_files(){
        while(true){
            if(destroyed) break;
            await utils.sleep(utils.random_int(1,30)*10);
            status_bar.r_message = 'Copying: ' + utils.random_files();
        }
    }

    

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38://up
				break;
			 case 40://down
				break;
			 case 13://enter
				 break;
            case 27://esc
                
                break;
		 }
	}



</script>

<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi">
    <div class=" mt-4 text-xl font-bold text-slate-400 inline-block">
        <p class="px-2">Windows XP Professional Setup</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div>
    </div>
    <div class="mt-12 text-xl text-slate-400">
        <p class="text-center">Please wait while Setup copies files</p>
        <p class="mt-2 text-center">to the Windows installation folders.</p>
        <p class="mt-2 text-center">This might take several minutes to complete.</p>
        
        

        <div class="absolute bottom-[150px] left-0 right-0">
            <div class="border-double border-4 border-slate-400 mx-auto max-w-[700px]">
                <p class="text-slate-400 ml-4 my-2">Setup is copying files...</p>
                <p class="my-2 text-center">{Math.floor(progress)}%</p>
                <div class="mx-auto w-[500px] border-2 border-slate-400 h-[40px] mb-4 pt-[8px] pb-[4px] px-[4px]">
                    <div class="transition-all h-full bg-yellow-300" style:width="{progress}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<StatusBar bind:this={status_bar} show_separator={true} l_message="" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />