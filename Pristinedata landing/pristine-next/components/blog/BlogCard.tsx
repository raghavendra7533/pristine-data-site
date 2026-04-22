import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blogs'

type Props = {
  post: BlogPost
}

export function BlogCard({ post }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col flex-1 p-6 gap-3">
        <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={post.date}>
          {formattedDate}
        </time>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </Link>
  )
}
