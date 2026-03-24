---
name: web-spec
description: Draft a reusable web product specification from a rough idea or prompt, covering user flow, page structure, feature scope, and frontend design direction. Use when the user wants to plan a website or web app before implementation.
---

# Web Spec

## Overview

Turn a rough website idea into a concrete specification that can be used before design or coding starts.
Use this skill when the user wants a prompt, blueprint, brief, sitemap, or frontend direction for a new web page or web app.

## Workflow

### 1. Gather the minimum context

Before writing the spec, determine:
- product or page goal
- target users
- primary actions users must complete
- core pages or features
- preferred visual direction if already known

If the user gives only a vague idea, infer a reasonable structure, but explicitly label assumptions.

### 2. Define the product shape

Convert the request into a concrete product framing:
- problem being solved
- user types or personas
- main success path
- supporting flows
- required content blocks
- pages, modules, and data states

### 3. Write the spec in a stable structure

Use the output structure from `references/spec-template.md`.
Keep the output compact but implementation-ready.
Prefer decisions over option spam.

### 4. Make the frontend direction explicit

For every spec, define:
- information hierarchy
- layout pattern per page
- component groups
- interaction expectations
- responsive behavior
- accessibility expectations
- visual tone, color direction, and typography direction when relevant

Do not stop at "make it modern" or "clean UI". Convert vague design language into concrete choices.

### 5. Produce actionable output

End with one of these deliverables depending on the request:
- product spec
- page-by-page wireframe brief
- frontend implementation brief
- prompt that can be reused to ask Codex to build the UI

When the user asks for a prompt, produce a prompt that already includes:
- context
- scope
- page list
- required sections
- visual direction
- technical constraints if known

## Output Rules

- Use headings and concise bullets.
- Separate confirmed facts from assumptions.
- Avoid filler such as "user-friendly", "intuitive", or "modern" unless you define what they mean.
- If a page or flow is missing, call it out directly.
- If the request is for a single landing page, simplify the output to fit that scope.
- If the request is for a multi-role app, define flow per role.

## When To Ask Clarifying Questions

Ask only when one of these blocks the spec quality:
- target user is unclear
- platform type is unclear
- required pages or flows are unclear
- visual direction is important but absent
- the user wants the output tailored to a real brand or business

Otherwise, proceed with explicit assumptions.

## Examples Of Valid Requests

- "$web-spec buatkan spesifikasi web HRIS untuk karyawan dan admin."
- "$web-spec susun prompt untuk landing page jasa renovasi rumah."
- "$web-spec dari ide aplikasi absensi ini, buatkan sitemap, flow, dan arahan frontend."
- "$web-spec bikin brief implementasi frontend untuk dashboard payroll."

## References

Read `references/spec-template.md` before drafting the final output so the structure stays consistent.
