import {PageManager} from "./manager/PageManager.js";
import {StartPage} from "./view/page/StartPage.js";
import {PlayerManager} from "./manager/PlayerManager.js";
import {ResourceManager} from "./manager/ResourceManager.js";
import {ArchiveManager} from "./manager/ArchiveManager.js";

let pageManager = null;
let playerManager = null;
let resourceManager = null;
let archiveManager = null;

export function initGame(app) {
    initResourceManager().then(()=>{
        playerManager = new PlayerManager();
        archiveManager = new ArchiveManager();
        initPageManager(app);
    });
}

function initPageManager(app) {
    pageManager = new PageManager(app);
    pageManager.registerPage("start", new StartPage(app));
    pageManager.switchTo("start").then();
}

async function initResourceManager() {
    resourceManager = new ResourceManager();
    await resourceManager.loadTable('weapon', 'resource/table/weapon.csv');
    await resourceManager.loadTable('creature', 'resource/table/creature.csv');
    await resourceManager.loadTable('level', 'resource/table/level.csv');
}

export function getPageManager() {
    if (!pageManager) {
        throw new Error("manager not exist");
    }
    return pageManager;
}

export function getPlayerManager() {
    if (!playerManager) {
        throw new Error("manager not exist");
    }
    return playerManager;
}

export function getResourceManager() {
    if (!resourceManager) {
        throw new Error("manager not exist");
    }
    return resourceManager;
}

export function getArchiveManager() {
    if (!archiveManager) {
        throw new Error("manager not exist");
    }
    return archiveManager;
}