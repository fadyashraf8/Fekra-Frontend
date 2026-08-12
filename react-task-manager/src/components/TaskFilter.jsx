import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPriorityFilter,
  selectStatusFilter,
  selectSearchQuery,
  setPriorityFilter,
  setStatusFilter,
  setSearchQuery,
  clearCompletedTasks,
  selectTaskStats,
} from '../redux/taskSlice';
import { Search, Filter, Trash2 } from 'lucide-react';

const TaskFilter = () => {
  const dispatch = useDispatch();
  const priorityFilter = useSelector(selectPriorityFilter);
  const statusFilter = useSelector(selectStatusFilter);
  const searchQuery = useSelector(selectSearchQuery);
  const stats = useSelector(selectTaskStats);

  const priorities = ['All', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Active', 'Completed'];

  return (
    <div className="trello-toolbar">
      {/* Search Input Box */}
      <div className="search-box">
        <Search className="search-icon" size={15} />
        <input
          type="text"
          className="input-search"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />z
      </div>

      {/* Priority Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Filter size={13} /> Priority:
        </span>
        <div className="filter-group">
          {priorities.map((priority) => (
            <button
              key={priority}
              className={`filter-pill ${priorityFilter === priority ? 'active' : ''}`}
              onClick={() => dispatch(setPriorityFilter(priority))}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div className="filter-group">
          {statuses.map((status) => (
            <button
              key={status}
              className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
              onClick={() => dispatch(setStatusFilter(status))}
            >
              {status}
            </button>
          ))}
        </div>

        {stats.completed > 0 && (
          <button
            className="filter-pill"
            style={{ color: '#dc2626', background: '#fee2e2' }}
            onClick={() => dispatch(clearCompletedTasks())}
            title="Delete all completed cards"
          >
            <Trash2 size={13} style={{ marginRight: '4px' }} /> Clear Done
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
