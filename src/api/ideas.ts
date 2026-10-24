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


export const createIdea = async (newIdea: NewIdea): Promise<Idea[]> => {
  const payload = {
    data: {
      ...newIdea,
        date: new Date().toISOString(), 
        slug: newIdea.Title             
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
    }
  };
  
  const res = await api.post('/api/ideas', payload);
  return res.data.data;
};


export const editIdea = async (editedIdea:EditIdea):Promise<Idea[]>=>{
    const payload = {
    data: {
          Title: editedIdea.Title,  
          summary: editedIdea.summary,
          description: editedIdea.description
        }
    }

  const res = await api.put(`/api/ideas/${editedIdea.documentId}`, payload)
  return res.data.data
}



export const deleteIdea = async (ideaId: string):Promise<void>=>{
   await api.delete(`/api/ideas/${ideaId}`)
}

export const reorderIdeas = async (orderedIds: string[]): Promise<void> => {
  await Promise.all(
    orderedIds.map((documentId, index) =>
      api.put(`/api/ideas/${documentId}?status=published`, { data: { position: index } })
    )
  )
}

