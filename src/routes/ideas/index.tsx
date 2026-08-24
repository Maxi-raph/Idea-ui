import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchIdeas } from '#/api/ideas'
import IdeaCard from '#/components/IdeaCard'

const ideaQueryOptions = ()=> queryOptions({
  queryKey: ['ideas'],
  queryFn: fetchIdeas,
  staleTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
})

export const Route = createFileRoute('/ideas/')({
  head: ()=>({
    meta:[
        {
            title: 'IdeaHub - Browse Ideas'
        }
    ]
  }),
  component: IdeasPage,
  loader: ({context:{queryClient}})=> queryClient.ensureQueryData(ideaQueryOptions())
})

function IdeasPage() {
  const {data } = useSuspenseQuery(ideaQueryOptions())
  const ideas = [...data].sort((a,b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ideas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ideas.map((idea)=>(
            <IdeaCard title={idea.Title} summary={idea.summary} id={idea.documentId} latestIdeas={true} key={idea.documentId}/>
        ))}
      </div>
    </div>
  )
}
