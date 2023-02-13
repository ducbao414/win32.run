export let make = ({type, originator}) => {
    //originator: program
    return {
        required_width: 180 + 20,
        required_height: 27*4 + 20,
        menu: [
            [
                {
                    name: 'Minimize',
                    action: () => {originator.window.on_click_minimize();},
                    disabled: originator.window.minimized,
                    icon: '/images/xp/icons/tile_minimize.png',
                    icon_size: 10,
                    icon_type: 'monotone'
                },
                {
                    name: 'Restore',
                    action: () => {originator.window.restore();},
                    disabled: !originator.window.maximized && !originator.window.minimized,
                    icon: '/images/xp/icons/tile_restore.png',
                    icon_size: 10,
                    icon_type: 'monotone'
                },
                {
                    name: 'Maximize',
                    action: () => {originator.window.on_click_maximize();},
                    disabled: originator.window.maximized || !originator.window.options.resizable,
                    icon: '/images/xp/icons/tile_maximize.png',
                    icon_size: 10,
                    icon_type: 'monotone'
                },
                {
                    name: 'Close',
                    font: 'bold',
                    action: () => {originator.window.on_click_close()},
                    icon: '/images/xp/icons/tile_close.png',
                    icon_size: 10,
                    icon_type: 'monotone'
                }
            ]
        ]
    }
}