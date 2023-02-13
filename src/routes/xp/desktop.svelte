<script>
    import TaskBar from "./task_bar.svelte";
    import WorkSpace from "./work_space.svelte";
    import ContextMenu from "../../lib/components/xp/ContextMenu.svelte";
    import axios from "axios";
    import { get, set, keys } from "idb-keyval";
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import {
        zIndex,
        hardDrive,
        wallpaper,
        queueCommand,
    } from "../../lib/store";
    import StartMenu from "./start_menu.svelte";
    import Welcome from "./welcome.svelte";
    import * as utils from "../../lib/utils";
    let dispatcher = createEventDispatcher();

    let io_worker;

    let unsubscribers = [
        hardDrive.subscribe(async (value) => {
            clearInterval(io_worker);
            io_worker = setTimeout(async () => {
                console.log('update hardDrive');
                await set("hard_drive", $hardDrive);
            }, 1000);
        }),
        wallpaper.subscribe(async (value) => {
            if (value == null) return;
            await set("wallpaper", value);
        }),
        queueCommand.subscribe((cmd) => {
            if (cmd != null && cmd != "") {
                switch (cmd) {
                    case "shutdown":
                        dispatcher("load_page", {
                            url: "./xp/shutdown.svelte",
                        });
                        queueCommand.set(null);
                        break;
                    case "restart":
                        dispatcher("load_page", {
                            url: "./xp/shutdown.svelte",
                        });
                        break;

                    default:
                        break;
                }
            }
        }),
    ];

    let welcome_scene;
    let fallback_timer;

    onMount(async () => {
        //load other pure js lib
        loadjs([
            "https://www.gstatic.com/charts/loader.js",
            "/js/mammoth.browser.min.js",
            "https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js",
            "https://unpkg.com/@ruffle-rs/ruffle"
        ]);

        welcome_scene.self = welcome_scene;
        fallback_timer = setTimeout(() => {
            welcome_scene.destroy();
        }, 7000)

        let welcome_audio = new Audio("/audio/xp_startup.mp3");
        welcome_audio.addEventListener("canplaythrough", (e) => {
            console.log('canplaythrough');
            if(welcome_scene){
                welcome_audio.play().catch(async (e) => {
                    await utils.sleep(4000);
                    clearTimeout(fallback_timer);
                    welcome_scene.destroy();
                });
            }
        });
        welcome_audio.addEventListener("ended", (e) => {
            console.log("xp_startup audio ended");
            clearTimeout(fallback_timer);
            welcome_scene.destroy();
        });

    });

    onDestroy(() => {
        for (let fn of unsubscribers) {
            fn();
        }
        clearInterval(io_worker);
    });
</script>

<div id="desktop" class="absolute inset-0 p-0">
    <div class="absolute z-0 left-0 right-0 top-0 bottom-[30px]">
        <WorkSpace />
    </div>

    <TaskBar />
    <StartMenu />
    <ContextMenu />
</div>

<Welcome bind:this={welcome_scene} />
