import React from 'react';
import { useSelector } from 'react-redux';
import { selectTaskStats } from '../redux/taskSlice';
import { Kanban, Plus } from 'lucide-react';

const Header = ({ onOpenAddModal }) => {
  const stats = useSelector(selectTaskStats);

  return (
    <header className="trello-header">
      <div className="brand">
        <div className="brand-icon">
          <Kanban size={20} />
        </div>
        <div>
          <h1 className="brand-title">Task Manager</h1>
          <p className="brand-subtitle">Redux Task Management • Fekra Test</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="filter-group">
          <div className="filter-pill" style={{ cursor: 'default' }}>
            <span>Total: </span>
            <strong style={{ color: 'var(--text-main)' }}>{stats.total}</strong>
          </div>
          <div className="filter-pill" style={{ cursor: 'default' }}>
            <span>Active: </span>
            <strong style={{ color: '#d97706' }}>{stats.active}</strong>
          </div>
          <div className="filter-pill" style={{ cursor: 'default' }}>
            <span>Done: </span>
            <strong style={{ color: '#059669' }}>{stats.completed}</strong>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => onOpenAddModal('Medium')}>
          <Plus size={16} />
          <span>Add Card</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
