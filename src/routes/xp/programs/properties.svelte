<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import Tab from '../../../lib/components/xp/Tab.svelte';
    import CheckBox from '../../../lib/components/xp/CheckBox.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, hardDrive } from '../../../lib/store';
    import {icons} from '../../../lib/system';
    import * as utils from '../../../lib/utils';
    import _, { isEqual } from 'lodash';
    import * as finder from '../../../lib/finder';

    export let id;
    export let window;
    export let self;
    export let fs_item;
    export let exec_path;

    let details = fs_item == null ? [] : [
        ['Type', fs_item.type.split('_').map(el => _.upperFirst(el)).join(' ')],
        ['Location', finder.to_url(fs_item.id)],
        
        ...fs_item?.type == 'file' ? [
            ['Size', utils.formatBytes(fs_item.size*1024)]
        ] : [
            ['Size', utils.formatBytes(size_cal(fs_item.id)*1024)]
        ],

        ...fs_item?.type == 'file' ? [
            ['Size on disk', utils.formatBytes(Math.ceil(fs_item.size*1024/4096)*4096)]
        ] : [
            ['Size on disk', utils.formatBytes(Math.ceil(size_cal(fs_item.id)*1024/4096)*4096)]
        ],

        ...fs_item?.type == 'file' ? [] : 
        [
            ['Contains', `${fs_item.children.filter(el => $hardDrive[el].type == 'file').length} Files, ${fs_item.children.filter(el => $hardDrive[el].type == 'folder').length} Folders`]
        ],
        ['Date Created', utils.timestamp_to_readable(fs_item.date_created)],
        ['Last Modified', utils.timestamp_to_readable(fs_item.date_modified)]
    ]

    onMount(() => {
        console.log(fs_item)
    })


    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }


    export let options = {
        title: 'Properties',
        min_width: 350,
        min_height: 460,
        width: 350,
        height: 460,
        icon: null,
        id: id,
        resizable: false,
        maximize_btn: false,
        minimize_btn: false,
        exec_path
    };

    function size_cal(id){
        console.log(id);
        let total_size = _.sum(
            $hardDrive[id]
            .children
            .map(el => $hardDrive[el])
            .filter(el => el.type == 'file')
            .map(el => el.size)
        );
        
        let folders = $hardDrive[id]
            .children
            .filter(el => $hardDrive[el].type == 'folder');
        for(let folder of folders){
            total_size += size_cal(folder);
        }
        return total_size;
    }

    function file_icon(item){
        if(item.icon != null){
            return `url(${item.icon})`
        }
        if(icons[item.ext] != null){ 
            return `url(/images/xp/icons/${icons[item.ext]})`
        }
        return null;
    }



</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-1 p-2 pb-1  bg-xp-yellow overflow-hidden">
        <Tab size={'sm'} items={['General', 'Sharing', 'Customize']} 
            selected={'General'}>
        </Tab>
        <div class="w-full h-[350px] grow bg-[#fafaf9]  shadow-sm -mt-[1px]  overflow-hidden overflow-y-auto  p-2">

            <div class="flex flex-row border-b-slate-300 border-b p-2 items-center my-3">
                <div class="shrink-0 w-[70px]">
                    {#if fs_item.type == 'file'}
                        <div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/Default.png)] bg-contain bg-no-repeat"
                            style:background-image="{file_icon(fs_item)}">
                        </div>
                    {:else}
                        <div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/FolderClosed.png)] bg-contain bg-no-repeat"
                            style:background-image="{fs_item.icon == null ? '' : `url(${fs_item.icon})`}">
                        </div>
                    {/if}
                </div>
                <div class="grow ml-2">
                    <input disabled class="border w-full border-slate-400 outline-none text-[11px] pt-0.5 pl-0.5 pb-2" value="{fs_item.name}">
                </div>
            </div>

            
            {#each details as detail}
                <div class="flex flex-row px-2 my-3 text-[12px] text-slate-800">
                    <div class="shrink-0 w-[70px]">
                        {detail[0]}
                    </div>
                    <div class="grow ml-2 {detail[0] == 'Location' ? 'break-all' : 'break-words'}">
                        {detail[1]}
                    </div>
                </div>
            {/each}

            <div class="flex flex-row px-2 my-3 mb-6 text-[12px] text-slate-800">
                <div class="shrink-0 w-[70px]">
                    Attributes
                </div>
                <div class="grow ml-2 flex flex-row justify-between items-start">
                    <div>
                        <CheckBox checked={false} checkmark={false}  label="Read-only"></CheckBox>
                        <CheckBox checked={false} label="Hidden" style="margin-top:10px;"></CheckBox>
                    </div>
                    <Button title="Advanced..."></Button>
                </div>
            </div>
            

        </div>
        <div class="flex flex-row justify-end items-center px-1 pt-2 mt-1">
            <Button title="OK" style="margin-right:10px;" on_click={destroy}></Button>
            <Button title="Cancel" on_click={destroy}></Button>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>