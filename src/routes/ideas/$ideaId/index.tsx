import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { deleteIdea, fetchIdea } from '#/api/ideas'


const ideaQueryOptions = (ideaId:string) => queryOptions({
  queryKey: ['idea', ideaId],
  queryFn: ()=> fetchIdea(ideaId),
  staleTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
}) 


export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  loader: async ({params:{ ideaId }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(ideaId))
  }
})

function IdeaDetailsPage() {
  const {ideaId} = Route.useParams()
  const {data:idea}  = useSuspenseQuery(ideaQueryOptions(ideaId))
  const navigate = useNavigate()

  const {mutateAsync: deleteMutate, isPending} = useMutation({
    mutationFn: deleteIdea,
    onSuccess: ()=> navigate({to: '/ideas'}),
    onError: ()=> alert('Failed to delete idea')
  })
  
  const handleDelete = async (id:string)=>{
    const confirmDelete = window.confirm('Are you sure you want to delete this idea?')

    if (confirmDelete) {
      await deleteMutate(id)
    }
  }

  return (
      <div className='p-4'>
        <Link to='/ideas' className='text-blue-500 
        underline block mb-4'>Back to ideas</Link>
        <h2 className="text-2xl font-bold">{idea.Title}</h2>
        <p className="mt-2">{idea.description}</p>
        <div className="flex justify-between gap-6 items-center">
        <button
        onClick={()=>handleDelete(idea.documentId)}
        disabled={isPending}
        className="flex-1 bg-red-600 hover:bg-red-700 transition px-4 py-2 
        rounded-md cursor-pointer mt-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{isPending ? 'Deleting...' : 'Delete Idea'}</button>
        <button
        onClick={()=>navigate({to: `/ideas/edit/${idea.documentId}`})}
        className="flex-1 bg-gray-500 hover:bg-gray-600 transition px-4 py-2 
        rounded-md cursor-pointer mt-4 text-white font-semibold">{'Edit Idea'}</button>

        </div>
      </div>
  )
}
  