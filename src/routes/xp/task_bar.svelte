<script>
    import SystemTray from "./system_tray.svelte";
    import ProgramTray from "./program_tray.svelte";

    function start_menu(){
        let el = document.querySelector('#start-menu');
        let classList = el.classList;
        
        if(classList.contains('hidden')){
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
        console.log('toggle start menu');
    }
</script>


<div class="z-10 absolute bottom-0 left-0 right-0 w-full h-[30px] bg-[linear-gradient(var(--xp-gradient))] flex flex-row items-center">
    <div id="start-menu-btn" class="w-[100px] h-full bg-[url(/images/xp/start_btn_normal.png)] bg-cover hover:brightness-110 shrink-0"
        on:click={start_menu}>
    </div>

    <ProgramTray></ProgramTray>
    <SystemTray></SystemTray>
</div>