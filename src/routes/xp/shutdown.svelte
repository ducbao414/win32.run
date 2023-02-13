<script>
    import {onMount, createEventDispatcher} from 'svelte';
    import * as utils from '../../lib/utils';
    import { hardDrive } from '../../lib/store';
    import {get, set} from 'idb-keyval';
    let dispatcher = createEventDispatcher();

    export let self;

    onMount(async () => {
        await set('hard_drive', $hardDrive);
        
        let shutdown_audio = new Audio('/audio/xp_shutdown.mp3');
        shutdown_audio.addEventListener('canplaythrough', (e) => {
            shutdown_audio.play();
        })
        shutdown_audio.addEventListener('ended', async () => {
            await utils.sleep(3000);
            dispatcher('load_page', {url: './xp/blackout.svelte'});
        });
    })

    export function destroy(){
        self.$destroy();
    }
    
</script>


<div class="absolute inset-0 z-50 overflow-hidden flex flex-col bg-[#5a7edc] font-sans">
    <div class="h-[70px] bg-[#00309c] flex flex-row items-center shrink-0">
      
    </div>
    <div class="h-[2px] bg-[linear-gradient(45deg,#466dcd,#c7ddff,#b0c9f7,#5a7edc)] shrink-0"></div>
    <div class="grow bg-[radial-gradient(circle_at_5%_5%,#91b1ef_0,#7698e6_6%,#5a7edc_12%)] relative overflow-hidden">
        <div class="absolute top-[30%] left-[45%] flex flex-col items-end">
            <img src="/images/xp_logo.png" width="200">
            <p class="mr-4 mt-8 text-right text-[24px] text-slate-50">Windows is shutting down...</p>
        </div>
    </div>
  
    <div class="h-[2px] bg-[linear-gradient(45deg,#003399,#f99736,#c2814d,#00309c)] shrink-0"></div>
    <div class="h-[70px] w-full bg-[linear-gradient(90deg,#3833ac,#00309c)] shrink-0 relative">
    </div>

</div>
  
<svelte:options accessors={true}></svelte:options>