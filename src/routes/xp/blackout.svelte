<script>
    import { onMount } from 'svelte';
    import {queueCommand} from '../../lib/store';
    import * as utils from '../../lib/utils'

    onMount(async () => {
        await utils.sleep(1000);
        if($queueCommand == 'restart'){
            queueCommand.set(null);
            window.location.reload();
        }
    })

    function on_key_pressed(e){
        window.location.reload();
    }
</script>

<div class="absolute z-50 inset-0 bg-black cursor-none">

</div>


<svelte:window on:keydown={on_key_pressed} />