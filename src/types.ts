
export interface Idea {
  id: string,
  title: string,
  summary: string,
  description: string,
  tags?: string[],
  createdAt: string,
  documentId: string
} 

export interface NewIdea {
  title: string,
  summary: string,
  description: string,
  tags?: string[]
} 

export interface EditIdea {
  title: string,
  summary: string,
  description: string,
  id: string
} 

export interface IdeaCardProps {
 title: string,
 summary: string,
 id: string,
 latestIdeas: boolean
}