export class AnimHelper {

    static linearInterpolation(start, end, progress) {
        return start + (end - start) * progress;
    }

    static doMove(target, endValue, duration, onComplete = null, onCancel = null) {
        const startValue = {
            x: target.position.x,
            y: target.position.y,
        };

        let startTime = null;
        let anim = null;
        let cancelFlag = false;

        function animate(timestamp) {
            if (cancelFlag) {
                if (onCancel) {
                    onCancel();
                }
                return;
            }

            if (!startTime) {
                startTime = timestamp;
            }

            const progress = Math.min((timestamp - startTime) / duration, 1);

            const currentX = AnimHelper.linearInterpolation(startValue.x, endValue.x, progress);
            const currentY = AnimHelper.linearInterpolation(startValue.y, endValue.y, progress);

            target.position.set(currentX, currentY);

            if (progress < 1) {
                anim = requestAnimationFrame(animate);
            } else {
                target.position.set(currentX, currentY);
                target.position.set(endValue.x, endValue.y);
                if (onComplete) {
                    onComplete();
                }
            }
        }

        anim = requestAnimationFrame(animate.bind(this));

        // return stop handle
        return () => {
            cancelFlag = true;
            if (anim) {
                cancelAnimationFrame(anim);
            }
        };
    }
}