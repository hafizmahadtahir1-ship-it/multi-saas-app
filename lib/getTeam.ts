import supabase from "../lib/supabaseClient"

export async function getTeamId(userId: string) {
  const { data, error } = await supabase
    .from("members")
    .select("team_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Team not found", error);
    return null;
  }

  return data.team_id;
}