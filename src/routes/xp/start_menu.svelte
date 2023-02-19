<script>
    import {hardDrive, queueProgram } from '../../lib/store';
    import { my_pictures_id, my_music_id } from '../../lib/system';
    import * as utils from '../../lib/utils';
    const { click_outside } = utils;

    let col_1 = [
        {
            name: 'Internet Explorer',
            icon: '/images/xp/icons/InternetExplorer6.png',
            path: './programs/internet_explorer.svelte',
            font: 'bold'
        },
        {
            name: 'Microsoft Word 2003',
            icon: '/images/xp/icons/MSWord.png',
            path: './programs/microsoft_word.svelte',
            font: 'bold'
            
        },
        null,
        {
            name: 'Media Player Classic',
            icon: '/images/xp/icons/MPC.png',
            path: './programs/media_player_classic.svelte',
            
        },
        {
            name: 'Foxit Reader',
            icon: '/images/xp/icons/FoxitReader.png',
            path: './programs/foxit_reader.svelte',
            
        },
        {
            name: 'Koodo Reader',
            icon: '/images/xp/icons/Koodo.png',
            path: './programs/koodo.svelte',
            
        },
        {
            name: 'Photon',
            icon: '/images/xp/icons/Photon.png',
            path: './programs/photon.svelte',
            
        },
        {
            name: 'Paint',
            icon: '/images/xp/icons/Paint.png',
            path: './programs/paint.svelte',
            
        },
        {
            name: 'Tour Windows XP',
            icon: '/images/xp/icons/TourXP.png',
            path: './programs/xp_tour.svelte',
            
        },
    ]

    let col_2 = [
        {
            name: 'My Pictures',
            icon: '/images/xp/icons/MyPictures.png',
            path: './programs/my_computer.svelte',
            fs_item: {id: my_pictures_id},
            font: 'bold'
        },
        {
            name: 'My Music',
            icon: '/images/xp/icons/MyMusic.png',
            path: './programs/my_computer.svelte',
            fs_item: {id: my_music_id},
            font: 'bold'
        },
        {
            name: 'My Computer',
            icon: '/images/xp/icons/MyComputer.png',
            path: './programs/my_computer.svelte',
            font: 'bold'
        },
        null,
        {
            name: 'Control Panel',
            icon: '/images/xp/icons/ControlPanel.png',
            path: ''
        },
        {
            name: 'Display Properties',
            icon: '/images/xp/icons/DisplayProperties.png',
            path: './programs/display_properties.svelte',
        },
        {
            name: 'Help and Support',
            icon: '/images/xp/icons/HelpandSupport.png',
            path: './programs/webapp.svelte',
            link: 'https://docs.win32.run'
        },
        null,
        {
            name: 'Installer',
            icon: '/images/xp/icons/Programs.png',
            path: './programs/app_installer.svelte'
        },
        {
            name: 'Search',
            icon: '/images/xp/icons/Search.png',
            path: ''
        },
        {
            name: 'Run...',
            icon: '/images/xp/icons/Run.png',
            path: ''
        }
    ]

    let programs = [
        {
            name: 'Display Properties',
            icon: '/images/xp/icons/DisplayProperties.png',
            path: './programs/display_properties.svelte',
        },
        {
            name: 'Windows Catalog',
            icon: '/images/xp/icons/WindowsCatalog.png',
            path: ''
        },
        {
            name: 'Windows Update',
            icon: '/images/xp/icons/WindowsUpdate.png',
            path: ''
        },
        null,
        {
            name: 'Accessories',
            icon: '/images/xp/icons/StartMenuPrograms.png',
            top: '-100px',
            items: [
                {
                    name: 'Accessibility',
                    icon: '/images/xp/icons/StartMenuPrograms.png',
                    items: [
                        {
                            name: 'Accessibility Wizard',
                            icon: '/images/xp/icons/AccessibilityWizard.png',
                            path: ''
                        },
                        {
                            name: 'Magnifier',
                            icon: '/images/xp/icons/Magnifier.png',
                            path: ''
                        },
                        {
                            name: 'Narrator',
                            icon: '/images/xp/icons/Narrator.png',
                            path: ''
                        },
                        {
                            name: 'On-Screen Keyboard',
                            icon: '/images/xp/icons/On-ScreenKeyboard.png',
                            path: ''
                        },
                        {
                            name: 'Utility Manager',
                            icon: '/images/xp/icons/BAT.png',
                            path: ''
                        },
                    ]
                },
                {
                    name: 'Communications',
                    icon: '/images/xp/icons/StartMenuPrograms.png',
                    items: [
                        {
                            name: 'Hyper Terminal',
                            icon: '/images/xp/icons/HyperTerminal.png',
                            path: ''
                        },
                        {
                            name: 'Network Connections',
                            icon: '/images/xp/icons/NetworkConnections.png',
                            path: ''
                        },
                        {
                            name: 'Network Setup Wizard',
                            icon: '/images/xp/icons/NetworkSetup.png',
                            path: ''
                        },
                        {
                            name: 'New Connection Wizard',
                            icon: '/images/xp/icons/NewNetworkConnection.png',
                            path: ''
                        },
                        {
                            name: 'Wireless Network Setup Wizard',
                            icon: '/images/xp/icons/WirelessNetworkSetup.png',
                            path: ''
                        },
                    ]
                },
                {
                    name: 'Entertainment',
                    icon: '/images/xp/icons/StartMenuPrograms.png',
                    items: [
                        {
                            name: 'Sound Recorder',
                            icon: '/images/xp/icons/Volume.png',
                            path: ''
                        },
                        {
                            name: 'Volume Control',
                            icon: '/images/xp/icons/VolumeLevel.png',
                            path: ''
                        },
                        {
                            name: 'Windows Media Player',
                            icon: '/images/xp/icons/WindowsMediaPlayer9.png',
                            path: ''
                        },
                    ]
                },
                {
                    name: 'System Tools',
                    icon: '/images/xp/icons/StartMenuPrograms.png',
                    items: [
                        {
                            name: 'Backup',
                            icon: '/images/xp/icons/BackupWizard.png',
                            path: ''
                        },
                        {
                            name: 'Character Map',
                            icon: '/images/xp/icons/Charmap.png',
                            path: ''
                        },
                        {
                            name: 'Disk Cleanup',
                            icon: '/images/xp/icons/DiskCleanup.png',
                            path: ''
                        },
                        {
                            name: 'Disk Defragmenter',
                            icon: '/images/xp/icons/DiskDefragmenter.png',
                            path: ''
                        },
                        {
                            name: 'Files and Settings Transfer Wizard',
                            icon: '/images/xp/icons/FileandSettingsTransferWizard.png',
                            path: ''
                        },
                        {
                            name: 'Scheduled Tasks',
                            icon: '/images/xp/icons/ScheduledTasks.png',
                            path: ''
                        },
                        {
                            name: 'Security Center',
                            icon: '/images/xp/icons/SecurityCenter.png',
                            path: ''
                        },
                        {
                            name: 'System Information',
                            icon: '/images/xp/icons/SystemInformation.png',
                            path: ''
                        },
                        {
                            name: 'System Restore',
                            icon: '/images/xp/icons/SystemRestore.png',
                            path: ''
                        },
                    ]
                },
                {
                    name: 'Address Book',
                    icon: '/images/xp/icons/AddressBook.png',
                    path: ''
                },
                {
                    name: 'Calculator',
                    icon: '/images/xp/icons/Calculator.png',
                    path: ''
                },
                {
                    name: 'Command Prompt',
                    icon: '/images/xp/icons/CommandPrompt.png',
                    path: ''
                },
                {
                    name: 'Notepad',
                    icon: '/images/xp/icons/Notepad.png',
                    path: ''
                },
                {
                    name: 'Paint',
                    icon: '/images/xp/icons/Paint.png',
                    path: ''
                },
                {
                    name: 'Program Compatibility Wizard',
                    icon: '/images/xp/icons/HelpandSupport.png',
                    path: ''
                },
                {
                    name: 'Remote Desktop Connection',
                    icon: '/images/xp/icons/RemoteDesktop.png',
                    path: ''
                },
                {
                    name: 'Synchronize',
                    icon: '/images/xp/icons/Synchronize.png',
                    path: ''
                },
                {
                    name: 'Tour Windows Xp',
                    icon: '/images/xp/icons/TourXP.png',
                    path: ''
                },
                {
                    name: 'Windows Explorer',
                    icon: '/images/xp/icons/Explorer.png',
                    path: ''
                },
                {
                    name: 'Wordpad',
                    icon: '/images/xp/icons/Wordpad.png',
                    path: ''
                },
                
            ]
        },
        {
            name: 'Games',
            top: '-300px',
            icon: '/images/xp/icons/StartMenuPrograms.png',
            items: [{"name":"Adventure Miner","icon":"/images/xp/icons/AdventureMiner.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/adventure-miner","name":"Adventure Miner","icon":"/images/xp/icons/AdventureMiner.png"}},{"name":"Age of War","icon":"/images/xp/icons/AgeOfWar.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/age-of-war","name":"Age of War","icon":"/images/xp/icons/AgeOfWar.png"}},{"name":"Army Warfare","icon":"/images/xp/icons/ArmyWarfare.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/army-warfare","name":"Army Warfare","icon":"/images/xp/icons/ArmyWarfare.png"}},{"name":"Big Farm","icon":"/images/xp/icons/BigFarm.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/goodgame-big-farm","name":"Big Farm","icon":"/images/xp/icons/BigFarm.png"}},{"name":"Bubble Pop","icon":"/images/xp/icons/BubblePop.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/bubble-pop-classic","name":"Bubble Pop","icon":"/images/xp/icons/BubblePop.png"}},{"name":"Cursed Treasure","icon":"/images/xp/icons/CursedTreasure.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/cursed-treasure-2","name":"Cursed Treasure","icon":"/images/xp/icons/CursedTreasure.png"}},{"name":"Day D Tower Rush","icon":"/images/xp/icons/DayD.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/day-d-tower-rush","name":"Day D Tower Rush","icon":"/images/xp/icons/DayD.png"}},{"name":"DualForce Idle","icon":"/images/xp/icons/DualForceIdle.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/dualforce-idle","name":"DualForce Idle","icon":"/images/xp/icons/DualForceIdle.png"}},{"name":"Empire","icon":"/images/xp/icons/Empire.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/goodgame-empire","name":"Empire","icon":"/images/xp/icons/Empire.png"}},{"name":"Grand Prix","icon":"/images/xp/icons/GrandPrix.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/crazy-grand-prix","name":"Grand Prix","icon":"/images/xp/icons/GrandPrix.png"}},{"name":"Highway Racer","icon":"/images/xp/icons/HighwayRacer.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/highway-racer","name":"Highway Racer","icon":"/images/xp/icons/HighwayRacer.png"}},{"name":"Infiltrating the Airship","icon":"/images/xp/icons/Infiltrate.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/infiltrating-the-airship","name":"Infiltrating the Airship","icon":"/images/xp/icons/Infiltrate.png"}},{"name":"MineCraft","icon":"/images/xp/icons/MineCraft.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/mine-craft-io","name":"MineCraft","icon":"/images/xp/icons/MineCraft.png"}},{"name":"Minesweeper","icon":"/images/xp/icons/Minesweeper.png","path":"./programs/minesweeper.svelte","size":7860},{"name":"Santa Parkour","icon":"/images/xp/icons/SantaParkour.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/santa-parkour","name":"Santa Parkour","icon":"/images/xp/icons/SantaParkour.png"}},{"name":"Skydom","icon":"/images/xp/icons/Skydom.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/skydom","name":"Skydom","icon":"/images/xp/icons/Skydom.png"}},{"name":"Solitaire","icon":"/images/xp/icons/Solitaire.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/solitaire-frvr","name":"Solitaire","icon":"/images/xp/icons/Solitaire.png"}},{"name":"Space Battle","icon":"/images/xp/icons/SpaceBattle.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/space-battle","name":"Space Battle","icon":"/images/xp/icons/SpaceBattle.png"}},{"name":"StickWar","icon":"/images/xp/icons/StickWar.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/stick-war","name":"StickWar","icon":"/images/xp/icons/StickWar.png"}},{"name":"Teacher Simulator","icon":"/images/xp/icons/TeacherSimulator.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/teacher-simulator","name":"Teacher Simulator","icon":"/images/xp/icons/TeacherSimulator.png"}},{"name":"Train Master","icon":"/images/xp/icons/TrainMaster.png","path":"./programs/webapp.svelte","webapp":{"background":"#111827","url":"https://www.crazygames.com/embed/train-master","name":"Train Master","icon":"/images/xp/icons/TrainMaster.png"}}]
        },
        {
            name: 'Startup',
            icon: '/images/xp/icons/StartMenuPrograms.png',
            items: []
        },
        {
            name: 'Internet Explorer',
            icon: '/images/xp/icons/InternetExplorer6.png',
            path: './programs/internet_explorer.svelte',
            font: 'bold'
        },
        {
            name: 'Microsoft Word 2003',
            icon: '/images/xp/icons/MSWord.png',
            path: './programs/microsoft_word.svelte',
            font: 'bold'
            
        },
        null,
        {
            name: 'Media Player Classic',
            icon: '/images/xp/icons/MPC.png',
            path: './programs/media_player_classic.svelte',
            
        },
        {
            name: 'Foxit Reader',
            icon: '/images/xp/icons/FoxitReader.png',
            path: './programs/foxit_reader.svelte',
            
        },
        {
            name: 'Flash Player',
            icon: '/images/xp/icons/FlashPlayer.png',
            path: './programs/flash_player.svelte',
            
        },
        {
            name: 'Python REPL',
            icon: '/images/xp/icons/Python.png',
            path: './programs/webapp.svelte',
            "webapp": {
                "background": "#000000",
                "url": "https://pyodide.org/en/stable/console.html",
                "name": "Python REPL",
                "icon": "/images/xp/icons/Python.png"
            },
        },
        {
            name: 'Koodo Reader',
            icon: '/images/xp/icons/Koodo.png',
            path: './programs/koodo.svelte',
            
        },
        {
            name: 'Photon',
            icon: '/images/xp/icons/Photon.png',
            path: './programs/photon.svelte',
            
        },
        {
            name: 'Paint',
            icon: '/images/xp/icons/Paint.png',
            path: './programs/paint.svelte',
            
        },
        {
            name: 'Tour Windows XP',
            icon: '/images/xp/icons/TourXP.png',
            path: './programs/xp_tour.svelte',
            
        },
    ]

    function hide(){
        let el = document.querySelector('#start-menu');
        if(!el.classList.contains('hidden')){
            el.classList.add('hidden');
        }
    }

    function launch(item){
        console.log(item);
        let {path, fs_item, webapp, link } = item;
        if(link){
            open_link(link);

        } else if(path){
            queueProgram.set({
                path, 
                fs_item,
                webapp
            })
        }
        hide();
    }

    function open_link(link){
        queueProgram.set({
            path: './programs/internet_explorer.svelte',
            fs_item: {url: link}
        })
    }

    async function show_shutdown_panel(){
        const ShutDownPanel = (await import('./shutdown_panel.svelte')).default;
        let panel = new ShutDownPanel({
            target: document.querySelector('#desktop')
        });
        panel.self = panel;
        hide();
    }

</script>

<div id="start-menu" class="absolute bottom-[30px] left-0 h-[500px] w-[390px] z-20 flex flex-col shadow-lg rounded-t-md hidden"
    style:background-color="rgb(66, 130, 214)"
    use:click_outside on:click_outside={hide}>
    <div class="h-[3px] absolute top-0 left-[3px] right-[3px]" style="background: linear-gradient(to right, transparent 0px, rgba(255, 255, 255, 0.3) 1%, rgba(255, 255, 255, 0.5) 2%, rgba(255, 255, 255, 0.5) 95%, rgba(255, 255, 255, 0.3) 98%, rgba(255, 255, 255, 0.2) 99%, transparent 100%);
    box-shadow: rgb(14 96 203) 0px -1px 1px inset;"></div>

    <div class="w-full h-[70px] rounded-t-md shrink-0"
        style:background-image="linear-gradient(rgb(24, 104, 206) 0%, rgb(14, 96, 203) 12%, rgb(14, 96, 203) 20%, rgb(17, 100, 207) 32%, rgb(22, 103, 207) 33%, rgb(27, 108, 211) 47%, rgb(30, 112, 217) 54%, rgb(36, 118, 220) 60%, rgb(41, 122, 224) 65%, rgb(52, 130, 227) 77%, rgb(55, 134, 229) 79%, rgb(66, 142, 233) 90%, rgb(71, 145, 235) 100%)">
    </div>

    <div class="shrink-0 h-[2px] w-full" style:background-image="linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(218, 136, 74) 50%, rgba(0, 0, 0, 0) 100%)">
    </div>

    <div class="grow bg-slate-50 mx-0.5 flex flex-row">
        
        <div class="grow w-1/2 flex flex-col h-full shrink-0 px-1">
            {#each col_1 as item}
                {#if item == null}
                    <div class="my-0.5 mx-auto w-5/6 h-[2px] bg-slate-200 shrink-0"></div>
                {:else}
                    <div class="flex flex-row items-center grow p-1 group hover:bg-blue-500" on:click={() => launch(item)}>
                        <div class="w-8 h-8 bg-contain mr-1"
                            style:background-image="url({item.icon})">
                        </div>
                        <div class="text-[11px] group-hover:text-white text-black {item.font == 'bold' ? 'font-bold' : ''}">
                            {item.name}
                        </div>
                    </div>
                {/if}
            {/each}
            <div class="my-0.5 mx-auto w-5/6 h-[2px] bg-slate-200 shrink-0"></div>
            <div class="relative grow group">
                
                <div class="flex pl-9 py-2 items-center flex-row  group-hover:bg-blue-500">
                    <div class="font-bold text-black text-[11px] group-hover:text-white">All Programs</div>
                    <div class="w-4 h-4 ml-1 bg-contain bg-[url(/images/xp/icons/876.png)]"></div>
                </div>

                <div class="absolute left-[90%] bottom-0 w-[250px] shadow-xl border-t border-l-4 border-blue-500 hidden group-hover:block bg-slate-50">
                    <div class="absolute -left-[50px] bottom-0 w-[820px] h-[500px] ">
                        <div class="absolute left-[300px] top-0 -bottom-[100px] right-0 " on:click|self={hide}></div>
                    </div>
                    {#each programs as item}
                        {#if item == null}
                            <div class="my-0.5 mx-auto w-5/6 h-[1px] bg-slate-200 shrink-0"></div>
                        {:else}
                            <div class="flex flex-row items-center grow p-1 group-sub1 hover:bg-blue-500 relative"  on:click={() => launch(item)}>
                                <div class="w-5 h-5 bg-contain mr-1 shrink-0"
                                    style:background-image="url({item.icon})">
                                </div>
                                <div class="text-[11px]  text-slate-800 grow group-sub1-hover:text-white">
                                    {item.name}
                                </div>
                                <div class="w-[10px] shrink-0">
                                    {#if item.items != null}
                                        <svg class="fill-slate-900 group-sub1-hover:fill-slate-50 w-[10px] h-[10px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                                    {/if}
                                </div>

                                {#if item.items != null}
                                    <div class="absolute left-[100%] top-0 w-[200px] shadow-xl border-t border-b border-l-4 border-blue-500 hidden group-sub1-hover:block bg-slate-50"
                                        style:top="{item.top}">
                                        <div  on:click|self={hide} class="absolute left-0 -bottom-[50px] w-[500px]" style:height="{item.items.length * 37}px"></div>
                                        {#if item.items.length == 0}
                                            <div class="h-6 text-slate-400 text-[11px] w-full px-4 flex flex-row items-center">(Empty)</div>
                                        {/if}
                                        {#each item.items as subitem}
                                            {#if subitem == null}
                                                <div class="my-0.5 mx-auto w-5/6 h-[1px] bg-slate-200 shrink-0"></div>
                                            {:else}
                                                <div class="flex flex-row items-center grow p-1 group-sub2 hover:bg-blue-500 relative" on:click={() => launch(subitem)}>
                                                    <div class="w-5 h-5 bg-contain mr-1 shrink-0"
                                                        style:background-image="url({subitem.icon})">
                                                    </div>
                                                    <div class="text-[11px]  text-slate-800 grow group-sub2-hover:text-white">
                                                        {subitem.name}
                                                    </div>
                                                    <div class="w-[10px] shrink-0">
                                                        {#if subitem.items != null}
                                                            <svg class="fill-slate-900 group-sub2-hover:fill-slate-50 w-[10px] h-[10px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                                                        {/if}
                                                    </div>
                                                    {#if subitem.items != null}
                                                        <div class="absolute left-[100%] top-0 w-[220px] shadow-xl border-t border-b border-l-4 border-blue-500 hidden group-sub2-hover:block bg-slate-50">
                                                            {#each subitem.items as subsubitem}
                                                                {#if subsubitem == null}
                                                                    <div class="my-0.5 mx-auto w-5/6 h-[1px] bg-slate-200 shrink-0"></div>
                                                                {:else}
                                                                    <div class="flex flex-row items-center grow p-1 group-sub3 hover:bg-blue-500 relative" on:click={() => launch(subsubitem)}>
                                                                        <div class="w-5 h-5 bg-contain mr-1 shrink-0"
                                                                            style:background-image="url({subsubitem.icon})">
                                                                        </div>
                                                                        <div class="text-[11px]  text-slate-800 grow group-sub3-hover:text-white">
                                                                            {subsubitem.name}
                                                                        </div>
                                                                        <div class="w-[10px] shrink-0">
                                                                            {#if subsubitem.items != null}
                                                                                <svg class="fill-slate-900 group-sub3-hover:fill-slate-50 w-[10px] h-[10px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                                                                            {/if}
                                                                        </div>
                                                                    </div>
                                                                {/if}
                                                            {/each}
                                                        </div>
                                                    {/if}
                                                </div>
                                            {/if}
                                        {/each}
                                    </div>
                                {/if}

                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>

        <div class="grow w-1/2 flex flex-col h-full bg-blue-200 shrink-0 px-1">
            {#each col_2 as item}
                {#if item == null}
                    <div class="my-0.5 mx-auto w-5/6 h-[1px] bg-blue-100 shrink-0"></div>
                {:else}
                    <div class="flex flex-row items-center grow p-1 group hover:bg-blue-500" on:click={() => launch(item)}>
                        <div class="w-7 h-7 bg-contain mr-1"
                            style:background-image="url({item.icon})">
                        </div>
                        <div class="text-[11px] group-hover:text-white text-slate-800 {item.font == 'bold' ? 'font-bold' : ''}">
                            {item.name}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>

    <div class="w-full h-[40px] shrink-0 flex items-center justify-end px-2" 
        style:background-image="linear-gradient(rgb(66, 130, 214) 0%, rgb(59, 133, 224) 3%, rgb(65, 138, 227) 5%, rgb(65, 138, 227) 17%, rgb(60, 135, 226) 21%, rgb(55, 134, 228) 26%, rgb(52, 130, 227) 29%, rgb(46, 126, 225) 39%, rgb(35, 116, 223) 49%, rgb(32, 114, 219) 57%, rgb(25, 110, 219) 62%, rgb(23, 107, 216) 72%, rgb(20, 104, 213) 75%, rgb(17, 101, 210) 83%, rgb(15, 97, 203) 88%)">
        <div class="p-1 rounded-sm hover:brightness-110 flex flex-row items-center" on:click={show_shutdown_panel}>
            <div class="w-6 h-6 bg-[url(/images/xp/icons/Logout.png)] bg-contain"></div>
            <span class="text-slate-50 text-[11px] ml-1">Log Off</span>
        </div>
        <div class="p-1 ml-2 rounded-sm hover:brightness-110 flex flex-row items-center" on:click={show_shutdown_panel}>
            <div class="w-6 h-6 bg-[url(/images/xp/icons/Power.png)] bg-contain" ></div>
            <span class="text-slate-50 text-[11px] ml-1">Turn Off Computer</span>
        </div>
    </div>

</div>