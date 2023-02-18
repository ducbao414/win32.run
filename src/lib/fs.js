import { queueProgram, clipboard, selectingItems, hardDrive, clipboard_op } from './store';
import { recycle_bin_id, protected_items, SortOptions, SortOrders } from './system';
import * as utils from './utils';
import { get } from 'svelte/store';
import short from 'short-uuid';
import * as util from './utils';
import * as idb from 'idb-keyval';
import * as finder from './finder';
import {Buffer} from 'buffer';

export function copy(){
    clipboard_op.set('copy');
    clipboard.set(get(selectingItems));
    console.log('copy');
}

export function cut(){
    clipboard_op.set('cut');
    clipboard.set(get(selectingItems));
    console.log('cut');
}

export function paste(id, new_id=null){
    console.log('paste to', id);
    console.log('clipboard_op', get(clipboard_op));
    console.log(get(hardDrive)[id]);
    if(get(hardDrive)[id] == null || get(hardDrive)[id].type == 'file'){
        console.log('target is not a dir');
        return;
    }

    if(get(clipboard).length == 0){
        console.log('clipboard is empty');
        return;
    }

    for(let fs_id of get(clipboard)){
        clone_fs(fs_id, id, new_id);

        if(get(clipboard_op) == 'cut'){
            del_fs(fs_id);
        }
    }

    clipboard_op.set('copy')
    // clipboard.set([]);
}

export function del_fs(id){
    if(protected_items.includes(id)){
        console.log(id, 'is protected');
        return;
    }
    let obj = get(hardDrive)[id];

    let child_ids = [
        ...obj.children
    ]
    if(get(hardDrive)[obj.parent] != null){
        console.log('delete from parent', obj.parent)
        
        hardDrive.update(data => {
            data[obj.parent].children = data[obj.parent].children.filter(el => el != obj.id);
            data[obj.parent].date_modified = (new Date()).getTime();
            return data;
        })
    }
    
    hardDrive.update(data => {
        delete data[id];
        return data;
    })

    for(let child_id of child_ids){
        del_fs(child_id);
    }
}

function dir_contains_dir(a, b){
    if(a == null || b == null) return false;
    if(get(hardDrive)[a] == null) return false;
    if(get(hardDrive)[b] == null) return false;
    if(a == b) return true;
    
    let paths = [];
    while(get(hardDrive)[b].parent != null){
        let parent = get(hardDrive)[b].parent;
        paths.push(parent);
        b = parent;
    }
    return paths.includes(a);

}
export function clone_fs(obj_current_id, parent_id, new_id=null){
    if(dir_contains_dir(obj_current_id, parent_id)){
        console.log('cannot paste item onto itself');
        return;
    }

    let obj = {...get(hardDrive)[obj_current_id]};

    if(new_id == null){
        obj.id = short.generate();
    } else {
        obj.id = new_id;
    }
    
    obj.parent = parent_id;

    let parent_items_names = [
        ...get(hardDrive)[parent_id].children.map(el => get(hardDrive)[el].name),
    ]
    let appendix = 2;
    let basename = obj.basename;
    while(parent_items_names.includes(basename + obj.ext)){
        basename = obj.basename + ' ' + appendix;
        appendix++;
    }
    obj.basename = basename;
    obj.name = basename + obj.ext;
    
    //backup children
    console.log(obj)
    let children = [...obj.children];
    obj.children = [];

    //save to hard drive
    hardDrive.update(data => {
        data[obj.id] = obj;
        return data;
    })
    console.log('cloning', obj.id)

    hardDrive.update(data => {
        data[parent_id].children.push(obj.id);
        data[parent_id].date_modified = (new Date()).getTime();
        return data;
    })

    //recursively clone child items
    for(let child of [...children]){
        clone_fs(child, obj.id);
    }
}


export async function new_fs_item(type, ext, seedname, parent_id, file=null){
    if(type == null || seedname == null || parent_id == null){
        return;
    }

    let now = (new Date()).getTime();
    let item = {
        "id": short.generate(),
        "type": type,
        "path": "",
        "name": "",
        "storage_type": "local",
        "url": short.generate(),
        "ext": ext,
        "level": 0,
        "parent": parent_id,
        "size": 1,
        "children": [],
        "basename": "",
        date_created: now,
        date_modified: now,
        sort_option: SortOptions.NONE,
        sort_order: SortOrders.ASCENDING
    }

    let children = get(hardDrive)[parent_id].children.map(el => get(hardDrive)[el]);

    let parent_items_names = [
        ...children.map(el => el.name)
    ]

    let appendix = 2;
    seedname = utils.sanitize_filename(seedname);
    let basename = seedname;
    while(parent_items_names.includes(basename + ext)){
        basename = seedname  + ' ' + appendix;
        appendix++;
    }
    item.basename = basename;
    item.name = basename + item.ext;

    if(file != null){
        await idb.set(item.url, file);
        item.size = Math.ceil(file.size/1024);

    } else if(type == 'file'){
        console.log('fetch empty file')
        file = await file_from_url(`/empty/empty${item.ext}`, item.name);
        await idb.set(item.url, file);
        item.size = Math.ceil(file.size/1024);

    } else {
        item.url = '';
    }
    

    hardDrive.update(data => {
        data[item.id] = item;
        return data;
    })
    hardDrive.update(data => {
        data[parent_id].children.push(item.id);
        data[parent_id].date_modified = now;
        return data;
    })

    return item.id;
}

export async function new_fs_item_raw(item, parent_id){
    if(parent_id == null){
        return;
    }
    item.id = short.generate();
    item.parent = parent_id;

    if(!['file', 'folder'].includes(item.type)){
        item.type = 'file';
    }
    if(item.storage_type == null){
        item.storage_type = 'local'
    }
    if(item.ext == null){
        item.ext = '';
    }
    if(item.icon == null){
        item.icon = '/images/xp/icons/ApplicationWindow.png'
    }
    if(item.children == null){
        item.children = [];
    }
    let now = (new Date()).getTime();
    item.date_created = now;
    item.date_modified = now;
    item.sort_option = SortOptions.NONE,
    item.sort_order = SortOrders.ASCENDING
    
    let children = get(hardDrive)[parent_id].children.map(el => get(hardDrive)[el]);

    let parent_items_names = [
        ...children.map(el => el.name)
    ]

    let appendix = 2;
    let seedname = utils.sanitize_filename(item.basename);
    let basename = seedname;
    while(parent_items_names.includes(basename + item.ext)){
        basename = seedname  + ' ' + appendix;
        appendix++;
    }
    item.basename = basename;
    item.name = basename + item.ext;

    if(item.file != null){
        item.url = short.generate();
        await idb.set(item.url, item.file);
        item.size = Math.ceil(file.size/1024);
        delete item.file;
    } else if(item.executable){
        item.url = './programs/webapp.svelte';
    }
    

    hardDrive.update(data => {
        data[item.id] = item;
        return data;
    })
    hardDrive.update(data => {
        data[parent_id].children.push(item.id);
        data[parent_id].date_modified = now;
        return data;
    })

    return item.id;
}

export function get_path(id){
    return finder.to_url(id);
}

export async function save_file(fs_id, file){
    if(get(hardDrive)[fs_id] == null){
        console.log(fs_id, 'not exist');
        return;
    }
    let url = short.generate();
    await idb.set(url, file);

    let parent_id = get(hardDrive)[fs_id].parent;
    let now = (new Date()).getTime();
    hardDrive.update(data => {
        data[fs_id].url = url;
        data[fs_id].storage_type = 'local';
        data[fs_id].date_modified = now;
        data[parent_id].date_modified = now;
        return data;
    })
}

export async function save_file_as(basename, ext, file, parent_id, new_id=null){
    ext = ext.toLowerCase();
    if(util.extname(basename) == ext){
        basename = util.basename(basename, ext);
    }

    let url = short.generate();
    await idb.set(url, file);

    if(new_id == null){
        new_id = short.generate();
    }

    let now = (new Date()).getTime();
    let obj = {
        "id": new_id,
        "type": 'file',
        "path": "",
        "name": basename + ext,
        "storage_type": "local",
        "url": url,
        "ext": ext,
        "level": 0,
        "parent": parent_id,
        "size": Math.round(file.size/1024),
        "children": [],
        "basename": basename,
        date_created: now,
        date_modified: now,
        sort_option: SortOptions.NONE,
        sort_order: SortOrders.ASCENDING
    }

    let parent_items_names = [
        ...get(hardDrive)[parent_id].children.map(el => get(hardDrive)[el].name)
    ]
    let appendix = 2;
    basename = obj.basename;
    while(parent_items_names.includes(basename + obj.ext)){
        basename = obj.basename + ' ' + appendix;
        appendix++;
    }
    obj.basename = basename;
    obj.name = basename + obj.ext;


    hardDrive.update(data => {
        data[obj.id] = obj;
        data[parent_id].children.push(obj.id);
        data[parent_id].date_modified = now;
        return data;
    })
}

export async function get_file(id){
    let fs_item = get(hardDrive)[id];
    let file;
    if(fs_item.storage_type == 'remote'){
        file = await file_from_url(fs_item.url);
    } else if(fs_item.storage_type == 'local') {
        file = await idb.get(fs_item.url);
        console.log(file);
    }
    file = new File([file], fs_item.name, {type: file.type})
    return file;
}

export async function get_url(id){
    let fs_item = get(hardDrive)[id];

    if(fs_item.storage_type == 'remote'){
        return fs_item.url;
    } else if(fs_item.storage_type == 'local') {
        let file = await idb.get(fs_item.url);
        return URL.createObjectURL(file);
    }
}

export async function file_from_url(url, name, defaultType = 'image/jpeg'){
    try {
        const response = await fetch(url);
        const data = await response.blob();
        return new File([data], name, {
            type: data.type || defaultType,
        });
    } catch (error) {
        return new File([''], 'empty.txt', {
            type: 'text/plain'
        })
    }
}

export async function array_buffer_from_url(url){
    let file = await file_from_url(url);
    return await file.arrayBuffer();
}

export async function buffer_from_url(url){
    let array_buffer = await array_buffer_from_url(url);
    console.log(array_buffer)
    return Buffer.from(array_buffer);
}