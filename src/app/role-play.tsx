import { Redirect } from "expo-router";

/** Legacy route — canonical roleplay lives at /(tabs)/roleplay */
export default function RolePlayRedirect() {
  return <Redirect href="/roleplay" />;
}
