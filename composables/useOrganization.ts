import { createClient } from '@supabase/supabase-js'

let _supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (_supabase) return _supabase
  const config = useRuntimeConfig()
  _supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string
  )
  return _supabase
}

export function useOrganization() {
  const supabase = getSupabase()

  const companyLogo = useState<string | null>('company-logo', () => null)
  const orgName = useState<string>('org-name', () => 'RouteReady')
  const orgId = useState<string | null>('org-id', () => null)

  async function fetchOrganization() {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, logo_url')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching organization:', error.message)
      return
    }
    if (data) {
      orgId.value = data.id
      orgName.value = data.name
      companyLogo.value = data.logo_url
    }
  }

  async function uploadLogo(file: File) {
    if (!orgId.value) await fetchOrganization()

    if (!orgId.value) {
      console.error('No organization found — cannot upload logo')
      return
    }

    const path = `logos/${orgId.value}-${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('org-assets')
      .upload(path, file, { upsert: true })

    if (error) {
      console.error('Error uploading logo:', error.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('org-assets')
      .getPublicUrl(data.path)

    companyLogo.value = publicUrl

    await supabase
      .from('organizations')
      .update({ logo_url: publicUrl })
      .eq('id', orgId.value)
  }

  return { companyLogo, orgName, orgId, fetchOrganization, uploadLogo }
}