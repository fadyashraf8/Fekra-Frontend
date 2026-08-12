import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredTasks, selectPriorityFilter, selectSearchQuery } from '../redux/taskSlice';
import TaskItem from './TaskItem';
import { Plus, CheckCircle2, Flame, Zap, ShieldCheck } from 'lucide-react';

const TaskList = ({ onEditTask, onOpenAddModalWithPriority }) => {
  const filteredTasks = useSelector(selectFilteredTasks);
  const priorityFilter = useSelector(selectPriorityFilter);
  const searchQuery = useSelector(selectSearchQuery);

  const columnsConfig = [
    {
      id: 'High',
      title: 'High Priority',
      color: '#eb5a46',
      icon: <Flame size={16} style={{ color: '#eb5a46' }} />,
    },
    {
      id: 'Medium',
      title: 'Medium Priority',
      color: '#ffab00',
      icon: <Zap size={16} style={{ color: '#ffab00' }} />,
    },
    {
      id: 'Low',
      title: 'Low Priority',
      color: '#61bd4f',
      icon: <ShieldCheck size={16} style={{ color: '#61bd4f' }} />,
    },
  ];

  // If a specific priority filter is chosen (e.g. High only), show filtered column or simple list
  const activeColumns = priorityFilter === 'All' 
    ? columnsConfig 
    : columnsConfig.filter(col => col.id === priorityFilter);

  return (
    <div className="trello-board-grid">
      {activeColumns.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.priority === col.id);

        return (
          <div key={col.id} className="trello-column">
            {/* Column Header */}
            <div className="column-header">
              <div className="column-title-box">
                {col.icon}
                <span className="column-title">{col.title}</span>
              </div>
              <span className="column-count">{colTasks.length}</span>
            </div>

            {/* Cards Container */}
            <div className="column-cards-container">
              {colTasks.length > 0 ? (
                colTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onEdit={onEditTask} />
                ))
              ) : (
                <div className="empty-col-text">
                  {searchQuery ? 'No tasks match search' : 'No cards in this column'}
                </div>
              )}
            </div>

            {/* Inline Add Card Button */}
            <div className="column-footer-add">
              <button
                className="btn-add-card-inline"
                onClick={() => onOpenAddModalWithPriority(col.id)}
              >
                <Plus size={16} />
                <span>Add a card</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
