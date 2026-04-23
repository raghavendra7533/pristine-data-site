import type { Section } from '@/lib/blogs'

type Props = {
  sections: Section[]
}

export function BlogContent({ sections }: Props) {
  return (
    <div className="max-w-none text-slate-700 dark:text-slate-300">
      {sections.map((section, i) => (
        <div key={section.heading ?? section.subheading ?? i} className="mb-10">
          {section.heading && (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-3 leading-snug">
              {section.heading}
            </h2>
          )}
          {section.subheading && (
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-6 mb-2 leading-snug">
              {section.subheading}
            </h3>
          )}
          {section.body?.map((para, j) => (
            <p key={j} className="text-base leading-relaxed mb-4">
              {para}
            </p>
          ))}
          {section.list && (
            <ul className="mt-3 space-y-2 pl-5 list-disc marker:text-rose-500">
              {section.list.map((item, k) => (
                <li key={k} className="text-base leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
