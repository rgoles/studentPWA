import { supabase } from "@/config/supabase";

export async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,

    // TODO: options redirect promijeni na pravi link npr about ili stogod

    options: {
      emailRedirectTo: "https://example.com/welcome",
    },
  });
  
  if (error) {
    console.error("Signup failed:", error.message);
    throw new Error(`Failed to sign up: ${error.message}`);
  }
  
  console.log("Signup successful:", data.user);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) {
    console.error("Login failed:", error.message);
    throw new Error(`Failed to sign in: ${error.message}`);
  }
  
  console.log("Login successful:", data.user);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Signout failed:", error.message);
    throw new Error(`Failed to sign out: ${error.message}`);
  }
  
  return true; // Success
}
