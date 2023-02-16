<script>
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    import { faker } from '@faker-js/faker';
    import * as utils from '../../../lib/utils';
    
    import { onMount, createEventDispatcher } from 'svelte';
    let dispatcher = createEventDispatcher();

    let status_bar;

   

    onMount(async () => {
        
    })

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38://up
				 
				break;
			 case 40://down
				 
				break;
			 case 13://enter
                dispatcher('load_page', {url: './installation/dos/eula.svelte'});
				 break;
            case 27://esc
                dispatcher('load_page', {url: './boot_manager.svelte'});
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
    <div class="ml-12 mt-8 text-xl">
        <p class="text-slate-50">Welcome to Setup.</p>
        <p class="mt-3 text-slate-400">This portion of the Setup program prepares Microsoft(R) Windows(R) to run on your computer.</p>
        <ul class="mt-6 ml-12 text-slate-400 list-disc">
            <li class="mt-3">To setup Windows XP now, press ENTER.</li>
            <li class="mt-3">To repaire a Windows installation using Recovery Console, press R.</li>
            <li class="mt-3">To quite Setup without installing Windows XP, press ESC.</li>
        </ul>
    </div>
</div>

<StatusBar bind:this={status_bar} l_message="ENTER=Continue&nbsp;&nbsp;&nbsp; R=Repair&nbsp;&nbsp;&nbsp; ESC=Quit" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />