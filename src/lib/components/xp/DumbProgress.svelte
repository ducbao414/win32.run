<script>
    import ProgressBar from "./ProgressBar.svelte";
    import * as utils from '../../utils';
    import {onMount} from 'svelte';

    export let style = '';
    export let increment = 5;

    let progress_bar;
    onMount(async () => {
        while(progress_bar != null){
            progress_bar.value = Math.min(progress_bar.value + increment, 100);
            if(progress_bar.value >= 100){
                progress_bar.value = 0;
            }
            await utils.sleep(500);
        }
    })

</script>

<div style="{style}">
    <ProgressBar bind:this={progress_bar} value={10} style="width:100%;height:100%;"></ProgressBar>
</div>