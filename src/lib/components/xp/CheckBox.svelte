<script>
    export let style = '';
    export let checkmark = true;
    export let size = 12;
    export let checked = false;
    export let label = "";

    function on_click(){
        checked = !checked;
    }
</script>

<div class="flex flex-row items-start"  on:click={on_click} style="{style}">
    <div class="border border-slate-500 bg-slate-50 inline-block box-content"
        style:width="{size}px" style:height="{size}px">
        {#if checked}
            {#if checkmark}
                <img alt="" src="/images/xp/checkmark.png" style:width="{size-2}px" style:height="{size-2}px" style:margin="1px">

            {:else}
                <div class="bg-gradient-to-r from-green-600 to-green-500 block"
                    style:width="{size-4}px" style:height="{size-4}px" style:margin="2px">
                </div>
            {/if}
        {/if}
    </div>
    <span class="text-[11px] ml-1">{label}</span>
</div>