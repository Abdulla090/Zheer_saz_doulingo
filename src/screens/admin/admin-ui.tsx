import { AppText } from "../../components/ui/AppText";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type AdminFieldProps = TextInputProps & {
  label: string;
  latin?: boolean;
};

export function AdminField({
  label,
  latin = false,
  style,
  ...rest
}: AdminFieldProps) {
  return (
    <View style={styles.field}>
      <AppText style={styles.label} forceLatinFont={latin}>
        {label}
      </AppText>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#9CA3AF"
        multiline={rest.multiline ?? label.length > 20}
        {...rest}
      />
    </View>
  );
}

type AdminButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "ghost";
  small?: boolean;
};

export function AdminButton({
  label,
  onPress,
  variant = "primary",
  small,
}: AdminButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        variant === "primary" && styles.btnPrimary,
        variant === "danger" && styles.btnDanger,
        variant === "ghost" && styles.btnGhost,
        pressed && styles.btnPressed,
      ]}
    >
      <AppText
        style={[
          styles.btnText,
          variant === "ghost" && styles.btnGhostText,
          small && styles.btnTextSmall,
        ]}
        forceLatinFont
      >
        {label}
      </AppText>
    </Pressable>
  );
}

type AdminCardProps = {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function AdminCard({ title, children, actions }: AdminCardProps) {
  return (
    <View style={styles.card}>
      {(title || actions) && (
        <View style={styles.cardHeader}>
          {title ? (
            <AppText style={styles.cardTitle} forceLatinFont>
              {title}
            </AppText>
          ) : (
            <View />
          )}
          {actions}
        </View>
      )}
      {children}
    </View>
  );
}

export function AdminSegment<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map((opt) => (
        <Pressable
          key={opt.id}
          onPress={() => onChange(opt.id)}
          style={[
            styles.segmentItem,
            value === opt.id && styles.segmentItemActive,
          ]}
        >
          <AppText
            style={[
              styles.segmentText,
              value === opt.id && styles.segmentTextActive,
            ]}
            forceLatinFont
          >
            {opt.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "700", color: "#64748B" },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
    minHeight: 44,
  },
  btn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 12 },
  btnPrimary: { backgroundColor: "#2B59F3" },
  btnDanger: { backgroundColor: "#EF4444" },
  btnGhost: { backgroundColor: "#F1F5F9" },
  btnPressed: { opacity: 0.85 },
  btnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  btnTextSmall: { fontSize: 12 },
  btnGhostText: { color: "#334155" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EDFF",
    shadowColor: "#2B59F3",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#152238", flex: 1 },
  segment: {
    flexDirection: "row",
    backgroundColor: "#E8EDFF",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentItemActive: { backgroundColor: "#FFFFFF" },
  segmentText: { fontSize: 13, fontWeight: "700", color: "#64748B" },
  segmentTextActive: { color: "#2B59F3" },
});
