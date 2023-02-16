<script>
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    import { faker } from '@faker-js/faker';
    import * as utils from '../../../lib/utils';
    import { onMount, createEventDispatcher } from 'svelte';

    let dispatcher = createEventDispatcher();
    let status_bar;

    let messages = [
        {l: 'Press F6 if you need to install a third party SCSI or RAID Driver', d: 2000},
        {l: 'Press F2 to run Automated System Recovery (ASR)...', d: 2000},
        ...(() => {
            let a = new Array(12);
            for(let i = 0; i < a.length; i++){
                a[i] = {l: 'Setup is loading files ' + faker.system.directoryPath() + '...', d: utils.random_int(2, 7)*50};
            }
            return a;
        })(),
        {l: 'Setup is starting Windows', d: 2000}
    ]

    onMount(async () => {
        await status_bar.display(messages);
        dispatcher('load_page', {'url': './installation/dos/welcome.svelte'});
    })



</script>

<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi">
    <div class=" mt-4 text-xl font-bold text-slate-400 inline-block">
        <p class="px-2">Windows XP Professional Setup</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div>
    </div>
</div>

<StatusBar bind:this={status_bar} />