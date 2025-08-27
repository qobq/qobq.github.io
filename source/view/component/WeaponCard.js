import {WeaponIcon} from "./WeaponIcon.js";
import {NumberHelper} from "../../helper/NumberHelper.js";
import {getArchiveManager} from "../../Game.js";

export class WeaponCard extends PIXI.Container {
    constructor() {
        super();

        this.cardWidth = 2000;
        this.cardHeight = 400;
        this.border = 25;
        this.color = 0xffffff;
        this.init();

        this.pivot.set(1000, 200);
    }

    init() {
        this.background = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRoundedRect(this.border, this.border, this.cardWidth - this.border * 2, this.cardHeight - this.border * 2, 0)
            .endFill();
        this.addChild(this.background);

        this.frame = new PIXI.Graphics()
            .lineStyle(5, 0xFFFFFF, 0.4)
            .drawRect(this.border, this.border, this.cardWidth - this.border * 2, this.cardHeight - this.border * 2);
        this.addChild(this.frame);

        this.icon = new WeaponIcon();
        this.icon.position.set(200, 200);
        this.addChild(this.icon);

        this.createTextLabel();
        this.createStarLabel();
        this.setupInteractivity();
    }

    createTextLabel() {
        this.titleText = new PIXI.Text('TITLE', {
            ...PIXI.Text.defaultStyle, fill: this.color, fontSize: 50,
        });
        this.titleText.position.set(400, 75);
        this.addChild(this.titleText);

        this.contentText = new PIXI.Text('CONTENT', {
            ...PIXI.Text.defaultStyle, fill: this.color, fontSize: 50,
        });
        this.contentText.position.set(400, 150);
        this.addChild(this.contentText);

        this.appendText = new PIXI.Text('APPEND', {
            ...PIXI.Text.defaultStyle, fill: this.color, fontSize: 50,
        });
        this.appendText.position.set(400, 225);
        this.addChild(this.appendText);
    }

    createStarLabel() {

        const texture = PIXI.Texture.from(`resource/image/icon/star.png`);

        this.starArray = [];
        for (let i = 0; i < 10; i++) {
            const sprite = new PIXI.Sprite(texture);
            sprite.position.set(400 + 60 * i + 5, 300);
            sprite.width = 50;
            sprite.height = 50;

            this.addChild(sprite);
            this.starArray.push(sprite);
        }
    }

    setupInteractivity() {
        this.eventMode = 'static';
        // this.cursor = 'pointer';

        this.on('pointerover', this.onPointerOver.bind(this))
            .on('pointerout', this.onPointerOut.bind(this))
            .on('pointerdown', this.onPointerDown.bind(this))
            .on('pointerup', this.onPointerUp.bind(this));
    }

    onPointerOver() {
    }

    onPointerOut() {
    }

    onPointerDown() {
        this.emit('click', this);
    }

    onPointerUp() {
    }

    setWeapon(weapon, level, appendStrength, starCount) {

        if (level === 0) {
            const colorMatrix = new PIXI.ColorMatrixFilter();
            colorMatrix.blackAndWhite();
            this.icon.imageSprite.filters = [colorMatrix];
            this.icon.imageSprite.alpha = 0.4;
            this.titleText.alpha = 0.4;
            this.contentText.alpha = 0.4;
            this.appendText.alpha = 0.4;
        } else {
            this.icon.imageSprite.filters = [];
            this.icon.imageSprite.alpha = 1;
            this.titleText.alpha = 1;
            this.contentText.alpha = 1;
            this.appendText.alpha = 1;
        }

        const cm = new PIXI.ColorMatrixFilter();
        cm.matrix = [1, 0, 0, 0, 0, // R
            0, 1, 0, 0, 0, // G
            0, 0, 0.7, 0, 0, // B
            0, 0, 0, 1, 0  // A
        ];

        for (let i = 0; i < this.starArray.length; i++) {
            if (i < starCount) {
                this.starArray[i].alpha = 1;
                this.starArray[i].filters = [cm];
            } else {
                this.starArray[i].alpha = 0.1;
            }
        }

        this.icon.imageSprite.texture = PIXI.Texture.from(`resource/image/weapon/${weapon.image}.png`);
        this.titleText.text = `L${level} ${weapon.name} + ${appendStrength}`;
        const attackDamage = (Number(weapon.strength) + Number(appendStrength)) * starCount * level;
        this.contentText.text = `攻击: ${NumberHelper.formatNumber(attackDamage)} = (${weapon.strength} + ${appendStrength}) x ${starCount} x ${level}`;

        const props = getArchiveManager().LocalGameStatus.props;

        const sLevel = NumberHelper.fn(weapon.strength * level, 6);

        const sStrength = NumberHelper.formatStringLength((Number(weapon.strength) + Number(appendStrength)) + `(${props[weapon.key + 'Stone'] ?? 0})`, 10);

        const sStar = NumberHelper.formatStringLength(2 ** starCount + `(${props[weapon.key + 'Stone'] ?? 0})`, 10);

        this.appendText.text = `强化: ${sLevel}  重铸: ${sStrength}  升星: ${sStar}`;
    }
}