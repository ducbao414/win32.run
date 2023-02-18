<script>
    import { contextMenu, selectingItems, zIndex, clipboard, hardDrive, clipboard_op, queueProgram } from '../../lib/store'
    
    import * as utils from '../../lib/utils';
    import { doctypes, icons, desktop_folder, previewable_exts } from '../../lib/system';
    import * as fs from '../../lib/fs';
    const {click_outside} = utils;
    import {  onMount, tick } from 'svelte';
    import short from 'short-uuid';
    import {get, set} from 'idb-keyval';
    import { filter, map, transform } from 'lodash';
    import DragSelect from 'dragselect';
    import RecycleBin from '../../lib/components/xp/RecycleBin.svelte';
    import { parse_dir } from '../../lib/dir_parser';
    import Previewable from '../../lib/components/xp/Previewable.svelte';
    

    let id = desktop_folder;
    
    $: items =  $hardDrive[id] == null ? 
        [] : 
        $hardDrive[id]
        .children
        .map(id => $hardDrive[id])
        .filter(el => el != null);

    let is_focus = true;
    let node_ref;
    let cell_size = 80;

    export let renaming = false;

    const ds = new DragSelect({
        customStyles: false,
        draggability: true
    });

    ds.subscribe('callback', (e) => {
        for(let node of e.items){
            let fs_id = node.getAttribute('fs-id');
            if(fs_id == null) continue;
            if($hardDrive[fs_id] == null) continue;
            if(utils.is_empty(node.style.transform)) continue;

            $hardDrive[fs_id]['desktop_css_transform'] = node.style.transform;
        }
        $selectingItems = e.items
        .map(el => el.getAttribute('fs-id'))
        .filter(el => $hardDrive[el] != null);
        console.log($selectingItems.map(el => $hardDrive[el]));
    });
    const observer = new MutationObserver(mutations => {
        ds.setSettings({
            selectables: node_ref ? node_ref.querySelectorAll('.fs-item') : []
        })
    });

    onMount(async () => {
        ds.setSettings({
            selectables: node_ref.querySelectorAll('.fs-item'),
            area: node_ref
        })
        observer.observe(node_ref, {attributes: false, childList: true, characterData: false, subtree:true});
        
    })
    

    function on_rightclick(ev, item){
        let selected = $selectingItems.includes(item.id);
        let el = node_ref.querySelector(`.fs-item[fs-id="${item.id}"]`);

        if(!selected && el && el.classList.contains('fs-item')){
            if(ev.metaKey || ev.ctrlKey){
                ds.addSelection([el], true);
            } else {
                ds.setSelection([el], true);
            }
        }

        contextMenu.set(null);

        let originator = {item};
        originator.open = (id) => {open(id)};
        originator.rename = () => { rename()}

        contextMenu.set({x: ev.x, y: ev.y, type: 'FSItem', originator: originator});
    }

    

    function show_void_menu(ev){
        let originator= {id};
        contextMenu.set({x: ev.x, y: ev.y, type: 'Desktop', originator});
    }

    function clear_selection(){
        console.log('clear_selection');
        ds.clearSelection(true);
    }


    function open(id){
        is_focus = false;
        clear_selection();
        let fs_item = $hardDrive[id];
        if(fs_item.type == 'file'){
            if(fs_item.executable){
                queueProgram.set({
                    path: fs_item.url,
                    webapp: fs_item.webapp
                })
            } else if(doctypes[fs_item.ext] != null){
                queueProgram.set({
                    path: doctypes[fs_item.ext][0].path,
                    fs_item: fs_item
                })
            } else {
                queueProgram.set({
                    path: './programs/notepad.svelte',
                    fs_item: fs_item
                })
            }
        } else {
            queueProgram.set({
                    path: './programs/my_computer.svelte',
                    fs_item: fs_item
                })
        }
        
    }

    function rename(){
        renaming = true;
        tick()
        .then(() => {
            let id = $selectingItems[0];
            let el = document.querySelector(`div[fs-id="${id}"] textarea`);
            let end_range = $hardDrive[id].basename.length;
            if(el != null) el.setSelectionRange(0, end_range);
        });
    }


    
    function end_renaming(e, item){
        let name = utils.sanitize_filename(e.target.value);

        let ext = utils.extname(name);
        let seedname = utils.basename(name, ext);
        let basename = seedname;

        item.ext = ext.toLowerCase();

        if(basename.trim() == ''){
            renaming = false;
            return;
        }
        
        let parent_items_names = [
            ...$hardDrive[item.parent].children.filter(el => el != item.id).map(el => $hardDrive[el].name),
        ]
        let appendix = 2;
        while(parent_items_names.includes(basename + item.ext)){
            basename = seedname + ' ' + appendix;
            appendix++;
        }
        $hardDrive[item.id].basename = basename;
        $hardDrive[item.id].ext = item.ext;
        $hardDrive[item.id].name = basename + item.ext;
        
        renaming = false;
    }

    function on_keydown(e){
        if(!is_focus) return;
        if(renaming) return;
        if(id == null) return;
        console.log('keyevent in desktop_folder');

        if(!(e.ctrlKey || e.metaKey)) return;
        if(e.key == 'c'){
            fs.copy();
        } else if(e.key == 'x'){
            fs.cut();
        } else if(e.key == 'v'){
            fs.paste(id);
        } else if(e.key == 'a'){
            let els = node_ref.querySelectorAll('.fs-item');
            ds.setSelection(els, true);
        }
    }

    async function on_drop(e){
        e.preventDefault();
        if(id == null) return;

        let copying_obj = await parse_dir(e);
        queueProgram.set({
            path: './programs/copier.svelte',
            copying_obj,
            target_folder_id: id
        })

    }

    function on_drop_over(e){
        e.preventDefault();
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


<div class="absolute z-0 inset-0 overflow-hidden bg-transparent"
    on:drop={on_drop} on:dragover={on_drop_over}
    on:click={() => is_focus = true}
    use:click_outside on:click_outside={() => {
        is_focus = false;
    }}
    on:contextmenu|self={show_void_menu}
    bind:this={node_ref}>

    <div class="top-0 left-0 bottom-0 absolute flex flex-col flex-wrap" 
        class:hidden={id == null}>
        {#each items as item, index (item.id)}

            <div fs-id="{item.id}" class="relative fs-item w-[150px] flex-shrink-0 flex-grow-0 overflow-hidden m-2 inline-flex flex-col items-center font-MSSS" 
                on:dblclick={() => open(item.id)} on:contextmenu={(e) => on_rightclick(e, item)}
                style:transform="{item.desktop_css_transform}"
                style:width="{cell_size}px"
                style:height="{cell_size}px">
                {#if previewable_exts.includes(item.ext)}
                    <Previewable size={40} default_icon={file_icon(item)} fs_id={item.id}></Previewable>
                {:else}
                    <div class="w-[40px] h-[40px] shrink-0 bg-contain bg-no-repeat bg-center
                        {$clipboard.includes(item.id) && $clipboard_op == 'cut' ? 'opacity-70' : ''}
                        {item.type == 'folder' ? 'bg-[url(/images/xp/icons/FolderClosed.png)]' : 'bg-[url(/images/xp/icons/Default.png)]'} "
                        style:background-image="{file_icon(item)}">
                    </div>
                {/if}
                <p class="px-1 mx-0.5 text-[11px] break-words line-clamp-2 text-ellipsis leading-tight text-center text-white
                    {$selectingItems?.includes(item.id) && is_focus ? 'bg-blue-600 text-slate-50' : ''}"
                    style="text-shadow: 1px 1px 2px black;">
                    {item.executable ? item.basename : item.name}
                </p>
                {#if $selectingItems.includes(item.id) && renaming}
                    <textarea
                        autofocus
                        on:keydown={e => e.key == 'Enter' && end_renaming(e, item)}
                        on:blur={(e) => end_renaming(e, item)}
                        class="absolute max-h-[40px] left-0 top-[40px] right-0 bottom-0 overflow-hidden 
                        outline-none border-1 border-slate-900 text-[11px] font-MSSS z-50 resize-none"
                    >{item.name}</textarea>
                {/if}
                
            </div>

        {/each}
        
    </div>

    <RecycleBin style="width: {cell_size}px;height: {cell_size}px;"></RecycleBin>

</div>

<svelte:options accessors={true}></svelte:options>
<svelte:window on:keydown={on_keydown}></svelte:window>