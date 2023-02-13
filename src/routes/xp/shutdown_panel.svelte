<script>
    import Button from "../../lib/components/xp/Button.svelte";
    import {queueCommand} from '../../lib/store';

    export let self;

    export function destroy(){
        self.$destroy();
    }

</script>
<div class="z-50 inset-0 absolute font-sans">
    <div class="absolute inset-0 backdrop-grayscale animate-fadein">
    </div>
    <div class="absolute inset-0 bottom-32 text-white flex items-center justify-center">
        <div class="w-[300px] h-[200px] bg-blue-700 flex flex-col">
            <div class="w-full h-[40px] p-2 shrink-0 flex flex-row items-center justify-between">
                <p>Turn off computer</p>
                <img class="h-full" src="/images/ms.png">
            </div>
            <div class="h-[2px] bg-[linear-gradient(45deg,#466dcd,#c7ddff,#b0c9f7,#5a7edc)] shrink-0"></div>
            <div class="w-full grow bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500">
                <div class="mx-[50px] h-full flex flex-row justify-between items-center text-[12px] font-bold">
                    <div class="flex flex-col items-center justify-center brightness-50">
                        <img class="w-8 h-8 bg-[url(/images/xp/icons/Standby.png)] bg-contain bg-no-repeat mb-1">
                        <p>Standby</p>
                    </div>
                    <div class="flex flex-col items-center justify-center group" on:click={() => queueCommand.set('shutdown')}>
                        <img class="group-hover:brightness-110 w-8 h-8 bg-[url(/images/xp/icons/Power.png)] bg-contain bg-no-repeat mb-1">
                        <p>Power</p>
                    </div>
                    <div class="flex flex-col items-center justify-center group" on:click={() => queueCommand.set('restart')}>
                        <img class="group-hover:brightness-110 w-8 h-8 bg-[url(/images/xp/icons/Restart.png)] bg-contain bg-no-repeat mb-1">
                        <p>Restart</p>
                    </div>
                </div>
            </div>
            <div class="w-full h-[40px] p-2 shrink-0 flex flex-row-reverse items-center text-slate-800">
                <Button title="Cancel" on_click={destroy}></Button>
            </div>
        </div>
    </div>
</div>
<svelte:options accessors={true}></svelte:options>