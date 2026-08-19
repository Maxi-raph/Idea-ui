import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { NewIdea } from '#/types';
import { createIdea } from '#/api/ideas'

export const Route = createFileRoute('/ideas/new/')({
  component: NewIdeaPage,
  head:()=>({
    meta:[
      {
        title: 'IdeaHub - Create New Idea'
      }
    ]
  })
})

function NewIdeaPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<NewIdea>({title: '', summary: '', description: '', tags:[]})
  const [tagInput, setTagInput] = useState('');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: ()=> navigate({to: '/ideas'})
  })
  const handleSubmit = async(e:React.SyntheticEvent<HTMLFormElement>)=>{
    e.preventDefault()

    const requiredFields = ['title', 'summary', 'description'] as const;
    const emptyFields = requiredFields.filter(
      field => !formData[field] || formData[field].trim() === ''
    );

    if (emptyFields.length > 0) {
      alert(`Please fill in: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      await mutateAsync(formData)
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally{
      setFormData({title: '', summary: '', description: '', tags:[]})
    }
  }


  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);  // Always update the input text
    
    // Convert to tags array
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    setFormData((prev) => ({
      ...prev,
      tags
    }));
  };

  return(
    <div className='space-y-6'>
      <h1 className="text-3xl font-bold mb-6">Create New Idea</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label 
          htmlFor="title" 
          className="block text-gray-700 font-medium mb-1">Title</label>
          <input 
          id='title' 
          type="text"
          value={formData.title}
          onChange={(e)=> setFormData((prev) => ({...prev, title: e.target.value}))} 
          className='w-full border-gray-300 border rounded-md p-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Enter Idea Title'/>
        </div>
        <div>
          <label 
          htmlFor="summary" 
          className="block text-gray-700 font-medium mb-1">Summary</label>
          <input 
          id='summary' 
          type="text"
          value={formData.summary}
          onChange={(e)=> setFormData((prev) => ({...prev, summary: e.target.value}))} 
          className='w-full border-gray-300 border rounded-md p-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Enter Idea Summary'/>
        </div>
        <div>
          <label 
          htmlFor="description" 
          className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea 
          id='description' 
          value={formData.description}
          rows={6}
          onChange={(e)=> setFormData((prev) => ({...prev, description: e.target.value}))} 
          className='w-full border-gray-300 border rounded-md p-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Write out the description of your idea'/>
        </div>
        <div>
          <label 
          htmlFor="tags" 
          className="block text-gray-700 font-medium mb-1">Tags</label>
          <input 
          id='tags' 
          type="text"
          value={tagInput}
          onChange={handleTagsChange} 
          className='w-full border-gray-300 border rounded-md p-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Optional tags, comma separated'/>
        </div>
        <button 
        type="submit"
        disabled={isPending}
        className='block w-full bg-blue-600 hover-bg-blue-700
         text-white font-semibold rounded-md transition py-2 px-6 cursor-pointer
         disabled:opacity-50 disabled:cursor-not-allowed'>
          {isPending ? 'Creating...' : 'Create Idea'}
        </button>
      </form>
    </div>
  )
}
