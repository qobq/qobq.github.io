import {getResourceManager} from "../Game.js";

export class PlayerManager {

    constructor() {
        this._data = getResourceManager().getData('creature', 'Girl');
    }

    getPlayer(){
        return this._data
    }
}