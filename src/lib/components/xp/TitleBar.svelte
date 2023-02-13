<script>
    
    export let options = {};

    let {close_btn=true, maximize_btn=true, minimize_btn=true, 
        close_btn_disabled=false, maximize_btn_disabled=false, minimize_btn_disabled=false} = options;


    export let inactive = false;
    export let maximized = false;

    export let on_click_maximize = () => {}
    export let on_click_minimize = () => {}
    export let on_click_close = () => {}

    export function update_icon(icon){
        options.icon = icon;
    }

    export function update_title(title){
        options.title = title;
    }
</script>

<div class="titlebar shrink-0 flex rounded-tl-lg rounded-tr-lg items-center justify-between  h-7 p-1 font-Trebuchet
{inactive ? 'bg-[linear-gradient(var(--titlebar-gradient-inactive))]' : 'bg-[linear-gradient(var(--titlebar-gradient))]'}">
    {#if options.icon}
        <img src="{options.icon}" width="20px" height="20px" class="ml-1" alt="">
    {/if}
    <p class="text-white font-semibold mr-4 text-[12px] grow ml-1 leading-tight line-clamp-1 text-ellipsis">{options.title}</p>
    <div class="flex mr-0.5 shrink-0">
        {#if minimize_btn}
            <button disabled={minimize_btn_disabled} on:click={on_click_minimize}
                class="group w-5 h-5 ml-1 group">
                <img src="/images/xp/icons/Minimize.png" class="w-full h-full {minimize_btn_disabled ? 'contrast-75' : 'group-hover:brightness-110'}" >
            </button>
        {/if}
        {#if maximize_btn}
            <button disabled={maximize_btn_disabled} on:click={on_click_maximize}
                class="group w-5 h-5 ml-1 group" >
                {#if maximized}
                    <img src="/images/xp/icons/Restore.png" class="w-full h-full {maximize_btn_disabled ? 'contrast-75' : 'group-hover:brightness-110'}" >
                {:else}
                    <img src="/images/xp/icons/Maximize.png" class="w-full h-full {maximize_btn_disabled ? 'contrast-75' : 'group-hover:brightness-110'}" >
                {/if}
                
                
            </button>
        {/if}
        {#if close_btn}
            <button disabled={close_btn_disabled} on:click={on_click_close}
                class="group w-5 h-5 ml-1 group">
                <img src="/images/xp/icons/Exit.png" class="w-full h-full {close_btn_disabled ? 'contrast-75' : 'group-hover:brightness-110'}" >
            </button>
        {/if}
        
    </div>
</div>

<svelte:options accessors={true}></svelte:options>