import { PasswordsDontMatchError } from "@/lib/auth/auth-flows-error";
import { createClient } from "@/lib/supabase/client";

export const authClientService = {
  async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async loginWithEmail(email: string, password: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  async loginWithGoogle(redirectTo: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
          redirectTo,
        )}`,
      },
    });
    if (error) throw error;
  },

  async signUpWithEmail(
    email: string,
    password: string,
    repeatPassword: string,
  ) {
    if (password !== repeatPassword) {
      throw new PasswordsDontMatchError();
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  },

  async signUpWithGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const supabase = createClient();
    // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
};
