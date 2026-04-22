import { Suspense } from 'react'
import { StackAuditClient } from './StackAuditClient'

export default function StackAuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <StackAuditClient />
    </Suspense>
  )
}
