<script>
    import {onMount} from 'svelte';
    import TitleBar from './TitleBar.svelte';
    import * as utils from '../../utils';
    const {click_outside} = utils;
    import _ from 'lodash';
    import {get, set} from 'idb-keyval';
    import { zIndex, runningPrograms } from '../../store';

    export let options = {};
    
    let titlebar;
    export let node_ref;
    let saved_position;
    export let maximized;
    export let minimized;
    let translateX = '';
    let translateY = '';
    let animation_enabled = false;

    export let on_focused = () => {
    }
    
    export let z_index = 0;

    onMount(async () => {
        if(options.exec_path != null){
            let rect = await get(options.exec_path);
            if(rect){
                rect = {top: rect.top, left: rect.left, width: rect.width, height: rect.height};
                let workspace = document.querySelector('#work-space');
                let nudge = calc_nudges(rect);
                rect.top = rect.top + nudge.top;
                rect.left = rect.left + nudge.left;

                if(rect.left + rect.width <= workspace.offsetWidth
                && rect.top + rect.height <= workspace.offsetHeight){
                    options.top = rect.top;
                    options.left = rect.left;
                    options.width = rect.width;
                    options.height = rect.height;
                }
            }
        }

        if(options.top == null){
            options.top = (node_ref.parentNode.offsetHeight - node_ref.offsetHeight)/2;
        }
        if(options.left == null){
            options.left = (node_ref.parentNode.offsetWidth - node_ref.offsetWidth)/2;
        }
        set_position({top: options.top, left: options.left, width: options.width, height: options.height});
        
        if(options.resizable == null){
            options.resizable = true;
        }
        if(options.draggable == null){
            options.draggable = true;
        }
        

        setup_gestures();
        zIndex.update(value => value + 1);
        z_index = $zIndex;

        node_ref.style.removeProperty('opacity');
        setTimeout(() => {
            animation_enabled = true;
        }, 500)
        
    })

    
    export let on_click_close = () => {
    }

    export let on_click_maximize = () => {
        if(!options.resizable) return;
        minimized = false;
        if(maximized){
            set_position(saved_position);
            maximized = false;
        } else {
            // let rect = utils.relative_rect(node_ref.parentNode.getBoundingClientRect(), node_ref.getBoundingClientRect());
            // console.log(rect);
            saved_position = {top: node_ref.offsetTop, left: node_ref.offsetLeft, width: node_ref.offsetWidth, height: node_ref.offsetHeight};
            set_position({top: 0, left: 0, width: node_ref.parentNode.offsetWidth, height: node_ref.parentNode.offsetHeight});
            maximized = true;
        }
        focus();
    }

    export let on_click_minimize = () => {
        let window_center = get_center_point(node_ref.getBoundingClientRect());
        let tile_center = get_center_point(document.querySelector(`.program-tile[program-id="${options.id}"]`)?.getBoundingClientRect());
        
        translateX = `translateX(${tile_center.x-window_center.x}px)`;
        translateY = `translateY(${tile_center.y-window_center.y}px)`;
        console.log(`${translateX} ${translateY} scale(0.1)`);
        
        minimized = true;
        loose_focus();
    }

    export function restore(){
        if(minimized){
            minimized = false;
        } else if(maximized) {
            on_click_maximize();
        }
        focus();
    }

    export function focus(){
        if(z_index != $zIndex){
            zIndex.update(value => value + 1);
            z_index = $zIndex;
            on_focused();
        }
    }

    export function loose_focus(){
        if(z_index == $zIndex){
            console.log('loose focus');
            zIndex.update(value => value + 1);
        }
    }

    function calc_nudges({top, left, width, height}){
        let existing_window = $runningPrograms.findLast(el => {
            return el.options.id != options.id
                && el.options.exec_path == options.exec_path;
        });
        if(existing_window == null) return {top: 0, left: 0}
        
        let pad = 10;
        let nudges = [[pad, pad], [pad, -pad], [-pad, pad], [-pad, -pad], [0, 0]];
        let workspace = document.querySelector('#work-space');
        for(let nudge of nudges){
            if(top + nudge[0] >= 0
            && left + nudge[1] >= 0
            && top + height + nudge[0] <= workspace.offsetHeight
            && left + width + nudge[1] <= workspace.offsetWidth){
                return {top: nudge[0], left: nudge[1]}
            }
        }
        return {top: 0, left: 0};
    }

    function get_center_point(rect){
        if(rect == null){
            return {x: document.body.offsetWidth*0.5, y: document.body.offsetHeight*0.5}
        }
        return {x: rect.x + rect.width*0.5, y: rect.y+rect.height*0.5}
    }

    

    export function set_position({top, left, width, height}){
        
        node_ref.style.top = `${top}px`;
        node_ref.style.left = `${left}px`;
        node_ref.style.width = `${width}px`;
        node_ref.style.height = `${height}px`;
        
        if(options.exec_path){
            set(options.exec_path, node_ref.getBoundingClientRect())
        }
    }

    

    function setup_gestures(){
        if(options.draggable){
            jQuery(node_ref).draggable({
                containment: 'parent',
                handle: '.titlebar',
                stop: async () => {
                    if(options.exec_path){
                        await set(options.exec_path, node_ref.getBoundingClientRect())
                    }
                }
            })
        }

        if(options.resizable){
            jQuery(node_ref).resizable({
                minWidth: options.min_width,
                minHeight: options.min_height,
                aspectRatio: options.aspect_ratio,
                containment: 'parent',
                handles: 'all',
                classes: {
                    "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se opacity-0"
                },
                start: () => {
                    let iframe = node_ref.querySelector('iframe');
                    if(iframe){
                        iframe.style.pointerEvents = 'none';
                    }
                },
                stop: async () => {
                    if(options.exec_path){
                        await set(options.exec_path, node_ref.getBoundingClientRect())
                    }
                    let iframe = node_ref.querySelector('iframe');
                    if(iframe){
                        iframe.style.removeProperty('pointer-events');
                    }
                }
            })
        }
    }

    export function update_icon(icon){
        titlebar.update_icon(icon);
    }

    export function update_title(title){
        runningPrograms.update(values => {
            let program = values.find(el => el.options.id == options.id);
            let index = values.indexOf(program);
            if(index >= 0){
                values[index].options.title = title;
            }
            
            return values;
        })
        titlebar.update_title(title);
    }

    export function show_toast({theme='dark', message}){
        let toast = document.createElement('div');
        toast.style.position = 'absolute';
        toast.style.transform = 'translate(-50%)';
        toast.style.left = '50%';
        toast.style.top = '50%';
        toast.style.padding = '10px';
        toast.innerText = message;
        toast.style.borderRadius = '7px';
        toast.style.opacity = 1;
        toast.style.fontSize = '12px';
        toast.style.minHeight = '30px';
        toast.style.minWidth = '70px';
        toast.style.zIndex = 99999;
        if(theme == 'dark'){
            toast.style.backgroundColor = '#0f172a';
            toast.style.border = '1px solid #f1f5f9';
            toast.style.color = '#f8fafc';
        } else {
            toast.style.backgroundColor = '#f1f5f9';
            toast.style.border = '1px solid #1e293b';
            toast.style.color = '#0f172a';
        }
        node_ref.append(toast);
        
        setTimeout(() => {
            toast.remove()
        }, 3000);

    }

    
</script>
<div
    on:mousedown={focus}
    use:click_outside on:click_outside={loose_focus}
    bind:this={node_ref} style="
    opacity:0;
    position: absolute;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 0px;
    -webkit-font-smoothing: antialiased;" 
    program-id="{options.id}"
    class="window absolute flex flex-col bg-xp-yellow {animation_enabled ? 'transition duration-300' : ''}  {minimized ? `opacity-0` : ''}"
    style:width="{options.width}px" style:height="{options.height}px" 
    style:min-width="{options.min_width}px" style:min-height="{options.min_height}px"
    style:transform="{minimized ? `${translateX} ${translateY} scale(0.1)` : 'none'}"
    style:background="{options.background}"
    style:z-index="{z_index}" style:box-shadow="{z_index < $zIndex ? 'var(--window-box-shadow-inactive)' : 'var(--window-box-shadow)'}">

    <div class="shrink-0">
        <TitleBar bind:this={titlebar} options={options} inactive={z_index < $zIndex} maximized={maximized}
            on_click_close={on_click_close} on_click_maximize={on_click_maximize} on_click_minimize={on_click_minimize}>
        </TitleBar>
    </div>

    <div class="grow shrink-0 relative shadow-xl">
        <slot name="content"></slot>
    </div>

</div>

<svelte:options accessors={true}></svelte:options>