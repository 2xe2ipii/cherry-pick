// utils/assets.ts
//
// This module centralizes the list of avatar images for the Cherry Pick UI.
// All fruit icons are stored in the public/avatars directory.  Each entry in
// the AVATARS array is a relative URL starting with a leading slash so that
// the images are served from the app's public directory at build time.  By
// using a single source of truth here, it becomes easy to add or remove
// avatars without touching the page logic.  The order of items in the array
// controls the default selection (the first element is used as the default
// avatar) and how they appear in the picker.

// A variety of fruit emojis from the Fluent UI 3D icon pack.
// See: https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/ for
// preview images and licenses.  All icons downloaded under MIT license.

// Instead of importing the PNGs from the local filesystem, reference the
// Microsoft FluentUI Emoji 3D icons directly via their CDN URLs.  This
// avoids build errors if the images are not present locally and ensures
// they load without additional configuration.

/*
 * Centralized list of fruit image URLs for avatars and other UI elements.
 *
 * We export both a keyed object (FRUIT_ASSETS) for semantic access — e.g.
 * FRUIT_ASSETS.cherry — and an ordered array (AVATARS) that controls the
 * display order in the avatar picker.  All images are sourced from the
 * Microsoft Fluent UI Emoji 3D pack under the MIT license.  See
 * https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/ for a
 * complete gallery.
 */

export const FRUIT_ASSETS: { [key: string]: string } = {
  apple: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Red-Apple-3d-icon.png',
  greenApple: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Green-Apple-3d-icon.png',
  orange: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Tangerine-3d-icon.png',
  grapes: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Grapes-3d-icon.png',
  melon: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Watermelon-3d-icon.png',
  peach: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Peach-3d-icon.png',
  pear: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Pear-3d-icon.png',
  banana: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Banana-3d-icon.png',
  pineapple: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Pineapple-3d-icon.png',
  mango: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Mango-3d-icon.png',
  strawberry: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Strawberry-3d-icon.png',
  blueberries: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Blueberries-3d-icon.png',
  kiwi: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Kiwi-Fruit-3d-icon.png',
  cherry: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Cherries-3d-icon.png',
  lemon: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Lemon-3d-icon.png',
};

export const AVATARS: string[] = [
  FRUIT_ASSETS.apple,
  FRUIT_ASSETS.greenApple,
  FRUIT_ASSETS.orange,
  FRUIT_ASSETS.grapes,
  FRUIT_ASSETS.melon,
  FRUIT_ASSETS.peach,
  FRUIT_ASSETS.pear,
  FRUIT_ASSETS.banana,
  FRUIT_ASSETS.pineapple,
  FRUIT_ASSETS.mango,
  FRUIT_ASSETS.strawberry,
  FRUIT_ASSETS.blueberries,
  FRUIT_ASSETS.kiwi,
  FRUIT_ASSETS.cherry,
  FRUIT_ASSETS.lemon,
];