import React, { useState } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { useSelector } from 'react-redux';

interface Project {
  projectId: string;
  pname: string;
  uname: string;
  dueDate: string;
  status: 'ASSIGNED' | 'PROGRESS' | 'COMPLETED' | 'EXCEEDED';
}

interface KanbanProps {
  project: Project[];
}

const columns = ['ASSIGNED', 'PROGRESS', 'COMPLETED', 'EXCEEDED'];

const Kanban: React.FC<KanbanProps> = ({ project }) => {
  //console.log('Project data:', project);
  const { email } = useSelector((state: any) => state.user);
  const initialState = columns.reduce((acc, column) => {
    acc[column] = project.filter((p) => p.status === column);
    return acc;
  }, {} as Record<string, Project[]>);

  const [kanbanData, setKanbanData] = useState(initialState);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColumn = '';
    let draggedProject: Project | null = null;

    for (const [column, items] of Object.entries(kanbanData)) {
      const found = items.find((item) => item.projectId === activeId);
      if (found) {
        sourceColumn = column;
        draggedProject = found;
        break;
      }
    }

    if (!draggedProject || overId === sourceColumn) return;

    // Move the card
    setKanbanData((prev) => {
      const updatedSource = prev[sourceColumn].filter((item) => item.projectId !== activeId);
      const updatedTarget = [...prev[overId], { ...draggedProject, status: overId as Project['status'] }];

      return {
        ...prev,
        [sourceColumn]: updatedSource,
        [overId]: updatedTarget,
      };
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        {columns.map((column) => (
          <Droppable key={column} id={column}>
            <div className="bg-gray-100 border border-black rounded-md p-3 min-h-[300px]">
              <h2 className="text-lg font-semibold mb-3">{column}</h2>
              {kanbanData[column].map((proj) => (
                <Draggable key={proj.projectId} id={proj.projectId}>
                  <div className="bg-white p-3 rounded shadow mb-3">
                    <h3 className="font-bold">{proj.pname}</h3>
                    <p className="text-sm text-gray-500">Owner: {proj.uname}</p>
                   <p className="text-black text-base font-normal mt-1">
            Owner: <span className="font-semibold text-black">{proj.uname[1]===email? <span className="text-green-500">You</span> : proj.uname[0]}</span>
          </p>
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

export default Kanban;
