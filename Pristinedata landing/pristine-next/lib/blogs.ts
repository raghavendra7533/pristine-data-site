// lib/blogs.ts

export type Section = {
  heading?: string
  subheading?: string
  body?: string[]
  list?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string        // ISO: "YYYY-MM-DD"
  image: string       // relative to /public, e.g. "/images/blog-1.webp"
  sections: Section[]
}

// Ordered newest-first. Prepend new posts to maintain this order.
export const blogs: BlogPost[] = [
  {
    slug: 'quota-killers-what-top-b2b-reps-do-differently',
    title: 'What Top B2B Sales Reps Actually Do Differently',
    description: "Fewer than 30% of reps hit quota consistently. Here's what the ones who do are doing differently — and why most teams never replicate it.",
    date: '2025-08-04',
    image: '/images/blog-1.webp',
    sections: [
      {
        body: [
          'B2B sales has gotten harder. Sales cycles are longer. Decision-makers are harder to reach. Quotas keep climbing while win rates stay flat.',
          'The numbers are blunt:',
        ],
        list: [
          'Fewer than 30-40% of reps consistently hit quota.',
          '67% of sales professionals said they were unlikely to meet their 2024 targets.',
          'The average B2B win rate is just 21%, meaning nearly 80% of deals never close.',
        ],
      },
      {
        body: [
          "But a small group of reps consistently beats those numbers. What separates them isn't always personality or raw talent. More often, it's five specific habits.",
        ],
      },
      {
        heading: '1. They Know Their Prospects Before They Call',
        body: [
          "Top reps don't show up cold. Before any outreach, they understand what's happening in the prospect's business, what problems they're likely facing, and how their offering actually fits.",
          'Most reps skip this because it takes time. But the reps who do it consistently land more meetings and close at higher rates — because the conversation starts from a position of relevance, not introduction.',
        ],
      },
      {
        heading: '2. They Follow Up Like They Mean It',
        body: [
          "Most reps stop after one or two attempts. Top performers don't. 80% of sales require at least five follow-ups — but only 8% of reps make it past the second.",
          "The difference isn't persistence for its own sake. Top reps vary their channel, vary their message, and find different angles to stay relevant without being annoying.",
        ],
      },
      {
        heading: '3. They Act Like Consultants',
        body: [
          '78% of B2B buyers want to work with someone who acts as a trusted advisor — not a product pitcher. Top reps earn that status by showing up informed, asking better questions, and focusing on the buyer\'s problem before their own solution.',
          'This takes time to build, but it shortens sales cycles and dramatically increases win rates.',
        ],
      },
      {
        heading: '4. They Use Every Channel Available',
        body: [
          'Relying on email alone misses most of your prospects. Only 23% of sales emails are opened. Top performers use email, phone, LinkedIn, and occasionally video messages — rotating channels and messages based on what gets a response.',
          "This isn't multitasking. It's understanding that different buyers respond to different things, and you need to find out which before giving up.",
        ],
      },
      {
        heading: '5. They Know the Marketing Content Better Than Marketing Does',
        body: [
          "Only 30% of sales teams report strong alignment with marketing. Elite reps don't wait for perfect alignment — they dig into the content themselves. They know which case studies resonate for which type of buyer, which use cases map to which pain points, and how to use collateral consultatively rather than just forwarding a deck.",
          "This makes them more credible in every conversation, because they're drawing on real knowledge instead of relying on generic materials.",
        ],
      },
      {
        heading: 'Want to build a team that hits those numbers?',
        body: [
          'Pristine Data AI gives your reps the buyer intelligence, outreach tools, and workflow automation they need to operate like your top performers — at scale.',
        ],
      },
    ],
  },
  {
    slug: 'prospect-research-b2b-sales',
    title: 'Why Prospect Research Is the One Sales Habit That Actually Compounds',
    description: "Top-performing reps generate nearly 3x more meetings than their peers. The difference isn't charisma — it's how well they know their buyers before picking up the phone.",
    date: '2025-07-28',
    image: '/images/blog-6.webp',
    sections: [
      {
        body: [
          "In today's sales environment, the reps who win aren't the ones making the most calls. They're the ones who know exactly who they're calling — and why that person should care.",
          '84% of business buyers want salespeople who genuinely understand their needs. 73% say most sales interactions still feel purely transactional. That gap is both a problem and an opportunity.',
        ],
      },
      {
        heading: 'The Bar Has Moved',
        body: [
          "Buyers now complete 70-80% of their research before speaking to a salesperson. By the time you make contact, they've read reviews, compared alternatives, and formed a view of what they need. Walking into that conversation without having done your own homework isn't just inefficient — it signals that you're not someone worth their time.",
          "On top of that, buying decisions now involve more stakeholders than ever, spread across different roles and digital platforms. Research isn't optional anymore. It's how you figure out who matters, what they care about, and how to reach them.",
        ],
      },
      {
        heading: 'Why Reps Skip It Anyway',
        body: [
          'Quota pressure pushes reps toward volume. The thinking goes: more calls, more chances. But high rejection rates from generic outreach just waste the time research would have cost.',
          "There's also a tech overload problem. Updating the CRM, searching for materials, documenting calls — it adds up. But the top performers find the right balance. They don't use busyness as a reason to skip the one habit that moves numbers.",
        ],
      },
      {
        heading: 'What Actually Happens When You Research Well',
        body: [
          'Two years ago, a sales rep at a mid-sized software company decided to invest 25% of her time in understanding her prospects before contacting them. Within six months, her close rate doubled and her average deal size grew by 40%. She stopped treating sales as a numbers game and started treating it as a people game.',
          'The data backs this up:',
        ],
        list: [
          'Top-performing reps generate nearly 3x more meetings than their peers by prioritizing research.',
          'Conversion rates improve by up to 85% when messaging is aligned to prospect needs.',
          'Average deal sizes grow by 50% when reps personalize their approach.',
        ],
      },
      {
        heading: 'What Research Actually Buys You',
        list: [
          'Credibility from the first conversation — buyers who feel understood are 86% more likely to engage.',
          'Shorter sales cycles — research identifies the right decision-makers and skips unnecessary steps. Teams that do this effectively shorten cycles by up to a third.',
          'Larger deals — understanding priorities lets you propose solutions that actually fit, which tends to increase deal size.',
          'Better retention — deep understanding builds trust that drives repeat business. Teams that prioritize ongoing research see a 75% boost in repeat customers.',
          '210 more hours per rep per year for actual selling, by cutting time wasted on irrelevant outreach.',
        ],
      },
      {
        heading: 'Want to see how it works in practice?',
        body: [
          'Pristine Data AI surfaces the buyer insights your team needs — before every conversation, not after.',
        ],
      },
    ],
  },
  {
    slug: 'mid-market-b2b-sales-competitive-edge',
    title: 'How Mid-Market Sales Teams Can Actually Compete with Enterprise',
    description: 'Mid-market companies face bigger budgets, established credibility, and larger teams on the other side of every deal. Here\'s what it takes to compete — and win.',
    date: '2025-07-21',
    image: '/images/blog-2.webp',
    sections: [
      {
        body: [
          "Mid-market sales teams know the feeling. You're going up against companies with bigger budgets, larger teams, and years of brand recognition. Your solution might be better — but you're still the one who has to earn credibility from scratch.",
          'The good news is that mid-market teams have an inherent advantage: agility. The challenge is using it strategically.',
        ],
      },
      {
        heading: 'What Actually Moves the Needle',
        list: [
          'Close the data gap — enterprise competitors have dedicated RevOps teams maintaining clean contact data, intent signals, and account intelligence. Mid-market teams that invest in good data level the playing field before the first call.',
          "Compete on precision, not volume — you can't out-resource a competitor with five times your headcount. You can out-research them. Targeted outreach based on real buyer signals beats mass sequences every time.",
          "Use automation selectively — the right automation doesn't replace the human part of selling. It handles the repetitive work so reps can spend more time on conversations that actually require judgment.",
          'Build credibility with proof — case studies, customer stories, and specific ROI examples matter more for mid-market companies than for established brands. Buyers need social proof when they cannot rely on name recognition.',
        ],
      },
      {
        heading: 'The Agility Advantage',
        body: [
          'Enterprise sales cycles often move slowly — approvals, stakeholders, internal politics. Mid-market teams can move faster, respond quickly, and adapt their approach in real time. That speed is a competitive advantage when used deliberately.',
        ],
      },
      {
        heading: 'Compete on insight, not just price',
        body: [
          'Pristine Data AI gives mid-market sales teams real-time account intelligence, verified contact data, and outreach tools — so you can show up to every deal more prepared than the competition.',
        ],
      },
    ],
  },
  {
    slug: 'sales-marketing-alignment-funnel',
    title: 'Why Sales and Marketing Alignment Actually Matters (And How to Get There)',
    description: "Sales and marketing misalignment costs companies an average of 10% of annual revenue. Here's what alignment looks like in practice across the entire funnel.",
    date: '2025-07-15',
    image: '/images/blog-7.webp',
    sections: [
      {
        body: [
          'In most B2B companies, sales and marketing operate as two separate worlds. Marketing focuses on awareness and leads. Sales focuses on closing. Both teams track different metrics, attend different meetings, and often blame each other when results fall short.',
          "Tight alignment between these two teams isn't a nice-to-have — it's what separates companies that grow predictably from those that don't.",
        ],
      },
      {
        heading: 'Why It Matters',
        body: [
          'When sales and marketing work from the same playbook, every stage of the customer journey becomes more coherent. Marketing understands which leads actually close. Sales understands what messaging is landing. Both teams stop duplicating effort and start reinforcing each other.',
          "According to Gartner, companies lose an average of 10% of annual revenue due to sales and marketing misalignment. That's not a rounding error.",
        ],
      },
      {
        heading: 'What Alignment Looks Like at Each Stage',
        subheading: 'Top of funnel',
        body: [
          "Marketing uses real insights from sales conversations to shape campaigns — not assumptions about what prospects care about. The result is awareness content that resonates because it's built on firsthand knowledge of buyer pain points.",
        ],
      },
      {
        subheading: 'Middle of funnel',
        body: [
          'Both teams agree on what a qualified lead looks like before handing it off. Shared definitions of MQLs and SQLs eliminate the friction that kills deals — the moment sales says "these leads are terrible" and marketing says "sales never follows up."',
        ],
      },
      {
        subheading: 'Bottom of funnel',
        body: [
          "Sales feeds back to marketing on which content or angles actually helped close a deal. That feedback loop makes the next campaign sharper. It's a compounding advantage that most companies never build.",
        ],
      },
      {
        heading: 'Three Things That Make Alignment Real',
        list: [
          'Shared KPIs — both teams own pipeline growth and conversion rates, not just their own slice of the funnel.',
          'Shared data — CRM and marketing automation that talk to each other, so both teams see the same customer picture.',
          "Regular communication — weekly or biweekly syncs where both teams review what's working and adjust.",
        ],
      },
      {
        heading: 'Alignment is a competitive advantage',
        body: [
          'Pristine Data AI gives sales and marketing a shared view of their buyers — so both teams can show up with the same story.',
        ],
      },
    ],
  },
  {
    slug: 'why-mid-market-b2b-sales-is-hard',
    title: "The Real Challenges of Mid-Market B2B Sales (And Why They're Harder Than Anyone Admits)",
    description: 'Only 22% of mid-sized businesses saw sales growth last year. Here\'s what it actually feels like to sell for a mid-market company — and what the numbers behind the struggle look like.',
    date: '2025-07-07',
    image: '/images/blog-3.webp',
    sections: [
      {
        body: [
          "Selling for a mid-market B2B company puts you in a strange position. You're expected to close the same kinds of deals as enterprise sales teams, with a fraction of the resources, budget, and brand recognition.",
          'Sarah Chen, a sales director at a growing SaaS company, described it well: "It\'s like being asked to build a house with half the tools and twice the pressure to finish quickly."',
          'The numbers back her up. Only 22% of mid-sized businesses saw sales growth last year.',
        ],
      },
      {
        heading: 'The Deck Is Stacked Against You',
        body: [
          'Mid-market companies face a specific set of constraints that enterprise competitors do not.',
        ],
        list: [
          'Budget pressure — every dollar needs to show ROI immediately. The choice between hiring a rep, investing in tools, or running a campaign is not strategic — it is a constraint.',
          'Credibility deficit — every sales call starts with an implicit "Who are you?" Even when your product is genuinely better, you are fighting the old saying that nobody ever got fired for buying the market leader.',
          'Lean teams — while enterprise companies have specialized roles for everything from lead generation to customer success, you are doing it all with a small team wearing multiple hats.',
        ],
      },
      {
        heading: 'Life in the Trenches',
        body: [
          "For venture-backed companies, the pressure intensifies. You're not just trying to grow — you're trying to prove your growth model works on a timeline set by investors. Missing quota isn't just about commission. It's about validating the entire business.",
          'One VC-backed sales leader put it plainly: "Missing quota is not just about bonuses here. It is about proving our entire business model works."',
          'A shocking percentage of mid-sized companies still do not have a properly configured CRM. Imagine running a high-velocity sales team without reliable pipeline data — managing deals with spreadsheets, sticky notes, and memory. Mike Rodriguez, a veteran sales rep turned consultant, said it perfectly: "Enterprise reps complain about their CRM. Mid-market reps dream of having a CRM to complain about."',
        ],
      },
      {
        heading: "88% of Marketing Leaders Aren't Confident",
        body: [
          "88% of marketing leaders say they aren't confident their teams can hit revenue targets. When you're trying to do enterprise-level marketing on a mid-market budget, with no dedicated demand gen team, that number makes sense.",
          "The challenge isn't talent — mid-market teams are often sharper than they get credit for. The challenge is being asked to do enterprise work without enterprise infrastructure.",
        ],
      },
      {
        heading: 'The Data Problem',
        body: [
          'Data quality is where mid-market companies feel the gap most. Enterprise companies have dedicated RevOps teams maintaining clean CRM data, enriching records, and building reports. Mid-market teams patch this together however they can.',
          "Outdated contact information, missing intent signals, no visibility into who's actually engaged — this isn't just an inconvenience. It means your reps spend time chasing leads that have already decided, or miss the ones ready to buy.",
        ],
      },
      {
        heading: 'You do not need enterprise resources to compete',
        body: [
          'Pristine Data AI gives mid-market sales teams access to the same buyer intelligence and outreach capabilities that enterprise teams pay 10x more for — without the complexity.',
        ],
      },
    ],
  },
  {
    slug: 'b2b-buying-committee-challenge-part-2',
    title: 'Why B2B Companies Are Failing Their Buyers: The Buying Committee Challenge (Part 2)',
    description: 'Five more reasons B2B companies struggle to align with buyers — from buying group blind spots to change resistance and the technology gap.',
    date: '2025-06-09',
    image: '/images/blog-8.webp',
    sections: [
      {
        body: [
          'The way B2B buying works has changed fundamentally. In-person sales meetings are becoming rare. A striking 58% of sellers say virtual selling is harder than in-person selling — yet 70% of B2B decision-makers are open to making purchases over $50,000 remotely, and 27% will spend more than $500,000 without ever meeting in person.',
          'In Part 1, we looked at data silos, the real-time gap, decision complexity, shallow personalization, and the sales-marketing divide. Here are five more challenges getting in the way.',
        ],
      },
      {
        heading: 'The Buying Group Blind Spot',
        body: [
          'Single decision-makers are a thing of the past. Most B2B purchases now involve 5 to 11 stakeholders, each with different priorities. Yet many sales teams still treat the process as a one-on-one conversation.',
          "While your rep may be focused on the IT director, is anyone helping that IT director sell the solution internally? Companies that provide role-specific materials — ROI calculators for CFOs, technical specs for engineers — see a 30% increase in decision confidence. This is no longer a nice touch. It's a competitive requirement.",
        ],
      },
      {
        heading: 'Content That Misses the Mark',
        body: [
          "71% of buyers expect content to help them build a business case internally. Most B2B companies still produce product-focused content that doesn't address that need.",
          "The problem isn't volume — companies produce more content than ever. The problem is relevance. When was the last time your content strategy started with what your buyer needs to hear, rather than what you want to say?",
          "Without face-to-face meetings, buyers take longer to process information. They need content that simplifies their decision, not content that adds to the noise.",
        ],
      },
      {
        heading: 'The Manual Process Trap',
        body: [
          'Many B2B organizations still run lead scoring, follow-ups, and content distribution by hand. Research shows that automation increases sales productivity by 14.5% while cutting marketing costs by 12.2%.',
          "The bigger cost is missed timing. In fast-moving buying cycles, catching a prospect at the right moment can be the difference between winning and losing a deal. Manual processes simply can't keep pace.",
        ],
      },
      {
        heading: 'Resistance to Change',
        body: [
          "McKinsey's research is sobering: 70% of change initiatives fail, primarily due to employee resistance and lack of management support.",
          "Becoming buyer-aligned isn't just about adopting new tools. It requires changes to organizational structure, incentive systems, and culture — breaking down long-standing silos and reimagining how success is measured. That's a hard sell internally, and most organizations underestimate it.",
        ],
      },
      {
        heading: 'The Technology Gap',
        body: [
          "Most organizations recognize the value of predictive analytics but struggle with implementation. Companies that use integrated digital tools see sales cycles 30% faster than those that don't. Organizations using digital sales rooms report a 40% reduction in sales cycle times.",
          "But buying technology isn't the finish line. The organizations that benefit most are the ones that actually use their tools — not the ones with the most expensive stack.",
        ],
      },
      {
        heading: 'The Path Forward',
        body: [
          "Looking across both parts of this series, a clear pattern emerges: B2B companies are struggling to adapt to fundamental shifts in how their buyers behave. The fix isn't purely technological — it requires a different mindset.",
        ],
        list: [
          'Think of buying groups as ecosystems, not chains of command. Each stakeholder needs different information at different times.',
          "Rebuild your content strategy around what buyers need to hear, not what you want to say.",
          'Automate the repetitive work so your team can focus on high-value conversations.',
          'Build change management into your transformation plan from day one.',
          'Invest in technology with a clear purpose — solve a real buyer problem, not a trend.',
        ],
      },
      {
        heading: 'Ready to close the gap?',
        body: [
          'Pristine Data AI helps GTM teams understand their buyers, align sales and marketing, and show up to every conversation prepared.',
        ],
      },
    ],
  },
  {
    slug: 'b2b-buyer-expectations-sales-challenge-part-1',
    title: 'Why B2B Companies Are Failing Their Buyers (Part 1)',
    description: "74% of sellers say their role is becoming more consultative. Only 27% of B2B companies are actually pulling it off. Here are five reasons the gap keeps widening.",
    date: '2025-05-19',
    image: '/images/blog-4.webp',
    sections: [
      {
        body: [
          'Buyers have raised their expectations dramatically. They do most of their own research, prefer digital interactions, and expect vendors to understand their specific situation before a conversation even starts.',
          "74% of sellers say their role is becoming more consultative. But only 27% of B2B companies actually excel at consultative selling strategies — despite 56% of buyers expecting personalized engagement (Salesforce). That gap is the problem.",
          'Here are five reasons it keeps widening.',
        ],
      },
      {
        heading: '1. Data Silos Create Fragmented Buyer Experiences',
        body: [
          'Your marketing team sees one version of the customer. Sales sees another. Customer success sees a third. Each team works from its own data, which means no one has the complete picture.',
          'According to Gartner, companies lose an average of 10% of annual revenue to sales and marketing misalignment, with data silos being a major contributor.',
          "With over 60% of B2B interactions now happening digitally (McKinsey), a fragmented view of the buyer isn't just inconvenient — it means your teams can't deliver a coherent experience when buyers expect one.",
        ],
      },
      {
        heading: '2. Delayed Insights Miss Fast-Moving Buyers',
        body: [
          "Modern buyers research, evaluate, and make decisions at their own pace — often outside business hours. Static lead scoring and delayed reporting can't keep up.",
          "Companies using real-time engagement data see 20% higher conversion rates than those relying on manual or delayed processes. That's not a small edge. In competitive deals, responding to a buyer signal hours late can cost you the opportunity.",
        ],
      },
      {
        heading: '3. The Buying Process Is More Complex Than Most Companies Acknowledge',
        body: [
          '77% of B2B buyers say their last purchase was very complex or difficult. 95% of buying groups had to revisit decisions at least once. Up to 60% of B2B decisions ultimately fall through entirely.',
          'Why? Risk aversion, competing priorities across 6 to 10 stakeholders, information overload, and low trust that vendors will actually deliver.',
          'Most companies respond to this complexity by adding more — more content, more steps, more process. The buyers who struggle most need the opposite: simplicity, clarity, and tools that help them build internal consensus.',
        ],
      },
      {
        heading: '4. Personalization Stops at the Name Field',
        body: [
          'Personalization can increase conversion rates by 20% (Salesforce). But most B2B companies deliver the surface-level version — swapping names and company logos into otherwise generic content.',
          '78% of B2B buyers want salespeople to act as trusted advisors. They want vendors who understand their specific situation, industry context, and goals. A template with their name in the subject line does not do that.',
          "True personalization at scale requires understanding who each buyer is and what matters to them — then actually adapting your approach. Most organizations haven't built the capability to do that.",
        ],
      },
      {
        heading: '5. Sales and Marketing Tell Different Stories',
        body: [
          "When sales and marketing aren't aligned, the buyer experience breaks down. Marketing sends one message. Sales says something different. The prospect notices — and it erodes trust.",
          'Only 30% of sales teams report strong alignment with marketing. That means 70% of organizations are asking buyers to navigate inconsistent messaging while trying to make complex purchasing decisions.',
        ],
      },
      {
        heading: 'Part 2 continues this thread',
        body: [
          'We cover five more challenges in Part 2 — including the buying group blind spot, content that misses the mark, and the change resistance problem most companies underestimate.',
          'Pristine Data AI helps GTM teams close this gap — with buyer intelligence that keeps sales and marketing working from the same picture.',
        ],
      },
    ],
  },
  {
    slug: 'buyer-enablement-new-era-b2b-sales',
    title: 'From Pitching to Enabling: How B2B Sales Has to Change',
    description: "Buyers complete 70% of their purchase decision before talking to sales. The teams winning in this environment aren't selling harder — they're making the buying process easier.",
    date: '2025-04-10',
    image: '/images/blog-5.webp',
    sections: [
      {
        body: [
          'B2B sales used to be about controlling information. Reps held the knowledge, buyers needed them to understand their options. That dynamic is gone.',
          "Today's B2B buyer completes roughly 70% of their purchase decision before speaking to a salesperson. They've researched their options, read peer reviews, and often defined what they want — before your team even knows they exist.",
          "83% of buyers prefer digital channels for much of the buying journey, but 75% say the process feels overwhelming. There's more information available than ever, and most of it isn't helping them decide.",
        ],
      },
      {
        heading: 'What Buyer Enablement Actually Means',
        body: [
          "Buyer enablement means helping your prospects make a confident decision — not just persuading them to buy. It's about reducing complexity, providing clarity, and delivering the right information at the right time.",
          "This isn't a technology fix. It's a different way of thinking about what your sales team is there to do.",
        ],
      },
      {
        heading: 'Three Challenges Buyers Face Right Now',
        list: [
          "Information overload — buyers are swimming in vendor pitches, marketing content, and peer reviews. More information doesn't help them decide faster.",
          'Complex buying groups — the average buying group now has 5 to 11 stakeholders, each with different priorities. Getting everyone to agree is genuinely hard.',
          'Fear of regret — 22% of B2B buyers experience purchase regret when relying solely on self-service tools, compared to 11% in rep-assisted transactions. Buyers know they can get it wrong, and it makes them cautious.',
        ],
      },
      {
        heading: 'What Enabling Buyers Actually Looks Like',
        subheading: "Know who you're talking to before the call",
        body: [
          "Instead of scrambling for last-minute context, top teams arrive at every conversation already knowing what matters to this prospect — what's changing in their business, what problems they're trying to solve, what they've already looked at. This shifts the conversation from introduction to problem-solving immediately.",
          'A SaaS company that used intent data to identify a prospect dealing with compliance issues tailored their pitch around regulatory reporting. The sales cycle shortened by 20%.',
        ],
      },
      {
        subheading: 'Personalize past the name in the subject line',
        body: [
          "Real personalization means recommending solutions based on the buyer's industry, company size, and role — not just inserting their name into a template. According to Salesforce, personalized experiences increase conversion rates by 20% on average.",
          'A financial services firm that created different content for different stakeholders — financial impact reports for decision-makers, technical documentation for analysts — saw a 30% increase in engagement.',
        ],
      },
      {
        subheading: 'Make the decision easier, not just the pitch better',
        body: [
          "B2B decisions are hard. Buyers need to compare options, calculate ROI, and get buy-in from people who weren't in the original conversation. Tools that simplify this — ROI calculators, side-by-side comparisons, internal sell-in materials — reduce friction at exactly the point where deals stall.",
        ],
      },
      {
        heading: 'Start enabling your buyers',
        body: [
          'Pristine Data AI gives your GTM team the buyer intelligence they need to show up prepared — and the tools to make every conversation count.',
        ],
      },
    ],
  },
]

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogs.find((b) => b.slug === slug)
}

// Returns the first `count` posts that are not the current post.
// Selection is positional (newest-first array order), not topical.
export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  return blogs.filter((b) => b.slug !== currentSlug).slice(0, count)
}