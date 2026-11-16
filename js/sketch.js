gsap.registerPlugin(SplitText);

// Timeline globale : toutes les animations de texte y sont placées.
// repeat: -1 → toute la séquence recommence en boucle une fois terminée.
const scene = gsap.timeline({ repeat: -1 });

// Toutes les lettres animées, mises à jour à chaque image (voir plus bas)
const animatedTexts = [];

/**
 * Fait défiler un texte de droite à gauche, avec les lettres qui se mettent en place.
 *
 * @param {number} index     Numéro du texte : 1 → .Horizontal__text_1, 2 → .Horizontal__text_2…
 * @param {number|string} y  Hauteur à l'écran : un nombre = % de la hauteur (0 = haut, 100 = bas),
 *                           ou une valeur CSS ("120px", "30vh"…)
 * @param {number} start     Moment où le texte commence à défiler (en secondes, depuis le début de la scène)
 * @param {object} options   { duration } : durée de la traversée de l'écran (en secondes, 60 par défaut)
 */
function animateText(index, y, start, { duration = 60 } = {}) {
  const text = document.querySelector(`.Horizontal__text_${index}`);
  if (!text) {
    console.warn(`animateText : aucun élément .Horizontal__text_${index}`);
    return;
  }

  // Position verticale
  gsap.set(text, { top: typeof y === "number" ? `${y}%` : y, x: 0, xPercent: 0 });

  // Découpage en lettres + mesure de la position de chaque lettre dans le texte
  const split = SplitText.create(text, { type: "chars, words" });
  const textLeft = text.getBoundingClientRect().left;
  const chars = split.chars.map((char) => ({
    offset: char.getBoundingClientRect().left - textLeft,
    tween: gsap.from(char, {
      yPercent: "random(-200, 200)",
      rotation: "random(-20, 20)",
      ease: "back.out(1.2)",
      paused: true
    })
  }));
  animatedTexts.push({ text, chars });

  // Défilement horizontal, placé dans la scène au moment "start"
  scene.fromTo(text, { xPercent: 0 }, { xPercent: -100, ease: "none", duration }, start);
}

// À chaque image : chaque lettre se met en place entre 100% et 30% de la largeur de l'écran
gsap.ticker.add(() => {
  const vw = window.innerWidth;
  animatedTexts.forEach(({ text, chars }) => {
    const left = text.getBoundingClientRect().left;
    chars.forEach(({ offset, tween }) => {
      tween.progress(gsap.utils.clamp(0, 1, (vw - (left + offset)) / (vw * 0.7)));
    });
  });
});
