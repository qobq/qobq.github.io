import {getPlayerManager} from "../../Game.js";
import {NumberHelper} from "../../helper/NumberHelper.js";

export class PlayerPanel extends PIXI.Container {
    constructor() {
        super();

        const p = getPlayerManager().getPlayer();

        let s =
            `攻击: ${NumberHelper.fn(p.attack, 6)}  攻速: ${NumberHelper.fnp(p.speed, 6)}  ` +
            `生命: ${NumberHelper.fn(p.health, 6)}  防御: ${NumberHelper.fn(p.defend, 6)}\n\n` +
            `暴击: ${NumberHelper.fnp(p.cProb, 6)}  暴伤: ${NumberHelper.fnp(p.cScale, 6)}  ` +
            `闪避: ${NumberHelper.fnp(p.miss, 6)}  吸血: ${NumberHelper.fnp(p.absorb, 6)}`;

        this.contentText = new PIXI.Text(s, {
            ...PIXI.Text.defaultStyle,
            fontSize: 50,
        });

        this.contentText.anchor.set(0.5, 0.5);
        this.contentText.position.set(0, 0);
        this.addChild(this.contentText);

        this.frame = new PIXI.Graphics()
            .lineStyle(5, 0xFFFFFF, 0.1)
            .drawRect(-1000, -200, 2000, 400);

        this.addChild(this.frame);
    }
}