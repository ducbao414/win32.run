<script>
    import * as fs from '../../fs';
    import {onMount} from 'svelte';

    export let default_icon;
    export let fs_id;
    export let size = 50;
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
        console.log(preview_url)
        if(preview_url != null) return;
        if(fs_id == null) return;
        let url = await fs.get_url(fs_id);

        let image = new Image();
        image.src = url;
        image.onload = () => preview_url = `url(${url})`;
        
    }

</script>

<div bind:this={node_ref} class="shrink-0 bg-contain bg-no-repeat bg-center"
    style:background-image="{preview_url || default_icon}"
    style:width="{size}px"
    style:height="{size}px">
</div>