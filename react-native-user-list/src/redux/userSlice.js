import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@cached_user_list_v1';
const API_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * AsyncThunk to fetch user data from API with AsyncStorage offline fallback caching.
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Attempt online fetch
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const data = await response.json();

      // Cache data in AsyncStorage for offline usage
      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (cacheError) {
        console.warn('AsyncStorage cache write error:', cacheError);
      }

      return { users: data, isOffline: false };
    } catch (error) {
      console.warn('Network request failed, falling back to AsyncStorage cache:', error.message);

      // Attempt to load from AsyncStorage offline cache
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedData = JSON.parse(cached);
          return { users: cachedData, isOffline: true };
        }
      } catch (cacheReadError) {
        console.error('AsyncStorage cache read error:', cacheReadError);
      }

      return rejectWithValue(error.message || 'Unable to fetch users online or offline');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isOffline: false,
  searchQuery: '',
  page: 1,
  pageSize: 4, // 4 users per page for pagination demo
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1; // Reset to page 1 on search
    },
    loadMoreUsers: (state) => {
      state.page += 1;
    },
    resetPagination: (state) => {
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.users;
        state.isOffline = action.payload.isOffline;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load user list';
      });
  },
});

export const { setSearchQuery, loadMoreUsers, resetPagination } = userSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.items;
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;
export const selectIsOffline = (state) => state.users.isOffline;
export const selectSearchQuery = (state) => state.users.searchQuery;
export const selectPage = (state) => state.users.page;

// Selector to get filtered users by name
export const selectFilteredUsers = (state) => {
  const users = state.users.items;
  const query = state.users.searchQuery.toLowerCase().trim();

  if (!query) return users;

  return users.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
};

// Selector to get paginated users for FlatList
export const selectPaginatedUsers = (state) => {
  const filtered = selectFilteredUsers(state);
  const limit = state.users.page * state.users.pageSize;
  return filtered.slice(0, limit);
};

// Selector to check if more users are available to load
export const selectHasMoreUsers = (state) => {
  const filtered = selectFilteredUsers(state);
  const currentCount = state.users.page * state.users.pageSize;
  return currentCount < filtered.length;
};

export default userSlice.reducer;
