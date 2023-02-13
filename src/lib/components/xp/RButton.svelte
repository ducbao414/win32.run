<script>
    import {tooltip} from './tooltip';
    export let title = '';
    export let icon = '';
    export let style = '';
    export let tooltip_message = '';
    export let disabled = false;
    export let expandable = false;

    export let on_click = () => {
    }
</script>

<div class="p-2 h-min flex flex-row bg-xp-yellow rounded items-center {!disabled ? 'hover:brightness-105 hover:shadow' : ''}" 
    use:tooltip tooltip="{tooltip_message}"
    on:click={() => {
        if(!disabled){
            on_click();
        }
    }}>
    <div class="h-[25px] w-[25px] bg-contain bg-no-repeat {disabled? 'grayscale' : ''}" style:background-image="url({icon})">
    </div>
    {#if title.trim() != ''}
        <div class="text-[12px] text-slate-900 ml-2">{title}</div>
    {/if}
    {#if expandable}
        <div class="w-[10px] ml-1">
            <svg class="{disabled ? 'fill-gray-400' : 'fill-slate-700'} group-hover:fill-slate-50 w-[10px] h-[10px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
        </div>
    {/if}
</div>