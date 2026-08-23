export const useSearch = () => {
  const isSearchOpen = useState<boolean>('search-modal-open', () => false)
  const searchQuery = useState<string>('search-query', () => '')

  const openSearch = () => {
    isSearchOpen.value = true
  }

  const closeSearch = () => {
    isSearchOpen.value = false
    searchQuery.value = ''
  }

  return {
    isSearchOpen,
    searchQuery,
    openSearch,
    closeSearch
  }
}
