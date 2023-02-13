<script>

    
    import { click_outside } from '../../utils'
    export let menu = [
        {
            name: 'File',
            items: [//group of items
                [{name: 'Open'}],
                [{name: 'Save'}, {name:'Save as'}],
                [{name: 'Exit'}]
            ]
        },
        {
            name: 'Edit',
            items: [
                [{name: 'Undo'}, {name: 'Redo'}],
                [{name: 'Cut'}, {name: 'Copy'}, {name: 'Paste', disabled: true}, {name: 'Delete'}],
                [{name: 'Find'}, {name: 'Find Next'}, {name: 'Replace'}, {name: 'Goto'}]
            ]
        }
    ];
    export let style = '';

    let active = false;

    function hide(){
        active = false;
    }

    

</script>

<div class="toolbar-menu flex flex-row items-center justify-evenly w-min font-MSSS z-10" style="{style}"
    use:click_outside on:click_outside={() => active = false}>
    {#each menu as menu_group}
        <div class="text-[11px]  text-slate-900 hover:bg-blue-600 hover:text-slate-50 relative group">
            <div class="px-2 py-1" on:click={() => active = true}>
                {menu_group.name}
            </div>
            {#if menu_group.items != null}
                <div class="absolute w-[150px] border-slate-500 shadow hidden {active ? 'group-hover:block' : 'inactive-class'} border border-slate-200  bg-slate-50 left-0 top-[25px]">
                    {#each menu_group.items as item_group, group_index}
                        <div class="w-full border-slate-200 {group_index == menu_group.items.length - 1 ? '' : 'border-b'}">
                            {#each item_group as item}
                                <div class="py-1 w-full flex flex-row items-center {item.disabled? '' : 'hover:bg-blue-600'} relative group-sub" 
                                    on:click={() => {
                                        if(!item.disabled){
                                            hide();
                                            console.log(active);
                                            item.action();
                                        }
                                    }}>
                                    <div class="w-[20px] ml-1 shrink-0">
                                        {#if item.icon}
                                            <img src="{item.icon}" width="17px" height="17px">
                                        {/if}
                                    </div>
                                    <div class="grow text-slate-900 {item.font == 'bold' ? 'font-bold' : ''}  {item.disabled ? 'text-slate-400' : 'group-sub-hover:text-slate-50'}">
                                        <p class="line-clamp-1">{item.name}</p>
                                    </div>
                                    <div class="w-[10px]">
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>
