import { Chess, Coding, Maths } from "../constants/icons";
import { SvgProps } from "react-native-svg";

type NewCourse = {
  id: number;
  title: string;
  description: string;
  image: React.FC<SvgProps>;
  color: string;
  isNew: boolean;
};
const newCourses: NewCourse[] = [
  {
    id: 1,
    title: "زمانەکان",
    description: "فێربوونی ئینگلیزی، ئەڵمانی، فەرەنسی",
    image: Coding,
    color: "#CE82FF",
    isNew: false,
  },
  {
    id: 2,
    title: "ئینگلیزی بۆ کار",
    description: "فێربوونی زمانی بازرگانی",
    image: Maths,
    color: "#1CB0F6",
    isNew: false,
  },
  {
    id: 3,
    title: "قسەکردنی ڕۆژانە",
    description: "وانەی تایبەت بە گفتوگۆ",
    image: Chess,
    color: "#e6e6bc",
    isNew: true,
  },
];

export default newCourses;
