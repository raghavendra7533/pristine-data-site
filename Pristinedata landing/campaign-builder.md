# PRD: Campaign Builder Redesign + Dynamic Variable System

**Author:** Raghavendra Radhakrishnan  
**Date:** March 24, 2026  
**Status:** Draft — Pending Ashok Review  
**Informed by:** Ashok Anna meetings — March 11 and March 23, 2026

---

## 1. Background and Why This Exists

The campaign builder was designed when the AI model generated the entire email — subject line and body — as one block. That model has changed.

Ashok and Arvind have already updated the backend in SBX. The new model accepts a theme AND a template separately, and can now generate just one paragraph instead of the full email. This means a user can choose exactly which part of their email gets AI-generated and which part stays static. The old campaign screen does not support this paradigm at all. Building on top of it will create compounding UX debt.

This PRD covers the redesign of the campaign creation screen and the new dynamic variable system that makes selective personalization possible.

---

## 2. What Ashok Said, Verbatim Context

**March 23 — on the screen:**
> "All I need from a UX perspective is on the campaign screen, I felt it needed a redesign. Because now we are changing the paradigm of how you want the email to be created. Do you want the entire body and subject line? Do you want to only personalize the subject line? Do you want to personalize the body?"

**March 23 — on operator overloading:**
> "I'm introducing themes, I'm introducing templates... now I may have the ability to select multiple contact lists. Now I feel like, on the object oriented design, it's called function overloading or operator overloading — you're overloading the screen. That's not a good design from a UX perspective. You'll just confuse me."

**March 23 — on the new backend model:**
> "The way we built the theme and template, it always returns an entire block of subject line and body. We changed it in SBX where we said, no, if I send you a theme, and then I send you a template where I only want you to generate one paragraph."

**March 23 — on the JTBD framing:**
> "Either they want the AI to do all the work, or they want to do some of the work, or they want to attach something."

**March 11 — on the conditional variable:**
> "There will be a text block — it's not a text block that is static, it'll be AI-generated based on what problems they are facing. Or it could be something that's based on industry — for each industry they want a different non-monetary offer. So there is an if-then-else going on. The simple thing is a supplemental table. Wherever it says role is A, Gobi will go fetch whatever is section A's value and drop it into the table."

**March 11 — on existing variables:**
> "This is existing today. Simple personalization. I can put your company name, I can put your first name. Now what I'm asking for is two advanced variables."

---

## 3. Problem Statement

The current campaign screen conflates too many decisions into one surface:

- Theme selection
- Template selection
- Contact list selection
- Number of stages
- AI instructions

Users don't know what controls what. Adding the new personalization paradigm (selective AI generation) on top of this will make it worse. The screen needs to be rebuilt around a single guiding question: **what job is the user trying to do?**

The three JTBD modes from Ashok:

1. AI does everything — full generation of subject line and body
2. User controls structure, AI fills specific sections
3. User writes the email, AI personalizes one or two dynamic blocks

---

## 4. Scope

**In scope for this PRD:**

- Redesign of the campaign creation screen (Step 1 of campaign builder)
- Introduction of the Personalization Mode selector (what gets AI-generated)
- New Dynamic Variable types: Conditional Content Block and AI-Generated Paragraph block
- How variables are inserted into the email body

**Out of scope:**

- Campaign analytics screen
- Smartlead integration flow
- Multi-contact list selection (Ashok flagged this explicitly as something to defer — it overloads the screen)
- Custom Theme Builder (separate FRD already exists)

---

## 5. User Personas

**Primary: Demand Gen User (Single Grain archetype)**
Sending volume campaigns. Does not want to manually configure every variable. Wants to pick a mode, optionally set a conditional rule, and launch. Speed matters more than fine-grained control.

**Secondary: Precision AE (Sudhir archetype)**
Smaller lists, higher ACV targets. Wants to write their own static email with one or two AI-personalized blocks dropped in at specific places. Control matters.

---

## 6. Proposed UX Changes

### 6.1 Campaign Creation Screen — New Structure

The screen should be split into three clean sections. No nesting. No overloading.

**Section 1: Campaign Basics**
- Campaign name (text input)
- Contact list selector (single select, V1 — multiple contact lists deferred per Ashok)
- Number of stages (1–5 pill selector, same as current)

**Section 2: Personalization Mode**

This is the new element. A three-option selector that answers the JTBD question. Present as a segmented control or card selector — not a dropdown.

| Mode | Label | What it does |
|------|-------|--------------|
| A | Full AI | AI generates subject line and full body. User provides theme + optional instructions. |
| B | Selective | User writes the email. AI fills one or more specific sections (paragraph or conditional block). |
| C | Static | No AI generation. User writes everything. Variables limited to simple merge tokens (first name, company). |

Selecting Mode A shows: Theme selector + Instructions field (current behavior, cleaner layout).

Selecting Mode B shows: A simplified email editor with the ability to insert Dynamic Variable blocks at cursor position (see Section 6.2).

Selecting Mode C shows: The existing static template editor with merge token support only.

**Section 3: Theme and Instructions (conditional — only shown in Mode A)**
- Theme selector (existing campaign types: Sales, Event, Competitor, Nurture, Awareness)
- Each theme shows a tooltip breakdown of what each stage does (Ashok flagged this in the March 11 meeting — tooltips should describe per-stage logic, not just the theme name)
- Additional instructions textarea (optional, existing)

---

### 6.2 Dynamic Variable System

This is the core new capability. Two new variable types beyond existing merge tokens.

**Existing variables (unchanged):**
- `{{firstName}}`
- `{{companyName}}`
- `{{jobTitle}}`

**New Variable Type 1: Conditional Content Block**

This is the supplemental table concept Ashok described. An if-then-else that maps a contact attribute to a pre-written content snippet.

How it works for the user:
1. User inserts a `{{conditional}}` block at the desired position in the email
2. A side panel opens: user picks the matching attribute (role, industry, seniority, etc.)
3. User adds rows: Attribute value -> Content to show
4. One default/fallback row is required

Example configuration:

| If Role is... | Show this text |
|---------------|---------------|
| VP of Marketing | "I'd love to run a free ICP audit for your demand gen team — takes 30 minutes." |
| Head of Growth | "We can pull 50 accounts in your exact ICP in under 10 minutes." |
| Founder / CEO | "If you're still personally running outbound, we should talk." |
| (default) | "I'd love to show you how we're helping teams like yours." |

Backend mechanic (per Ashok): Gobi does an inner join between the contact's attribute value and the supplemental table. The matched row's content gets dropped into the email at that position. If no match, the default row is used.

**Open question to resolve with Gobi before building:** What are the exact field names from the enrichment data that can be used as matching attributes? This was flagged as a blocker in the FRD. Cannot design the attribute picker without a confirmed field list.

**New Variable Type 2: AI-Generated Paragraph Block**

This is the simpler of the two. User inserts a `{{ai_paragraph}}` block at a specific position. The AI generates one paragraph for that block based on the contact's enriched profile (company news, role, tech stack signals etc.).

How it works for the user:
1. User inserts `{{ai_paragraph}}` at cursor position
2. Optional: User adds an instruction for what the paragraph should accomplish (e.g., "reference a recent company news signal" or "relate to their role's typical pipeline problem")
3. At generation time, Pristine fills this block per contact — one-to-one

This is the "Pristine wrote this email" concept. The first line of the email can be fully static and transparent ("Full disclosure — Pristine wrote this"), and the `{{ai_paragraph}}` block delivers the actual personalized hook.

---

### 6.3 Variable Insertion UI

In Mode B (Selective), the email editor needs an insert mechanism. Proposed approach:

- A small `+ Insert Variable` button appears inline when the user clicks inside the editor, or as a persistent toolbar above the editor
- Clicking it opens a picker with three categories:
  - Simple merge tokens (first name, company, etc.)
  - Conditional Content Block (triggers configuration panel)
  - AI Paragraph Block (triggers instruction input)
- Selected variable is inserted at cursor as a styled token/chip in the editor body
- Each chip is visually distinct by type (merge tokens = grey, conditional = orange, AI paragraph = blue) so the user can see at a glance what is static vs dynamic

---

## 7. What Does NOT Change

Per Ashok: "We only need to redesign the previous screen." The downstream screens (preview, confirmation, analytics) are not in scope. The current stage-by-stage email preview flow stays as-is.

---

## 8. Backend Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| New theme + template model (generates one paragraph, not full email) | Arvind | Done in SBX, not in production |
| Conditional block — supplemental table inner join logic | Gobi | Not started, needs enrichment field list first |
| AI paragraph block — per-contact generation at send time | Arvind | Dependent on campaign screen UX sign-off |
| Enrichment field names for conditional attribute picker | Gobi / Ashok | **BLOCKER — needed before F2 can be built** |

---

## 9. Open Questions

1. **Enrichment field names for conditional block** — Gobi needs to confirm which contact attributes are available as matching keys (role, industry, seniority, etc.) and what their exact field names are in the data model. This is the single biggest blocker.

2. **Gift card / incentive field** — The outbound experiments reference a monetary offer. Is there a campaign-level field where the user specifies the offer value? This is needed for Experiment 1 but not explicitly designed anywhere yet.

3. **Default fallback behavior** — If the conditional block has no matching row AND no default row, what happens? Does the email send without that block, or does it fail? Needs a defined behavior.

4. **AI paragraph block vs full AI mode** — Can a user in Mode A also insert an `{{ai_paragraph}}` block for additional sections? Or is Mode A strictly full-generation? Needs Ashok sign-off on whether these modes are mutually exclusive.

---

## 10. Success Criteria

- A user can create a campaign in Mode A (full AI) in under 3 clicks from the campaign screen
- A user in Mode B can insert a conditional block, configure it with at least 2 rows + a default, and preview it without engineering involvement
- The screen does not show multiple contact list selection (deferred — this was Ashok's explicit operator overloading concern)
- Arvind can release the new SBX model to production once this UX is signed off

---

## 11. Next Steps

| Action | Owner | When |
|--------|-------|------|
| Whiteboard session with Ashok on JTBD redesign | Raghav + Ashok | Next 1-on-1 |
| Confirm enrichment field names for conditional block | Raghav to ask Gobi | This week |
| Build Mode A screen (simplest — just cleanup of current screen) | Gobi | After whiteboard |
| Design Mode B with variable insertion UI | Raghav (Figma/Lovable) | After field names confirmed |
| Release new template model to production | Arvind | After UX sign-off |