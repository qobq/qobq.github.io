export class GridLayoutContainer extends PIXI.Container {
    /**
     * @param {Object} [options]
     * @param {number} [options.cellWidth=100]
     * @param {number} [options.cellHeight=100]
     * @param {number} [options.spacingX=10]
     * @param {number} [options.spacingY=10]
     * @param {number} [options.startX=0]
     * @param {number} [options.startY=0]
     * @param {string} [options.constraint='column'] ('col', 'row')
     * @param {number} [options.constraintCount=1]
     */
    constructor(options = {}) {
        super();
        
        this._config = {
            cellWidth: 100,
            cellHeight: 100,
            spacingX: 10,
            spacingY: 10,
            startX: 0,
            startY: 0,
            constraint: 'col',
            constraintCount: 1,
        };
        
        Object.assign(this._config, options);
        
        this._items = [];
        
        this._content = new PIXI.Container();
        this.addChild(this._content);
    }
    
    layout() {
        let col = 0;
        let row = 0;
        
        this._content.children.forEach((item, index) => {
            if (this._config.constraint === 'col') {
                col = index % this._config.constraintCount;
                row = Math.floor(index / this._config.constraintCount);
            } else if (this._config.constraint === 'row') {
                row = index % this._config.constraintCount;
                col = Math.floor(index / this._config.constraintCount);
            }
            
            item.x = this._config.startX + col * (this._config.cellWidth + this._config.spacingX);
            item.y = this._config.startY + row * (this._config.cellHeight + this._config.spacingY);
        });
    }
    
    addChildToGrid(child) {
        this._content.addChild(child);
        this.layout();
        return child;
    }
    
    removeChildFromGrid(child) {
        this._content.removeChild(child);
        this.layout();
        return child;
    }

    getGridChildren() {
        return this._content.children;
    }
    
    clearGrid() {
        this._content.removeChildren();
        this.layout();
    }
    
    setCellSize(width, height) {
        this._config.cellWidth = width;
        this._config.cellHeight = height;
        this.layout();
    }
    
    setSpacing(spacingX, spacingY) {
        this._config.spacingX = spacingX;
        this._config.spacingY = spacingY;
        this.layout();
    }
    
    setStartPosition(startX, startY) {
        this._config.startX = startX;
        this._config.startY = startY;
        this.layout();
    }
    
    setConstraint(constraint, count) {
        this._config.constraint = constraint;
        if (count !== undefined) {
            this._config.constraintCount = count;
        }
        this.layout();
    }
}