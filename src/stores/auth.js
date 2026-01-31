import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  async function init() {
    if (!isSupabaseConfigured) {
      loading.value = false;
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user.value = session?.user ?? null;
    loading.value = false;

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  }

  async function signIn(email, password) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signUp(email, password) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // When email confirmation is required, session is null until user confirms
    return { needsEmailConfirmation: !data.session };
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  return { user, loading, init, signIn, signUp, signOut };
});
