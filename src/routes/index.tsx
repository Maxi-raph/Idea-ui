import { fetchIdeas } from '#/api/ideas'
import IdeaCard  from '#/components/IdeaCard'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react'



const ideasQueryOptions = ()=> queryOptions({
  queryKey:['ideas'],
  queryFn: fetchIdeas,
})

export const Route = createFileRoute('/')({
  head:()=>({
    meta:[{
      title: 'Idea Hub - Where ideas meet perfection'
    }]
  }),
  component: Home ,
  loader: ({context:{queryClient}})=> queryClient.ensureQueryData(ideasQueryOptions())
})

function Home() {
  const {data} = useSuspenseQuery(ideasQueryOptions())
  const ideas = [...data].sort((a,b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())

  return (
    <div className="flex flex-col md:flex-row
     items-start justify-between gap-10 p-6">

      <div className="flex flex-col items-start gap-4">
        <Lightbulb className="w-16 h-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-gray-800">Welcome to IdeaDrop</h1>
        <p className="text-gray-600 max-w-xs">
          Share, explore, and build on the best startup ideas and side hustles.
        </p>
      </div>
     
    <section className="flex-1 w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Latest Ideas</h2>
        <div className="space-y-6">
          {ideas.slice(0,3).map((idea)=>(
            <IdeaCard title={idea.title} summary={idea.summary} id={idea.id} latestIdeas={false} key={idea.id}/>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/ideas"
            className="w-full text-center inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            View All Ideas
          </Link>
        </div>
    </section>
  </div>

  )
}
