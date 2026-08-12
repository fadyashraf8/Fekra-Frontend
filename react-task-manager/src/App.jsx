import React, { useState } from 'react';
import Header from './components/Header';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultPriority, setDefaultPriority] = useState('Medium');

  const handleOpenAddModal = (priority = 'Medium') => {
    setTaskToEdit(null);
    setDefaultPriority(priority);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="app-container">
      <Header onOpenAddModal={handleOpenAddModal} />
      <TaskFilter />
      <TaskList
        onEditTask={handleOpenEditModal}
        onOpenAddModalWithPriority={handleOpenAddModal}
      />
      
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
        defaultPriority={defaultPriority}
      />
    </div>
  );
}

export default App;
