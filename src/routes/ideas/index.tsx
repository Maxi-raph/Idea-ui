import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchIdeas, reorderIdeas } from '#/api/ideas'
import IdeaCard from '#/components/IdeaCard'
import { ArrowLeft } from 'lucide-react'
import type { Idea } from '#/types'
import { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const ideaQueryOptions = () => queryOptions({
  queryKey: ['ideas'],
  queryFn: fetchIdeas,
  staleTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
})

export const Route = createFileRoute('/ideas/')({
  head: () => ({
    meta: [{ title: 'IdeaHub - Browse Ideas' }],
  }),
  component: IdeasPage,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(ideaQueryOptions()),
})

function IdeasPage() {
  const { data } = useSuspenseQuery(ideaQueryOptions())
  const queryClient = useQueryClient()

  // Local state for drag — prevents snap-back
  const [localIdeas, setLocalIdeas] = useState<Idea[]>([])
  const isDragging = useRef(false)

  // Sync from query ONLY when not dragging
  useEffect(() => {
    if (data && !isDragging.current) {
      const sorted = [...data].sort((a, b) => {
        const posDiff = (a.position ?? 0) - (b.position ?? 0)
        if (posDiff !== 0) return posDiff
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setLocalIdeas(sorted)
    }
  }, [data])

  const { mutate } = useMutation({
    mutationFn: reorderIdeas,
    onMutate: async (orderedIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] })
      const previous = queryClient.getQueryData<Idea[]>(['ideas'])
      const reordered = orderedIds
        .map((documentId, index) => {
          const idea = previous?.find(i => i.documentId === documentId)
          return idea ? { ...idea, position: index } : null
        })
        .filter(Boolean) as Idea[]
      queryClient.setQueryData(['ideas'], reordered)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['ideas'], context.previous)
        // Also revert local state on error
        const sorted = [...context.previous].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        setLocalIdeas(sorted)
      }
    },
    onSettled: () => {
   
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = () => {
    isDragging.current = true
  }

  const handleDragEnd = (event: DragEndEvent) => {
    isDragging.current = false
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = localIdeas.findIndex(i => i.documentId === active.id)
    const newIndex = localIdeas.findIndex(i => i.documentId === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Update LOCAL state immediately — this is what prevents snap-back
    const reordered = arrayMove(localIdeas, oldIndex, newIndex)
    setLocalIdeas(reordered)

    // Then sync to server
    mutate(reordered.map(i => i.documentId))
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-bold mb-4">Ideas</h1>
        <Link to='/' className='text-blue-500 outline-none hover:text-blue-400 transition-all'>
          <ArrowLeft size={18} className='inline-block' /> Back to home
        </Link>
      </div>

      <DndContext
        id="ideas-dnd-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={localIdeas.map(i => i.documentId)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {localIdeas.map(idea => (
              <IdeaCard
                key={idea.documentId}
                title={idea.Title}
                summary={idea.summary}
                id={idea.documentId}
                latestIdeas={true}
                draggable={true}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}