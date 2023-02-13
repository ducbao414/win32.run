<script>
    import { zIndex, runningPrograms, contextMenu } from '../../store';
    let node_ref;

    export let program;

    function on_rightclick(ev){
        contextMenu.set(null);
        console.log(program);
        console.log({maximized: program.window.maximized, minimized: program.window.minimized})
        contextMenu.set({x: ev.x, y: ev.y, type: 'ProgramTile', originator: program});
    }

    function on_mousedown(ev){
        // program.window.focus();
    }

    function on_click(ev){
        if(!program.window.minimized){
            if(program.window.z_index == $zIndex){
                console.log('minimize');
                program.window.on_click_minimize();
            } else {
                program.window.focus();
            }
            
        } else {
            program.window.restore();
        }
        
    }

</script>

<div bind:this={node_ref} on:contextmenu={on_rightclick} on:mousedown={on_mousedown} on:click={on_click}
     program-id="{program.id}"
     class="program-tile h-full w-[150px] min-w-[70px] flex flex-row items-center max-w-[200px] overflow-hidden rounded-sm hover:brightness-125"
     style:background="{program.window.z_index == $zIndex? 'rgb(30,82,183)' : 'rgb(60,129,243)'}"
     style:box-shadow="{program.window.z_index == $zIndex? 'rgb(0 0 0 / 20%) 0px 0px 1px 1px inset, rgb(0 0 0 / 70%) 1px 0px 1px inset' : 'rgb(0 0 0 / 30%) -1px 0px inset, rgb(255 255 255 / 20%) 1px 1px 1px inset'}"
     >
    <img src="{program.options.icon}" width="15px" height="15px" class="shrink-0 ml-2 pointer-events-none" alt="">
    <p class="text-[11px]  text-slate-50 text-ellipsis mx-1 line-clamp-1 leading-none">{program.options.title}</p>
</div>
