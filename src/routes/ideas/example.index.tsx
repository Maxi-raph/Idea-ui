import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ideas/example/')({
  component: examplePage,
})

function examplePage() {
  return <div>Hello "/ideas/example/"!</div>
}
