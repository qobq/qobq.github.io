import { WeaponIcon } from "./WeaponIcon.js";

export class WeaponDataPanel extends PIXI.Container {
    constructor() {
        super();

        this.pageWidth = 2000;
        this.pageHeight = 1600;

        this.panelWidth = 1600;
        this.panelHeight = 1200;

        this.setup();
    }

    setup() {
        this.background = new PIXI.Graphics()
            .beginFill(0x000000, 0.4)
            .drawRoundedRect(-this.pageWidth / 2, -this.pageHeight / 2, this.pageWidth, this.pageHeight, 0)
            .endFill();
        this.addChild(this.background);

        this.panel = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRoundedRect(-this.panelWidth / 2, -this.panelHeight / 2, this.panelWidth, this.panelHeight, 0)
            .endFill();
        this.addChild(this.panel);

        this.frame = new PIXI.Graphics()
            .lineStyle(5, 0xFFFFFF, 0.1)
            .drawRect(-this.panelWidth / 2, -this.panelHeight / 2, this.panelWidth, this.panelHeight);
        this.addChild(this.frame);

        this.icon = new WeaponIcon();
        this.icon.position.set(0, 0);
        this.addChild(this.icon);

        this.background.eventMode = 'static';
        this.background.on('pointerdown', this.onBackgroundClick.bind(this));
    }

    onBackgroundClick() {
        this.eventMode = 'none';
        this.alpha = 0;
    }

    setWeapon(weapon) {

    }
}