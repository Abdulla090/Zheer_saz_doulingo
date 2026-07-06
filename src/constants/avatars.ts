import PingoAvatar from "../../assets/images/avatars/avatar_pingo.svg";
import FoxAvatar from "../../assets/images/avatars/avatar_fox.svg";
import OwlAvatar from "../../assets/images/avatars/avatar_owl.svg";
import DinoAvatar from "../../assets/images/avatars/avatar_dino.svg";

export const PREMADE_AVATARS = [
  {
    id: "pingo",
    name: "Pingo",
    Component: PingoAvatar,
    dbPath: "premade/avatar_pingo.svg"
  },
  {
    id: "fox",
    name: "Fox",
    Component: FoxAvatar,
    dbPath: "premade/avatar_fox.svg"
  },
  {
    id: "owl",
    name: "Owl",
    Component: OwlAvatar,
    dbPath: "premade/avatar_owl.svg"
  },
  {
    id: "dino",
    name: "Dino",
    Component: DinoAvatar,
    dbPath: "premade/avatar_dino.svg"
  }
];

export const getLocalPremadeAvatar = (url: string | null) => {
  if (!url) return null;
  const match = PREMADE_AVATARS.find((av) => url.includes(av.dbPath));
  return match ? match.Component : null;
};
