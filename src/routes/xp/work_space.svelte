<script>
    import {onMount, onDestroy } from 'svelte';
    import Wallpaper from "./wallpaper.svelte";
    import {  queueProgram, runningPrograms, selectingItems } from '../../lib/store';
    import _ from 'lodash';
    import short from 'short-uuid';
    import DesktopFolder from './desktop_folder.svelte';
    import * as finder from '../../lib/finder'
    

    let node_ref;
    let workSpaceHeight;

    let unsubscribers = [
        queueProgram.subscribe(program => {
            if(program == null){
                return;
            }
            launch(program);
        })
    ]

    

    onMount(() => {
        
    })

    onDestroy(() => {

    })

    async function launch(program){
        let {fs_item, webapp, copying_obj, target_folder_id, path} = program;

        if(path == './programs/my_computer.svelte'){
            const Program = (await import('./programs/my_computer.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), fs_item, exec_path: path}
            });
            program.self = program;
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })

        } else if(path == './programs/display_properties.svelte'){
            const Program = (await import('./programs/display_properties.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), exec_path: path}
            });
            program.self = program;
            //add to program tray
            // runningPrograms.update(values => {
            //     return [...values, program];
            // })
        } else if(path == './programs/internet_explorer.svelte'){
            let url = await get_url(fs_item);
            const Program = (await import('./programs/internet_explorer.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), url, exec_path: path}
            });
            program.self = program;
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/xp_tour.svelte'){
            const Program = (await import('./programs/xp_tour.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/paint.svelte'){
            const Program = (await import('./programs/paint.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/photon.svelte'){
            const Program = (await import('./programs/photon.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/media_player_classic.svelte'){

            const Program = (await import('./programs/media_player_classic.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            if(fs_item) program.options = {...program.options, title: fs_item.name}

            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/minesweeper.svelte'){
            const Program = (await import('./programs/minesweeper.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, exec_path: path}
            });
            program.self = program;
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        }  else if(path == './programs/properties.svelte'){
            const Program = (await import('./programs/properties.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            if(fs_item) program.options = {...program.options, title: fs_item.name + ' Properties'}
            
        }  else if(path == './programs/disk_properties.svelte'){
            const Program = (await import('./programs/disk_properties.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            if(fs_item) program.options = {...program.options, title: fs_item.display_name + ' Properties'}
            
        }  else if(path == './programs/notepad.svelte'){
            const Program = (await import('./programs/notepad.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
            
        } else if(path == './programs/java.svelte'){
            const Program = (await import('./programs/java.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            if(fs_item) program.options = {...program.options, title: fs_item.display_name};
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/foxit_reader.svelte'){
            const Program = (await import('./programs/foxit_reader.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/microsoft_word.svelte'){
            const Program = (await import('./programs/microsoft_word.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/koodo.svelte'){
            const Program = (await import('./programs/koodo.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/winrar.svelte'){
            const Program = (await import('./programs/winrar.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/zip.svelte'){
            const Program = (await import('./programs/zip.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/webapp.svelte'){
            const Program = (await import('./programs/webapp.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, webapp, exec_path: path + '::' + webapp.url}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/image_viewer.svelte'){
            const Program = (await import('./programs/image_viewer.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/copier.svelte'){

            const Program = (await import('./programs/copier.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, copying_obj, target_folder_id, exec_path: path}
            });
            program.self = program;
        } else if(path == './programs/app_installer.svelte'){

            const Program = (await import('./programs/app_installer.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, copying_obj, target_folder_id, exec_path: path}
            });
            program.self = program;
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } else if(path == './programs/flash_player.svelte'){
            const Program = (await import('./programs/flash_player.svelte')).default;
            let program = new Program({
                target: node_ref,
                props: {id: short.generate(), parentNode: node_ref, fs_item, exec_path: path}
            });
            program.self = program;
            
            //add to program tray
            runningPrograms.update(values => {
                return [...values, program];
            })
        } 

        queueProgram.set(null);
    }

    async function get_url(item){
        if(item == null) return 'https://app.usepanda.com/#/';

        if(item.storage_type == 'local'){
            return finder.to_url(item.id);
        } else {
            return item.url;
        }
    }



</script>

<div id="work-space" bind:this={node_ref} bind:clientHeight={workSpaceHeight} class="absolute inset-0 {$queueProgram != null ? 'waiting': ''}">
    <Wallpaper></Wallpaper>
    <DesktopFolder></DesktopFolder>

    
</div>