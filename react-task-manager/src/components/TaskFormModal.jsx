import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, editTask } from '../redux/taskSlice';
import { X, Flame, Zap, ShieldCheck } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, taskToEdit, defaultPriority = 'Medium' }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPriority(taskToEdit.priority || 'Medium');
    } else {
      setTitle('');
      setPriority(defaultPriority || 'Medium');
    }
    setError('');
  }, [taskToEdit, defaultPriority, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a card title');
      return;
    }

    if (taskToEdit) {
      dispatch(editTask({ id: taskToEdit.id, title, priority }));
    } else {
      dispatch(addTask({ title, priority }));
    }

    onClose();
  };

  const priorityOptions = [
    { label: 'High', icon: <Flame size={15} /> },
    { label: 'Medium', icon: <Zap size={15} /> },
    { label: 'Low', icon: <ShieldCheck size={15} /> },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{taskToEdit ? 'Edit Card' : 'Add New Card'}</h2>
          <button className="btn-icon-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Card Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <span style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.3rem', display: 'block' }}>{error}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Priority List</label>
            <div className="priority-selector">
              {priorityOptions.map((opt) => (
                <div
                  key={opt.label}
                  className={`priority-chip ${opt.label} ${priority === opt.label ? 'selected' : ''}`}
                  onClick={() => setPriority(opt.label)}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Save Changes' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
