import { AnimationController } from "@ionic/angular";
const animationCtrl = new AnimationController();

const TRANSFORM = "transform";
const MOVED_DOWN = "translate3d(0,-100%,0)";
const MOVED_UP = "translate3d(0,100%,0)";
const NOT_MOVED = "translate3d(0,0,0)";
const ZINDEX = "z-index";
const OPACITY = "opacity";
const PERSEPECTIVE = "-webkit-perspective";
const BACKFACE = "-webkit-backface-visibility";
const PERSEPECT_INDEX = 1000;
const HIDDEN = "hidden";
const INDEX_FRONT = 101;
const INDEX_BACK = 100;
const OPAQUE = 1;


export const slidecustomAnimation = (_: HTMLElement, opts: any) => {

    const rootTransition = animationCtrl
    .create()
    .duration(opts.duration || 500)
    .easing("cubic-bezier(0.390, 0.575, 0.565, 1.000)");

        const enteringView = opts.enteringEl;
        const leavingView = opts.leavingEl;

        const backDirection = (opts.direction === 'back');

        let animation = [];

        if (enteringView) {
            const enterTransition = animationCtrl.create().addElement(opts.enteringEl);

            if (backDirection) {
                enterTransition.beforeStyles({opacity:1})
                    .fromTo(TRANSFORM, MOVED_DOWN, NOT_MOVED)
                    .fromTo(OPACITY, OPAQUE, OPAQUE)
                    .fromTo(PERSEPECTIVE, PERSEPECT_INDEX, PERSEPECT_INDEX)
                    .fromTo(BACKFACE, HIDDEN, HIDDEN)
                    .fromTo(ZINDEX, INDEX_FRONT, INDEX_FRONT);
            } else {
                enterTransition.beforeStyles({opacity:1})
                    .fromTo(TRANSFORM, MOVED_UP, NOT_MOVED)
                    .fromTo(OPACITY, OPAQUE, OPAQUE)
                    .fromTo(PERSEPECTIVE, PERSEPECT_INDEX, PERSEPECT_INDEX)
                    .fromTo(BACKFACE, HIDDEN, HIDDEN)
                    .fromTo(ZINDEX, INDEX_BACK, INDEX_BACK);
            }
            animation.push(enterTransition);
        }

        if (leavingView) {
            const exitTransition = animationCtrl.create().addElement(opts.leavingEl);

            if (backDirection) {
                exitTransition.beforeStyles({opacity:1})
                    .fromTo(TRANSFORM, NOT_MOVED, MOVED_UP)
                    .fromTo(OPACITY, OPAQUE, OPAQUE)
                    .fromTo(PERSEPECTIVE, PERSEPECT_INDEX, PERSEPECT_INDEX)
                    .fromTo(BACKFACE, HIDDEN, HIDDEN)
                    .fromTo(ZINDEX, INDEX_BACK, INDEX_BACK);
            } else {
                exitTransition.beforeStyles({opacity:1})
                    .fromTo(TRANSFORM, NOT_MOVED, MOVED_DOWN)
                    .fromTo(OPACITY, OPAQUE, OPAQUE)
                    .fromTo(PERSEPECTIVE, PERSEPECT_INDEX, PERSEPECT_INDEX)
                    .fromTo(BACKFACE, HIDDEN, HIDDEN)
                    .fromTo(ZINDEX, INDEX_FRONT, INDEX_FRONT)
                    .afterClearStyles([TRANSFORM, OPACITY]);
            }
            animation.push(exitTransition);
        }

        rootTransition.addAnimation(animation);
        return rootTransition;

}