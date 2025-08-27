import {BattleBullet} from "./BattleBullet.js";

export class BattleCreature {

    static STATE_BORN = 0;
    static STATE_PLAY = 1;
    static STATE_DEAD = 2;
    static STATE_NULL = 3;

    static BORN_TIME = 1000;
    static DEAD_TIME = 1000;
    static COOL_TIME = 1000;

    constructor(context, creature) {
        this.context = context;
        this.state = BattleCreature.STATE_BORN;

        this.bornTimer = BattleCreature.BORN_TIME;
        this.deadTimer = BattleCreature.DEAD_TIME;

        this.coolTimer = 0;

        this.haveTarget = false;

        this.creature = creature;
        this.health = this.creature.health;
    }

    update(delta) {

        delta = delta * this.creature.speed / 1000;

        const updateMap = new Map();

        if (this.state === BattleCreature.STATE_BORN) {
            const t = Math.min(delta, this.bornTimer);
            this.bornTimer -= t;
            delta -= t;

            if (delta <= 0) {
                updateMap.set('alpha', 1 - this.bornTimer / BattleCreature.BORN_TIME);
                return updateMap;
            }

            updateMap.set('alpha', 1);

            this.state = BattleCreature.STATE_PLAY;
            this.coolTimer = 0;
        }

        if (this.state === BattleCreature.STATE_PLAY) {
            while (delta > 0) {

                if (this.coolTimer <= 0) {
                    if (!this.haveTarget) {
                        break;
                    }
                    // do attack
                    this.context.addBullet(new BattleBullet(this === this.context.player, this.creature.attack, this.creature.cProb, this.creature.cScale));
                    this.coolTimer += BattleCreature.COOL_TIME;
                }

                const t = Math.min(delta, this.coolTimer);
                this.coolTimer -= t;
                delta -= t;
            }

            return updateMap;
        }

        if (this.state === BattleCreature.STATE_DEAD) {
            const t = Math.min(delta, this.deadTimer);
            this.deadTimer -= t;
            delta -= t;

            if (delta <= 0) {
                updateMap.set('alpha', this.deadTimer / BattleCreature.DEAD_TIME);
                return updateMap;
            }

            if (this.deadTimer <= 0) {
                this.deadTimer = 0;
                updateMap.set('alpha', 0);
                this.state = BattleCreature.STATE_NULL;
            }
        }

        return updateMap;
    }
}