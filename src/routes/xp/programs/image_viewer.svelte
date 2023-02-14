<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import {onMount, tick } from 'svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import {get,set} from 'idb-keyval';
    
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;
    let img_node;
    let panzoom_instance;

    let supported_exts = ['.bmp', '.jpg', '.jpeg', '.png', '.webp'];

    $: {
        if(fs_item && window) {
            window.update_title(fs_item.name)
        }
    }

    onMount(async () => {
        await load_image(fs_item.id);
        
        panzoom_instance = panzoom(img_node, {
            filterKey: function(e) {
                if(e.key == 'ArrowRight' || e.key == 'ArrowLeft'){
                    return true;
                }
            }
        });
    })

    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: fs_item == null ? 'Image Viewer' : fs_item.name,
        min_width: 300,
        min_height: 300,
        width: 600,
        height: 400,
        icon: '/images/xp/icons/WindowsPictureandFaxViewer.png',
        id: id,
        exec_path
    };


    async function load_image(id){
        let item = $hardDrive[id];
        
        let url = null;

        if(item.storage_type == 'remote'){
            url = item.url;
        } else if (item.storage_type == 'local'){
            let file = await get(item.url);
            url = URL.createObjectURL(file);
        }
        img_node.src = url;
    }

    async function on_key_pressed(e){
        if(window.z_index != $zIndex) return;
        if(!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;

        if(e.key == 'ArrowRight'){
            await load_next_image();

        } else if(e.key == 'ArrowLeft'){
            await load_previous_image();
        }
    }

    async function load_next_image(){
        fs_item = next_image(fs_item);
        await load_image(fs_item.id);
        img_node.style.transform = 'none';
    }

    async function load_previous_image(){
        fs_item = previous_image(fs_item);
        await load_image(fs_item.id);
        img_node.style.transform = 'none';
    }

    function zoomIn(){
        panzoom_instance.smoothZoom(img_node.clientWidth*0.5,img_node.clientHeight*0.5, 1.2);
    }

    function zoonOut(){
        panzoom_instance.smoothZoom(img_node.clientWidth*0.5,img_node.clientHeight*0.5, 0.8);
    }

    function next_image(curr_item){
        console.log($hardDrive[curr_item.parent])
        let siblings = $hardDrive[curr_item.parent]
            .children
            .filter(id => supported_exts.includes($hardDrive[id].ext));
        let curr_index = siblings.indexOf(curr_item.id);

        if(curr_index == siblings.length - 1){
            return $hardDrive[siblings[0]];
        } else {
            return  $hardDrive[siblings[curr_index + 1]];
        }
    }

    function previous_image(curr_item){
        let siblings = $hardDrive[curr_item.parent]
            .children
            .filter(id => supported_exts.includes($hardDrive[id].ext));
        let curr_index = siblings.indexOf(curr_item.id);

        if(curr_index == 0){
            return $hardDrive[siblings[siblings.length - 1]];
        } else {
            return $hardDrive[siblings[curr_index - 1]];
        }
    }

</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 flex flex-col bg-slate-100">
        <div class="grow w-full overflow-hidden flex items-center justify-center p-2 outline-none">
            <img bind:this={img_node} class="max-w-full max-h-full outline-none" alt="">
        </div>
        <div class="h-[40px] shrink-0 flex items-center">
            <div class="mx-auto flex flex-row items-center justify-evenly w-[200px]">
                <button class="w-4 h-4 outline-none" on:click={zoomIn}>
                    <svg class="w-full h-full fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24V232h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H232V120c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"/>
                    </svg>
                </button>

                <button class="w-4 h-4 outline-none" on:click={zoonOut}>
                    <svg class="w-full h-full fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24H280c13.3 0 24-10.7 24-24s-10.7-24-24-24H136z"/>
                    </svg>
                </button>

                <button class="w-4 h-4 outline-none" on:click={load_previous_image}>
                    <svg class="w-full h-full fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/>
                    </svg>
                </button>

                <button class="w-4 h-4 outline-none" on:click={load_next_image}>
                    <svg class="w-full h-full fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    
</Window>

<svelte:options accessors={true}></svelte:options>

<svelte:window on:keydown={on_key_pressed} />
