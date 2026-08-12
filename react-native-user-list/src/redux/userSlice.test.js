import { describe, it, expect } from 'vitest';
import userReducer, {
  setSearchQuery,
  loadMoreUsers,
  selectFilteredUsers,
  selectPaginatedUsers,
  selectHasMoreUsers,
} from './userSlice';

describe('Redux userSlice state & selectors', () => {
  const sampleUsers = [
    { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
    { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
    { id: 3, name: 'Clementine Bauch', email: 'Nathan@yesenia.net' },
    { id: 4, name: 'Patricia Lebsack', email: 'Julianne.OConner@kory.org' },
    { id: 5, name: 'Chelsey Dietrich', email: 'Lucio_Hettinger@annie.ca' },
  ];

  const initialState = {
    items: sampleUsers,
    status: 'succeeded',
    error: null,
    isOffline: false,
    searchQuery: '',
    page: 1,
    pageSize: 2,
  };

  it('updates searchQuery and resets page to 1', () => {
    const state = userReducer({ ...initialState, page: 3 }, setSearchQuery('Leanne'));
    expect(state.searchQuery).toBe('Leanne');
    expect(state.page).toBe(1);
  });

  it('increments page count on loadMoreUsers action', () => {
    const state = userReducer(initialState, loadMoreUsers());
    expect(state.page).toBe(2);
  });

  it('filters users by name via selectFilteredUsers selector', () => {
    const state = { users: { ...initialState, searchQuery: 'Ervin' } };
    const filtered = selectFilteredUsers(state);

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Ervin Howell');
  });

  it('paginates users correctly via selectPaginatedUsers selector', () => {
    // Page 1 with pageSize 2 should return 2 users
    let state = { users: initialState };
    let paginated = selectPaginatedUsers(state);
    expect(paginated.length).toBe(2);

    // Page 2 should return 4 users
    state = { users: { ...initialState, page: 2 } };
    paginated = selectPaginatedUsers(state);
    expect(paginated.length).toBe(4);
  });

  it('determines if more users are available via selectHasMoreUsers selector', () => {
    let state = { users: { ...initialState, page: 1, pageSize: 2 } };
    expect(selectHasMoreUsers(state)).toBe(true);

    state = { users: { ...initialState, page: 3, pageSize: 2 } };
    expect(selectHasMoreUsers(state)).toBe(false);
  });
});
