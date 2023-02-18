<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, zIndex, hardDrive, selectingItems, queueProgram } from '../../../lib/store'
    import {recycle_bin_id, icons} from '../../../lib/system';
    import Menu from '../../../lib/components/xp/Menu.svelte';
    import RButton from '../../../lib/components/xp/RButton.svelte';
    import Viewer from './my_computer/viewer.svelte';
    import * as finder from '../../../lib/finder'
    import Sidebar from './my_computer/sidebar.svelte';

    export let id;//this is the program id, don' confuse with file/folder id
    export let window;
    export let self;
    export let exec_path;

    export let fs_item;//fs: file system, i.e, files and folder
    let history = [fs_item?.id];
    let page_index = 0;
    $: url = finder.to_url(history[page_index]) || 'My Computer';
    $: {
        let curr_id = history[page_index];
        
        if(curr_id == null){
            window?.update_icon('/images/xp/icons/MyComputer.png');
            window?.update_title('My Computer');

        } else if(curr_id == recycle_bin_id) {
            window?.update_icon('/images/xp/icons/RecycleBinempty.png');
            window?.update_title('Recycle Bin');

        } else {
            let curr_item = $hardDrive[curr_id];
            if(curr_item){
                if(curr_item.icon){
                    window?.update_icon(curr_item.icon);
                } else {
                    window?.update_icon('/images/xp/icons/FolderClosed.png');
                }
                window?.update_title(curr_item.name);
            }
        }
    }

    export let viewer;

    let menu = [
        {
            name: 'File',
            items: [
                [
                    {
                        name: 'Create Shortcut',
                        disabled: true
                    }
                ],
                [
                    {
                        name: 'Close',
                        action: () => {destroy();}
                    }
                ]
            ]
        },
        
        {
            name: 'View',
            items: [
                [
                    {
                        name: 'Toolbars'
                    },
                    {
                        name: 'Status Bar'
                    },
                    {
                        name: 'Explorer Bar'
                    }
                ],
                [
                    {
                        name: 'Thumbnails'
                    },
                    {
                        name: 'Tiles'
                    },
                    {
                        name: 'Icons'
                    },
                    {
                        name: 'List'
                    },
                    {
                        name: 'Details'
                    }
                ],
                [
                    {
                        name: 'Choose Details...'
                    },
                    {
                        name: 'Go To'
                    },
                    {
                        name: 'Refresh'
                    }
                ]
            ]
        },
        {
            name: 'Favorites',
            items: [
                [
                    {
                        name: 'Add to Favorites...'
                    },
                    {
                        name: 'Organize Favorites'
                    }
                ],
                [
                    {
                        name: 'Links',
                        icon: '/images/xp/icons/FolderClosed.png'
                    },
                    {
                        name: 'MSN.com',
                        icon: '/images/xp/icons/URL.png'
                    },
                    {
                        name: 'Radio Station Guide',
                        icon: '/images/xp/icons/URL.png'
                    }
                ]
            ]
        },
        {
            name: 'Tools',
            items: [
                [
                    {
                        name: 'Map Network Drive...'
                    },
                    {
                        name: 'Disconnect Network Drive...'
                    },
                    {
                        name: 'Synchronize...'
                    }
                ],
                [
                    {
                        name: 'Folder Options...'
                    }
                ]
            ]
        },
        {
            name: 'Help',
            items: [
                [
                    {
                        name: 'Help and Support Center',
                        action: () => open_link('https://docs.win32.run')
                    },
                    {
                        name: 'Is this copy legal?',
                        action: () => open_link('https://docs.win32.run')
                    }
                ],
                [
                    {
                        name: 'About Windows',
                        action: () => open_link('https://docs.win32.run')
                    }
                ]
            ]
        }
    ]

    onMount(() => {
        
    })


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
   
    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title:  'My Computer' ,
        min_width: 500,
        min_height: 400,
        width: 700,
        height: 500,
        icon: '/images/xp/icons/MyComputer.png',
        id: id,
        exec_path
    };

    function file_icon(item){
        if(item == null) return null;
        if(item.icon != null){
            return `url(${item.icon})`
        }
        if(icons[item.ext] != null){ 
            return `url(/images/xp/icons/${icons[item.ext]})`
        }
        if(item.id == recycle_bin_id){
            return `url(/images/xp/icons/RecycleBinempty.png)`;
        }
        return null;
    }

    export function open(fs_id){
        if(fs_id == history[page_index]) return; 
        console.log('open', fs_id);
        console.log($hardDrive[fs_id]);
        history = [...history.slice(0, page_index+1), fs_id];
        page_index = history.length - 1;
    }

    function back(){
        page_index = Math.max(0, page_index - 1);
    }

    function next(){
        page_index = Math.min(history.length - 1, page_index + 1);
    }

    export function up(){
        let parent_id = $hardDrive[history[page_index]].parent;
        open(parent_id);
    }

    function open_link(link){
        queueProgram.set({
            path: './programs/internet_explorer.svelte',
            fs_item: {url: link}
        })
    }

</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-0.5 flex flex-col bg-xp-yellow overflow-hidden">
        <div class="shrink-0 w-full border-b border-stone-300 flex flex-row items-center justify-between">
            <Menu menu={menu}></Menu>
            <div class="w-[40px] h-full bg-slate-50  flex items-center justify-center">
                <div class="w-[20px] h-[20px] bg-[url(/images/ms.png)] bg-contain bg-center bg-no-repeat"></div>
            </div>
        </div>
        <div class="shrink-0 flex flex-row items-center border-b border-stone-300">
            <RButton icon="/images/xp/icons/Back.png" title="Back" 
                    on_click={back}
                    expandable={true} disabled={page_index == 0} tooltip_message="Back to Previous"></RButton>
            <RButton icon="/images/xp/icons/Forward.png" 
                    on_click={next}
                    expandable={true} disabled={page_index == history.length-1}></RButton>

            <RButton icon="/images/xp/icons/Up.png" 
                on_click={up}
                disabled={history[page_index] == null} ></RButton>

            <div class="w-[1px] h-full py-1">
                <div class=" w-full h-full border-l border-stone-300"></div>
            </div>

            <RButton icon="/images/xp/icons/Search.png" title="Search"></RButton>
            <RButton icon="/images/xp/icons/FolderView.png" title="Folders"></RButton>

            <div class="w-[1px] h-full py-1">
                <div class=" w-full h-full border-l border-stone-300"></div>
            </div>

            <RButton icon="/images/xp/icons/FolderView-Classic.png" expandable={true}></RButton>
        </div>
        <div class="shrink-0 flex flex-row items-center border-b border-stone-300 text-[11px] items-center">
            <span class="px-2 text-slate-800">Address</span>
            <div class="grow h-[25px] relative">
                <input class="absolute inset-0 pl-7 outline-none" type="text" 
                on:click={(e) => e.target.select()} on:keyup={on_user_input} value="{url}">
                <div class="w-[17px] h-[17px] absolute top-[4px] left-[4px] 
                    {history[page_index] == null ? 'bg-[url(/images/xp/icons/MyComputer.png)]' : 'bg-[url(/images/xp/icons/FolderClosed.png)]'} bg-contain"
                    style:background-image="{file_icon($hardDrive[history[page_index]])}">
                </div>
            </div>
            <div class="w-[30px] h-[20px] bg-[url(/images/xp/icons/Go.png)] bg-center bg-contain bg-no-repeat"></div>
        </div>
        
        <div class="grow flex flex-row overflow-hidden">
            <Sidebar my_computer_instance={self} id={history[page_index]} ></Sidebar>
            <div class="grow relative bg-blue-100">
                <Viewer bind:this={viewer} self={viewer} id={history[page_index]} 
                    on:open={(e) => open(e.detail.id)} my_computer_instance={self}>
                </Viewer>
            </div>
        </div>
        
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>