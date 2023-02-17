<script>
    import {onMount, createEventDispatcher} from 'svelte';
    import * as utils from '../../lib/utils';

    export let self;

    let fallback_timer;
    let destroyed = false;

    onMount(() => {
        
        let welcome_audio = new Audio("/audio/xp_startup.mp3");
        welcome_audio.addEventListener("canplaythrough", (e) => {
            console.log('canplaythrough');
            if(!destroyed){
                welcome_audio.play().catch(async (e) => {
                });
            }
        });

        welcome_audio.addEventListener("ended", (e) => {
            console.log("xp_startup audio ended");
            clearTimeout(fallback_timer);
            self.destroy();
        });

        fallback_timer = setTimeout(() => {
            self.destroy();
        }, 7000)

    })

    export function destroy(){
        destroyed = true;
        self.$destroy();
    }
    
</script>


<div class="absolute inset-0 z-50 overflow-hidden flex flex-col bg-[#5a7edc] font-sans">
    <div class="h-[70px] bg-[#00309c] flex flex-row items-center shrink-0">
      
    </div>
    <div class="h-[2px] bg-[linear-gradient(45deg,#466dcd,#c7ddff,#b0c9f7,#5a7edc)] shrink-0"></div>
    <div class="grow bg-[radial-gradient(circle_at_5%_5%,#91b1ef_0,#7698e6_6%,#5a7edc_12%)] relative overflow-hidden">
        <span class="absolute top-[40%] left-[50%] text-[42px] text-slate-50 italic font-bold">Welcome</span>
    </div>
  
    <div class="h-[2px] bg-[linear-gradient(45deg,#003399,#f99736,#c2814d,#00309c)] shrink-0"></div>
    <div class="h-[70px] w-full bg-[linear-gradient(90deg,#3833ac,#00309c)] shrink-0 relative">
    </div>

</div>
  
<svelte:options accessors={true}></svelte:options>