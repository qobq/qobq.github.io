export class TextEffect extends PIXI.Text {
    constructor(text, color, position) {
        super(text, {
            ...PIXI.Text.defaultStyle,
            fill: color,
        });
        this.anchor.set(0.5);
        this.position.set(position.x, position.y);
    }
}