<script>
    export let value = 0;
    export let total = 100;
    export let style = '';
</script>

<div class="bg-slate-100 border border-slate-500 rounded-sm w-10 h-1 p-0.5 overflow-hidden" style="{style}">
    <div style:width="{100*value/total}%" 
        class="h-full bg-[url(/images/xp/battery_cell.png)] bg-contain bg-repeat-x">
    </div>
</div>

<svelte:options accessors={true}></svelte:options>