import type { IdeaCardProps } from "#/types";
import { Link } from "@tanstack/react-router";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const IdeaCard = ({ title, summary, id, latestIdeas, draggable = false }: IdeaCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: !draggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      style={draggable ? style : undefined}
      className="border border-gray-300 rounded-lg shadow p-4 bg-white relative"
    >
      {draggable && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
      )}
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-2">{summary}</p>
      <Link
        to="/ideas/$ideaId"
        params={{ ideaId: id.toString() }}
        className={`${latestIdeas
          ? "block text-center mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          : "text-blue-600 hover:underline"}`}
      >
        {latestIdeas ? "View Idea" : "Read more →"}
      </Link>
    </div>
  );
};

export default IdeaCard;