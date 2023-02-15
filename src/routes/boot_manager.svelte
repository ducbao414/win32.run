<script>
    
    
    import { onMount, createEventDispatcher } from 'svelte';
    import * as utils from '../lib/utils';
    let dispatcher = createEventDispatcher();

    let is_chromium = true;
    onMount(() => {
        //load jquery
        loadjs([
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js',
            'https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css'
        ], {async: false});
        
        utils.set_theme('none');
        is_chromium = window.chrome != null;
    })

    let current_option = 0;
    let boot_options = [
        'Start Windows Normally',
        'Install Windows',
        'Onboard NIC (IPV4)',
        'Onboard NIC (IPV6',
        'BIOS Setup',
        'Device Configuration',
        'BIOS Flash Update',
        'Change Boot Mode Settings'
    ];

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38:
				 if(current_option == 0){
                    current_option = boot_options.length - 1;
                 } else {
                    current_option = current_option - 1;
                 }
				 break;
			 case 40:
				 if(current_option == boot_options.length - 1){
                    current_option = 0;
                 } else {
                    current_option = current_option + 1;
                 }
				 break;
			 case 13:
				 boot();
				 break;
		 }
	}

    let selected = false;
    function boot(){
        if(selected) return;
        selected = true;
        
        if(current_option == 0){
            utils.set_installing_windows(false);
            dispatcher('load_page', {url: './xp/starting.svelte'});

        } else if(current_option == 1){
            utils.set_installing_windows(true);
            dispatcher('load_page', {url: './installation/dos/starting.svelte'});
        }   
    }


</script>

<div class="w-screen h-screen bg-black overflow-hidden font-MSSS">
    <div class="mt-12 ml-8 text-lg">
        <p class="text-slate-100">Use the ↑(Up) and ↓(Down) key to move the pointer to desired boot device.</p>
        <p class="text-slate-100">Press (Enter) to attempt to boot or ESC to cancel.</p>
        {#if !is_chromium}
        <p class="text-slate-100 mt-2 max-w-[500px]">WIN32.RUN might have unexpected behaviors on browsers that are NOT Chromium-based (Safari, Firefox, Internet Explorer, etc.)</p>
        {/if}

        <p class="text-slate-100 uppercase mt-4 mb-2">boot options:</p>
        {#each boot_options.slice(0, 4) as option, index }
            <div>
                <div class="ml-8 p-2 inline-block {index == current_option ? 'text-slate-900 bg-slate-200' : 'text-slate-300'}"
                    on:click={() => {
                        //current_option = index;
                        //boot();
                    }}>
                    {option}
                </div>
            </div>
        {/each}

        <p class="text-slate-100 uppercase mt-4 mb-2">other options:</p>
        {#each boot_options.slice(4) as option, index }
            <div>
                <div class="ml-8 p-2 inline-block {index+4 == current_option ? 'text-slate-900 bg-slate-200' : 'text-slate-300'}">
                    {option}
                </div>
            </div>
        {/each}

    </div>
</div>


<svelte:window on:keydown={on_key_pressed} />