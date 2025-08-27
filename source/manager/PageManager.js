export class PageManager {

    constructor(app) {
        this.app = app;
        this.currentPage = null;
        this.pages = new Map();
    }

    registerPage(name, page) {
        this.pages.set(name, page);
        page.visible = false;
        this.app.stage.addChild(page);
    }

    async switchTo(pageName, transitionType = 'fade') {
        const oldPage = this.currentPage;
        const newPage = this.pages.get(pageName);

        if (!newPage) {
            throw new Error(`page [${pageName}] not exist`);
        }

        if (oldPage && oldPage.onLeave) oldPage.onLeave();

        switch (transitionType) {
            case 'fade':
                await this.fadeTransition(oldPage, newPage);
                break;
            default:
                if (oldPage) {
                    oldPage.visible = false;
                }
                newPage.visible = true;
        }

        this.currentPage = newPage;

        if (newPage.onEnter) newPage.onEnter();

        return true;
    }

    async fadeTransition(oldPage, newPage) {
        const DURATION = 500;
        const startTime = performance.now();

        newPage.visible = true;
        newPage.alpha = 0;

        return new Promise((resolve) => {
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / DURATION, 1);

                if (oldPage) {
                    oldPage.alpha = 1 - progress;
                }
                newPage.alpha = progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (oldPage) {
                        oldPage.visible = false;
                        oldPage.alpha = 0;
                    }

                    newPage.visible = true;
                    newPage.alpha = 1;

                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    getPage(name) {
        return this.pages.get(name);
    }
}