<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import {onMount } from 'svelte';
    import { runningPrograms, zIndex } from '../../../lib/store'
    import Menu from '../../../lib/components/xp/Menu.svelte';
    import RButton from '../../../lib/components/xp/RButton.svelte';
    import ProgressBar from '../../../lib/components/xp/ProgressBar.svelte';
    import buildUrl from 'build-url';
    import isURL from 'is-valid-http-url';
    import * as fs from '../../../lib/fs';
    import * as utils from '../../../lib/utils';
    import * as finder from '../../../lib/finder';

    export let id;
    export let window;
    export let self;
    export let url;
    export let exec_path;

    let iframe;
    let address_bar;
    let homepage = url ? url : 'https://app.usepanda.com/#/';
    let history = [homepage];
    
    let page_index = 0;
    let loading = true;

    let real_url;

    onMount(async () => {
        real_url = await to_real_url(history[page_index]);
    })

    function on_user_input(e){
        if(e.key == 'Enter'){
            load_page();
        }
    }
    async function load_page(){
        loading = true;
        let url = address_bar.value;
        if(url == null || url.trim() == '') return;

        if(/^[A-Z]:\\/.test(url)){

        } else if(!url.startsWith('https://') && !url.startsWith('http://')){
            url = 'https://' + url;
            if(!isURL(url)){
                url = buildUrl('https://bing.com', {
                    path: 'search',
                    queryParams: {
                        q: address_bar.value.trim()
                    }
                })
            }
        } 

        history = [...history.slice(0, page_index+1), url, ...history.slice(page_index+1)];
        page_index++;
        console.log(history);
        real_url = await to_real_url(history[page_index]);
    }

    async function back(){
        page_index = page_index - 1;
        real_url = await to_real_url(history[page_index]);
    }

    async function next(){
        page_index = page_index + 1;
        real_url = await to_real_url(history[page_index]);
    }

    function iframe_loaded(){
        loading = false;
    }

    async function to_real_url(url){
        if(/^[A-Z]:\\/.test(url)){
            let file = await fs.get_file(finder.to_id(url));
            return URL.createObjectURL(file);
        } else {
            return url;
        }
    }

    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    let ws_size = {width: document.querySelector('#work-space').offsetWidth, height: document.querySelector('#work-space').offsetHeight};

    export let options = {
        title: 'Microsoft Internet Explorer',
        min_width: 500,
        min_height: 400,
        width: Math.min(ws_size.width - 20, (ws_size.height - 20)*1.6),
        height: Math.min(ws_size.height - 20),
        icon: '/images/xp/icons/InternetExplorer6.png',
        id: id,
        exec_path
    };

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
                        name: 'Help and Support Center'
                    },
                    {
                        name: 'Is this copy legal?'
                    }
                ],
                [
                    {
                        name: 'About Windows'
                    }
                ]
            ]
        }
    ]




</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-xp-yellow">
        <div class="shrink-0 w-full border-b border-stone-300 flex flex-row items-center justify-between">
            <Menu menu={menu}></Menu>
            <div class="w-[40px] h-full bg-slate-50  flex items-center justify-center">
                <div class="w-[20px] h-[20px] bg-[url(/images/ms.png)] bg-contain bg-center bg-no-repeat"></div>
            </div>
        </div>
        <div class="shrink-0 flex flex-row items-center border-b border-stone-300 overflow-hidden">
            <RButton icon="/images/xp/icons/Back.png" title="Back" 
                    on_click={back}
                    expandable={true} disabled={page_index == 0} tooltip_message="Back to Previous"></RButton>
            <RButton icon="/images/xp/icons/Forward.png" 
                    on_click={next}
                    expandable={true} disabled={page_index == history.length-1}></RButton>

            <RButton icon="/images/xp/icons/IEStop.png"></RButton>
            <RButton icon="/images/xp/icons/IERefresh.png" 
                on_click={() => {
                    var src = iframe.src;
                    iframe.src = src;
                }}></RButton>
            <RButton icon="/images/xp/icons/IEHome.png"
                on_click={() => {
                    address_bar.value = 'https://app.usepanda.com/#/';
                    load_page();
                }}>
            </RButton>

            <div class="w-[1px] h-full py-1">
                <div class=" w-full h-full border-l border-stone-300"></div>
            </div>

            <RButton icon="/images/xp/icons/Search.png" title="Search" 
                on_click={() => {
                    address_bar.focus();
                    address_bar.select();
                }}>
            </RButton>

            <RButton icon="/images/xp/icons/Favorites.png" title="Favorites"></RButton>
            <RButton icon="/images/xp/icons/IEHistory.png"></RButton>

            <div class="w-[1px] h-full py-1">
                <div class=" w-full h-full border-l border-stone-300"></div>
            </div>

            <RButton icon="/images/xp/icons/Email.png" expandable={true}></RButton>
            <RButton icon="/images/xp/icons/Fax.png"></RButton>
            <RButton icon="/images/xp/icons/WindowsMessenger.png"></RButton>
        </div>
        <div class="shrink-0 flex flex-row items-center border-b border-stone-300 text-[11px] items-center">
            <span class="px-2 text-slate-800">Address</span>
            <div class="grow h-[25px] relative">
                <input class="absolute inset-0 pl-6 outline-none" type="text" bind:this={address_bar}
                on:click={(e) => e.target.select()} on:keyup={on_user_input} value="{history[page_index]}">
                <div class="w-[17px] h-[17px] absolute top-[4px] left-[4px] bg-[url(/images/xp/icons/URL.png)] bg-contain"></div>
            </div>
            <div on:click={load_page} class="w-[30px] h-[20px] bg-[url(/images/xp/icons/Go.png)] bg-center bg-contain bg-no-repeat"></div>
        </div>
        
        <div class="grow">
            <!-- svelte-ignore a11y-missing-attribute -->
            <iframe bind:this={iframe} 
                class="w-full h-full bg-slate-50 {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" 
                src="{real_url}" 
                on:load={(e) => iframe_loaded(e)} frameborder="0">
            </iframe>
            
        </div>
        <div class="bg-xp-yellow h-[20px] shrink-0 flex flex-row justify-between items-center px-2">
            <div class="flex flex-row">
                <img src="/images/xp/icons/URL.png" class="w-[15px] h-[15px]" alt="">
                {#if loading}
                    <ProgressBar style="width:100px;height:15px;margin-left:8px;" value={utils.random_int(50,80)}></ProgressBar>
                {:else}
                    <span class="ml-2 text-[11px]">Done</span>
                {/if}
            </div>
            <div class="flex flex-row">
                <img src="/images/xp/icons/InternetShortcut.png" class="w-[15px] h-[15px]" alt="">
                <span class="ml-2 text-[11px]">Internet</span>
            </div>
        </div>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>