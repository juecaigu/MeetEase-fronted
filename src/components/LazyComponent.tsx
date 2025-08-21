import { Suspense } from 'react'
import type { LazyExoticComponent } from 'react'
import Loading from './Loading'

interface LazyRouteProps {
  lazyComponent: LazyExoticComponent<React.FC<unknown>>
}

const LazyComponent = ({ lazyComponent: Component }: LazyRouteProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}

export default LazyComponent
