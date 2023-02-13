<svelte:options accessors={true} />

<script>
    import Window from "../../../lib/components/xp/Window.svelte";
    import {
        runningPrograms,
        systemVolume,
        zIndex,
        hardDrive,
        queueProgram,
    } from "../../../lib/store";
    import * as utils from "../../../lib/utils";
    import Menu from "../../../lib/components/xp/Menu.svelte";
    import * as fs from "../../../lib/fs";
    import short from "short-uuid";
    import DumbProgress from "../../../lib/components/xp/DumbProgress.svelte";

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let iframe;
    let iframe_loaded = false;
    let dirty = false;
    let default_title = "Notepad";

    $: {
        let title = "";
        if (fs_item) {
            title = fs_item.name;
        } else {
            title = default_title;
        }
        if (dirty) {
            title += " *";
        }
        if (window) {
            window.update_title(title);
        }
    }

    export let options = {
        title: default_title,
        min_width: 300,
        min_height: 200,
        width: 600,
        height: 500,
        icon: "/images/xp/icons/Notepad.png",
        id: id,
        exec_path
    };

    let menu = [
        {
            name: "File",
            items: [
                //group of items
                [{ name: "Open", action: open_file }],
                [
                    { name: "Save", action: save_file },
                    { name: "Save As", action: save_file_as },
                ],
                [{ name: "Exit", action: destroy }],
            ],
        },
        {
            name: "Edit",
            items: [
                [
                    { name: "Undo", action: () => iframe.contentWindow.undo() },
                    { name: "Redo", action: () => iframe.contentWindow.redo() },
                ],
                [
                    { name: "Find", action: () => iframe.contentWindow.find() },
                    {
                        name: "Replace",
                        action: () => iframe.contentWindow.replace(),
                    },
                ],
                [
                    {
                        name: "Date/Time",
                        action: () =>
                            iframe.contentWindow.insert(
                                new Date().toDateString()
                            ),
                    },
                ],
            ],
        },
        {
            name: "Format",
            items: [
                [
                    {
                        name: "Word Wrap",
                        action: () => iframe.contentWindow.toggle_wrap(),
                    },
                ],
            ],
        },
        {
            name: "View",
            items: [[{ name: "Status Bar" }]],
        },
        {
            name: "Help",
            items: [
                [
                    { 
                        name: "Help Topics", 
                        action: () => {
                            queueProgram.set({
                                path: './programs/internet_explorer.svelte',
                                fs_item: {url: 'https://en.wikipedia.org/wiki/Windows_Notepad'}
                            })
                        }
                    }, 
                    { 
                        name: "About Notepad",
                        action: () => {
                            queueProgram.set({
                                path: './programs/internet_explorer.svelte',
                                fs_item: {url: 'https://en.wikipedia.org/wiki/Windows_Notepad'}
                            })
                        }
                    }
                ]
            ],
        },
    ];

    let supported_types = [
        { name: "Plain Text (.txt)", ext: ".txt" },
        { name: "Web Page (.html)", ext: ".html" },
        { name: "Markdown (.md)", ext: ".md" },
        { name: "Javascript (.js)", ext: ".js" },
        { name: "VBScript (.vbs)", ext: ".vbs" },
    ];

    async function open_file() {
        let item = await pick_file({
            filetypes_desc: "All Files",
            filetypes: [],
        });
        if (fs_item || dirty) {
            queueProgram.set({
                path: "./programs/notepad.svelte",
                fs_item: item,
            });
        } else {
            fs_item = item;
            let file = await fs.get_file(fs_item.id);
            let text = await file.text();
            iframe.contentWindow.set_content(text);
            iframe.contentWindow.set_mode(fs_item.name);
        }
    }

    export async function destroy() {
        if (dirty) {
            let no_action = () => {
                close_program();
            };
            let yes_action = async () => {
                await save_file();
                close_program();
            };
            confirm_exit({
                node_ref: window.node_ref,
                title: "Save Changes",
                message:
                    "Do you want to save the changes you've made before closing this document?",
                yes_action,
                no_action,
            });
        } else {
            close_program();
        }
    }

    function close_program() {
        runningPrograms.update((programs) => programs.filter((p) => p != self));
        self.$destroy();
    }

    async function pick_file({ filetypes_desc, filetypes }) {
        let selected_items = await pick_file_dialog({
            node_ref: window.node_ref,
            filetypes_desc,
            filetypes,
        });
        let item = $hardDrive[selected_items[0]];
        return item;
    }

    async function pick_file_dialog({ node_ref, filetypes_desc, filetypes }) {
        return new Promise(async (resolve, reject) => {
            const OpenModal = (
                await import("../../../lib/components/xp/OpenModal.svelte")
            ).default;
            let modal = new OpenModal({
                target: node_ref,
                props: { filetypes, filetypes_desc },
            });
            modal.self = modal;
            modal.on_open = () => {
                resolve(modal.selected_items);
                modal.destroy();
            };
        });
    }

    async function save_file() {
        if (fs_item != null) {
            let content = iframe.contentWindow.get_content();
            let file = new File([content], fs_item.name, {
                type: utils.ext_to_mime(fs_item.ext),
            });
            fs.save_file(fs_item.id, file);
            iframe.contentWindow.set_mode(fs_item.name);
            window.show_toast({ message: "Changes Saved!", theme: "light" });
        } else {
            await save_file_as();
        }
        iframe.contentWindow.set_clean();
        dirty = false;
    }

    async function save_file_as() {
        console.log(fs_item);
        let current_filetype = supported_types.find(
            (el) => el.ext == fs_item?.ext
        );
        if (current_filetype == null) {
            current_filetype = supported_types[0];
        }

        let { parent_id, filename, selected_filetype } =
            await save_file_as_dialog({
                id: fs_item?.parent,
                node_ref: window.node_ref,
                filetypes: supported_types,
                current_filetype,
            });
        let mime = utils.ext_to_mime(selected_filetype.ext);
        let content = iframe.contentWindow.get_content();
        let file = new File([content], filename, { type: mime });
        console.log(file);
        let new_id = short.generate();
        await fs.save_file_as(
            filename,
            selected_filetype.ext,
            file,
            parent_id,
            new_id
        );
        if (fs_item == null) {
            fs_item = $hardDrive[new_id];
        }
    }

    async function save_file_as_dialog({
        node_ref,
        filetypes,
        id,
        current_filetype,
    }) {
        return new Promise(async (resolve, reject) => {
            const SaveModal = (
                await import("../../../lib/components/xp/SaveModal.svelte")
            ).default;
            let modal = new SaveModal({
                target: node_ref,
                props: { filetypes, selected_filetype: current_filetype, id },
            });
            modal.self = modal;
            modal.on_save = () => {
                resolve({
                    parent_id: modal.parent_id,
                    filename: modal.filename,
                    selected_filetype: modal.selected_filetype,
                });
                modal.destroy();
            };
        });
    }

    async function confirm_exit({
        node_ref,
        title,
        message,
        icon,
        yes_action,
        no_action,
    }) {
        const Dialog = (
            await import("../../../lib/components/xp/Dialog.svelte")
        ).default;
        let buttons = [
            {
                name: "Save",
                action: () => {
                    yes_action();
                    dialog.destroy();
                },
                focus: true,
            },
            {
                name: "Don't Save",
                action: () => {
                    no_action();
                    dialog.destroy();
                },
            },
            {
                name: "Cancel",
                action: () => {
                    dialog.destroy();
                },
            },
        ];
        let dialog = new Dialog({
            target: node_ref,
            props: {
                icon,
                title,
                message,
                buttons,
                button_align: "center",
            },
        });
        dialog.self = dialog;
    }

    async function setup_notepad() {
        console.log(iframe);
        if (fs_item) {
            let file = await fs.get_file(fs_item.id);
            let text = await file.text();
            iframe.contentWindow.set_content(text);
            iframe.contentWindow.set_mode(fs_item.name);
        } else {
            iframe.contentWindow.set_content("");
        }
        iframe.contentWindow.dirty_state_changed = () => {
            dirty = iframe.contentWindow.is_dirty();
            console.log({ dirty });
        };
        iframe.contentWindow.editor_clicked = () => {
            window.focus();
        };
        iframe.contentWindow.parent_key_event = on_key_pressed;
        iframe_loaded = true;
        setTimeout(() => {
            iframe.contentWindow.editor.focus();
        }, 500);
    }

    function on_key_pressed(e) {
        if (window.z_index != $zIndex) return;
        if (!(e.ctrlKey || e.metaKey)) return;

        console.log("keyevent receive in notepad");

        if (e.key == "s") {
            e.preventDefault();
            save_file();
        } else if (e.key == "o") {
            e.preventDefault();
            open_file();
        }
    }
    function on_window_focused() {
        setTimeout(() => {
            if (iframe) {
                iframe.contentWindow.editor.focus();
            }
        }, 500);
    }
</script>

<Window
    {options}
    bind:this={window}
    on_click_close={destroy}
    on_focused={on_window_focused}
>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-xp-yellow">
        <Menu {menu} />
        <!-- svelte-ignore a11y-missing-attribute -->
        <div
            class="absolute inset-0 top-[25px] overflow-auto bg-slate-50 font-sans"
        >
            {#if !iframe_loaded}
                <div
                    class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono"
                >
                    <DumbProgress style="width:150px;height:15px;" />
                </div>
            {/if}

            <iframe
                bind:this={iframe}
                src="/html/notepad/index.html"
                class="w-full h-full {!iframe_loaded ? 'opacity-0' : ''}"
                on:load={setup_notepad}
                frameborder="0"
            />
        </div>
    </div>
</Window>

<svelte:window on:keydown={on_key_pressed} />
