/**
 * Icon3D — Soft premium coin icons (matches home path buttons).
 * Radial face lighting, gloss sheen, and gentle depth — no hard extruded ledges.
 */

import React from "react";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Rect,
  G,
} from "react-native-svg";

// ----- ID factory (unique per mount) ----------------------------------------
let _uid = 0;
function useId(prefix: string) {
  return React.useRef(`${prefix}-${_uid++}`).current;
}

// ----- Core icon builder -------------------------------------------------------
// Soft premium coin — radial lighting + gentle depth (matches home path buttons).
interface SphereProps {
  size: number;
  bright: string;
  mid: string;
  shade: string;
  sheen?: string;
  id: string;
}

function Sphere({ size, bright, mid, shade, id, children }: SphereProps & { children?: React.ReactNode }) {
  const radial = `rad-${id}`;
  const gloss = `gloss-${id}`;
  const pad = size * 0.04;
  const w = size - pad * 2;
  const rx = w / 2;
  const cx = pad + rx;
  const cy = pad + rx;
  const depth = Math.max(2, Math.round(size * 0.05));
  const totalH = size + depth;

  return (
    <Svg width={size} height={totalH} viewBox={`0 0 ${size} ${totalH}`}>
      <Defs>
        <RadialGradient
          id={radial}
          cx="32%"
          cy="28%"
          rx="72%"
          ry="72%"
          fx="28%"
          fy="22%"
        >
          <Stop offset="0%" stopColor={bright} />
          <Stop offset="55%" stopColor={mid} />
          <Stop offset="100%" stopColor={shade} />
        </RadialGradient>
        <LinearGradient id={gloss} x1="0" y1="0" x2="0.4" y2="1">
          <Stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <Stop offset="45%" stopColor="rgba(255,255,255,0.08)" />
          <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </LinearGradient>
      </Defs>

      <Rect
        x={pad}
        y={pad + depth * 0.85}
        width={w}
        height={w}
        rx={rx}
        fill={shade}
        opacity={0.38}
      />

      <Rect x={pad} y={pad} width={w} height={w} rx={rx} fill={`url(#${radial})`} />

      <Rect
        x={pad}
        y={pad}
        width={w}
        height={w * 0.55}
        rx={rx}
        fill={`url(#${gloss})`}
        opacity={0.9}
      />

      <Rect
        x={pad + 0.75}
        y={pad + 0.75}
        width={w - 1.5}
        height={w - 1.5}
        rx={rx - 0.75}
        fill="none"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth={1.25}
      />

      <G>{children}</G>
    </Svg>
  );
}

// Helpers — pure white glyphs, no dark copies
function IconPath({ d, strokeWidth = 2, opacity = 1 }: {
  d: string; rim?: string; strokeWidth?: number; opacity?: number;
}) {
  return (
    <Path d={d} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
  );
}

function IconFill({ d }: { d: string; rim?: string }) {
  return <Path d={d} fill="rgba(255,255,255,0.95)" />;
}



// ============================================================================
// PUBLIC ICONS
// ============================================================================

/** ✅ Green 3D Checkmark coin */
export function Icon3DCheck({ size = 22 }: { size?: number }) {
  const id = useId("chk");
  return (
    <Sphere size={size} id={id}
      bright="#6EE7B7" mid="#10B981" shade="#059669" sheen="#D1FAE5">
      <IconPath d={`M${size*0.28} ${size*0.52} L${size*0.45} ${size*0.68} L${size*0.72} ${size*0.38}`} rim="#10B981" strokeWidth={size*0.1} />
    </Sphere>
  );
}

/** ⭐ Golden 3D Star coin */
export function Icon3DStar({ size = 22 }: { size?: number }) {
  const id = useId("star");
  const h = size / 2;
  const s = `M${h} ${h * 0.45}l${h * 0.28} ${h * 0.83}h${h * 0.9}l-${h * 0.72} ${h * 0.56}${h * 0.28} ${h * 0.87}-${h * 0.74}-${h * 0.55}-${h * 0.74} ${h * 0.55}${h * 0.28}-${h * 0.87}-${h * 0.72}-${h * 0.56}h${h * 0.9}z`;
  return (
    <Sphere size={size} id={id}
      bright="#FCD34D" mid="#F59E0B" shade="#D97706" sheen="#FEF9C3">
      <IconFill d={s} rim="#FBBF24" />
    </Sphere>
  );
}

/** 🔥 Orange 3D Fire / Streak icon */
export function Icon3DFire({ size = 22 }: { size?: number }) {
  const id = useId("fire");
  return (
    <Sphere size={size} id={id}
      bright="#FCA5A5" mid="#EF4444" shade="#DC2626" sheen="#FEE2E2">
      <IconPath
        d={`M${size*0.5} ${size*0.22}
            C${size*0.5} ${size*0.22} ${size*0.68} ${size*0.35} ${size*0.65} ${size*0.52}
            C${size*0.72} ${size*0.42} ${size*0.76} ${size*0.3} ${size*0.7} ${size*0.2}
            C${size*0.84} ${size*0.36} ${size*0.82} ${size*0.65} ${size*0.62} ${size*0.77}
            C${size*0.65} ${size*0.68} ${size*0.6} ${size*0.64} ${size*0.55} ${size*0.72}
            C${size*0.5} ${size*0.62} ${size*0.42} ${size*0.7} ${size*0.45} ${size*0.79}
            C${size*0.32} ${size*0.68} ${size*0.28} ${size*0.5} ${size*0.36} ${size*0.38}
            C${size*0.3} ${size*0.42} ${size*0.28} ${size*0.54} ${size*0.3} ${size*0.62}
            C${size*0.22} ${size*0.48} ${size*0.26} ${size*0.3} ${size*0.5} ${size*0.22}Z`}
        rim="#F87171" strokeWidth={0}
      />
    </Sphere>
  );
}

/** 💎 Blue 3D Diamond / Gem icon */
export function Icon3DDiamond({ size = 22 }: { size?: number }) {
  const id = useId("gem");
  const h = size / 2;
  return (
    <Sphere size={size} id={id}
      bright="#93C5FD" mid="#3B82F6" shade="#2563EB" sheen="#EFF6FF">
      <IconFill
        d={`M${h} ${size*0.15}L${size*0.82} ${h*0.82}L${h} ${size*0.88}L${size*0.18} ${h*0.82}ZM${h} ${size*0.15}L${size*0.18} ${h*0.82}L${h} ${size*0.5}ZM${h} ${size*0.15}L${size*0.82} ${h*0.82}L${h} ${size*0.5}Z`}
        rim="#60A5FA"
      />
    </Sphere>
  );
}

/** 🔔 Blue 3D Bell icon */
export function Icon3DBell({ size = 22 }: { size?: number }) {
  const id = useId("bell");
  return (
    <Sphere size={size} id={id}
      bright="#7DD3FC" mid="#0EA5E9" shade="#0284C7" sheen="#E0F2FE">
      <IconPath
        d={`M${size*0.5} ${size*0.18}
            C${size*0.35} ${size*0.18} ${size*0.24} ${size*0.3} ${size*0.24} ${size*0.5}
            L${size*0.22} ${size*0.68}
            L${size*0.18} ${size*0.74}
            L${size*0.82} ${size*0.74}
            L${size*0.78} ${size*0.68}
            L${size*0.76} ${size*0.5}
            C${size*0.76} ${size*0.3} ${size*0.65} ${size*0.18} ${size*0.5} ${size*0.18}Z
            M${size*0.42} ${size*0.74} Q${size*0.42} ${size*0.84} ${size*0.5} ${size*0.84} Q${size*0.58} ${size*0.84} ${size*0.58} ${size*0.74}`}
        rim="#38BDF8" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** 🛡️ Blue 3D Shield icon */
export function Icon3DShield({ size = 36 }: { size?: number }) {
  const id = useId("shield");
  return (
    <Sphere size={size} id={id}
      bright="#7DD3FC" mid="#0EA5E9" shade="#0284C7" sheen="#E0F2FE">
      <IconPath
        d={`M${size*0.5} ${size*0.17}
            L${size*0.2} ${size*0.3}
            L${size*0.2} ${size*0.52}
            C${size*0.2} ${size*0.7} ${size*0.34} ${size*0.84} ${size*0.5} ${size*0.86}
            C${size*0.66} ${size*0.84} ${size*0.8} ${size*0.7} ${size*0.8} ${size*0.52}
            L${size*0.8} ${size*0.3}Z`}
        rim="#38BDF8" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** ⭐ Purple 3D Star badge (Quick Learner) */
export function Icon3DStarPurple({ size = 36 }: { size?: number }) {
  const id = useId("starp");
  const h = size / 2;
  const s = `M${h} ${h*0.45}l${h*0.28} ${h*0.83}h${h*0.9}l-${h*0.72} ${h*0.56}${h*0.28} ${h*0.87}-${h*0.74}-${h*0.55}-${h*0.74} ${h*0.55}${h*0.28}-${h*0.87}-${h*0.72}-${h*0.56}h${h*0.9}z`;
  return (
    <Sphere size={size} id={id}
      bright="#DDD6FE" mid="#7C3AED" shade="#6D28D9" sheen="#F3E8FF">
      <IconFill d={s} rim="#A78BFA" />
    </Sphere>
  );
}

/** ⚡ Orange 3D Zap / Lightning bolt (Streak Master) */
export function Icon3DZap({ size = 36 }: { size?: number }) {
  const id = useId("zap");
  return (
    <Sphere size={size} id={id}
      bright="#FED7AA" mid="#F97316" shade="#EA580C" sheen="#FFEDD5">
      <IconFill
        d={`M${size*0.58} ${size*0.15}L${size*0.28} ${size*0.52}L${size*0.48} ${size*0.52}L${size*0.42} ${size*0.85}L${size*0.72} ${size*0.48}L${size*0.52} ${size*0.48}Z`}
        rim="#FB923C"
      />
    </Sphere>
  );
}

/** 🏆 Pink 3D Award / Trophy (Quiz Whiz) */
export function Icon3DAward({ size = 36 }: { size?: number }) {
  const id = useId("award");
  return (
    <Sphere size={size} id={id}
      bright="#FBCFE8" mid="#EC4899" shade="#DB2777" sheen="#FCE7F3">
      <IconPath
        d={`M${size*0.5} ${size*0.58}
            C${size*0.3} ${size*0.58} ${size*0.2} ${size*0.45} ${size*0.2} ${size*0.35}
            C${size*0.2} ${size*0.22} ${size*0.34} ${size*0.15} ${size*0.5} ${size*0.15}
            C${size*0.66} ${size*0.15} ${size*0.8} ${size*0.22} ${size*0.8} ${size*0.35}
            C${size*0.8} ${size*0.45} ${size*0.7} ${size*0.58} ${size*0.5} ${size*0.58}Z
            M${size*0.5} ${size*0.58}L${size*0.5} ${size*0.74}
            M${size*0.35} ${size*0.78}L${size*0.65} ${size*0.78}
            M${size*0.42} ${size*0.35}L${size*0.5} ${size*0.27}L${size*0.58} ${size*0.35}`}
        rim="#F472B6" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** 🔒 Grey 3D Lock (locked badge) */
export function Icon3DLock({ size = 36 }: { size?: number }) {
  const id = useId("lock");
  return (
    <Sphere size={size} id={id}
      bright="#CBD5E1" mid="#64748B" shade="#475569" sheen="#F9FAFB">
      <IconPath
        d={`M${size*0.35} ${size*0.5}
            L${size*0.35} ${size*0.4}
            C${size*0.35} ${size*0.27} ${size*0.65} ${size*0.27} ${size*0.65} ${size*0.4}
            L${size*0.65} ${size*0.5}
            L${size*0.27} ${size*0.5}
            L${size*0.27} ${size*0.78}
            L${size*0.73} ${size*0.78}
            L${size*0.73} ${size*0.5}Z
            M${size*0.5} ${size*0.6}L${size*0.5} ${size*0.68}`}
        rim="#94A3B8" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** 🎯 Teal 3D Target (Today's Goal) */
export function Icon3DTarget({ size = 16 }: { size?: number }) {
  const id = useId("tgt");
  const h = size / 2;
  return (
    <Sphere size={size} id={id}
      bright="#5EEAD4" mid="#14B8A6" shade="#0D9488" sheen="#CCFBF1">
      <IconPath d={`M${h} ${h*0.5}A${h*0.5} ${h*0.5} 0 1 1 ${h-0.01} ${h*0.5}Z`} rim="#2DD4BF" strokeWidth={1.4} />
      <IconPath d={`M${h} ${h*0.74}A${h*0.26} ${h*0.26} 0 1 1 ${h-0.01} ${h*0.74}Z`} rim="#2DD4BF" strokeWidth={1.2} />
    </Sphere>
  );
}

/** 📖 Teal 3D Book (Learn mode) */
export function Icon3DBook({ size = 32 }: { size?: number }) {
  const id = useId("book");
  return (
    <Sphere size={size} id={id}
      bright="#5EEAD4" mid="#14B8A6" shade="#0D9488" sheen="#CCFBF1">
      <IconPath
        d={`M${size*0.5} ${size*0.3}
            C${size*0.38} ${size*0.24} ${size*0.24} ${size*0.26} ${size*0.2} ${size*0.32}
            L${size*0.2} ${size*0.72}
            C${size*0.24} ${size*0.67} ${size*0.38} ${size*0.66} ${size*0.5} ${size*0.72}Z
            M${size*0.5} ${size*0.3}
            C${size*0.62} ${size*0.24} ${size*0.76} ${size*0.26} ${size*0.8} ${size*0.32}
            L${size*0.8} ${size*0.72}
            C${size*0.76} ${size*0.67} ${size*0.62} ${size*0.66} ${size*0.5} ${size*0.72}Z
            M${size*0.5} ${size*0.3}L${size*0.5} ${size*0.72}`}
        rim="#2DD4BF" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** 🎮 Purple 3D Gamepad (Game mode) */
export function Icon3DGamepad({ size = 32 }: { size?: number }) {
  const id = useId("gpad");
  return (
    <Sphere size={size} id={id}
      bright="#DDD6FE" mid="#7C3AED" shade="#6D28D9" sheen="#EDE9FE">
      <IconPath
        d={`M${size*0.18} ${size*0.4}
            L${size*0.18} ${size*0.6}
            C${size*0.18} ${size*0.74} ${size*0.28} ${size*0.8} ${size*0.38} ${size*0.78}
            L${size*0.45} ${size*0.64}
            L${size*0.55} ${size*0.64}
            L${size*0.62} ${size*0.78}
            C${size*0.72} ${size*0.8} ${size*0.82} ${size*0.74} ${size*0.82} ${size*0.6}
            L${size*0.82} ${size*0.4}
            C${size*0.82} ${size*0.28} ${size*0.7} ${size*0.22} ${size*0.5} ${size*0.22}
            C${size*0.3} ${size*0.22} ${size*0.18} ${size*0.28} ${size*0.18} ${size*0.4}Z
            M${size*0.36} ${size*0.38}L${size*0.36} ${size*0.54}
            M${size*0.28} ${size*0.46}L${size*0.44} ${size*0.46}
            M${size*0.64} ${size*0.42}A${size*0.03} ${size*0.03} 0 1 1 ${size*0.64-0.01} ${size*0.42}Z
            M${size*0.72} ${size*0.5}A${size*0.03} ${size*0.03} 0 1 1 ${size*0.72-0.01} ${size*0.5}Z`}
        rim="#A78BFA" strokeWidth={1.6}
      />
    </Sphere>
  );
}

/** ✏️ Yellow 3D Pencil (Practice mode) */
export function Icon3DPencil({ size = 32 }: { size?: number }) {
  const id = useId("pen");
  return (
    <Sphere size={size} id={id}
      bright="#FCD34D" mid="#F59E0B" shade="#D97706" sheen="#FEF9C3">
      <IconPath
        d={`M${size*0.62} ${size*0.2}
            L${size*0.78} ${size*0.36}
            L${size*0.4} ${size*0.74}
            L${size*0.22} ${size*0.76}
            L${size*0.24} ${size*0.58}Z
            M${size*0.54} ${size*0.28}L${size*0.7} ${size*0.44}`}
        rim="#FBBF24" strokeWidth={1.7}
      />
    </Sphere>
  );
}

/** 🚩 Blue 3D Flag (Quests) */
export function Icon3DFlag({ size = 32 }: { size?: number }) {
  const id = useId("flag");
  return (
    <Sphere size={size} id={id}
      bright="#93C5FD" mid="#3B82F6" shade="#2563EB" sheen="#EFF6FF">
      <IconPath
        d={`M${size*0.3} ${size*0.2}L${size*0.3} ${size*0.8}
            M${size*0.3} ${size*0.2}L${size*0.76} ${size*0.32}L${size*0.3} ${size*0.52}`}
        rim="#60A5FA" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** 🔍 Grey 3D Search icon */
export function Icon3DSearch({ size = 20 }: { size?: number }) {
  const id = useId("srch");
  return (
    <Sphere size={size} id={id}
      bright="#CBD5E1" mid="#64748B" shade="#475569" sheen="#F9FAFB">
      <IconPath
        d={`M${size*0.28} ${size*0.46}A${size*0.18} ${size*0.18} 0 1 1 ${size*0.28-0.01} ${size*0.46}Z
            M${size*0.57} ${size*0.57}L${size*0.78} ${size*0.78}`}
        rim="#94A3B8" strokeWidth={1.7}
      />
    </Sphere>
  );
}

/** 🎙️ Blue 3D Mic icon */
export function Icon3DMic({ size = 20 }: { size?: number }) {
  const id = useId("mic");
  return (
    <Sphere size={size} id={id}
      bright="#93C5FD" mid="#3B82F6" shade="#2563EB" sheen="#EFF6FF">
      <IconPath
        d={`M${size*0.5} ${size*0.22}
            C${size*0.38} ${size*0.22} ${size*0.36} ${size*0.3} ${size*0.36} ${size*0.42}
            L${size*0.36} ${size*0.54}
            C${size*0.36} ${size*0.66} ${size*0.38} ${size*0.74} ${size*0.5} ${size*0.74}
            C${size*0.62} ${size*0.74} ${size*0.64} ${size*0.66} ${size*0.64} ${size*0.54}
            L${size*0.64} ${size*0.42}
            C${size*0.64} ${size*0.3} ${size*0.62} ${size*0.22} ${size*0.5} ${size*0.22}Z
            M${size*0.26} ${size*0.54}C${size*0.26} ${size*0.74} ${size*0.36} ${size*0.82} ${size*0.5} ${size*0.82}
            C${size*0.64} ${size*0.82} ${size*0.74} ${size*0.74} ${size*0.74} ${size*0.54}
            M${size*0.5} ${size*0.82}L${size*0.5} ${size*0.9}`}
        rim="#60A5FA" strokeWidth={1.6}
      />
    </Sphere>
  );
}

/** 🎓 Teal 3D Graduation Cap */
export function Icon3DGradCap({ size = 32 }: { size?: number }) {
  const id = useId("grad");
  return (
    <Sphere size={size} id={id}
      bright="#5EEAD4" mid="#14B8A6" shade="#0D9488" sheen="#CCFBF1">
      <IconPath
        d={`M${size*0.15} ${size*0.46}L${size*0.5} ${size*0.3}L${size*0.85} ${size*0.46}L${size*0.5} ${size*0.62}Z
            M${size*0.72} ${size*0.54}L${size*0.72} ${size*0.72}
            C${size*0.6} ${size*0.8} ${size*0.4} ${size*0.8} ${size*0.28} ${size*0.72}L${size*0.28} ${size*0.54}`}
        rim="#2DD4BF" strokeWidth={1.7}
      />
    </Sphere>
  );
}

/** ⚡ Blue 3D Zap (Street English tab) */
export function Icon3DZapBlue({ size = 16, active = false }: { size?: number; active?: boolean }) {
  const id = useId("zapb");
  return (
    <Sphere size={size} id={id}
      bright={active ? "#BAE6FD" : "#E2E8F0"}
      mid={active ? "#38BDF8" : "#94A3B8"}
      shade={active ? "#0EA5E9" : "#64748B"}
      sheen="#FFFFFF">
      <IconFill
        d={`M${size*0.58} ${size*0.15}L${size*0.28} ${size*0.52}L${size*0.48} ${size*0.52}L${size*0.42} ${size*0.85}L${size*0.72} ${size*0.48}L${size*0.52} ${size*0.48}Z`}
      />
    </Sphere>
  );
}

/** 🔲 Purple 3D Layers (Normal English tab) */
export function Icon3DLayers({ size = 16, active = false }: { size?: number; active?: boolean }) {
  const id = useId("lyr");
  return (
    <Sphere size={size} id={id}
      bright={active ? "#EDE9FE" : "#E2E8F0"}
      mid={active ? "#A78BFA" : "#94A3B8"}
      shade={active ? "#7C3AED" : "#64748B"}
      sheen="#FFFFFF">
      <IconPath
        d={`M${size*0.2} ${size*0.46}L${size*0.5} ${size*0.32}L${size*0.8} ${size*0.46}L${size*0.5} ${size*0.6}Z
            M${size*0.2} ${size*0.54}L${size*0.5} ${size*0.68}L${size*0.8} ${size*0.54}
            M${size*0.2} ${size*0.62}L${size*0.5} ${size*0.76}L${size*0.8} ${size*0.62}`}
        strokeWidth={1.4}
      />
    </Sphere>
  );
}

/** ➕ Blue 3D Plus */
export function Icon3DPlus({ size = 20 }: { size?: number }) {
  const id = useId("plus");
  return (
    <Sphere size={size} id={id}
      bright="#93C5FD" mid="#3B82F6" shade="#2563EB" sheen="#EFF6FF">
      <IconPath
        d={`M${size*0.5} ${size*0.25}L${size*0.5} ${size*0.75}M${size*0.25} ${size*0.5}L${size*0.75} ${size*0.5}`}
        rim="#60A5FA" strokeWidth={2}
      />
    </Sphere>
  );
}

/** 🔊 Teal 3D Volume/Speaker */
export function Icon3DVolume({ size = 16 }: { size?: number }) {
  const id = useId("vol");
  return (
    <Sphere size={size} id={id}
      bright="#5EEAD4" mid="#14B8A6" shade="#0D9488" sheen="#CCFBF1">
      <IconPath
        d={`M${size*0.28} ${size*0.38}L${size*0.44} ${size*0.38}L${size*0.6} ${size*0.24}L${size*0.6} ${size*0.76}L${size*0.44} ${size*0.62}L${size*0.28} ${size*0.62}Z
            M${size*0.66} ${size*0.36}C${size*0.76} ${size*0.44} ${size*0.76} ${size*0.56} ${size*0.66} ${size*0.64}
            M${size*0.72} ${size*0.28}C${size*0.86} ${size*0.38} ${size*0.86} ${size*0.62} ${size*0.72} ${size*0.72}`}
        rim="#2DD4BF" strokeWidth={1.5}
      />
    </Sphere>
  );
}

/** 💬 Blue 3D Message/Chat bubble */
export function Icon3DMessage({ size = 14 }: { size?: number }) {
  const id = useId("msg");
  return (
    <Sphere size={size} id={id}
      bright="#93C5FD" mid="#3B82F6" shade="#2563EB" sheen="#EFF6FF">
      <IconPath
        d={`M${size*0.2} ${size*0.22}L${size*0.8} ${size*0.22}C${size*0.86} ${size*0.22} ${size*0.86} ${size*0.28} ${size*0.86} ${size*0.28}
            L${size*0.86} ${size*0.62}C${size*0.86} ${size*0.68} ${size*0.8} ${size*0.68} ${size*0.8} ${size*0.68}
            L${size*0.42} ${size*0.68}L${size*0.28} ${size*0.82}L${size*0.28} ${size*0.68}L${size*0.2} ${size*0.68}
            C${size*0.14} ${size*0.68} ${size*0.14} ${size*0.62} ${size*0.14} ${size*0.62}
            L${size*0.14} ${size*0.28}C${size*0.14} ${size*0.22} ${size*0.2} ${size*0.22} ${size*0.2} ${size*0.22}Z`}
        rim="#60A5FA" strokeWidth={1.4}
      />
    </Sphere>
  );
}

/** 📖 Teal 3D Book (small, for meta pills) */
export function Icon3DBookSm({ size = 10 }: { size?: number }) {
  const id = useId("bksm");
  return (
    <Sphere size={size} id={id}
      bright="#5EEAD4" mid="#14B8A6" shade="#0D9488" sheen="#CCFBF1">
      <IconPath
        d={`M${size*0.5} ${size*0.28}C${size*0.38} ${size*0.22} ${size*0.24} ${size*0.24} ${size*0.2} ${size*0.3}L${size*0.2} ${size*0.74}C${size*0.24} ${size*0.68} ${size*0.38} ${size*0.66} ${size*0.5} ${size*0.72}Z
            M${size*0.5} ${size*0.28}C${size*0.62} ${size*0.22} ${size*0.76} ${size*0.24} ${size*0.8} ${size*0.3}L${size*0.8} ${size*0.74}C${size*0.76} ${size*0.68} ${size*0.62} ${size*0.66} ${size*0.5} ${size*0.72}Z`}
        rim="#2DD4BF" strokeWidth={1.2}
      />
    </Sphere>
  );
}

/** ⌄ Grey 3D Chevron Down */
export function Icon3DChevronDown({ size = 18 }: { size?: number }) {
  const id = useId("chvd");
  return (
    <Sphere size={size} id={id}
      bright="#CBD5E1" mid="#64748B" shade="#475569" sheen="#F9FAFB">
      <IconPath
        d={`M${size*0.3} ${size*0.38}L${size*0.5} ${size*0.62}L${size*0.7} ${size*0.38}`}
        rim="#94A3B8" strokeWidth={1.8}
      />
    </Sphere>
  );
}

/** ✕ Red 3D X / Close */
export function Icon3DX({ size = 20 }: { size?: number }) {
  const id = useId("xcl");
  return (
    <Sphere size={size} id={id}
      bright="#FFE4E6" mid="#DC2626" shade="#F87171" sheen="#FEE2E2">
      <IconPath
        d={`M${size*0.32} ${size*0.32}L${size*0.68} ${size*0.68}M${size*0.68} ${size*0.32}L${size*0.32} ${size*0.68}`}
        rim="#F87171" strokeWidth={2}
      />
    </Sphere>
  );
}

/** 🕐 Orange 3D Clock */
export function Icon3DClock({ size = 20 }: { size?: number }) {
  const id = useId("clk");
  return (
    <Sphere size={size} id={id}
      bright="#FED7AA" mid="#F97316" shade="#EA580C" sheen="#FFEDD5">
      <IconPath
        d={`M${size*0.5} ${size*0.18}A${size*0.32} ${size*0.32} 0 1 1 ${size*0.5-0.01} ${size*0.18}Z
            M${size*0.5} ${size*0.34}L${size*0.5} ${size*0.5}L${size*0.62} ${size*0.58}`}
        rim="#FB923C" strokeWidth={1.7}
      />
    </Sphere>
  );
}

/** 🎁 Pink 3D Gift */
export function Icon3DGift({ size = 20 }: { size?: number }) {
  const id = useId("gift");
  return (
    <Sphere size={size} id={id}
      bright="#FBCFE8" mid="#EC4899" shade="#DB2777" sheen="#FCE7F3">
      <IconPath
        d={`M${size*0.18} ${size*0.42}L${size*0.82} ${size*0.42}L${size*0.82} ${size*0.8}L${size*0.18} ${size*0.8}Z
            M${size*0.18} ${size*0.3}L${size*0.82} ${size*0.3}L${size*0.82} ${size*0.42}L${size*0.18} ${size*0.42}Z
            M${size*0.5} ${size*0.3}L${size*0.5} ${size*0.8}
            M${size*0.5} ${size*0.3}C${size*0.5} ${size*0.3} ${size*0.34} ${size*0.18} ${size*0.38} ${size*0.26}C${size*0.42} ${size*0.34} ${size*0.5} ${size*0.3} ${size*0.5} ${size*0.3}Z
            M${size*0.5} ${size*0.3}C${size*0.5} ${size*0.3} ${size*0.66} ${size*0.18} ${size*0.62} ${size*0.26}C${size*0.58} ${size*0.34} ${size*0.5} ${size*0.3} ${size*0.5} ${size*0.3}Z`}
        rim="#F472B6" strokeWidth={1.5}
      />
    </Sphere>
  );
}

/** ✅ Green 3D CheckCircle (for completed states) */
export function Icon3DCheckCircle({ size = 20 }: { size?: number }) {
  const id = useId("chkc");
  return (
    <Sphere size={size} id={id}
      bright="#6EE7B7" mid="#10B981" shade="#059669" sheen="#D1FAE5">
      <IconPath
        d={`M${size*0.5} ${size*0.18}A${size*0.32} ${size*0.32} 0 1 1 ${size*0.5-0.01} ${size*0.18}Z
            M${size*0.34} ${size*0.5}L${size*0.46} ${size*0.62}L${size*0.66} ${size*0.38}`}
        rim="#10B981" strokeWidth={1.7}
      />
    </Sphere>
  );
}

/** ⚙️ Grey 3D Settings Gear */
export function Icon3DSettings({ size = 30 }: { size?: number }) {
  const id = useId("stg");
  const h = size / 2;
  return (
    <Sphere size={size} id={id}
      bright="#CBD5E1" mid="#64748B" shade="#475569" sheen="#F9FAFB">
      <IconPath
        d={`M${h} ${h*0.52}A${h*0.2} ${h*0.2} 0 1 1 ${h-0.01} ${h*0.52}Z
            M${h} ${size*0.18}L${h} ${size*0.28}
            M${h} ${size*0.72}L${h} ${size*0.82}
            M${size*0.18} ${h}L${size*0.28} ${h}
            M${size*0.72} ${h}L${size*0.82} ${h}
            M${size*0.26} ${size*0.26}L${size*0.33} ${size*0.33}
            M${size*0.67} ${size*0.67}L${size*0.74} ${size*0.74}
            M${size*0.74} ${size*0.26}L${size*0.67} ${size*0.33}
            M${size*0.33} ${size*0.67}L${size*0.26} ${size*0.74}`}
        rim="#94A3B8" strokeWidth={1.6}
      />
    </Sphere>
  );
}

/** > Grey 3D ChevronRight */
export function Icon3DChevronRight({ size = 16 }: { size?: number }) {
  const id = useId("chvr");
  return (
    <Sphere size={size} id={id}
      bright="#CBD5E1" mid="#64748B" shade="#475569" sheen="#F9FAFB">
      <IconPath
        d={`M${size*0.38} ${size*0.3}L${size*0.62} ${size*0.5}L${size*0.38} ${size*0.7}`}
        rim="#94A3B8" strokeWidth={1.8}
      />
    </Sphere>
  );
}
