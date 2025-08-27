export class SlideContainer extends PIXI.Container {
    constructor(width, height, lineHeight, backgroundColor, backgroundAlpha) {
        super();

        this.containerWidth = width;
        this.containerHeight = height;
        this.lineHeight = lineHeight;

        this.background = new PIXI.Graphics();
        this.background.beginFill(backgroundColor, backgroundAlpha);
        this.background.drawRect(0, 0, this.containerWidth, this.containerHeight);
        this.background.endFill();

        this.contentContainer = new PIXI.Container();

        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFFFFFF);
        this.mask.drawRect(0, 0, width, height);
        this.mask.endFill();

        this.contentContainer.mask = this.mask;

        super.addChild(this.background);
        super.addChild(this.mask);
        super.addChild(this.contentContainer);

        this.isDragging = false;
        this.startY = 0;
        this.startTop = 0;
        this.minY = 0;
        this.maxY = 0;

        this.setup();
    }

    setup() {
        this.contentContainer.eventMode = 'static';
        this.contentContainer.on('pointerdown', this.onDragStart.bind(this));
        this.contentContainer.on('pointermove', this.onDragMove.bind(this));
        this.contentContainer.on('pointerup', this.onDragEnd.bind(this));
        this.contentContainer.on('pointerupoutside', this.onDragEnd.bind(this));
    }

    onDragStart(event) {
        this.isDragging = true;
        this.startY = event.global.y;
        this.startTop = this.contentContainer.y;
    }

    onDragMove(event) {
        if (!this.isDragging) return;

        const currentY = event.global.y;
        const deltaY = currentY - this.startY;
        this.contentContainer.y = this.startTop + deltaY;
        this.checkBounds();
    }

    onDragEnd() {
        this.isDragging = false;
        this.checkBounds();
    }

    checkBounds() {
        if (this.contentContainer.y > this.minY) {
            this.contentContainer.y = this.minY;
        }
        if (this.contentContainer.y < this.maxY) {
            this.contentContainer.y = this.maxY;
        }
    }

    updateContentHeight(contentHeight) {
        this.maxY = Math.min(0, this.containerHeight - contentHeight);
    }

    addChild(child) {
        const i = this.contentContainer.children.length;
        child.position.set(this.containerWidth / 2, i * this.lineHeight + this.lineHeight / 2);

        this.contentContainer.addChild(child);

        this.updateContentHeight(i * this.lineHeight + this.lineHeight);
        return child;
    }
}