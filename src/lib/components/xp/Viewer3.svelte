<script>
    import { contextMenu, hardDrive } from '../../store'
    import {my_computer} from '../../../lib/system';
    
    import * as finder from '../../finder';
    import * as utils from '../../utils';
    import { doctypes, icons, hidden_items, previewable_exts } from '../../system';
    import * as fs from '../../fs';
    const {click_outside} = utils;
    import { createEventDispatcher, onMount, tick } from 'svelte';
    import short from 'short-uuid';
    import {get, set} from 'idb-keyval';
    import { filter, indexOf, map } from 'lodash';
    import Button from './Button.svelte';
    import SelectBox from './SelectBox.svelte';
    import Previewable from './Previewable.svelte';
    let dispatch = createEventDispatcher();


    export let id;
    let history = [id];
    let page_index = 0;
    $: url = finder.to_url(history[page_index]) || 'My Computer';
    
    $: items =  $hardDrive[id] == null ? 
        [] : 
        $hardDrive[id]
        .children
        .map(id => $hardDrive[id])
        .filter(el => el != null)
        .filter(el => !hidden_items.includes(el.id));

    let computer = my_computer.map(el => $hardDrive[el]);

    export let selected_filetype;
    export let filetypes = [];
    export let filename = '';
    export let select_box;

    function is_desired(item){
        return true;
    }


    export function open(item_id){
        let fs_item = $hardDrive[item_id];
        if(fs_item?.type == 'file'){
            
        } else {
            history = [...history.slice(0, page_index+1), item_id];
            page_index = history.length - 1;
            id = history[page_index];
        }
        
    }

    function back(){
        page_index = Math.max(0, page_index - 1);
        id = history[page_index];
    }

    function next(){
        page_index = Math.min(history.length - 1, page_index + 1);
        id = history[page_index];
    }

    function up(){
        let parent_id = $hardDrive[history[page_index]].parent;
        open(parent_id);
    }

    function file_icon(item){
        if(item == null) return null;
        if(item.icon != null){
            return `url(${item.icon})`
        }
        if(icons[item.ext] != null){ 
            return `url(/images/xp/icons/${icons[item.ext]})`
        }
        return null;
    }

    function on_user_input(e){
        if(e.key == 'Enter'){
            let id = finder.to_id(e.target.value);
            
            if(id == null){
                id = finder.to_id_nocase(e.target.value);
            }
            console.log('found id', id);
            if(id){
                open(id);
                e.target.blur();
            }
        }
    }

    export let on_save = () => {}
    export let on_cancel = () => {}

</script>


<div class="absolute inset-0 bg-xp-yellow">
    <div class="absolute inset-1 top-0.5 h-6 mb-2 flex flex-row items-center text-[11px]">
        <div class="h-full w-[300px] relative">
            <input class="absolute inset-0 w-[300px] pl-7 border border-blue-300 outline-none" type="text" 
                on:click={(e) => e.target.select()} on:keyup={on_user_input} value="{url}">
            <div class="w-[17px] h-[17px] absolute top-[4px] left-[4px] bg-no-repeat
                {id == null ? 'bg-[url(/images/xp/icons/MyComputer.png)]' : 'bg-[url(/images/xp/icons/FolderClosed.png)]'} bg-contain"
                style:background-image="{file_icon($hardDrive[id])}">
            </div>
        </div>
        <button class="mx-1.5 ml-4 w-4 h-4 bg-[url(/images/xp/icons/Back.png)] bg-contain disabled:grayscale"
            disabled={page_index == 0}
            on:click={back}>
        </button>

        <button class="mx-1.5 w-4 h-4 bg-[url(/images/xp/icons/Forward.png)] bg-contain disabled:grayscale"
            disabled={page_index == history.length-1}
            on:click={next}>
        </button>

        <button class="mx-1.5 w-5 h-5 bg-[url(/images/xp/icons/Up.png)] bg-contain disabled:grayscale"
            disabled={history[page_index] == null}
            on:click={up}>
        </button>

    </div>
    <div class="absolute top-7 left-1 right-1 h-[360px] overflow-auto bg-slate-50 border border-blue-300" class:hidden={id == null}>
        {#each items as item (item.id)}
            <div fs-id="{item.id}" class="w-[100px] overflow-hidden m-2 inline-flex flex-row items-center font-MSSS relative
                {is_desired(item) ? '' : 'opacity-50'}" 
                on:dblclick={() => open(item.id)}>
                {#if previewable_exts.includes(item.ext)}
                    <Previewable size={30} default_icon={file_icon(item)} fs_id={item.id}></Previewable>
                {:else}
                    <div class="w-[30px] h-[30px] shrink-0 bg-contain bg-no-repeat
                        {item.type == 'folder' ? 'bg-[url(/images/xp/icons/FolderClosed.png)]' : 'bg-[url(/images/xp/icons/Default.png)]'} "
                        style:background-image="{file_icon(item)}">
                    </div>
                {/if}
                <p class="px-1 text-[11px] break-words line-clamp-2 text-ellipsis leading-tight">
                    {item.name}
                </p>
                
            </div>
        {/each}

        
    </div>

    <div class="absolute top-7 left-1 right-1 h-[360px] overflow-auto bg-slate-50 border border-blue-300" class:hidden={id != null}>

        <p class="ml-2 mt-0.5 font-MSSS text-black text-[11px] font-bold">Files Stored on This Computer</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        {#each computer.filter(el => el.type == 'folder') as item}
            <div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS" 
                on:dblclick={() => open(item.id)}>
                <div class="w-[40px] h-[40px] shrink-0 bg-[url(/images/xp/icons/FolderClosed.png)] bg-contain"
                    style:background-image="{item.icon == null ? '' : `url(${item.icon})`}">
                </div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">
                    {item.display_name != null ? item.display_name : item.name}
                </div>
            </div>
        {/each}

        <p class="ml-2 mt-4 font-MSSS text-black text-[11px] font-bold">Hard Disk Drives</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        {#each computer.filter(el => el.type == 'drive') as item}
            <div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS" 
                on:dblclick={() => open(item.id)}>
                <div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/LocalDisk.png)] bg-contain">
                </div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">
                    {item.display_name != null ? item.display_name : item.name}
                </div>
            </div>
        {/each}

        <p class="ml-2 mt-4 font-MSSS text-black text-[11px] font-bold">Devices with Removable Storage</p>
        <div class="mb-4 w-[300px] h-[2px] bg-gradient-to-r from-blue-500 to-slate-50"></div>
        {#each computer.filter(el => el.type == 'removable_storage') as item}
            <div class="w-[150px] ml-4 mr-8 overflow-hidden inline-flex flex-row items-center font-MSSS" 
                on:dblclick={() => open(item.id)}>
                <div class="w-[50px] h-[50px] shrink-0 bg-[url(/images/xp/icons/RemovableMedia.png)] bg-contain">
                </div>
                <div class="px-1 text-[11px] line-clamp-2 text-ellipsis leading-tight">
                    {item.display_name != null ? item.display_name : item.name}
                </div>
            </div>
        {/each}
    </div>

    <div class="absolute bottom-1 right-1 left-1 h-[70px] text-[11px] text-black">
        <div class="absolute top-0 right-0 left-0 h-[35px] flex flex-row items-center">
            <div class="w-[100px] shrink-0">File name:</div>
            <div class="grow">
                <input type="text" bind:value={filename} 
                    on:keyup={(e) => {
                        if(e.key == 'Enter' && id != null && filename.length > 0){
                            on_save();
                        }
                    }}
                    class="w-full h-6 text-[11px] outline-none border border-blue-300 disabled:bg-slate-50">
            </div>
            <div class="w-[100px] shrink-0 flex flex-row justify-end ">
                <Button title="Save" on_click={on_save} disabled={filename.length == 0 || id == null}></Button>
            </div>
        </div>
        <div class="absolute bottom-0 right-0 left-0 h-[35px] flex flex-row items-center justify-between">
            <div class="w-[100px] shrink-0">Save as type:</div>
            <SelectBox 
                style="left:100px;right:100px;bottom:5px;"
                bind:this={select_box} items={filetypes}
                selected_index={filetypes.indexOf(selected_filetype) >= 0 ? filetypes.indexOf(selected_filetype) : 0}>
            </SelectBox>
            <div class="w-[100px] shrink-0 flex flex-row justify-end ">
                <Button title="Cancel" on_click={on_cancel}></Button>
            </div>
        </div>
    </div>
</div>



<svelte:options accessors={true}></svelte:options>