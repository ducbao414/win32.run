<script>

    import * as utils from '../../utils';
    const {click_outside} = utils;
    import {onMount} from 'svelte';

    export let items = []
    export let selected_index = 0;
    export let style = '';
    export let direction;

    let item_height = 24;
    let expand = false;
    let node_ref;
    let dropbox_pos = '';

    function on_click_expand(){
        cal_dropbox_pos();
        expand = true;
        console.log({expand});
    }

    function cal_dropbox_pos(){
        if(direction == 'bottom'){
            dropbox_pos = 'top:100%;'
        } else if(direction == 'top'){
            dropbox_pos = 'bottom:100%;'
        } else {
            if(document.body.offsetHeight - node_ref.getBoundingClientRect().y > 150){
                dropbox_pos = 'top:100%;'
            } else {
                dropbox_pos = 'bottom:100%;'
            }
        }
    }
    

</script>

<div bind:this={node_ref} class="bg-slate-50 h-6 text-slate-800 border border-blue-300 p-1 text-[11px] absolute" style="{style}"
    use:click_outside on:click_outside={()=> expand = false}>
    
    <div class="absolute bg-slate-50 w-full left-0 max-h-[100px] overflow-y-auto
        box-content border border-slate-300 {expand ? 'block' : 'hidden'}"
        style:height="{expand ? Math.min(items.length*item_height, 100) : 0}px" style="{dropbox_pos}">
        {#each items as item, index}
            <div class="box-border w-full flex flex-row p-0.5 pl-2 items-center hover:bg-blue-600 hover:text-slate-50
                {index != 0 ? 'border-t' : ''} border-slate-300" 
                style:height="{item_height}px"
                on:click={() => {
                    selected_index = index;
                    expand = false;
                }}>
                {item.name}
            </div>
        {/each}
    </div>  

    <div class="absolute inset-0 flex flex-row items-center pl-2"
        on:click={on_click_expand}>
        {items[selected_index]?.name}
    </div>
    {#if items.length > 1}
        <div class="absolute right-[1px] top-[1px] bottom-[1px] p-1 rounded bg-blue-200 border-2 border-slate-50 box-border" 
            style:width="{item_height-2}px" on:click={on_click_expand}>
            <svg class="w-full h-full fill-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
            </svg>
        </div>
    {/if}

</div>

<svelte:options accessors={true}></svelte:options>