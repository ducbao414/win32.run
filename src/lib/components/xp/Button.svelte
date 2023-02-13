<script>
    import {onMount} from 'svelte';
    export let on_click = (event) => {}

    export let title = '';
    export let style = '';
    export let disabled = false;
    export let focus = false;

    let node_ref;

    onMount(() => {
        if(focus){
            node_ref.focus();
        }
    })
    

</script>



<button bind:this={node_ref} on:click={(event) => on_click(event)}
    disabled={disabled} style="{style};" class="button disabled:opacity-30">
    {title}
</button>

<style>
    .button {
        font-family: 'MSSS', Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 11px;
        box-sizing: border-box;
        border: 1px solid #003c74;
        background: linear-gradient(180deg,#fff,#ecebe5 86%,#d8d0c4);
        box-shadow: none;
        border-radius: 3px;
        min-width: 75px;
        min-height: 23px;
        text-align: center;
    }

    .button:focus {
        outline: 1px dotted #000;
        outline-offset: -4px;
        box-shadow: inset -1px 1px #cee7ff, inset 1px 2px #98b8ea, inset -2px 2px #bcd4f6, inset 1px -1px #89ade4, inset 2px -2px #89ade4;
    }

    button:not(:disabled):hover {
        box-shadow: inset -1px 1px #fff0cf, inset 1px 2px #fdd889, inset -2px 2px #fbc761, inset 2px -2px #e5a01a;
    }
</style>

<svelte:options accessors={true}></svelte:options>