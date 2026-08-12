import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTask, deleteTask } from '../redux/taskSlice';
import { Check, Edit3, Trash2, Clock } from 'lucide-react';

const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch();

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`trello-card ${task.completed ? 'completed' : ''}`}>
      {/* Top Priority Bar */}
      <div className={`trello-label-bar ${task.priority}`} />

      <div className="trello-card-body">
        <div className="trello-card-header">
          {/* Checkbox */}
          <div
            className={`checkbox-trello ${task.completed ? 'checked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleTask(task.id));
            }}
            title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
          >
            {task.completed && <Check size={13} strokeWidth={3} />}
          </div>

          {/* Title */}
          <span className="trello-card-title">{task.title}</span>
        </div>

        {/* Card Footer */}
        <div className="trello-card-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge-tag ${task.priority}`}>{task.priority}</span>
            <span className="card-date">
              <Clock size={12} />
              {formatDate(task.createdAt)}
            </span>
          </div>

          {/* Actions on Hover */}
          <div className="card-actions-hover">
            <button
              className="btn-icon-sm"
              onClick={() => onEdit(task)}
              title="Edit card"
            >
              <Edit3 size={14} />
            </button>
            <button
              className="btn-icon-sm"
              style={{ color: '#ef4444' }}
              onClick={() => dispatch(deleteTask(task.id))}
              title="Delete card"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
