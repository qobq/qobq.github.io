import { SlideContainer } from "./SlideContainer.js";
import { WeaponCard } from "./WeaponCard.js";
import { getArchiveManager, getResourceManager } from "../../Game.js";
import { GameWeapon } from "../../module/design/GameWeapon.js";
import { WeaponDataPanel } from "./WeaponDataPanel.js";

export class WeaponSlidePanel extends PIXI.Container {
    constructor() {
        super();

        const slideContainer = new SlideContainer(2000, 1600, 400, 0x000000, 1);
        this.addChild(slideContainer);
        slideContainer.position.set(-1000, -800);

        const dataTable = getResourceManager().getTable('weapon');

        const weaponArray = Object.values(dataTable).sort((l, r) => l.strength - r.strength);

        if (weaponArray.length < 10) {
            throw new Error("data error");
        }

        for (let i = 0; i < 10; i++) {

            let gameWeapon = getArchiveManager().LocalGameStatus.weapons[weaponArray[i].key];

            if (!gameWeapon) {
                gameWeapon = new GameWeapon();
            }

            const item = new WeaponCard();
            item.setWeapon(weaponArray[i], gameWeapon.level, gameWeapon.appendStrength, gameWeapon.star);
            item.on('click', this.onClick.bind(this));
            slideContainer.addChild(item);
        }

        this.frame = new PIXI.Graphics()
            .lineStyle(5, 0xFFFFFF, 0.1)
            .drawRect(-1000, -800, 2000, 1600);

        this.addChild(this.frame);

        this.weaponDataPanel = new WeaponDataPanel();
        this.addChild(this.weaponDataPanel);
        this.weaponDataPanel.eventMode = 'none';
        this.weaponDataPanel.alpha = 0;
    }

    onClick() {
        this.weaponDataPanel.eventMode = 'static';
        this.weaponDataPanel.alpha = 1;
    }
}