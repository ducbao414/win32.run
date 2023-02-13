<script>
    export let l_message = '';
    export let r_message = '';
    export let show_separator = false;

    export async function display(messages){
        for(let {l, r, d} of messages){
            if(!l) l = '';
            if(!r) r = '';
            if(!d) d = 1000;
            l_message = l;
            r_message = r;
            await sleep(d);
        }
    }



    function sleep(ms) {
        return new Promise((resolve) => {
        setTimeout(resolve, ms);
        });
    } 
    

</script>


<div class="absolute bottom-0 left-0 right-0 h-8 bg-slate-200 text-slate-900 flex flex-row overflow-hidden font-MSSS">
    <div class="grow h-full pb-1 font-bold px-4">
        {l_message}
    </div>
    {#if  show_separator}
        <div class="w-1 h-full bg-slate-900"></div>
    {/if}
    <div class="basis-1/4 shrink-0 pb-1 font-bold px-4">
        {r_message}
    </div>

</div>

<svelte:options accessors={true}></svelte:options>