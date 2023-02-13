<script>
    
    export let options = {};

    let {close_btn=true, maximize_btn=true, minimize_btn=true, 
        close_btn_disabled=false, maximize_btn_disabled=false, minimize_btn_disabled=false, 
        title=''} = options;

    export let on_click_maximize = () => {}
    export let on_click_minimize = () => {}
    export let on_click_close = () => {}
</script>

<div class="titlebar flex items-center justify-between bg-[linear-gradient(90deg,navy,#1084d0)] p-0.5 font-MSSS">
    <p class="text-white font-semibold mr-4 text-sm ml-1 mb-1">{title}</p>
    <div class="flex">
        {#if minimize_btn}
            <button disabled={minimize_btn_disabled} on:click={on_click_minimize}
                class="group w-4 h-4 ml-1 bg-[#c0c0c0]" style="box-shadow:inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf">
                <svg class="fill-black group-disabled:fill-gray-500 w-3 h-3 m-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z"/></svg>
            </button>
        {/if}
        {#if maximize_btn}
            <button disabled={maximize_btn_disabled} on:click={on_click_maximize}
                class="group w-4 h-4 ml-1 bg-[#c0c0c0]" style="box-shadow:inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf">
                <svg class="fill-black group-disabled:fill-gray-500 w-3 h-3 m-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M7.724 65.49C13.36 55.11 21.79 46.47 32 40.56C39.63 36.15 48.25 33.26 57.46 32.33C59.61 32.11 61.79 32 64 32H448C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 93.79 .112 91.61 .3306 89.46C1.204 80.85 3.784 72.75 7.724 65.49V65.49zM48 416C48 424.8 55.16 432 64 432H448C456.8 432 464 424.8 464 416V224H48V416z"/></svg>
            </button>
        {/if}
        {#if close_btn}
            <button disabled={close_btn_disabled} on:click={on_click_close}
                class="group w-4 h-4 ml-1 bg-[#c0c0c0]" style="box-shadow:inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf">
                <svg class="fill-black group-disabled:fill-gray-500 w-3 h-3 m-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
            </button>
        {/if}
        
    </div>
</div>

<svelte:options accessors={true}></svelte:options>