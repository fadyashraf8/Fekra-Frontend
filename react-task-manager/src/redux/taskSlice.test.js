import { describe, it, expect, beforeEach, vi } from 'vitest';
import taskReducer, {
  addTask,
  editTask,
  deleteTask,
  toggleTask,
  setPriorityFilter,
  setStatusFilter,
  setSearchQuery,
  clearCompletedTasks,
  selectFilteredTasks,
  selectTaskStats,
} from './taskSlice';

describe('Redux taskSlice Reducers & Persistence', () => {
  let initialState;

  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorage.clear();
    initialState = {
      items: [
        { id: '1', title: 'Task One', priority: 'High', completed: false, createdAt: '2026-08-12T10:00:00.000Z' },
        { id: '2', title: 'Task Two', priority: 'Medium', completed: true, createdAt: '2026-08-12T11:00:00.000Z' },
        { id: '3', title: 'Task Three', priority: 'Low', completed: false, createdAt: '2026-08-12T12:00:00.000Z' },
      ],
      priorityFilter: 'All',
      statusFilter: 'All',
      searchQuery: '',
    };
  });

  it('should handle initial state correctly', () => {
    const state = taskReducer(undefined, { type: 'unknown' });
    expect(state.items).toBeDefined();
    expect(Array.isArray(state.items)).toBe(true);
  });

  it('should add a new task via addTask', () => {
    const action = addTask({ title: 'New Test Task', priority: 'High' });
    const nextState = taskReducer(initialState, action);

    expect(nextState.items.length).toBe(4);
    expect(nextState.items[0].title).toBe('New Test Task');
    expect(nextState.items[0].priority).toBe('High');
    expect(nextState.items[0].completed).toBe(false);
  });

  it('should edit an existing task title and priority via editTask', () => {
    const action = editTask({ id: '1', title: 'Updated Title', priority: 'Low' });
    const nextState = taskReducer(initialState, action);

    const updatedTask = nextState.items.find((t) => t.id === '1');
    expect(updatedTask.title).toBe('Updated Title');
    expect(updatedTask.priority).toBe('Low');
  });

  it('should delete a task via deleteTask', () => {
    const action = deleteTask('2');
    const nextState = taskReducer(initialState, action);

    expect(nextState.items.length).toBe(2);
    expect(nextState.items.find((t) => t.id === '2')).toBeUndefined();
  });

  it('should toggle completion status of a task via toggleTask', () => {
    const action = toggleTask('1');
    const nextState = taskReducer(initialState, action);

    const task = nextState.items.find((t) => t.id === '1');
    expect(task.completed).toBe(true);

    const toggleBack = taskReducer(nextState, toggleTask('1'));
    expect(toggleBack.items.find((t) => t.id === '1').completed).toBe(false);
  });

  it('should filter tasks by Priority (High, Medium, Low)', () => {
    let state = { ...initialState, priorityFilter: 'High' };
    let filtered = selectFilteredTasks({ tasks: state });
    expect(filtered.length).toBe(1);
    expect(filtered[0].priority).toBe('High');

    state = { ...initialState, priorityFilter: 'Medium' };
    filtered = selectFilteredTasks({ tasks: state });
    expect(filtered.length).toBe(1);
    expect(filtered[0].priority).toBe('Medium');

    state = { ...initialState, priorityFilter: 'Low' };
    filtered = selectFilteredTasks({ tasks: state });
    expect(filtered.length).toBe(1);
    expect(filtered[0].priority).toBe('Low');
  });

  it('should filter tasks by status (Active, Completed)', () => {
    let state = { ...initialState, statusFilter: 'Active' };
    let filtered = selectFilteredTasks({ tasks: state });
    expect(filtered.length).toBe(2);

    state = { ...initialState, statusFilter: 'Completed' };
    filtered = selectFilteredTasks({ tasks: state });
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should filter tasks by search query', () => {
    const state = { ...initialState, searchQuery: 'Three' };
    const filtered = selectFilteredTasks({ tasks: state });

    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Task Three');
  });

  it('should clear completed tasks via clearCompletedTasks', () => {
    const action = clearCompletedTasks();
    const nextState = taskReducer(initialState, action);

    expect(nextState.items.length).toBe(2);
    expect(nextState.items.every((t) => !t.completed)).toBe(true);
  });

  it('should calculate task stats correctly', () => {
    const stats = selectTaskStats({ tasks: initialState });

    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.active).toBe(2);
    expect(stats.highPriority).toBe(1);
  });
});
