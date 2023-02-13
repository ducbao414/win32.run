<script>
    export let on_click = (event) => {

    }

    export let title = '';
    export let style = '';
    export let disabled = false;

</script>

<button on:click={(event) => on_click(event)} disabled={disabled} style="
    {style};
    background: silver;
    box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;"
    class="px-2 py-1 text-center min-w-[50px] min-h-[20px] font-MSSS text-sm text-black
    focus:outline-dotted outline-black outline-offset-[-4px] disabled:text-gray-500">
    {title}
</button>