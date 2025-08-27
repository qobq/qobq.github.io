export class CreatureCard extends PIXI.Container {
    constructor(flip = false) {
        super();

        this.cardWidth = 375;
        this.cardHeight = 500;
        this.border = 5;
        this.color = 0xffffff;
        this.flip = flip;
        this.init();
        
        this.pivot.set(375 / 2, 250);
    }

    init() {
        // this.background = new PIXI.Graphics()
        //     .beginFill(0xFFFFFF)
        //     .drawRoundedRect(this.border, this.border, this.cardWidth - this.border * 2, this.cardHeight - this.border * 2, 0)
        //     .endFill();
        // this.addChild(this.background);

        this.frame = new PIXI.Graphics()
            .lineStyle(this.border, 0xFFFFFF, 0.4)
            .drawRect(0, 0, this.cardWidth, this.cardHeight)
        this.addChild(this.frame);

        this.loadImage(PIXI.Texture.EMPTY);

        this.createTitleLabel();
        this.createHealthBar();
        this.setupInteractivity();
    }

    loadImage(texture) {
        this.imageSprite = new PIXI.Sprite(texture);

        if (this.flip) {
            this.imageSprite.scale.x = -1;
            this.imageSprite.anchor.x = 1;
        }

        this.imageSprite.position.set(this.border, this.border);

        this.imageSprite.width = this.cardWidth - this.border * 2;
        this.imageSprite.height = this.cardHeight - this.border * 2;

        this.addChild(this.imageSprite);
    }

    createTitleLabel() {
        this.titleText = new PIXI.Text('', {
            ...PIXI.Text.defaultStyle,
            fill: this.color,
            fontSize: 50,
        });
        this.titleText.anchor.set(0.5);
        this.titleText.position.set(this.cardWidth / 2, this.cardHeight * 0.9);
        this.addChild(this.titleText);
    }

    createHealthBar() {
        const healthBar = new PIXI.Container();
        healthBar.position.set(this.border * 2, this.border * 2);

        const background = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRoundedRect(-this.border, -this.border, this.cardWidth - this.border * 2, 0.2 * this.cardWidth - this.border * 2, 0)
            .endFill();

        healthBar.addChild(background);

        const bar = new PIXI.Graphics()
            .beginFill(0xFFFFFF, 0.2)
            .drawRoundedRect(0, 0, this.cardWidth - this.border * 4, 0.2 * this.cardWidth - this.border * 4, 0)
            .endFill();

        healthBar.addChild(bar);

        this.healthImage = new PIXI.Graphics()
            .beginFill(0xFF0000, 0.7)
            .drawRoundedRect(0, 0, this.cardWidth - this.border * 4, 0.2 * this.cardWidth - this.border * 4, 0)
            .endFill();

        healthBar.addChild(this.healthImage);

        this.addChild(healthBar);

        this.healthText = new PIXI.Text('00000000', {
            ...PIXI.Text.defaultStyle,
            fontSize: 50,
        });
        this.healthText.anchor.set(0.5);
        this.healthText.x = this.cardWidth / 2;
        this.healthText.y = 0.1 * this.cardWidth;

        this.addChild(this.healthText);
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

    setCreature(creature){
        this.titleText.text = creature.name;
        this.imageSprite.texture = PIXI.Texture.from(`resource/image/creature/${creature.image}.png`);
        this.setMaxHealth(creature.health, creature.health)
    }

    setHealth(health){
        this.healthText.text = health;
        this.healthImage.scale.x = health / this.maxHealth;
    }

    setMaxHealth(health, maxHealth){
        this.maxHealth = maxHealth;
        this.healthText.text = health;
        this.healthImage.scale.x = health / this.maxHealth;
    }
}