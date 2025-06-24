import React, { useState } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { BASE_URL } from '../utils/contsant';
import axios from 'axios';

interface Task {
  taskId: string;
  taskName: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ASSIGNED' | 'PROGRESS' | 'COMPLETED' | 'EXCEEDED';
}

interface TaskKanbanProps {
  tasks: Task[];
  refresh?: () => void;
}

const columns = ['ASSIGNED', 'PROGRESS', 'COMPLETED', 'EXCEEDED'];

const TaskKanban: React.FC<TaskKanbanProps> = ({ tasks, refresh }) => {
  const initialState = columns.reduce((acc, column) => {
    acc[column] = tasks.filter((t) => t.status === column);
    return acc;
  }, {} as Record<string, Task[]>);

  const [kanbanData, setKanbanData] = useState(initialState);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = over.id;

    let sourceColumn = '';
    let draggedTask: Task | null = null;

    for (const [column, items] of Object.entries(kanbanData)) {
      const found = items.find((item) => String(item.taskId) === activeId);
      if (found) {
        sourceColumn = column;
        draggedTask = found;
        break;
      }
    }

    if (!draggedTask || overId === sourceColumn) return;

    setKanbanData((prev) => {
      const updatedSource = prev[sourceColumn].filter((item) => String(item.taskId) !== activeId);
      const updatedTarget = [
        ...prev[overId],
        { ...draggedTask, status: overId as Task['status'] },
      ];

      return {
        ...prev,
        [sourceColumn]: updatedSource,
        [overId]: updatedTarget,
      };
    });

    try {
      await axios.patch(`${BASE_URL}tasks/update-task/${draggedTask.taskId}`, {
        status: overId,
      });
      if (refresh) refresh();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Droppable key={column} id={column}>
            <div className="bg-gray-100 border border-black h-[360px] overflow-y-auto rounded-md p-3 ">
              <h2 className="text-lg font-semibold mb-3">{column}</h2>
              {kanbanData[column]?.map((task) => (
                <Draggable key={task.taskId} id={String(task.taskId)}>
                  <div className="bg-white p-3 rounded shadow mb-3 border hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                    <h3 className="font-bold text-gray-800">{task.taskName}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </Draggable>
              ))}
            </div>
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskKanban;
