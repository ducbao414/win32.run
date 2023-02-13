<script>
    import * as fs from '../../fs';
    import {onMount} from 'svelte';

    export let default_icon;
    export let fs_id;
    let preview_url;
    let node_ref;

    let observer;
    onMount(async () => {
        observer = new IntersectionObserver(intersect_callback, {
            root: null,
            threshold: 1
        })
        observer.observe(node_ref);
    })

    let intersect_callback = (entries, observer) => {
        entries.forEach((entry) => {
            let { target, isIntersecting } = entry;

            if(isIntersecting){
                load_preview();
            } 
        });
    };

    async function load_preview(){
        if(preview_url != null) return;
        if(fs_id == null) return;
        let url = await fs.get_url(fs_id);
        // console.log('load', fs_id, 'with url', url);
        preview_url = `url(${url})`;
    }

</script>

<div bind:this={node_ref} class="w-[50px] h-[50px] shrink-0 bg-contain bg-no-repeat bg-center"
    style:background-image="{preview_url || default_icon}">
</div>