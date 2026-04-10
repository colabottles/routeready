// Stub — replace with Supabase fetch when database is ready
// Expected table: organizations (id, name, logo_url, address, ...)

export function useOrganization() {
  // const supabase = useSupabaseClient()
  const companyLogo = useState('company-logo', () => null)
  const orgName = useState('org-name', () => 'RouteReady')

  async function fetchOrganization() {
    // TODO: uncomment when organizations table exists
    // const { data, error } = await supabase
    //   .from('organizations')
    //   .select('name, logo_url')
    //   .single()
    // if (data) {
    //   companyLogo.value = data.logo_url
    //   orgName.value = data.name
    // }

    // Temporary: fall back to localStorage
    if (import.meta.client) {
      const savedLogo = localStorage.getItem('routeready-logo')
      if (savedLogo) companyLogo.value = savedLogo
    }
  }

  async function uploadLogo(file: File) {
    // TODO: uncomment when Supabase Storage is ready
    // const { data, error } = await supabase.storage
    //   .from('org-assets')
    //   .upload(`logos/${Date.now()}-${file.name}`, file, { upsert: true })
    // if (data) {
    //   const { data: { publicUrl } } = supabase.storage
    //     .from('org-assets')
    //     .getPublicUrl(data.path)
    //   companyLogo.value = publicUrl
    //   await supabase.from('organizations').update({ logo_url: publicUrl }).eq('id', orgId)
    // }

    // Temporary: use base64 + localStorage
    return new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        companyLogo.value = result
        if (import.meta.client) {
          localStorage.setItem('routeready-logo', result)
        }
        resolve()
      }
      reader.readAsDataURL(file)
    })
  }

  return { companyLogo, orgName, fetchOrganization, uploadLogo }
}