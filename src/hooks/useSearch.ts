import { useState, useEffect } from 'react';

export function useSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  debounceMs = 150
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = debouncedQuery.trim()
    ? items.filter((item) => searchFn(item, debouncedQuery.trim().toLowerCase()))
    : items;

  return {
    query,
    setQuery,
    debouncedQuery,
    results
  };
}
