<script>
    export let checked = false;
    export let label = '';
    export let size = 15;
    export let in_progress = false;
</script>
<div class="flex flex-row">
    <div class="group bg-[linear-gradient(135deg,#dcdcd7,#fff)] shrink-0 rounded-full border border-[#1d5281] relative" 
    style:width='{size}px' style:height='{size}px'>
        <div class="{in_progress ? 'bg-gradient-to-r' : ''} group-hover:bg-gradient-to-r from-orange-300 to-orange-200 absolute inset-0 rounded-full p-[2px]">
            <div class="w-full h-full bg-[linear-gradient(135deg,#dcdcd7,#fff)] opacity-70 rounded-full"></div>
        </div>
        {#if checked}
            <div class="bg-[url(/images/xp/radio_check.png)] bg-cover absolute inset-1/4"></div>
        {/if}
    </div>
    <div class="ml-2 leading-none {in_progress ? 'text-orange-400' : ''}">{label}</div>
</div>

<svelte:options accessors={true}></svelte:options>