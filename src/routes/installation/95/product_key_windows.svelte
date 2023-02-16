<script>
    import Window from '../../../lib/components/95/Window.svelte';
    import Button from '../../../lib/components/95/Button.svelte';
    import {onMount} from 'svelte';

    let window;

    onMount(() => {
    })

    export let options = {
        title: 'Windows XP Professional Setup',
        min_width: 600,
        min_height: 400,
        width:600,
        height: 400,
        minimize_btn_disabled: true,
        maximize_btn_disabled: true,
        close_btn_disabled: true
    };

    export let on_click_next = () => {
        console.log('on click next');
    }

</script>

<Window options={options} bind:this={window} self={window}>
    
    <div slot="content" class="absolute inset-0 flex flex-col font-MSSS">
        <div class="bg-white p-2 shrink-0 flex justify-between shadow-sm">
            <div class="">
                <p class="font-semibold ml-4 text-black text-sm">Your Product Key</p>
                <p class="ml-8 mt-2 text-black text-sm">Your Product Key uniquely identifies your copy of Windows XP.</p>
            </div>
            <div class="ml-12">
                <img src="/images/95/0.png" width="50" alt="">
            </div>
        </div>
        <div class="p-4 shadow flex">
            <div class="bg-black shrink-0">
                <div class="p-2 h-full w-full bg-yellow-500 rounded-md text-sm text-black">
                    <p>
                        <span>
                            <svg class="fill-black h-3 mb-1 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/></svg>
                        </span>
                        <span>
                            PRODUCT KEY:
                        </span>
                    </p>
                    <p class="mt-2">zzzzz-zzzzz-zzzzz-zzzzz-zzzzz</p>
                </div>
            </div>
            <div class="ml-4 text-black text-sm max-w-[400px]">
                <p>The 25-character Product Key appears on the yellow sticker on the back of your Windows CD folder.</p>
                <p class="mt-4">Type the Product Key below:</p>
            </div>
        </div>
        <div class="p-2 py-4 shadow-sm grow">
            <p class="mb-2 text-black text-sm">Product Key:</p>
            {#each [0,1,2,3,4] as index}
            <input style="background-color: #fff;
            box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
            box-sizing: border-box;
            padding: 3px 4px;" type="text" class="h-6 w-[85px] text-center focus:outline-none text-black font-bold uppercase" maxlength="5" id="product_key_part_{index}"
            on:input={(event) => {
                if(event.target.value.length == 5){
                    document.querySelector(`#product_key_part_${index+1}`).focus();
                }
            }}>
            {#if index < 4}
                <div class="w-6 text-center inline-block">-</div>
            {/if}
            {/each}
        </div>

        <div class="p-8 pb-4 shadow-sm shrink-0 flex justify-end">
            <Button title="< Back" disabled={true} style="width:100px;margin-right:10px;"></Button>
            <Button on_click={on_click_next} title="Next >" style="width:100px;"></Button>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>