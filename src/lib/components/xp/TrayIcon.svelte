<script>
    import {tooltip} from './tooltip';
    export let style = '';
    export let tooltip_message;
    export let icon;

    export let on_click = () =>  {
        console.log('on click')
    }

    function on_mouseenter(e){
        if(tooltip_message == null) return;
        let position = {left: e.x, top: e.y - 40};
        if(tooltip_message.length >= 20){
            position.top = position.top - 20;
        }
        tooltip.set({message: tooltip_message, position});
    }

    function on_mouseleave(e){
        tooltip.set(null);
    }


</script>

<div class="mr-1 w-4 h-4 bg-no-repeat bg-contain" style:background-image="url({icon})" 
    on:click={on_click} use:tooltip tooltip="{tooltip_message}">
</div>