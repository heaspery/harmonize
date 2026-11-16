gsap.registerPlugin(SplitText);

const text = document.querySelector(".Horizontal__text");
const split = SplitText.create(text, { type: "chars, words" });

// Durée d'un passage complet du texte (en secondes)
const DURATION = 40;

// 1. Défilement horizontal automatique, en boucle
gsap.to(text, {
  xPercent: -100,
  ease: "none",
  duration: DURATION,
  repeat: -1
});

// 2. Animation de chaque lettre, en pause : sa progression dépend de sa position à l'écran
const textLeft = text.getBoundingClientRect().left;
const chars = split.chars.map((char) => ({
  offset: char.getBoundingClientRect().left - textLeft, // position de la lettre dans le texte
  tween: gsap.from(char, {
    yPercent: "random(-200, 200)",
    rotation: "random(-20, 20)",
    ease: "back.out(1.2)",
    paused: true
  })
}));

// 3. À chaque image : la lettre se met en place entre 100% et 30% de la largeur de l'écran
gsap.ticker.add(() => {
  const vw = window.innerWidth;
  const left = text.getBoundingClientRect().left;
  chars.forEach(({ offset, tween }) => {
    const x = left + offset;
    tween.progress(gsap.utils.clamp(0, 1, (vw - x) / (vw * 0.7)));
  });
});
