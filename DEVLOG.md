## Day 1 — 2026-05-07

**Hours worked:** 6

**What I did:**
- Read and analyzed the complete Credex internship assignment requirements
- Planned the overall architecture and feature breakdown for the AI Spend Audit platform
- Initialized a new Next.js project using TypeScript, Tailwind CSS, and App Router
- Configured GitHub repository and connected local project with remote repository
- Resolved Git merge conflicts and repository synchronization issues
- Installed and configured shadcn/ui components for the frontend UI system
- Built the initial landing page with:
  - responsive navbar
  - hero section
  - CTA buttons
  - statistics cards
  - footer
- Added a custom AI-themed hero image and blended it with the dark landing page background using gradients and glow effects
- Created the initial project folder structure for scalability
- Created Supabase project and configured backend database
- Created the `audits` table with required schema
- Connected Supabase to the Next.js application using environment variables

**What I learned:**
- How to structure a production-ready Next.js application using App Router
- How to integrate Supabase with a frontend application
- Better understanding of Git remote conflicts and merge handling
- Importance of clean UI hierarchy and visual consistency in SaaS landing pages
- How modern startup landing pages use gradients, blur effects, and glow styling for polished UI design

**Blockers / what I'm stuck on:**
- Faced dependency conflicts while setting up shadcn/ui due to an incorrect Next.js version initially installed
- Encountered Git push conflicts because the remote repository already contained commits
- Still deciding the best structure for implementing scalable audit recommendation logic

**Plan for tomorrow:**
- Build the complete AI spend input form
- Add dropdowns for AI tools and subscription plans
- Implement form validation
- Add localStorage persistence for saved form state
- Start building the audit engine logic and pricing dataset

## Day 2 — 2026-05-08

**Hours worked:** 6

**What I did:**
- Created the complete audit input page using Next.js and Tailwind CSS
- Built responsive form UI for collecting AI tool usage information
- Added dropdown selection system for different AI platforms and plans
- Implemented form state management using React hooks
- Added fields for:
  - AI tool selection
  - subscription plan
  - monthly spending
  - team size
  - primary use case
- Implemented localStorage persistence to save form progress automatically
- Added logic to reload saved form data after page refresh
- Added client-side form validation for required fields
- Created placeholder results page for audit output flow
- Implemented routing between audit form and results page
- Improved form styling with modern dark SaaS-inspired UI design
- Organized project structure using separate data and utility folders

**What I learned:**
- Better understanding of React state management using useState and useEffect
- How localStorage can improve user experience by preserving form state
- Improved understanding of client-side routing in Next.js App Router
- Importance of reusable data structures for scalable frontend architecture
- Learned how responsive form design affects usability across devices

**Blockers / what I'm stuck on:**
- Initially faced confusion with React client components and hook usage
- Needed additional debugging for localStorage synchronization after refresh
- Still planning the best architecture for scalable recommendation logic

**Plan for tomorrow:**
- Build the complete audit engine and pricing calculation system
- Add recommendation logic for AI tool optimization
- Generate dynamic audit results
- Create savings calculation functionality
- Add yearly savings estimation
- Improve overall user experience and interactions