<script>
    import Window from '../../../lib/components/xp/Window.svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive, queueProgram } from '../../../lib/store'
    import * as utils from '../../../lib/utils';
    import * as fs from '../../../lib/fs';
    import DumbProgress from '../../../lib/components/xp/DumbProgress.svelte';
    import short from 'short-uuid';
    

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let fs_item;
    export let exec_path;

    let supported_types = [
        {
            "name": "Portable Network Graphics",
            "mime": "image/png",
            "value": "image/png",
            "ext": ".png"
        },
        {
            "name": "JPEG images",
            "mime": "image/jpeg",
            "value": "image/jpeg",
            "ext": ".jpg"
        },
        {
            "name": "JPEG images",
            "mime": "image/jpeg",
            "value": "image/jpeg",
            "ext": ".jpeg"
        },
        {
            "name": "Windows OS/2 Bitmap Graphics",
            "mime": "image/bmp",
            "value": "image/bmp",
            "ext": ".bmp"
        }
    ]
    supported_types = supported_types.map(el => {
        el.name = el.name + ' (' + el.ext + ')';
        return el;
    })

    let iframe;
    let iframe_loaded = false;

    $: {
        if(fs_item && window) {
            window.update_title(fs_item.name)
        }
    }

    export async function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != self));
        self.$destroy();
    }

    export let options = {
        title: fs_item == null ? 'Paint' : fs_item.name,
        min_width: 500,
        min_height: 400,
        width: 700,
        height: 500,
        icon: '/images/xp/icons/Paint.png',
        id: id,
        exec_path
    };

    async function open_in_new_window(){
        let selected_items = 
            await pick_file_dialog({node_ref: window.node_ref, filetypes_desc: 'Image Files', filetypes: supported_types.map(el => el.ext)})
        let item = $hardDrive[selected_items[0]];
        queueProgram.set({
            path: './programs/paint.svelte',
            fs_item: item
        })
    }

    async function pick_file(){
        
        let selected_items = 
            await pick_file_dialog({node_ref: window.node_ref, filetypes_desc: 'Image Files', filetypes: supported_types.map(el => el.ext)})
        fs_item = $hardDrive[selected_items[0]];
        let file = await fs.get_file(selected_items[0]);
        console.log({fs_item});
        return file;
    }
    
    async function pick_file_dialog({node_ref, filetypes_desc, filetypes}){

        return new Promise(async (resolve, reject) => {
            const OpenModal = (await import('../../../lib/components/xp/OpenModal.svelte')).default;
            let modal = new OpenModal({
                target: node_ref,
                props:{filetypes, filetypes_desc}
            })
            modal.self = modal;
            modal.on_open = () => {
                resolve(modal.selected_items)
                modal.destroy();
            }
        })
    }

    async function save_file_as(){
        console.log(fs_item);
        let current_filetype = supported_types.find(el => el.ext == fs_item?.ext);
        if(current_filetype == null){
            current_filetype = supported_types[0]
        }

        let {parent_id, filename, selected_filetype} = await save_file_as_dialog({
            id: fs_item?.parent, node_ref: window.node_ref, filetypes: supported_types, current_filetype
        });
        console.log(selected_filetype);

        let canvas = iframe.contentDocument.querySelector(".main-canvas");
        canvas.toBlob(async (blob) => {
            let file = new File([blob], filename);
            let new_id = short.generate();
            await fs.save_file_as(filename, selected_filetype.ext, file, parent_id, new_id);
            if(fs_item == null){
                fs_item = $hardDrive[new_id];
            }
            
        }, selected_filetype.mime)
    }

    async function save_file_as_dialog({node_ref, filetypes, id, current_filetype}){

        return new Promise(async (resolve, reject) => {
            const SaveModal = (await import('../../../lib/components/xp/SaveModal.svelte')).default;
            let modal = new SaveModal({
                target: node_ref,
                props:{filetypes, selected_filetype: current_filetype, id}
            })
            modal.self = modal;
            modal.on_save = () => {
                resolve({parent_id: modal.parent_id, filename: modal.filename, selected_filetype: modal.selected_filetype})
                modal.destroy();
            }
        })
        }

    async function setup_paint(){
        iframe_loaded = true;
        var jspaint = iframe.contentWindow;
        jspaint.set_theme("classic.css");
        jspaint.open_in_new_window = open_in_new_window;
        jspaint.open_empty_window = () => {
            queueProgram.set({
                path: './programs/paint.svelte',
            })
        }
        
        if(fs_item != null){
            console.log({fs_item});
            let file = await fs.get_file(fs_item.id);
            console.log(file);
            jspaint.open_from_file(file);
        }
        // Wait for systemHooks object to exist (the iframe needs to load)
        waitUntil(()=> jspaint.systemHooks, 500, ()=> {
            // Hook in
            load_theme();
            jspaint.systemHooks.showSaveFileDialog = async ({ formats, defaultFileName, defaultPath, defaultFileFormatID, getBlob, savedCallbackUnreliable, dialogTitle }) => {
                await save_file_as();
            };

            jspaint.systemHooks.showOpenFileDialog = async ({ formats }) => { 
                let file = await pick_file();
                return {file, file_handle: file};
            };

            jspaint.systemHooks.writeBlobToHandle = async (save_file_handle, blob) => {
                console.log('writeBlobtoHandle');
                if(fs_item != null){
                    let ext = fs_item?.ext || '.png';
                    let mimetype = utils.ext_to_mime(ext, 'image/png');
                    console.log({mimetype});

                    let canvas = iframe.contentDocument.querySelector(".main-canvas");
                    canvas.toBlob((blob) => {
                        let file = new File([blob], fs_item.name);
                        fs.save_file(fs_item.id, file);
                        window.show_toast({message: 'Changes Saved!'})
                    }, mimetype)
                } else {
                    save_file_as();
                }
            };

            iframe.contentDocument.querySelector('.menus').style.pointerEvents = 'auto'
        });
        // General function to wait for a condition to be met, checking at regular intervals
        function waitUntil(test, interval, callback) {
            if (test()) {
                callback();
            } else {
                setTimeout(waitUntil, interval, test, interval, callback);
            }
        }
    }

    function load_theme(){
        iframe.contentWindow.load_theme_from_text(`
        ; Copyright © Microsoft Corp.

        [Theme]
        ; Windows Classic - IDS_THEME_DISPLAYNAME_CLASSIC
        DisplayName=Windows XP Classic
        SetLogonBackground=0

        ; Computer - SHIDI_SERVER
        [CLSID\\{20D04FE0-3AEA-1069-A2D8-08002B30309D}\\DefaultIcon]
        DefaultValue=%SystemRoot%\\System32\\imageres.dll,-109

        ; UsersFiles - SHIDI_USERFILES
        [CLSID\\{59031A47-3F72-44A7-89C5-5595FE6B30EE}\\DefaultIcon]
        DefaultValue=%SystemRoot%\\System32\\imageres.dll,-123

        ; Network - SHIDI_MYNETWORK
        [CLSID\\{F02C1A0D-BE21-4350-88B0-7367FC96EF3C}\\DefaultIcon]
        DefaultValue=%SystemRoot%\\System32\\imageres.dll,-25

        ; Recycle Bin - SHIDI_RECYCLERFULL SHIDI_RECYCLER
        [CLSID\\{645FF040-5081-101B-9F08-00AA002F954E}\\DefaultIcon]
        Full=%SystemRoot%\\System32\\imageres.dll,-54
        Empty=%SystemRoot%\\System32\\imageres.dll,-55

        [Control Panel\\Cursors]
        Arrow=
        Help=
        AppStarting=
        Wait=
        NWPen=
        No=
        SizeNS=
        SizeWE=
        Crosshair=
        IBeam=
        SizeNWSE=
        SizeNESW=
        SizeAll=
        UpArrow=
        DefaultValue=Windows default
        DefaultValue.MUI=@themeui.dll,-2043

        [Control Panel\\Desktop]
        Wallpaper=
        TileWallpaper=0
        WallpaperStyle=10
        Pattern=

        [Control Panel\\Desktop\\WindowMetrics]


        [Control Panel\\Colors]
        ActiveTitle=10 36 106
        Background=58 110 165
        Hilight=10 36 106
        HilightText=255 255 255
        TitleText=255 255 255
        Window=255 255 255
        WindowText=0 0 0
        Scrollbar=212 208 200
        InactiveTitle=128 128 128
        Menu=212 208 200
        WindowFrame=0 0 0
        MenuText=0 0 0
        ActiveBorder=212 208 200
        InactiveBorder=212 208 200
        AppWorkspace=128 128 128
        ButtonFace=212 208 200
        ButtonShadow=128 128 128
        GrayText=128 128 128
        ButtonText=0 0 0
        InactiveTitleText=212 208 200
        ButtonHilight=255 255 255
        ButtonDkShadow=64 64 64
        ButtonLight=212 208 200
        InfoText=0 0 0
        InfoWindow=255 255 225
        GradientActiveTitle=166 202 240
        GradientInactiveTitle=192 192 192

        [Metrics]
        IconMetrics=76 0 0 0 139 0 0 0 139 0 0 0 1 0 0 0 245 255 255 255 0 0 0 0 0 0 0 0 0 0 0 0 144 1 0 0 0 0 0 0 0 0 0 0 84 97 104 111 109 97 0 119 0 0 7 0 0 0 0 0 216 31 7 0 28 52 1 1 216 31 7 0 176 36 1 1
        NonclientMetrics=84 1 0 0 1 0 0 0 16 0 0 0 16 0 0 0 18 0 0 0 18 0 0 0 245 255 255 255 0 0 0 0 0 0 0 0 0 0 0 0 188 2 0 0 0 0 0 0 0 0 0 0 84 97 104 111 109 97 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 12 0 0 0 15 0 0 0 245 255 255 255 0 0 0 0 0 0 0 0 0 0 0 0 188 2 0 0 0 0 0 0 0 0 0 0 84 97 104 111 109 97 0 0 80 37 11 0 0 0 0 0 140 221 6 0 227 115 247 119 2 40 11 0 7 0 0 0 18 0 0 0 18 0 0 0 245 255 255 255 0 0 0 0 0 0 0 0 0 0 0 0 144 1 0 0 0 0 0 0 0 0 0 0 84 97 104 111 109 97 0 0 0 0 0 0 60 222 6 0 50 71 252 119 120 1 7 0 76 73 252 119 8 6 7 0 245 255 255 255 0 0 0 0 0 0 0 0 0 0 0 0 144 1 0 0 0 0 0 0 0 0 0 0 84 97 104 111 109 97 0 119 0 0 7 0 120 1 7 0 120 1 7 0 40 37 11 0 120 1 7 0 120 1 7 0 245 255 255 255 0 0 0 0 0 0 0 0 0 0 0 0 144 1 0 0 0 0 0 0 0 0 0 0 84 97 104 111 109 97 0 0 92 1 0 0 136 4 0 0 40 37 1 1 0 0 7 0 184 221 6 0 46 75 232 119
        CaptionFont=@themeui.dll,-2037
        SmCaptionFont=@themeui.dll,-2038
        MenuFont=@themeui.dll,-2039
        StatusFont=@themeui.dll,-2040
        MessageFont=@themeui.dll,-2041
        IconFont=@themeui.dll,-2042



        [VisualStyles]
        Path=%SystemRoot%\\Resources\\Themes\\Aero\\AeroLite.msstyles
        ColorStyle=NormalColor
        Size=NormalSize
        HighContrast=4
        ColorizationColor=0X7F000000
        AutoColorization=0
        VisualStyleVersion=10

        [boot]
        SCRNSAVE.EXE=

        [MasterThemeSelector]
        MTSM=RJSPBS


        [Sounds]
        ; IDS_SCHEME_DEFAULT
        SchemeName=@%SystemRoot%\\System32\\mmres.dll,-800
        `);
    }

</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-1 top-0 flex flex-col bg-[rgb(192,192,192)] overflow-hidden">
        <!-- svelte-ignore a11y-missing-attribute -->
        {#if !iframe_loaded}
        <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-slate-500 text-sm p-2 rounded font-mono">
            <DumbProgress style="width:150px;height:15px;"></DumbProgress>
        </div>
        {/if}
        
        <iframe src="/html/jspaint/index.html" bind:this={iframe} width="100%" height="100%" on:load={setup_paint}
            class="inset-0 absolute bg-white {iframe_loaded ? '' : 'opacity-0'}  {window?.z_index == $zIndex ? 'pointer-events-auto' : 'pointer-events-none'}">
        </iframe>
    </div>
    
</Window>


<svelte:options accessors={true}></svelte:options>

