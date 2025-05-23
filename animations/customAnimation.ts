import { AnimationController } from "@ionic/angular";
const animationCtrl = new AnimationController();

export const getIonPageElement = (element: HTMLElement) => {
    if (element.classList.contains("ion-page")) {
      return element;
    }
  
    const ionPage = element.querySelector(
      ":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs"
    );
    if (ionPage) {
      return ionPage;
    }
    return element;
  };

export const customAnimation = (_: HTMLElement, opts: any) => {
  // create root transition
  const rootTransition = animationCtrl
    .create()
    .duration(opts.duration || 400)
    .easing("cubic-bezier(0.390, 0.575, 0.565, 1.000)");

  const enterTransition = animationCtrl.create().addElement(opts.enteringEl);
  const exitTransition = animationCtrl.create().addElement(opts.leavingEl);

  enterTransition.keyframes([
    { offset: 0, transform: 'scale(0)', transformOrigin: '100% 0%' },
    { offset: 0.25, transform: 'scale(0.25)', transformOrigin: '100% 0%' },
    { offset: 0.5, transform: 'scale(0.5)', transformOrigin: '100% 0%' },
    { offset: 0.75, transform: 'scale(0.75)', transformOrigin: '100% 0%' },
    { offset: 1, transform: 'scale(1)', transformOrigin: '100% 0%' }
  ])

//   enterTransition.fromTo("opacity", "0", "1");
  exitTransition.fromTo("opacity", "1", "0.75");

  rootTransition.addAnimation([enterTransition, exitTransition]);
  return rootTransition;
};