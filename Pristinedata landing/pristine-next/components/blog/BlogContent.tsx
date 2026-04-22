import type { Section } from '@/lib/blogs'

type Props = {
  sections: Section[]
}

export function BlogContent({ sections }: Props) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-lg prose-p:leading-relaxed prose-li:leading-relaxed">
      {sections.map((section, i) => (
        <div key={i} className="mb-8">
          {section.heading && <h2>{section.heading}</h2>}
          {section.subheading && <h3>{section.subheading}</h3>}
          {section.body?.map((para, j) => (
            <p key={j}>{para}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item, k) => (
                <li key={k}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
