// store/searchStore.js
import { create } from "zustand";

const searchStore = create((set) => ({
  searchResults: [],
  searchTerm: "",
  setSearchData: (results, term) => set({ searchResults: results, searchTerm: term }),
}));

export default searchStore;
