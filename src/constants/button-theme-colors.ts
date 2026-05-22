export const BUTTON_FACE_RIM_COLORS = {
  // Ocean-inspired beautiful vibrant theme
  green: { rim: "#0B8A6C", face: "#08c296" }, // tropical water / mint
  purple: { rim: "#5E35B1", face: "#7E57C2" }, // deep sea coral/purple
  blue: { rim: "#0277BD", face: "#039BE5" }, // bright ocean
  mint: { rim: "#00695C", face: "#00897B" }, // deep sea green
  gray: { rim: "#455A64", face: "#607D8B" }, // oceanic slate
  yellow: { rim: "#F57F17", face: "#FBC02D" }, // starfish yellow/sand
  orange: { rim: "#E65100", face: "#FF9800" }, // sunset orange
  red: { rim: "#B71C1C", face: "#F44336" }, // coral red
} as const;

export type ButtonThemeColorKey = keyof typeof BUTTON_FACE_RIM_COLORS;
