<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import Tab from '../../../lib/components/xp/Tab.svelte';
    import CheckBox from '../../../lib/components/xp/CheckBox.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, hardDrive } from '../../../lib/store';
    import {icons} from '../../../lib/system';
    import * as utils from '../../../lib/utils';
    import _, { isEqual, map } from 'lodash';
    import * as finder from '../../../lib/finder';

    export let id;
    export let window;
    export let self;
    export let fs_item;
    export let exec_path;

    let details = {
        type: fs_item.type == 'drive' ? 'Local Disk' : 'Removable Storage',
        format: 'FAT32',
        used_space: size_cal(fs_item.id),
    }
    
    if(details.used_space > details.capacity){
        details.capacity = details.used_space;
    } else {
        details.capacity = fs_item.capacity;
    }
    details.free_space = details.capacity - details.used_space;

    onMount(() => {
        console.log(fs_item);
        draw_chart();
    })


    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }


    export let options = {
        title: 'Properties',
        min_width: 370,
        min_height: 570,
        width: 370,
        height: 570,
        icon: null,
        id: id,
        resizable: false,
        maximize_btn: false,
        minimize_btn: false,
        exec_path
    };

    function size_cal(id){
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

    function draw_chart(){
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(() => {
            var data = google.visualization.arrayToDataTable([
            ['space', 'size'],
            ['Used space',  details.used_space],
            ['Free space', details.free_space]
            ]);

            var options = {
            is3D: true,
            enableInteractivity: false,
            backgroundColor: 'transparent',
            chartArea: {height: '100%'},
            pieSliceText: 'none',
            pieSliceBorderColor: '#000',
            colors: ['#1d4ed8', '#ec4899' ],
            legend: {position: 'none'}
            };

            var chart = new google.visualization.PieChart(document.querySelector(`.window[program-id="${id}"] .chart`));
            chart.draw(data, options);
        });
        
    }



</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-1 p-2 pb-1  bg-xp-yellow overflow-hidden">
        <Tab size={'sm'} items={['General', 'Tools', 'Hardware', 'Sharing', 'Quota']} 
            selected={'General'}>
        </Tab>
        <div class="w-full grow bg-[#fafaf9]  shadow-sm -mt-[1px]  overflow-hidden p-2">

            <div class="flex flex-row border-b-slate-300 border-b p-2 items-center my-3">
                <div class="shrink-0 w-[70px]">
                    {#if fs_item.type == 'file'}
                        <div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/Default.png)] bg-contain"
                            style:background-image="{icons[fs_item.ext] != null ? `url(/images/xp/icons/${icons[fs_item.ext]})` : ''}">
                        </div>
                    {:else}
                        <div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/FolderClosed.png)] bg-contain"
                            style:background-image="{fs_item.icon == null ? '' : `url(${fs_item.icon})`}">
                        </div>
                    {/if}
                </div>
                <div class="grow ml-2">
                    <input disabled class="border w-full border-slate-400 outline-none text-[12px] pt-0.5 pl-0.5 pb-2" value="{fs_item.name}">
                </div>
            </div>

            
            <div class="flex flex-row px-2 my-3 text-[12px] text-slate-800">
                <div class="shrink-0 w-[70px]">
                    Type
                </div>
                <div class="grow ml-2">
                    {details.type}
                </div>
            </div>

            <div class="flex flex-row px-2 pb-2 my-3 text-[12px] text-slate-800 border-b border-slate-300">
                <div class="shrink-0 w-[70px]">
                    File System
                </div>
                <div class="grow ml-2">
                    {details.format}
                </div>
            </div>

            <div class="flex flex-row px-2 my-3 text-[12px] text-slate-800">
                <div class="shrink-0 w-[100px]">
                    <div class="w-3 h-3 inline-block bg-blue-700 border border-slate-700 mr-1"></div>
                    <span class="text-[12px]">Used space</span>
                </div>
                <div class="grow ml-2 flex justify-between">
                    <p>{(details.used_space*1024).toLocaleString()} bytes</p>
                    <p>{utils.formatBytes(details.used_space*1024)}</p>
                </div>
            </div>

            <div class="flex flex-row px-2 pb-2 my-3 text-[12px] text-slate-800 border-b border-slate-300">
                <div class="shrink-0 w-[100px]">
                    <div class="w-3 h-3 inline-block bg-pink-500 border border-slate-700 mr-1"></div>
                    <span class="text-[12px]">Free space</span>
                </div>
                <div class="grow ml-2 flex justify-between">
                    <p>{(details.free_space*1024).toLocaleString()} bytes</p>
                    <p>{utils.formatBytes(details.free_space*1024)}</p>
                </div>
            </div>

            <div class="flex flex-row px-2 pb-2 my-3 text-[12px] text-slate-800">
                <div class="shrink-0 w-[100px]">
                    <div class="w-3 h-3 inline-block mr-1"></div>
                    <span class="text-[12px]">Capacity</span>
                </div>
                <div class="grow ml-2 flex justify-between">
                    <p>{(details.capacity*1024).toLocaleString()} bytes</p>
                    <p>{utils.formatBytes(details.capacity*1024)}</p>
                </div>
            </div>

            <div class="chart w-full h-[100px]">
            </div>


            <div class="px-2 my-3 mb-6 text-[12px] text-slate-800">
                <CheckBox checked={false} label="Compress drive to save disk space"></CheckBox>
                <CheckBox checked={true} checkmark={false} label="Allow Indexing Service to index this disk for fast file searching" 
                    style="margin-top:10px;"></CheckBox>
            </div>
            

        </div>
        <div class="flex flex-row justify-end items-center px-1 pt-2 mt-1">
            <Button title="OK" style="margin-right:10px;" on_click={destroy}></Button>
            <Button title="Cancel" on_click={destroy}></Button>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>