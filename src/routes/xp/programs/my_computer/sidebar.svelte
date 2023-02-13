
<script>
    import {my_music_id, my_pictures_id} from '../../../../lib/system';
    import * as fs from '../../../../lib/fs';
    export let my_computer_instance = {};
    
    export let id;

    let hidden = {};

    $: menu = [
        {
            name: 'System Tasks',
            items: [
                ...id ? [{
                    name: 'Hide the contents of this drive',
                    icon: 'StartMenuProgramsAlt.png',
                    action: () => {}
                }] : [{
                    name: 'View System Information',
                    icon: 'explorerproperties.png',
                    action: () => {}
                }],
                
                {
                    name: 'Add or remove programs',
                    icon: 'Programs.png',
                    action: () => {console.log(id)}
                },

                ...id ? [{
                    name: 'Search for files or folders',
                    icon: 'Search.png',
                    action: () => {}
                }] : [{
                    name: 'Change a setting',
                    icon: 'ControlPanel.png',
                    action: () => {}
                }]
            ]
        },
        {
            name: 'Other Places',
            items: [
                {
                    name: 'My Computer',
                    icon: 'MyComputer.png',
                    action: () => { my_computer_instance.open(null) }
                },
                {
                    name: 'My Pictures',
                    icon: 'MyPictures.png',
                    action: () => { my_computer_instance.open(my_pictures_id) }
                },
                {
                    name: 'My Music',
                    icon: 'MyMusic.png',
                    action: () => { my_computer_instance.open(my_music_id) }
                },
                {
                    name: 'My Network Places',
                    icon: 'MyNetworkPlaces.png',
                    action: () => {}
                }
            ]
        },
        ...id ? [{
            name: 'File and Folder Tasks',
            items: [
                {
                    name: 'Make a new folder',
                    icon: 'NewFolder.png',
                    action: () => {
                        if(my_computer_instance.viewer.id){
                            fs.new_fs_item('folder', '', 'New Folder', my_computer_instance.viewer.id);
                        }
                    }
                },
                {
                    name: 'Publish this folder to the Web',
                    icon: 'Publishtoweb.png',
                    action: () => {}
                },
                {
                    name: 'Share this folder',
                    icon: 'SharedFolder.png',
                    action: () => {}
                }
            ]
        }] : [],
        
    ]
</script>

<div class="w-[220px] shrink-0 overflow-auto p-2"
    style:background="linear-gradient(rgb(137 155 253) 0%, rgb(84 104 212) 100%)">

    {#each menu as section}
    <div class="w-full overflow-hidden flex flex-col bg-blue-50 mt-2 
        {hidden[section.name] ? 'rounded' : 'rounded-t'}"
        style:background="linear-gradient(rgb(246 246 246) 0%, rgb(210 216 252) 100%)">
        <div class="grow-0 h-7 flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700"
            on:click={() => hidden[section.name] = !hidden[section.name]}>
            <div class="ml-3 leading-none text-slate-50 text-[12px] font-bold">{section.name}</div>
            <div class="shrink-0 w-4 h-4 mr-1 flex items-center justify-center rounded-full 
                border border-slate-100 bg-blue-600 shadow-2xl shadow-slate-50">
                
                {#if hidden[section.name]}
                <svg class="fill-slate-50 w-2 h-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"/>
                </svg>
                {:else}
                <svg class="fill-slate-50 w-2 h-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 109.3 361.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 301.3 361.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"/>
                </svg>
                {/if}
            </div>
        </div>
        <div class="overflow-hidden transition-all {hidden[section.name] ? 'h-0' : 'grow p-2'}">
            {#each section.items as item}
            <div class="flex flex-row items-center mt-2" on:click={item.action}>
                <div class="ml-1 w-5 h-5 bg-contain" style:background-image="url(/images/xp/icons/{item.icon})"></div>
                <p class="ml-2 mr-2 text-[12px] text-blue-600 leading-tight">{item.name}</p>
            </div>
            {/each}
        </div>
    </div>
    {/each}

</div>