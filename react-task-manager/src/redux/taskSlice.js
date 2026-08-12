import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'react_redux_task_manager_tasks';

// Default initial tasks if local storage is empty
const defaultTasks = [
  {
    id: '1',
    title: 'Complete Frontend Code Challenge for Fekra',
    priority: 'High',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: '2',
    title: 'Design responsive UI components with glassmorphic style',
    priority: 'Medium',
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: '3',
    title: 'Review Redux Toolkit slice logic & persistence',
    priority: 'Low',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Helper to safely load tasks from LocalStorage
const loadTasksFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error('Failed to load tasks from LocalStorage:', error);
  }
  return defaultTasks;
};

// Helper to save tasks to LocalStorage
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to LocalStorage:', error);
  }
};

const initialState = {
  items: loadTasksFromStorage(),
  priorityFilter: 'All', // 'All' | 'High' | 'Medium' | 'Low'
  statusFilter: 'All',   // 'All' | 'Active' | 'Completed'
  searchQuery: '',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { title, priority } = action.payload;
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        priority: priority || 'Medium',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newTask);
      saveTasksToStorage(state.items);
    },
    editTask: (state, action) => {
      const { id, title, priority } = action.payload;
      const task = state.items.find((item) => item.id === id);
      if (task) {
        if (title !== undefined) task.title = title.trim();
        if (priority !== undefined) task.priority = priority;
        saveTasksToStorage(state.items);
      }
    },
    deleteTask: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      saveTasksToStorage(state.items);
    },
    toggleTask: (state, action) => {
      const id = action.payload;
      const task = state.items.find((item) => item.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.items);
      }
    },
    setPriorityFilter: (state, action) => {
      state.priorityFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearCompletedTasks: (state) => {
      state.items = state.items.filter((item) => !item.completed);
      saveTasksToStorage(state.items);
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  toggleTask,
  setPriorityFilter,
  setStatusFilter,
  setSearchQuery,
  clearCompletedTasks,
} = taskSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectPriorityFilter = (state) => state.tasks.priorityFilter;
export const selectStatusFilter = (state) => state.tasks.statusFilter;
export const selectSearchQuery = (state) => state.tasks.searchQuery;

export const selectFilteredTasks = (state) => {
  const tasks = state.tasks.items;
  const priorityFilter = state.tasks.priorityFilter;
  const statusFilter = state.tasks.statusFilter;
  const searchQuery = state.tasks.searchQuery.toLowerCase().trim();

  return tasks.filter((task) => {
    // Priority filter
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
      return false;
    }
    // Status filter
    if (statusFilter === 'Active' && task.completed) return false;
    if (statusFilter === 'Completed' && !task.completed) return false;
    // Search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery)) {
      return false;
    }
    return true;
  });
};

export const selectTaskStats = (state) => {
  const tasks = state.tasks.items;
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  return { total, completed, active, highPriority };
};

export default taskSlice.reducer;
