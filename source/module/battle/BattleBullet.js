export class BattleBullet {

    constructor(fromPlayer, damage, cProb) {
        this.fromPlayer = fromPlayer
        this.damage = damage;
        this.cProb = cProb;
        this.timer = 0;
        this.delay = 500;
        this.shouldBoom = false;
    }

    update(delta) {
        this.timer += delta;

        if (this.timer >= this.delay) {
            this.shouldBoom = true;
            this.timer = this.delay;
        }

        return this.timer / this.delay;
    }
}