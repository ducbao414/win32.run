<script>
    export let style = '';
    export let items = [];
    export let group_class = 'group';
</script>


<div class="absolute left-[90%] bottom-0 w-[250px] shadow-xl border-t border-l-4 border-blue-500 hidden group-sub1-hover:block bg-slate-50">
    {#each items as item}
        {#if item == null}
            <div class="my-0.5 mx-auto w-5/6 h-[1px] bg-slate-200 shrink-0"></div>
        {:else}
            <div class="flex flex-row items-center grow p-1 group-sub2 hover:bg-blue-500 relative">
                <div class="w-5 h-5 bg-contain mr-1 shrink-0"
                    style:background-image="url({item.icon})">
                </div>
                <div class="text-[11px]  text-slate-800 grow group-sub12hover:text-white">
                    {item.name}
                </div>
                <div class="w-[10px] shrink-0">
                    {#if item.items != null}
                        <svg class="fill-slate-900 group-sub2-hover:fill-slate-50 w-[10px] h-[10px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                    {/if}
                </div>
            </div>
        {/if}
    {/each}
</div>