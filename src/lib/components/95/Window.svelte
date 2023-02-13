<script>
    import {onMount} from 'svelte';
    import TitleBar from './TitleBar.svelte';
    import * as utils from '../../utils';
    import _ from 'lodash';

    export let self;
    export let options = {something: 'some value'};

    let node_ref;
    let saved_position;
    let maximized;
    let minimized;

    onMount(() => {
        
        if(options.top == null){
            options.top = (node_ref.parentNode.offsetHeight - node_ref.offsetHeight)/2;
        }
        if(options.left == null){
            options.left = (node_ref.parentNode.offsetWidth - node_ref.offsetWidth)/2;
        }
        set_position({top: options.top, left: options.left, width: node_ref.width, height: node_ref.height});
        

        // enable_resize();
        enable_drag();

    })

    

    let on_click_close = () => {
        self.$destroy();
    }

    export let on_click_maximize = () => {
        if(maximized){
            set_position(saved_position);
            maximized = false;
        } else {
            let rect = utils.relative_rect(node_ref.parentNode.getBoundingClientRect(), node_ref.getBoundingClientRect());
            console.log(rect);
            saved_position = {top: rect.top, left: rect.left, width: node_ref.offsetWidth, height: node_ref.offsetHeight};
            set_position({top: 0, left: 0, width: node_ref.parentNode.offsetWidth, height: node_ref.parentNode.offsetHeight});
            maximized = true;
        }
    }

    function set_position({top, left, width, height, absolute_values}){
        if(absolute_values){
            let parent_top = node_ref.parentNode.getBoundingClientRect().top;
            let parent_left = node_ref.parentNode.getBoundingClientRect().left;
            top = top - parent_top;
            left = left - parent_left;
        } 
        node_ref.style.top = `${top}px`;
        node_ref.style.left = `${left}px`;
        node_ref.style.width = `${width}px`;
        node_ref.style.height = `${height}px`;
    }

    function enable_resize(){
        interact(node_ref)
        .resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            listeners: {
                move: function (event) {
                    let { x, y } = event.target.dataset;
                    x = (parseFloat(x) || 0) + event.deltaRect.left;
                    y = (parseFloat(y) || 0) + event.deltaRect.top;
                    let rect = node_ref.getBoundingClientRect();
                    set_position({top: y + rect.top, left: x + rect.left, width: event.rect.width, height: event.rect.height, absolute_values: true});
                }
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 50 }
                })
            ],
        })
    }

    function enable_drag(){
        jQuery(node_ref).draggable({
            containment: 'parent',
            handle: '.titlebar'
        })
        jQuery(node_ref).resizable({
            minWidth: options.min_width,
            minHeight: options.min_height,
            containment: 'parent',
            handles: 'all',
            classes: {
                'ui-resizable-se': ''
            }
        })
    }

    
</script>
<div bind:this={node_ref} style="
    position: absolute;
    background: silver;
    box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
    padding: 3px" class="absolute flex flex-col" 
    style:min-width="{options.min_width}px" style:min-height="{options.min_height}px">

    <div class="shrink-0">
        <TitleBar options={options} 
            on_click_close={on_click_close} on_click_maximize={on_click_maximize}>
        </TitleBar>
    </div>

    <div class="grow shrink-0 relative">
        <slot name="content"></slot>
    </div>
</div>

