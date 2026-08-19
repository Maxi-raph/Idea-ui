import type { IdeaCardProps } from "#/types";
import { Link } from "@tanstack/react-router";

const IdeaCard = ({ title, summary, id, latestIdeas }: IdeaCardProps) => {
    return (
            <div key={id} className="border border-gray-300 rounded-lg shadow p-4 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600 mb-2">{summary}</p>
                <Link
              to='/ideas/$ideaId'
              params={{ideaId: id.toString()}}
              className={`${latestIdeas ? 
                'block text-center mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition' 
                : 'text-blue-600 hover:underline'}`}>{latestIdeas ? 'View Idea' : 'Read more →'}</Link>
            </div>
    );
};

export default IdeaCard;