<script>
    import { contextMenu, wallpaper, hardDrive } from '../../lib/store';
    import { bliss_wallpaper, wallpapers_folder } from '../../lib/system';
    import * as utils from '../../lib/utils';
    import {get, set} from 'idb-keyval';
    import {onMount} from 'svelte';


    let cached_url = '';

    async function get_wallpaper_url(w){
        let fs_item = $hardDrive[w];
        console.log(fs_item)
        let url = null;

        if(fs_item.storage_type == 'remote'){
            url = fs_item.url;
        } else if (fs_item.storage_type == 'local'){
            let file = await get(fs_item.url);
            url = URL.createObjectURL(file);
        }
        
        await load_image_url(url);
        cached_url = url;
        return url;
    }

    function load_image_url(url){
        return new Promise(resolve => {
            let image = new Image();
            image.src = url;
            image.onload = () => resolve();
        })
    }
    
</script>

{#await get_wallpaper_url($wallpaper)}
    <div class="absolute inset-0 bg-cover bg-black" style:background-image="url({cached_url})">
    </div>
{:then url} 
    <div class="absolute inset-0 bg-cover" style:background-image="url({url})">
    </div>
{/await}
