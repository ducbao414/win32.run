<script>
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    import { faker } from '@faker-js/faker';
    import * as utils from '../../../lib/utils';
    
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    let dispatcher = createEventDispatcher();

    let status_bar;

    let time_left = 15;
    let destroyed = false;

    onMount(async () => {
        
        while(time_left > 0){
            if(destroyed) break;
            await utils.sleep(1000);
            time_left--;
            if(time_left == 0 && !destroyed){
                dispatcher('load_page', {url: './xp/starting.svelte'});
            }
        }
        
    })

    onDestroy(() => {
        destroyed = true;
    })

    

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38://up
				
				break;
			 case 40://down
				break;
			 case 13://enter
                dispatcher('load_page', {url: './xp/starting.svelte'});
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
    <div class="ml-8 mt-12 text-xl text-slate-400">
        <p class="">This portion of Setup has completed successfully.</p>
        <p class="mt-2">If there is a floppy disk in drive A:, remove it.</p>
        <p class="mt-2">To restart you computer, press ENTER.<br/>
            When your computer restarts, Setup will continue.
        </p>
        
        

        <div class="absolute bottom-[150px] left-0 right-0">
            <div class="border-double border-4 border-slate-400 pt-8 mx-auto max-w-[700px]">
                <p class="text-slate-400 ml-4 my-2"></p>
                <p class="my-2 text-center">Your computer will reboot in {time_left > 1 ? time_left + ' seconds' : time_left + ' second'}...</p>
                <div class="mx-auto w-[500px] border-2 border-slate-400 h-[40px] mb-4 pt-[8px] pb-[4px] px-[4px]">
                    <div class="transition-all h-full bg-red-500" style:width="{100*(15-time_left)/15}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<StatusBar bind:this={status_bar}  l_message="ENTER=Restart Computer" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />