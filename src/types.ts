
export interface Idea {
  id: string,
  Title: string,
  summary: string,
  description: string,
  tags?: string[],
  createdAt: string,
  documentId: string
} 

export interface NewIdea {
  Title: string,
  summary: string,
  description: string,
  tags?: string[],
  date: string,    
  slug: string
}

export interface NewIdeaProps {
 data: NewIdea
}

export interface EditIdea {
  Title: string,
  summary: string,
  description: string,
  id: string,
  documentId?: string;
} 

export interface IdeaCardProps {
 title: string,
 summary: string,
 id: string,
 latestIdeas: boolean
}