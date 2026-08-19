import { editIdea, fetchIdea } from '#/api/ideas'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

const ideaQueryOptions = (id: string)=> queryOptions({
    queryKey: ['ideas', id],
    queryFn: ()=> fetchIdea(id)
})

export const Route = createFileRoute('/ideas/edit/$ideaId/')({
  component: RouteComponent,
  loader: async({params: {ideaId} ,context: {queryClient}}) => queryClient.ensureQueryData(ideaQueryOptions(ideaId))
})

function RouteComponent() {
  const {ideaId} = Route.useParams()
  const {data: idea} = useSuspenseQuery(ideaQueryOptions(ideaId))
  const [editFormData, setEditFormData] = useState({title:(idea?.title ?? ''), summary:(idea?.summary ?? ''), description:(idea?.description ?? ''), id:(idea?.id ?? '')})
  const navigate = useNavigate()
 
  const {mutateAsync, isPending} = useMutation({
    mutationFn: editIdea,
    onSuccess:()=> navigate({to: `/ideas/${ideaId}`})
  })
  const handleEdit = async(e:React.SyntheticEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const confirmEdit = window.confirm('Are you sure you want to edit this idea?')

    if(confirmEdit){
      await mutateAsync(editFormData)
    }
  }
  return (
    <div>
      <h2 className="font-bold text-3xl mb-6">Edit Idea</h2>
      <form className='space-y-4' onSubmit={handleEdit}>
        <div>
          <label htmlFor="title" className='text-gray-700 font-semibold'>Title</label>
          <input 
          type="text"
          id='title'
          value={editFormData.title}
          onChange={(e)=>setEditFormData((prev)=> ({...prev, title:e.target.value}))}
          className='w-full block py-2 px-4 rounded-md border 
          border-gray-300 focus:outline-none 
          focus:ring focus:ring-blue-500 mt-2'
          placeholder='Edit Idea Title' />
        </div>
        <div>
          <label htmlFor="summary" className='text-gray-700 font-semibold'>Summary</label>
          <input 
          type="text"
          id='summary'
          value={editFormData.summary}
          onChange={(e)=>setEditFormData((prev)=> ({...prev, summary:e.target.value}))}
          className='w-full block py-2 px-4 rounded-md border 
          border-gray-300 focus:outline-none 
          focus:ring focus:ring-blue-500 mt-2'
          placeholder='Edit Idea Summary' />
        </div>
        <div>
          <label htmlFor="description" className='text-gray-700 font-semibold'>Description</label>
          <textarea
          rows={6}
          id='description'
          value={editFormData.description}
          onChange={(e)=>setEditFormData((prev)=> ({...prev, description:e.target.value}))}
          className='w-full block py-2 px-4 rounded-md border 
          border-gray-300 focus:outline-none 
          focus:ring focus:ring-blue-500 mt-2'
          placeholder='Edit Idea Description' />
        </div>
        <button 
        disabled={isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 
        text-white font-semibold py-2 px-4 cursor-pointer
        rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">{isPending ? 'editing...' : 'Edit Idea'}</button>
      </form>
    </div>
  )
}
