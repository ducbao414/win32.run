
<script>
    let EULA = '';
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    
    import { onMount, createEventDispatcher } from 'svelte';

    onMount(async () => {
        let res = await fetch('/files/EULA.txt');
        let file = await res.blob();
        EULA = fmt_html(await file.text());
    })


    function fmt_html(input){
        return input.split('\n\n').join('<br/>');
    }

    let dispatcher = createEventDispatcher();
    let status_bar;
    let y_pos = 0;

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38:
				y_pos = Math.min(y_pos + 100, 0);
				break;
			 case 40:
				y_pos = y_pos - 100;
				break;
			 case 13:
                dispatcher('load_page', {url: './installation/dos/partition.svelte'});
				 break;
            case 27:
                dispatcher('load_page', {url: './boot_manager.svelte'});
                break;
		 }
	}

</script>

<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi">
    <div class=" mt-4 text-xl font-bold text-slate-400 inline-block">
        <p class="px-2">Windows XP Licensing Agreement</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div>
    </div>
    <div class="mt-8 p-4 h-[90vh] text-xl text-slate-200 overflow-hidden relative">
        <div class="absolute" style:top="{y_pos}%">{@html EULA}</div>
    </div>
</div>

<StatusBar bind:this={status_bar} l_message="ENTER=I agree&nbsp;&nbsp;&nbsp; ESC=I do not agree&nbsp;&nbsp;&nbsp; ↓(Down)=Next page&nbsp;&nbsp;&nbsp;↑(Up)=Previous page" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />