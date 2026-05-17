export function useSupabaseClient() {
  const { $supabase } = useNuxtApp()
  return $supabase
}