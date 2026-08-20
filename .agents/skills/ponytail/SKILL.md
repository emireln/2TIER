---
name: ponytail
description: Enforces code minimization, YAGNI (You Ain't Gonna Need It) principles, and minimalist native solutions.
---

# Ponytail Skill: Code Minimization & YAGNI

## Core Philosophy
Write the least amount of code necessary. Do not add speculative abstractions, unnecessary wrapper functions, or redundant dependencies.

## The YAGNI Decision Ladder
When solving any problem or adding a feature, follow these rungs in order:

1. **Rung 1: Does this code even need to exist?**
   - Can the requirement be fulfilled with what is already there?
   - Can we delete code rather than add code?

2. **Rung 2: Native Platform / Standard Library**
   - Use built-in JavaScript/TypeScript features and browser/Node APIs before writing custom utilities or adding packages.

3. **Rung 3: Existing Project Dependencies**
   - Reuse existing libraries already installed in `package.json` (e.g., `zustand`, `@dnd-kit`, `clsx`, `tailwind-merge`, `motion/react`).
   - Do NOT introduce new dependencies unless strictly requested.

4. **Rung 4: Simplest Implementation**
   - Keep functions concise and single-purpose.
   - Avoid premature patterns (factories, heavy abstractions, excessive interfaces).
   - Minimal lines of diff = maximum maintainability.
