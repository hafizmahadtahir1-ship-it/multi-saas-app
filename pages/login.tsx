"use client";
import { useEffect } from "react";
import supabase from "../lib/supabaseClient"
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const loginDummyUser = async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "Test1234!",
      });

      if (error) {
        console.error("Login error:", error.message);
        alert("Login failed ❌ Check console");
      } else {
        router.push("/templates");
      }
    };
    loginDummyUser();
  }, []);

  return <div>Logging in dummy user...</div>;
}