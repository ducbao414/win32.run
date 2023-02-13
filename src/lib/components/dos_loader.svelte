<script>

    export let show = false;
    
</script>

<div class="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black overflow-hidden {show ? '' : 'hidden'} font-MSSS">
    <div class="mt-12 ml-8 text-lg">
        <div class="w-6 h-1 animate-cursor bg-slate-50">
        </div>
    </div>
</div>
<svelte:options accessors={true}></svelte:options>