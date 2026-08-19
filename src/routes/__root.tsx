import { 
  HeadContent, 
  Link, 
  Scripts, 
  createRootRouteWithContext,
  useRouteContext 
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import  Header  from '@/components/Header'

import appCss from '../styles.css?url'

type RouterContext = {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Idea Drop - Your Idea Hub' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'icon', href: '/logo192.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', href: '/logo512.png', sizes: '16x16', type: 'image/png' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

export function RootDocument({ children }: { children: React.ReactNode }) {
  
  const { queryClient } = useRouteContext({ from: '__root__' })

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className='min-h-screen bg-gray-100 flex flex-col'>
        {/* 5. Wrap the children in the QueryClientProvider */}
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="flex justify-center p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
              {children}
            </div>
          </main>
        </QueryClientProvider>
        
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}


export function NotFound(){
  return(
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold text-gray-400 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Oops! The page you are looking for does not exist</p>
      <Link to='/' 
      className='px-6 py-2 bg-blue-600 text-white 
      rounded-md hover:bg-blue-700 transition'>Go Back Home</Link>
    </div>
  )
}
