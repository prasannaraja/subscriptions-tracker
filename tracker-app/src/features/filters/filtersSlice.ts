import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  filterCat: string;
  searchQ: string;
  showInactive: boolean;
  sortBy: string;
}

const initialState: FiltersState = {
  filterCat: "all",
  searchQ: "",
  showInactive: false,
  sortBy: "name",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilterCat(state, action: PayloadAction<string>) {
      state.filterCat = action.payload;
    },
    setSearchQ(state, action: PayloadAction<string>) {
      state.searchQ = action.payload;
    },
    setShowInactive(state, action: PayloadAction<boolean>) {
      state.showInactive = action.payload;
    },
    setSortBy(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
    },
  },
});

export const { setFilterCat, setSearchQ, setShowInactive, setSortBy } = filtersSlice.actions;
export default filtersSlice.reducer;
