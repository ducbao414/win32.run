<script>
    import * as utils from '../../utils';

    import _, { find, isEqual } from 'lodash';
    import TitleBar from './TitleBar.svelte';
    import Button from './Button.svelte';
    

    export let self;
    export let title = '';
    export let message = '';
    export let icon = '';
    export let buttons = [];
    export let button_align = 'right';//center, right


    export function destroy(){
        console.log(self);
        self.$destroy();
    }


</script>

<div class="z-20 dialog absolute inset-0 bg-slate-50/10 rounded-t-lg" on:click|self={(e) => {
    e.target.querySelector('div').classList.add('animate-blink');
    setTimeout(() => {
        e.target.querySelector('div').classList.remove('animate-blink');
    }, 400);
}}>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
        style:width="400px" style:height="150px">
        <TitleBar options={{title: title, maximize_btn: false, minimize_btn: false}} on_click_close={destroy}></TitleBar>
        <div class="grow p-2  bg-xp-yellow overflow-hidden flex flex-col justify-between border-t-0 border-2 border-blue-600">
            <div class="grow flex flex-row text-[11px] p-2 text-slate-800">
                {#if icon.length > 0}
                    <div class="w-8 h-8 mr-4 shrink-0 bg-contain" style:background-image="url({icon})"></div>
                {/if}
                <div>
                    {message}
                </div>
            </div>
            <div class="flex flex-row pb-1 items-center {button_align == 'center' ? 'justify-center' : 'justify-end'}">
                {#each buttons as button}
                    <Button title={button.name} on_click={button.action} focus={button.focus} style="margin-left:7px;margin-right:7px;"></Button>
                {/each}
            </div>
        </div>
    </div>
</div>


<svelte:options accessors={true}></svelte:options>
