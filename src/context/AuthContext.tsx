import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useProgressStore } from "../stores/useProgressStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { isMascotId } from "../constants/mascots";
import { getBillingAccount, type BillingAccount } from "../services/billing";
import type { Session, User } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

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
  billingAccount: BillingAccount | null;
  billingError: boolean;
  loading: boolean;
  refreshBillingAccount: () => Promise<BillingAccount | null>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  billingAccount: null,
  billingError: false,
  loading: true,
  refreshBillingAccount: async () => null,
  signOut: async () => {},
  deleteAccount: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [billingAccount, setBillingAccount] = useState<BillingAccount | null>(null);
  const [billingError, setBillingError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Reference to track sync operation so we do not sync during initial load
  const isInitialLoad = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settingsSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeUserId = useRef<string | null>(null);
  const accountGeneration = useRef(0);
  const billingRequest = useRef<Promise<BillingAccount | null> | null>(null);

  const refreshBillingAccount = useCallback((): Promise<BillingAccount | null> => {
    if (!activeUserId.current) return Promise.resolve(null);
    if (billingRequest.current) return billingRequest.current;
    const generation = accountGeneration.current;
    const request = (async () => {
    try {
      const account = await getBillingAccount();
      if (generation !== accountGeneration.current) return null;
      setBillingAccount(account);
      setBillingError(false);
      const premium =
        account.subscription.status === "active" &&
        account.subscription.plan !== "free";
      useSettingsStore.getState().setIsPremium(premium);
      useSettingsStore
        .getState()
        .setSubscriptionTier(premium ? account.subscription.plan : "free");
      return account;
    } catch (error) {
      if (generation !== accountGeneration.current) return null;
      setBillingError(true);
      if (__DEV__) {
        console.warn("Billing account refresh failed:", error);
      }
      return null;
    } finally {
      if (generation === accountGeneration.current) billingRequest.current = null;
    }
    })();
    billingRequest.current = request;
    return request;
  }, []);

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
    const generation = accountGeneration.current;
    const isCurrent = () => generation === accountGeneration.current && activeUserId.current === loggedUser.id;
    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, selected_mascot_id, age, path_mode, tutor_voice, is_premium, subscription_tier")
        .eq("id", loggedUser.id)
        .single();
      if (!isCurrent()) return;
      
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
      } else if (profileErr?.code === "PGRST116") {
        // If no profile, push local settings to initialize
        const localSettings = useSettingsStore.getState();
        await pushSettingsToDatabase(loggedUser.id, localSettings);
      }
      if (!isCurrent()) return;

      // 2. Fetch Progress
      const { data: dbProgress, error: progressErr } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", loggedUser.id)
        .single();
      if (!isCurrent()) return;

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
      } else if (progressErr?.code === "PGRST116") {
        // If no progress in DB, push current local progress to initialize DB
        const localProgress = useProgressStore.getState();
        await pushProgressToDatabase(loggedUser.id, localProgress);
      }

      // Wallet and plan state are server-owned. Fetch them only after the
      // shared Supabase session has been restored.
      if (isCurrent()) await refreshBillingAccount();
    } catch (e) {
      console.error("Error during user login sync:", e);
    } finally {
      if (isCurrent()) isInitialLoad.current = false;
    }
  }, [pushProgressToDatabase, pushSettingsToDatabase, refreshBillingAccount]);

  // Auth callbacks must return before invoking Supabase again (its auth lock
  // is still held). Token refreshes must not reload and overwrite local progress.
  useEffect(() => {
    let mounted = true;
    let receivedAuthEvent = false;
    let loginTimer: ReturnType<typeof setTimeout> | undefined;
    const applySession = (next: Session | null) => {
      if (!mounted) return;
      const nextId = next?.user.id ?? null;
      const previousId = activeUserId.current;
      setSession(next);
      setUser(next?.user ?? null);
      setLoading(false);
      if (nextId === previousId) return;

      accountGeneration.current += 1;
      activeUserId.current = nextId;
      billingRequest.current = null;
      isInitialLoad.current = true;
      clearTimeout(loginTimer);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (settingsSyncTimeoutRef.current) clearTimeout(settingsSyncTimeoutRef.current);
      setProfile(null);
      setBillingAccount(null);
      setBillingError(false);
      useSettingsStore.getState().setIsPremium(false);
      useSettingsStore.getState().setSubscriptionTier(null);
      if (previousId) {
        useProgressStore.getState().resetProgress();
        useSettingsStore.getState().setUserName("");
        useSettingsStore.getState().setUserAge("");
        useSettingsStore.getState().setAvatarUrl("");
      }
      if (next?.user) {
        loginTimer = setTimeout(() => {
          if (mounted) void handleUserLogin(next.user);
        }, 0);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      receivedAuthEvent = true;
      applySession(next);
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (!receivedAuthEvent) applySession(data.session);
    }).catch((error) => {
      console.error("Unable to restore the saved session:", error);
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
      accountGeneration.current += 1;
      activeUserId.current = null;
      billingRequest.current = null;
      clearTimeout(loginTimer);
      subscription.unsubscribe();
    };
  }, [handleUserLogin]);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const update = (state: string) => {
      if (state === "active") void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    };
    update(AppState.currentState);
    const listener = AppState.addEventListener("change", update);
    return () => {
      listener.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  // Returning from hosted web checkout brings the app back to the foreground.
  // Refresh once on that transition so web and mobile show the same account.
  useEffect(() => {
    if (!user) return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refreshBillingAccount();
    });
    return () => subscription.remove();
  }, [refreshBillingAccount, user]);

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
    setBillingAccount(null);
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
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        billingAccount,
        billingError,
        loading,
        refreshBillingAccount,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
