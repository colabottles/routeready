// Stub — replace with Supabase fetch when database is ready
// Expected shape: { id: string, name: string, address: string }

export function useProperties() {
  const properties = ref([
    { id: '1', name: 'North Office Complex', address: '1112 W Hatcher Rd, Phoenix, AZ 85021' },
    { id: '2', name: 'Sunnyslope Plaza', address: '9375 N 7th St, Phoenix, AZ 85020' },
    { id: '3', name: 'Metro Parkway Center', address: '2929 W Dunlap Ave, Phoenix, AZ 85051' },
    { id: '4', name: 'Cholla Business Park', address: '1640 W Cholla St, Phoenix, AZ 85029' },
  ])

  // TODO: replace with useFetch/useSupabaseClient when DB is ready
  // const supabase = useSupabaseClient()
  // const { data } = await supabase.from('properties').select('id, name, address')
  // properties.value = data

  return { properties }
}