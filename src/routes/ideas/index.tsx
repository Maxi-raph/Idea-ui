import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchIdeas } from '#/api/ideas'
import IdeaCard from '#/components/IdeaCard'
import { ArrowLeft } from 'lucide-react'

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
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-bold mb-4">Ideas</h1>
        <Link to='/' className='text-blue-500 outline-none hover:text-blue-400 transition-all'><ArrowLeft size={18} className='inline-block'/> Back to home</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ideas.map((idea)=>(
            <IdeaCard title={idea.Title} summary={idea.summary} id={idea.documentId} latestIdeas={true} key={idea.documentId}/>
        ))}
      </div>
    </div>
  )
}
