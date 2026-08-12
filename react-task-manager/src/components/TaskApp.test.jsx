import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../redux/taskSlice';
import App from '../App';

const renderApp = (initialState) => {
  const store = configureStore({
    reducer: {
      tasks: taskReducer,
    },
    preloadedState: initialState
      ? { tasks: initialState }
      : undefined,
  });

  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

describe('React Task Manager UI Component Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Header with title and stats correctly', () => {
    renderApp();
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('filters tasks when Priority filter pills are clicked', () => {
    renderApp({
      items: [
        { id: '1', title: 'High Priority Task', priority: 'High', completed: false },
        { id: '2', title: 'Low Priority Task', priority: 'Low', completed: false },
      ],
      priorityFilter: 'All',
      statusFilter: 'All',
      searchQuery: '',
    });

    expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    expect(screen.getByText('Low Priority Task')).toBeInTheDocument();

    // Click High Priority filter pill
    const highFilterPill = screen.getAllByRole('button', { name: 'High' })[0];
    fireEvent.click(highFilterPill);

    expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    expect(screen.queryByText('Low Priority Task')).not.toBeInTheDocument();
  });

  it('opens New Task modal and creates a new task', () => {
    renderApp({
      items: [],
      priorityFilter: 'All',
      statusFilter: 'All',
      searchQuery: '',
    });

    const addButton = screen.getByRole('button', { name: /Add Card/i });
    fireEvent.click(addButton);

    // Modal should be open
    expect(screen.getByText('Add New Card')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Build React Component Tests' } });

    // Submit modal form
    const submitBtn = screen.getByRole('button', { name: 'Add Card' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Build React Component Tests')).toBeInTheDocument();
  });
});
