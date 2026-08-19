import api from "#/lib/axios"
import type { EditIdea, Idea, NewIdea } from '@/types'

export const fetchIdea = async function(ideaId:string):Promise<Idea>{
    const res = await api.get(`/ideas/${ideaId}`)

    return res.data
}

export const fetchIdeas = async ():Promise<Idea[]>=>{
  const res = await api.get('/ideas')
  return res.data
}


export const createIdea = async (newIdea:NewIdea):Promise<Idea[]>=>{
  const res = await api.post('/ideas', {
    ...newIdea,
    createdAt: new Date().toISOString()
  })
  return res.data
}

export const editIdea = async (editedIdea:EditIdea):Promise<Idea[]>=>{
  const res = await api.patch(`/ideas/${editedIdea.id}`, {
    ...editedIdea,
    createdAt: new Date().toISOString()
  })
  return res.data
}

export const deleteIdea = async (ideaId: string):Promise<void>=>{
   await api.delete(`/ideas/${ideaId}`)
}