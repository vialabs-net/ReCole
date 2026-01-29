import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ListingGridSkeleton } from '@/components/listings/listing-card-skeleton'

export default function SchoolLoading() {
  return (
    <div className="flex flex-col">
      {/* Header Skeleton */}
      <div className="border-b bg-muted/5">
        <div className="container px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Filters Skeleton */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Listings Grid Skeleton */}
        <ListingGridSkeleton count={8} />
      </div>
    </div>
  )
}
