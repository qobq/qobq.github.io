import { initGame } from "./Game.js";

let pixiApp = null;

function resizeApp() {
    if (pixiApp) {
        const container = document.getElementById('app-container');

        pixiApp.view.style.width = `${container.clientHeight / 2}px`;
        pixiApp.view.style.height = `${container.clientHeight}px`;
        pixiApp.view.style.position = 'absolute';
        pixiApp.view.style.left = '50%';
        pixiApp.view.style.top = '50%';
        pixiApp.view.style.transform = 'translate(-50%, -50%)';
    }
}

function initApp() {

    pixiApp = new PIXI.Application({
        width: 2000,
        height: 4000,
        backgroundColor: 0x111111,
        resolution: 1,
    });

    const container = document.getElementById('app-container');

    container.appendChild(pixiApp.view);

    resizeApp();

    const font = new FontFace('Maple Mono CN', 'url(resource/font/MapleMono-NF-CN-Regular.woff2)');
    font.load().then(() => {
        document.fonts.add(font);
        document.fonts.ready.then(() => {

            PIXI.Text.defaultStyle = new PIXI.TextStyle({
                fontFamily: 'Maple Mono CN',
                fontSize: 100,
                fill: 0xFFFFFF,
                stroke: 0x000000,
                strokeThickness: 5,
            });

            initGame(pixiApp);
        });
    });
}

function resizeContainer() {
    const container = document.getElementById('app-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowHeight > 2 * windowWidth) {
        container.style.width = `${windowWidth}px`;
        container.style.height = `${windowWidth * 2}px`;
    } else {
        container.style.width = `${windowHeight * 0.5}px`;
        container.style.height = `${windowHeight}px`;
    }

    resizeApp();
}

window.addEventListener('load', resizeContainer);
window.addEventListener('resize', resizeContainer);

initApp();