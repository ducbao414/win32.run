import { writable } from "svelte/store";
import { default_wallpapers } from './system';

export let queueProgram = writable({});
export let runningPrograms = writable([]);

export let selectingItems = writable([]);
export let contextMenu = writable(null);
export let zIndex = writable(0);

export let wallpaper = writable(null);

export let systemVolume = writable(1);

export let hardDrive = writable(null);
export let clipboard = writable([]);
export let clipboard_op = writable('copy');
export let queueCommand = writable(null);