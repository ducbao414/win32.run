<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import {onMount } from 'svelte';
    import { queueProgram, runningPrograms, zIndex } from '../../../lib/store'
    import Menu from '../../../lib/components/xp/Menu.svelte';
   
    export let id;
    export let window;
    export let self;
    export let parentNode;

    let iframe;
    let title_bar_height = 30;
    let menu_height = 30;
    let board_sizes = {
        beginner: {width: 236, height: 295},
        intermediate: {width: 436, height: 495},
        expert: {width: 786, height: 495}
    }

    onMount(() => {
    })

    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: 'Minesweeper',
        width: 236,
        height: 295 + title_bar_height + menu_height,
        icon: '/images/xp/icons/Minesweeper.png',
        resizable: false,
        maximize_btn_disabled: true,
        id: id
    };

    let menu = [
        {
            name: 'Game',
            items: [//group of items
                [
                    {name: 'New Game', action: () => {new_game()}}
                ],
                [
                    {name: 'Beginner', action: () => {beginner()}}, 
                    {name:'Intermediate', action: () => {intermediate()}},
                    {name: 'Expert', action: () => {expert()}}
                ],
                [{name: 'Exit', action: () => {destroy()}}]
            ]
        },
        {
            name: 'Help',
            items: [
                [
                    {
                        name: 'Contents', 
                        action: () => {
                            queueProgram.set({
                                path: './programs/internet_explorer.svelte',
                                fs_item: {url: 'https://en.wikipedia.org/wiki/Minesweeper_(video_game)'}
                            })
                        }
                    },
                    {
                        name: 'About Minesweeper', 
                        action: () => {
                            queueProgram.set({
                                path: './programs/internet_explorer.svelte',
                                fs_item: {url: 'https://en.wikipedia.org/wiki/Minesweeper_(video_game)'}
                            })
                        }
                    }, 
                ]
            ]
        }
    ];


    function new_game(){
        iframe.contentWindow.new_game();
    }
    function beginner(){
        resize_game_board('beginner');
        iframe.contentWindow.beginner();
    }

    function intermediate(){
        resize_game_board('intermediate');
        iframe.contentWindow.intermediate();
    }

    function expert(){
        resize_game_board('expert');
        iframe.contentWindow.expert();
    }

    function resize_game_board(preset){
        let {width, height} = board_sizes[preset];
        height = height + title_bar_height + menu_height;
        let top = (parentNode.offsetHeight-height)/2;
        let left = (parentNode.offsetWidth-width)/2;
        window.set_position({top, left, width, height});

    }


</script>

<Window options={options} bind:this={window} on_click_close={destroy}>
    
    <div slot="content" class="absolute inset-0 flex flex-col bg-xp-yellow">
        <Menu menu={menu}></Menu>
        <iframe bind:this={iframe}
            title="minesweeper"
            src="/html/games/minesweeper/index.html"
            class="w-full h-full {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}" frameborder="0"></iframe>
    </div>
</Window>


<svelte:options accessors={true}></svelte:options>