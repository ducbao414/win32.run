<script>
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    import { faker } from '@faker-js/faker';
    import * as utils from '../../../lib/utils';
    
    import { onMount, createEventDispatcher } from 'svelte';
    let dispatcher = createEventDispatcher();

    let status_bar;

   

    onMount(async () => {
        while(progress < 100){
            await utils.sleep(utils.random_int(1, 3)*300);
            progress = Math.min(100, progress + utils.random_int(5, 20));
        }
        await utils.sleep(1000);
        dispatcher('load_page', {url: './installation/dos/copying.svelte'});
    })

    let progress = 0;

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
        <p class="text-center">Please wait while Setup formats the partition</p>
        <p class="mt-4 text-center">C: Partition1 [New (Raw)] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10229 MB (10228 MB free)</p>
        
        <p class="mt-4 text-center">On 10237 MB Disk 0 at Id 0 on bus 0 on atapi [MBR]</p>

        <div class="absolute bottom-[150px] left-0 right-0">
            <div class="border-double border-4 border-slate-400 mx-auto max-w-[700px]">
                <p class="text-slate-400 ml-4 my-2">Setup is formatting...</p>
                <p class="my-2 text-center">{progress}%</p>
                <div class="mx-auto w-[500px] border-2 border-slate-400 h-[40px] mb-4 pt-[8px] pb-[4px] px-[4px]">
                    <div class="transition-all h-full bg-yellow-300" style:width="{progress}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<StatusBar bind:this={status_bar} l_message="" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />