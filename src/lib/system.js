export let default_wallpapers = [
    {
      "name": "Ascent",
      "type": "remote",
      "path": "/images/xp/Ascent.jpg",
      "css": "url(/images/xp/Ascent.jpg)"
    },
    {
      "name": "Autumn",
      "type": "remote",
      "path": "/images/xp/Autumn.jpg",
      "css": "url(/images/xp/Autumn.jpg)"
    },
    {
      "name": "Azul",
      "type": "remote",
      "path": "/images/xp/Azul.jpg",
      "css": "url(/images/xp/Azul.jpg)"
    },
    {
      "name": "Bliss",
      "type": "remote",
      "path": "/images/xp/Bliss.jpg",
      "css": "url(/images/xp/Bliss.jpg)"
    },
    {
      "name": "Follow",
      "type": "remote",
      "path": "/images/xp/Follow.jpg",
      "css": "url(/images/xp/Follow.jpg)"
    },
    {
      "name": "Friend",
      "type": "remote",
      "path": "/images/xp/Friend.jpg",
      "css": "url(/images/xp/Friend.jpg)"
    },
    {
      "name": "Moon flower",
      "type": "remote",
      "path": "/images/xp/Moonflower.jpg",
      "css": "url(/images/xp/Moonflower.jpg)"
    },
    {
      "name": "Radiance",
      "type": "remote",
      "path": "/images/xp/Radiance.jpg",
      "css": "url(/images/xp/Radiance.jpg)"
    },
    {
      "name": "Red moon desert",
      "type": "remote",
      "path": "/images/xp/Redmoondesert.jpg",
      "css": "url(/images/xp/Redmoondesert.jpg)"
    },
    {
      "name": "Tulips",
      "type": "remote",
      "path": "/images/xp/Tulips.jpg",
      "css": "url(/images/xp/Tulips.jpg)"
    },
    {
      "name": "Vortec space",
      "type": "remote",
      "path": "/images/xp/Vortecspace.jpg",
      "css": "url(/images/xp/Vortecspace.jpg)"
    },
    {
      "name": "Wind",
      "type": "remote",
      "path": "/images/xp/Wind.jpg",
      "css": "url(/images/xp/Wind.jpg)"
    }
];


export let SortOptions = Object.freeze({
  NONE: 0,
  NAME: 1,
  SIZE: 2,
  DATE_CREATED: 3,
  DATE_MODIFIED: 4,
})

export let SortOrders = Object.freeze({
  ASCENDING: 0,
  DESCENDING: 1
})

export let my_music_id = 'tjhEdnks6c4wPBWcqyoWQz';
export let my_pictures_id = 'neRHxqN8SPnG1xrivxXxRq';

export let my_computer = [
  'cTbkbrM4qjwF3UfmCoFkEK',//c drive
  'ejq5mVcfZA2fzR1uwYUC6n',//d drive
  'o1owmZuXKQdXR5vFxaBBW3',//f removable storage
  my_music_id,//my music
  my_pictures_id//my pictures
]

export let recycle_bin_id = "aEF1hjqok52tpJPsNeXMGP";

export let desktop_folder = 'nt1QdU9Sws26H26UNQZcQU';

export let wallpapers_folder = 'uZ7fBbvbzFvQgAmJZpVbEb';

export let bliss_wallpaper= 'w38WCkdn67K6JsvjdGug6y';

export let protected_items = [...my_computer, recycle_bin_id, desktop_folder, wallpapers_folder];

export let hidden_items = [recycle_bin_id,desktop_folder, wallpapers_folder];

export let supported_wallpaper_filetypes = ['.jpg', '.jpeg', '.png', '.webp'];

let image_viewer = {
  path: './programs/image_viewer.svelte',
  icon: '/images/xp/icons/WindowsPictureandFaxViewer.png',
  name: 'Image Viewer'
}

let paint_program = {
  path: './programs/paint.svelte',
  icon: '/images/xp/icons/Paint.png',
  name: 'Paint'
}
let photon_program = {
  path: './programs/photon.svelte',
  icon: '/images/xp/icons/Photon.png',
  name: 'Photon Editor'
}
let mpc_program = {
  path: './programs/media_player_classic.svelte',
  icon: '/images/xp/icons/MPC.png',
  name: 'Media Player Classic'
}
let foxit_reader_program = {
  path: './programs/foxit_reader.svelte',
  icon: '/images/xp/icons/PDF.png',
  name: 'Foxit Reader'
}
let msword_program = {
  path: './programs/microsoft_word.svelte',
  icon: '/images/xp/icons/DOC.png',
  name: 'Microsoft Word 2003'
}
let koodo_program = {
  path: './programs/koodo.svelte',
  icon: '/images/xp/icons/Koodo.png',
  name: 'Koodo Reader'
}
let notepad_program = {
  path: './programs/notepad.svelte',
  icon: '/images/xp/icons/Notepad.png',
  name: 'Notepad'
}
let ie_program = {
  path: './programs/internet_explorer.svelte',
  icon: '/images/xp/icons/InternetExplorer6.png',
  name: 'Microsoft Internet Explorer'
}
let winrar_program = {
  path: './programs/winrar.svelte',
  icon: '/images/xp/icons/RAR.png',
  name: 'WinRAR'
}

let flash_player_program = {
  path: './programs/flash_player.svelte',
  icon: '/images/xp/icons/FlashPlayer.png',
  name: 'Flash Player'
}

export let doctypes = {
  '.wav': [mpc_program],
  '.mp4': [mpc_program],
  '.mp3': [mpc_program],
  '.webp': [image_viewer],
  '.bmp': [image_viewer, paint_program, photon_program],
  '.png': [image_viewer, photon_program,paint_program],
  '.jpg': [image_viewer, photon_program,paint_program ],
  '.jpeg': [image_viewer, photon_program,paint_program],
  '.gif': [image_viewer],
  '.pdf': [foxit_reader_program,koodo_program],
  '.docx': [msword_program,koodo_program],
  '.epub': [koodo_program],
  '.azw3': [koodo_program],
  '.mobi': [koodo_program],
  '.djvu': [koodo_program],
  '.mht': [koodo_program],
  '.rtf': [koodo_program],
  '.fb2': [koodo_program],
  '.cbr': [koodo_program],
  '.cbz': [koodo_program],
  '.html': [ie_program, koodo_program, notepad_program],
  '.js': [notepad_program],
  '.vbs': [notepad_program],
  '.css': [notepad_program],
  '.txt': [notepad_program],
  '.zip': [winrar_program],
  '.rar': [winrar_program],
  '.tar': [winrar_program],
  '.7z': [winrar_program],
  '.swf': [flash_player_program]
}

export let icons = {
  '.mp3': 'MPC_audio.png',
  '.wav': 'MPC_audio.png',
  '.mp4': 'MPC_video.png',
  '.ogg': 'MPC_video.png',
  '.webm': 'MPC_video.png',
  '.exe': 'ApplicationWindow.png',
  '.xml': 'XML.png',
  '.dll': 'DLL.png',
  '.rtf': 'RTF.png',
  '.tiff': 'TIFF.png',
  '.vbs': 'VBS.png',
  '.ttf': 'Font.png',
  '.bat': 'Bat.png',
  '.txt': 'TXT.png',
  '.jpg': 'JPG.png',
  '.jpeg': 'JPG.png',
  '.png': 'TIFF.png',
  '.webp': 'TIFF.png',
  '.bmp': 'Bitmap.png',
  '.pdf': 'PDF.png',
  '.docx': 'DOC.png',
  '.epub': 'BOOK.png',
  '.azw3': 'BOOK.png',
  '.mobi': 'BOOK.png',
  '.html': 'URL.png',
  '.js': 'JavaScript.png',
  '.vbs': 'VBS.png',
  '.css': 'CSS.png',
  '.rar': 'RAR.png',
  '.zip': 'RAR.png',
  '.7z': 'RAR.png',
  '.tar': 'RAR.png',
  '.srt': 'SUB.png',
  '.vtt': 'SUB.png',
  '.gif': 'GIF.png',
  '.swf': 'SWF.png'
}

export let archive_exts = ['.rar', '.zip', '.7z', '.tar']
export let previewable_exts = ['.jpeg', '.jpg', '.png', '.webp', '.bmp']