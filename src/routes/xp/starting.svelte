<script>
    import * as utils from '../../lib/utils';
    import { onMount, createEventDispatcher } from 'svelte';
    import {set, get} from 'idb-keyval';
    import axios from 'axios';
    import { hardDrive, wallpaper, contextMenu } from '../../lib/store';
    import { bliss_wallpaper, wallpapers_folder, SortOptions, SortOrders } from '../../lib/system';
    let dispatcher = createEventDispatcher();

    let assets_loaded = false;

    let remote_files = ["/files/blue_hill.jpg","/files/new_stories.mp3","/files/sunset.jpg","/files/symphony_9.mp3","/files/wallpapers/Ascent.jpg","/files/wallpapers/Autumn.jpg","/files/wallpapers/Azul.jpg","/files/wallpapers/Bliss.jpg","/files/wallpapers/Follow.jpg","/files/wallpapers/Friend.jpg","/files/wallpapers/Moonflower.jpg","/files/wallpapers/Radiance.jpg","/files/wallpapers/Redmoondesert.jpg","/files/wallpapers/Tulips.jpg","/files/wallpapers/Wind.jpg","/files/water_lily.jpg","/files/winter.jpg"];

    let images = ["/images/95/0.png","/images/ms.png","/images/radio_check.png","/images/xp/battery_cell.png","/images/xp/checkmark.png","/images/xp/copying.gif","/images/xp/crt_monitor.png","/images/xp/icons/876.png","/images/xp/icons/AccessibilityWizard.png","/images/xp/icons/AddressBook.png","/images/xp/icons/AdventureMiner.png","/images/xp/icons/AgeOfWar.png","/images/xp/icons/ApplicationWindow.png","/images/xp/icons/ArmyWarfare.png","/images/xp/icons/BAT.png","/images/xp/icons/BOOK.png","/images/xp/icons/Back.png","/images/xp/icons/BackupWizard.png","/images/xp/icons/BigFarm.png","/images/xp/icons/Bitmap.png","/images/xp/icons/Briefcase.png","/images/xp/icons/BubblePop.png","/images/xp/icons/CSS.png","/images/xp/icons/Calculator.png","/images/xp/icons/Charmap.png","/images/xp/icons/CommandPrompt.png","/images/xp/icons/ControlPanel.png","/images/xp/icons/CopyingConflict.png","/images/xp/icons/Critical.png","/images/xp/icons/CursedTreasure.png","/images/xp/icons/DLL.png","/images/xp/icons/DOC.png","/images/xp/icons/DayD.png","/images/xp/icons/Default.png","/images/xp/icons/DeleteConfirmation.png","/images/xp/icons/Desktop.png","/images/xp/icons/DiskCleanup.png","/images/xp/icons/DiskDefragmenter.png","/images/xp/icons/DisplayProperties.png","/images/xp/icons/DualForceIdle.png","/images/xp/icons/Email.png","/images/xp/icons/Empire.png","/images/xp/icons/Exit.png","/images/xp/icons/Explorer.png","/images/xp/icons/Favorites.png","/images/xp/icons/Fax.png","/images/xp/icons/FileandSettingsTransferWizard.png","/images/xp/icons/FlashPlayer.png","/images/xp/icons/FloppyDisk.png","/images/xp/icons/FolderClosed.png","/images/xp/icons/FolderView-Classic.png","/images/xp/icons/FolderView.png","/images/xp/icons/Font.png","/images/xp/icons/Forward.png","/images/xp/icons/FoxitReader.png","/images/xp/icons/GIF.png","/images/xp/icons/Go.png","/images/xp/icons/GrandPrix.png","/images/xp/icons/HelpandSupport.png","/images/xp/icons/HighwayRacer.png","/images/xp/icons/HyperTerminal.png","/images/xp/icons/IEHistory.png","/images/xp/icons/IEHome.png","/images/xp/icons/IERefresh.png","/images/xp/icons/IEStop.png","/images/xp/icons/Infiltrate.png","/images/xp/icons/Information.png","/images/xp/icons/InternetExplorer6.png","/images/xp/icons/InternetShortcut.png","/images/xp/icons/JPG.png","/images/xp/icons/Java.png","/images/xp/icons/JavaScript.png","/images/xp/icons/Keyboard.png","/images/xp/icons/Koodo.png","/images/xp/icons/LocalDisk.png","/images/xp/icons/Logout.png","/images/xp/icons/MPC.png","/images/xp/icons/MPC_audio.png","/images/xp/icons/MPC_video.png","/images/xp/icons/MSWord.png","/images/xp/icons/Magnifier.png","/images/xp/icons/Maximize.png","/images/xp/icons/MineCraft.png","/images/xp/icons/Minesweeper.png","/images/xp/icons/Minimize.png","/images/xp/icons/Mute.png","/images/xp/icons/MyComputer.png","/images/xp/icons/MyMusic.png","/images/xp/icons/MyNetworkPlaces.png","/images/xp/icons/MyPictures.png","/images/xp/icons/Narrator.png","/images/xp/icons/NetworkConnection.png","/images/xp/icons/NetworkConnections.png","/images/xp/icons/NetworkSetup.png","/images/xp/icons/NewFolder.png","/images/xp/icons/NewNetworkConnection.png","/images/xp/icons/Notepad.png","/images/xp/icons/On-ScreenKeyboard.png","/images/xp/icons/PDF.png","/images/xp/icons/Paint.png","/images/xp/icons/Photon.png","/images/xp/icons/Power.png","/images/xp/icons/Programs.png","/images/xp/icons/Properties.png","/images/xp/icons/Publishtoweb.png","/images/xp/icons/Python.png","/images/xp/icons/RAR.png","/images/xp/icons/RTF.png","/images/xp/icons/RecycleBinempty.png","/images/xp/icons/RecycleBinfull.png","/images/xp/icons/RemoteDesktop.png","/images/xp/icons/RemovableMedia.png","/images/xp/icons/Restart.png","/images/xp/icons/Restore.png","/images/xp/icons/Run.png","/images/xp/icons/SUB.png","/images/xp/icons/SWF.png","/images/xp/icons/SantaParkour.png","/images/xp/icons/ScheduledTasks.png","/images/xp/icons/Search.png","/images/xp/icons/SecurityCenter.png","/images/xp/icons/SecurityError.png","/images/xp/icons/Setup.png","/images/xp/icons/SharedFolder.png","/images/xp/icons/Shortcutoverlay.png","/images/xp/icons/Skydom.png","/images/xp/icons/Solitaire.png","/images/xp/icons/SpaceBattle.png","/images/xp/icons/Standby.png","/images/xp/icons/StartMenuPrograms.png","/images/xp/icons/StartMenuProgramsAlt.png","/images/xp/icons/StickWar.png","/images/xp/icons/Stop.png","/images/xp/icons/Synchronize.png","/images/xp/icons/SystemInformation.png","/images/xp/icons/SystemRestore.png","/images/xp/icons/TIFF.png","/images/xp/icons/TXT.png","/images/xp/icons/TeacherSimulator.png","/images/xp/icons/TourXP.png","/images/xp/icons/TrainMaster.png","/images/xp/icons/URL.png","/images/xp/icons/Up.png","/images/xp/icons/VBS.png","/images/xp/icons/Volume.png","/images/xp/icons/VolumeLevel.png","/images/xp/icons/Vortecspace.jpg","/images/xp/icons/WMV.png","/images/xp/icons/WindowsCatalog.png","/images/xp/icons/WindowsMediaPlayer9.png","/images/xp/icons/WindowsMessenger.png","/images/xp/icons/WindowsPictureandFaxViewer.png","/images/xp/icons/WindowsUpdate.png","/images/xp/icons/WirelessNetworkSetup.png","/images/xp/icons/Wizard.png","/images/xp/icons/Wordpad.png","/images/xp/icons/XML.png","/images/xp/icons/Zipfolder.png","/images/xp/icons/explorerproperties.png","/images/xp/icons/tile_close.png","/images/xp/icons/tile_maximize.png","/images/xp/icons/tile_minimize.png","/images/xp/icons/tile_restore.png","/images/xp/radio_check.png","/images/xp/start_btn_normal.png","/images/xp/tile_close.png","/images/xp_loading_logo.jpg","/images/xp_loading_mslogo.jpg","/images/xp_logo.png","/images/xp_logo_horizontal.png"];

    let audios = ["/audio/xp_installing.mp3","/audio/xp_shutdown.mp3","/audio/xp_startup.mp3"];

    let fonts = ["/fonts/levi.ttf","/fonts/ms_sans_serif.ttf","/fonts/ms_sans_serif_bold.ttf","/fonts/trebuchet.ttf"];

    let empties = ["/empty/empty.png","/empty/empty.txt"];

    onMount(async () => {
        await load_hard_drive();
        await load_wallpaper();
        
        load_assets([
            ...audios,
            ...images,
            ...remote_files,
            ...fonts,
            ...empties,
        ], () => {
            assets_loaded = true;
        });

        let wait_count = 0;
        do {
            await utils.sleep(5000);

            wait_count++;
            if(wait_count >= 2) break;
        } while (!assets_loaded);
        
        preload_iframes();
        preload_context_menus();
        console.log('after preload_context_menu');

        if(utils.is_installing_windows()){
            dispatcher('load_page', {url: './installation/95/installing.svelte'});
        } else {
            dispatcher('load_page', {url: './xp/desktop.svelte'});
        }
        
    })

    async function load_hard_drive(){
        let hard_drive = await get('hard_drive');
        if(hard_drive == null){
            hard_drive = (await axios({
                method: 'get',
                url: '/json/hard_drive.json'
            })).data;
            await set('hard_drive', hard_drive);
        }
        migrate_files_format(hard_drive);
        console.log(hard_drive);
        hardDrive.set(hard_drive);
    }

    function migrate_files_format(drive){
        let now = (new Date()).getTime();
        for(let key of Object.keys(drive)){
            let obj = drive[key];
            if(obj.children == null){
                obj.children = [...obj.files, ...obj.folders];
                delete obj.files;
                delete obj.folders;
            }
            if(obj.date_created == null){
                obj.date_created = now;
            }
            if(obj.date_modified == null){
                obj.date_modified = now;
            }
            if(obj.sort_option == null){
                obj.sort_option = SortOptions.NONE;
            }
            if(obj.sort_order == null){
                obj.sort_order = SortOrders.ASCENDING;
            }
        }
    }

    async function load_wallpaper(){
        $wallpaper = await get('wallpaper');
        if($wallpaper == null){
            $wallpaper = bliss_wallpaper;
            await set('wallpaper', bliss_wallpaper);
        }
    }

    function preload_iframes(){
        let urls = [
            '/html/foxit_reader/web/viewer.html',
            '/html/jspaint/index.html',
            '/html/koodo/index.html',
            '/html/msword/index.html',
            '/html/photon/app/index.html',
            '/html/notepad/index.html'
        ];
        let parent = document.querySelector('#iframe-preload');
        for(let url of urls){
            let iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.inset = '0';
            iframe.src = url;
            iframe.onload = (e) => {
                console.log('loaded ', url);
                e.target.remove();
            };
            parent.appendChild(iframe);
        }
    }

    function preload_context_menus(){
        let types = ['ProgramTile', 'Desktop', 'FSVoid', 'FSItem', 'RecycleBin'];
        for(let type of types){
            contextMenu.set({x: -1000, y: -1000, type, originator: {}});
        }
    }

</script>

<div class="absolute inset-0 bg-black overflow-hidden text-slate-100">
    <div class="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] animate-fadein">
        <img src="/images/xp_loading_logo.jpg" alt="" width="400px">
        <div class="xp-loader">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>

    <div class="absolute left-8 bottom-8 animate-fadein text-base font-sans">
        <p>Copyright &copy; Microsoft Corporation</p>
    </div>
    <div class="absolute right-8 bottom-8 animate-fadein">
        <img src="/images/xp_loading_mslogo.jpg" width="120px" alt="">
    </div>

    

</div>


<style>
    .xp-loader{
        width: 150px;
        height: 20px;
        border: 2px solid #b2b2b2;
        border-radius: 7px;
        margin: 0 auto;
        margin-top: 150px;
        padding: 2px 1px;
        overflow: hidden;
        font-size: 0;
        }
    .xp-loader div{
        width: 9px;
        height: 100%;
        background: linear-gradient(to bottom, #2838c7 0%,#5979ef 17%,#869ef3 32%,#869ef3 45%,#5979ef 59%,#2838c7 100%);
        display: inline-block;
        margin-right: 2px;
        animation: loader 2s infinite;
        animation-timing-function: linear;
    }

    @keyframes loader{
    0%{
        transform: translate(-30px);
    }
    100%{
        transform: translate(150px);
    }
    }

</style>