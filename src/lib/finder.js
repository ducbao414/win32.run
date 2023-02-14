import { hardDrive } from './store';
import { my_computer} from './system';
import { get } from 'svelte/store';

let computer = my_computer.map(el => get(hardDrive)[el]);
let drives = computer.filter(item => item.type == 'drive' || item.type == 'removable_storage');
 
export function to_url(id){
    if(id == null || get(hardDrive)[id] == null) return null;
    let url = '';
    let current_location = get(hardDrive)[id];
    url = current_location.name + '\\' + url;

    if(current_location.parent == null) return url;
    
    do {
        
        current_location = get(hardDrive)[current_location.parent];
        url = current_location.name + '\\' + url;

        console.log(current_location);
    } while (current_location.parent != null && current_location.parent.length != 0)

    if(url[url.length - 1] == '\\'){
        url = url.slice(0, url.length-1);
    }
    return url;
}

export function to_id_nocase(url){
    if(url == null || url.trim().length == 0) return null;

    let path_components = url.split('\\').filter(item => item.trim().length > 0).map(item => item.trim());
    if(path_components.length == 0) return null;

    let drive = drives.find(item => item.name.toLowerCase() == path_components[0].toLowerCase());
   
    if(drive == null) return null;
    if(path_components.length == 1) return drive.id;

    drive = get(hardDrive)[drive.id];

    let current_location = drive;
    for(let i = 1; i < path_components.length; i++){
        console.log(i);
        console.log(path_components[i]);
        current_location = [
            ...current_location.children.map(id => get(hardDrive)[id])
        ]
        .find(item => item?.name?.toLowerCase() == path_components[i].toLowerCase());
        console.log(current_location);
        if(current_location == null) return null;
        if(i == path_components.length - 1) return current_location.id;
    }

}


export function to_id(url){
    if(url == null || url.trim().length == 0) return null;

    let path_components = url.split('\\').filter(item => item.trim().length > 0).map(item => item.trim());
    console.log(path_components);
    if(path_components.length == 0) return null;

    let drive = drives.find(item => item.name == path_components[0]);
   
    if(drive == null) return null;
    if(path_components.length == 1) return drive.id;

    drive = get(hardDrive)[drive.id];

    let current_location = drive;
    for(let i = 1; i < path_components.length; i++){
        console.log(i);
        console.log(path_components[i]);
        current_location = [
            ...current_location.children.map(id => get(hardDrive)[id])
        ]
        .find(item => item?.name == path_components[i]);
        console.log(current_location);
        if(current_location == null) return null;
        if(i == path_components.length - 1) return current_location.id;
    }

}
