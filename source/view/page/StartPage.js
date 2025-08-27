import { BattleStage } from "../component/BattleStage.js";
import { WeaponSlidePanel } from "../component/WeaponSlidePanel.js";
import { PlayerPanel } from "../component/PlayerPanel.js";
import { GameStatus } from "../../module/design/GameStatus.js";
import { GameWeapon } from "../../module/design/GameWeapon.js";
import { getArchiveManager } from "../../Game.js";

export class StartPage extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;

        // init
        const status = new GameStatus();
        status.weapons["WoodSword"] = new GameWeapon(1);
        getArchiveManager().LocalGameStatus = status;

        this.setup();
    }

    setup() {
        const background = new PIXI.Graphics()
            .beginFill(0x111111)
            .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
            .endFill();
        this.addChild(background);

        this.battleStage = new BattleStage(this.app);
        this.battleStage.position.set(1000, 700);
        this.addChild(this.battleStage);

        this.weaponPanel = new WeaponSlidePanel(this.app);
        this.weaponPanel.position.set(1000, 2800);
        this.addChild(this.weaponPanel);

        this.playerPanel = new PlayerPanel(this.app);
        this.playerPanel.position.set(1000, 1500);
        this.addChild(this.playerPanel);
    }

    onEnter() {
        this.battleStage.onEnter();
    }

    onLeave() {
        this.battleStage.onLeave();
    }
}