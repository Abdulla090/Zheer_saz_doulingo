import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useProgressStore } from "../stores/useProgressStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { isMascotId } from "../constants/mascots";
import type { Session, User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  selected_mascot_id: string;
  is_premium: boolean;
  subscription_tier: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  deleteAccount: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Reference to track sync operation so we do not sync during initial load
  const isInitialLoad = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settingsSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pushProgressToDatabase = useCallback(async (userId: string, state: any) => {
    try {
      const { error } = await supabase
        .from("user_progress")
        .upsert({
          user_id: userId,
          path_indexes: state.pathIndexes,
          normal_path_indexes: state.normalPathIndexes,
          kids_path_indexes: state.kidsPathIndexes,
          total_xp: state.totalXp,
          daily_xp: state.dailyXp,
          streak_days: state.streakDays,
          last_active_date: state.lastActiveDate,
          last_activity: state.lastActivity,
        });

      if (error) {
        console.error("Failed to sync progress to Supabase:", error.message);
      }
    } catch (e) {
      console.error("Database sync error:", e);
    }
  }, []);

  const pushSettingsToDatabase = useCallback(async (userId: string, state: any) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: state.userName,
          age: state.userAge ? parseInt(state.userAge, 10) : null,
          path_mode: state.pathMode,
          tutor_voice: state.tutorVoice,
          avatar_url: state.avatarUrl || null,
          selected_mascot_id: state.selectedMascotId,
        })
        .eq("id", userId);

      if (error) {
        console.error("Failed to sync settings to Supabase profiles:", error.message);
      }
    } catch (e) {
      console.error("Profiles database sync error:", e);
    }
  }, []);

  // Load profile and sync progress on user login
  const handleUserLogin = useCallback(async (loggedUser: User) => {
    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, selected_mascot_id, age, path_mode, tutor_voice, is_premium, subscription_tier")
        .eq("id", loggedUser.id)
        .single();
      
      if (!profileErr && profileData) {
        setProfile(profileData);
        // Sync local settings from DB
        isInitialLoad.current = true;
        if (profileData.display_name) {
          useSettingsStore.getState().setUserName(profileData.display_name);
        }
        if (profileData.age) {
          useSettingsStore.getState().setUserAge(String(profileData.age));
        }
        if (profileData.path_mode) {
          useSettingsStore.getState().setPathMode(profileData.path_mode as any);
        }
        if (profileData.tutor_voice) {
          useSettingsStore.getState().setTutorVoice(profileData.tutor_voice);
        }
        useSettingsStore.getState().setAvatarUrl(profileData.avatar_url || "");
        if (isMascotId(profileData.selected_mascot_id)) {
          useSettingsStore.getState().setSelectedMascotId(profileData.selected_mascot_id);
        }
        useSettingsStore.getState().setIsPremium(!!profileData.is_premium);
        useSettingsStore.getState().setSubscriptionTier(profileData.subscription_tier || null);
      } else {
        // If no profile, push local settings to initialize
        const localSettings = useSettingsStore.getState();
        await pushSettingsToDatabase(loggedUser.id, localSettings);
      }

      // 2. Fetch Progress
      const { data: dbProgress, error: progressErr } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", loggedUser.id)
        .single();

      isInitialLoad.current = true; // Block writing back during load

      if (!progressErr && dbProgress) {
        // Sync remote progress to local store
        useProgressStore.setState({
          pathIndexes: dbProgress.path_indexes ?? {},
          normalPathIndexes: dbProgress.normal_path_indexes ?? {},
          kidsPathIndexes: dbProgress.kids_path_indexes ?? {},
          totalXp: dbProgress.total_xp ?? 0,
          dailyXp: dbProgress.daily_xp ?? 0,
          streakDays: dbProgress.streak_days ?? 0,
          lastActiveDate: dbProgress.last_active_date,
          lastActivity: dbProgress.last_activity,
        });
      } else {
        // If no progress in DB, push current local progress to initialize DB
        const localProgress = useProgressStore.getState();
        await pushProgressToDatabase(loggedUser.id, localProgress);
      }
    } catch (e) {
      console.error("Error during user login sync:", e);
    } finally {
      isInitialLoad.current = false;
    }
  }, [pushProgressToDatabase, pushSettingsToDatabase]);

  // Listen for session/auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        handleUserLogin(initialSession.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        handleUserLogin(currentSession.user).then(() => setLoading(false));
      } else {
        setProfile(null);
        // Clear progress to default when logged out (or keep it local)
        isInitialLoad.current = true;
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleUserLogin]);

  // Sync local progress changes to Supabase (debounced to protect the DB)
  useEffect(() => {
    if (!user) return;

    const unsubscribe = useProgressStore.subscribe((state) => {
      if (isInitialLoad.current) return;

      // Debounce database sync (1.5 seconds)
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        pushProgressToDatabase(user.id, state);
      }, 1500);
    });

    return () => {
      unsubscribe();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [pushProgressToDatabase, user]);

  // Sync local settings changes to Supabase (debounced to protect the DB)
  useEffect(() => {
    if (!user) return;

    const unsubscribe = useSettingsStore.subscribe((state) => {
      if (isInitialLoad.current) return;

      // Debounce database sync (1.5 seconds)
      if (settingsSyncTimeoutRef.current) {
        clearTimeout(settingsSyncTimeoutRef.current);
      }

      settingsSyncTimeoutRef.current = setTimeout(() => {
        pushSettingsToDatabase(user.id, state);
      }, 1500);
    });

    return () => {
      unsubscribe();
      if (settingsSyncTimeoutRef.current) clearTimeout(settingsSyncTimeoutRef.current);
    };
  }, [pushSettingsToDatabase, user]);

  const clearSignedInUserState = () => {
    useProgressStore.getState().resetProgress();
    useSettingsStore.getState().setUserName("");
    useSettingsStore.getState().setUserAge("");
    useSettingsStore.getState().setPathMode("normal");
    useSettingsStore.getState().setTutorVoice("Aoede");
    useSettingsStore.getState().setAvatarUrl("");
    useSettingsStore.getState().setIsPremium(false);
    useSettingsStore.getState().setSubscriptionTier(null);
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearSignedInUserState();
    } catch (e) {
      console.error("Error signing out:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      throw new Error("You must be signed in to delete an account.");
    }

    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;

      // The remote account no longer exists; remove its token from this device.
      await supabase.auth.signOut({ scope: "local" });
      clearSignedInUserState();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (e) {
      console.error("Error deleting account:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
