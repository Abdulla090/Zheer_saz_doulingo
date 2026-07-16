import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Award01Icon,
  BookOpen02Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Diamond01Icon,
  FireIcon,
  Flag01Icon,
  GameController03Icon,
  GiftIcon,
  Layers01Icon,
  LockIcon,
  Message01Icon,
  Mic01Icon,
  Mortarboard01Icon,
  Notification02Icon,
  PencilEdit01Icon,
  Search01Icon,
  Settings01Icon,
  Shield01Icon,
  StarIcon,
  Target02Icon,
  Tick01Icon,
  VolumeHighIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  size?: number;
  color?: string;
  active?: boolean;
  filled?: boolean;
  duotone?: boolean;
  strokeWidth?: number;
};

function Glyph({
  icon,
  size = 22,
  color = "#64748B",
  filled = false,
  duotone = true,
  strokeWidth,
}: Props & { icon: any }) {
  if (duotone) {
    return (
      <View style={{ width: size, height: size }}>
        <HugeiconsIcon
          icon={icon}
          size={size}
          color={color}
          fill={color}
          opacity={filled ? 0.44 : 0.22}
          strokeWidth={0}
          style={StyleSheet.absoluteFill}
        />
        <HugeiconsIcon
          icon={icon}
          size={size}
          color={color}
          fill="none"
          strokeWidth={strokeWidth ?? (filled ? 2.55 : 2.35)}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      fill={filled ? color : "none"}
      strokeWidth={strokeWidth ?? (filled ? 2.5 : 2.25)}
    />
  );
}

export function AppCheckIcon(props: Props) {
  return <Glyph icon={Tick01Icon} color="#10B981" {...props} />;
}
export function AppStarIcon({ active, ...props }: Props) {
  return <Glyph icon={StarIcon} color={active ? "#F59E0B" : "#94A3B8"} {...props} />;
}
export function AppFireIcon(props: Props) {
  return <Glyph icon={FireIcon} color="#F97316" {...props} />;
}
export function AppDiamondIcon(props: Props) {
  return <Glyph icon={Diamond01Icon} color="#3B82F6" {...props} />;
}
export function AppBellIcon(props: Props) {
  return <Glyph icon={Notification02Icon} color="#3B82F6" {...props} />;
}
export function AppShieldIcon(props: Props) {
  return <Glyph icon={Shield01Icon} color="#2563EB" {...props} />;
}
export function AppAwardIcon(props: Props) {
  return <Glyph icon={Award01Icon} color="#FF6B4A" {...props} />;
}
export function AppLockIcon(props: Props) {
  return <Glyph icon={LockIcon} color="#94A3B8" {...props} />;
}
export function AppTargetIcon(props: Props) {
  return <Glyph icon={Target02Icon} color="#0D9488" {...props} />;
}
export function AppBookIcon(props: Props) {
  return <Glyph icon={BookOpen02Icon} color="#0D9488" {...props} />;
}
export function AppGamepadIcon(props: Props) {
  return <Glyph icon={GameController03Icon} color="#7C3AED" {...props} />;
}
export function AppPencilIcon(props: Props) {
  return <Glyph icon={PencilEdit01Icon} color="#F59E0B" {...props} />;
}
export function AppFlagIcon(props: Props) {
  return <Glyph icon={Flag01Icon} color="#EF4444" {...props} />;
}
export function AppSearchIcon(props: Props) {
  return <Glyph icon={Search01Icon} {...props} />;
}
export function AppMicIcon(props: Props) {
  return <Glyph icon={Mic01Icon} color="#FF6B4A" {...props} />;
}
export function AppGraduationIcon(props: Props) {
  return <Glyph icon={Mortarboard01Icon} color="#2563EB" {...props} />;
}
export function AppZapIcon({ active, ...props }: Props) {
  return <Glyph icon={ZapIcon} color={active ? "#FF6B4A" : "#94A3B8"} {...props} />;
}
export function AppLayersIcon({ active, ...props }: Props) {
  return <Glyph icon={Layers01Icon} color={active ? "#3B82F6" : "#94A3B8"} {...props} />;
}
export function AppPlusIcon(props: Props) {
  return <Glyph icon={Add01Icon} color="#FF6B4A" {...props} />;
}
export function AppVolumeIcon(props: Props) {
  return <Glyph icon={VolumeHighIcon} color="#3B82F6" {...props} />;
}
export function AppMessageIcon(props: Props) {
  return <Glyph icon={Message01Icon} color="#7C3AED" {...props} />;
}
export function AppChevronDownIcon(props: Props) {
  return <Glyph icon={ArrowDown01Icon} {...props} />;
}
export function AppCloseIcon(props: Props) {
  return <Glyph icon={Cancel01Icon} {...props} />;
}
export function AppClockIcon(props: Props) {
  return <Glyph icon={Clock01Icon} {...props} />;
}
export function AppGiftIcon(props: Props) {
  return <Glyph icon={GiftIcon} color="#EC4899" {...props} />;
}
export function AppCheckCircleIcon(props: Props) {
  return <Glyph icon={CheckmarkCircle01Icon} color="#10B981" {...props} />;
}
export function AppSettingsIcon(props: Props) {
  return <Glyph icon={Settings01Icon} {...props} />;
}
export function AppChevronRightIcon(props: Props) {
  return <Glyph icon={ArrowRight01Icon} {...props} />;
}
