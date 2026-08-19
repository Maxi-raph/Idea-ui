// src/server/api/ideas/[id].ts
import { defineEventHandler, getRouterParam, HTTPError  } from 'h3'

// In-memory data (replace with DB later)
const ideas = [
  { id: '1', title: 'Airbnb for Garages', summary: 'Rent out your garage' },
  { id: '2', title: 'Local Farm Box', summary: 'Weekly produce delivery' },
  { id: '3', title: 'Micro-SaaS for Freelancers', summary: 'Freelance dashboard' },
  { id: '4', title: 'Virtual Closet Organizer', summary: 'Your wardrobe, digitized and AI-personalized.' },
  { id: '5', title: 'Pet Sitter Marketplace', summary: 'Book trusted sitters and walkers in your area.' },
  { id: '6', title: 'Remote Job Recommender', summary: 'Smart job matches using your online presence.' },
  { id: 'CEOb04H_-yo', title: 'Innovation For All', summary: 'Creating something that sparks innovation in the lives of all humans worldwide.' },
]

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Find the idea
  const idea = ideas.find(i => i.id === id)
  
  // If not found, return 404
  if (!idea) {
    throw new HTTPError ({
      statusCode: 404,
      statusMessage: 'Idea not found',
    })
  }
  
  return idea
})