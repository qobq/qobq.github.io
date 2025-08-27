export class BulletSprite extends PIXI.Sprite {
    constructor(texture, flip) {
        super(texture);

        this.anchor.set(0.5);

        if (flip) {
            this.scale.set(-1, 1);
            this.rotation = -Math.PI / 4;
        } else {
            this.scale.set(1, 1);
            this.rotation = Math.PI / 4;
        }

        this.width = 200;
        this.height = 200;
    }
}