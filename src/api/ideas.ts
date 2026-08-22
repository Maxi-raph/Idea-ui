import api from "#/lib/axios"
import type { EditIdea, Idea, NewIdea } from '@/types'

export const fetchIdea = async function(ideaId:string):Promise<Idea>{
    const res = await api.get(`/api/ideas/${ideaId}`)

    return res.data.data
}

export const fetchIdeas = async ():Promise<Idea[]>=>{
  const res = await api.get('/api/ideas')
  return res.data.data
}


export const createIdea = async (newIdea:NewIdea):Promise<Idea[]>=>{
  const res = await api.post('/api/ideas', {
    ...newIdea,
    createdAt: new Date().toISOString()
  })
  return res.data.data
}

export const editIdea = async (editedIdea:EditIdea):Promise<Idea[]>=>{
  const res = await api.patch(`/api/ideas/${editedIdea.id}`, {
    ...editedIdea,
    createdAt: new Date().toISOString()
  })
  return res.data.data
}

export const deleteIdea = async (ideaId: string):Promise<void>=>{
   await api.delete(`/api/ideas/${ideaId}`)
}