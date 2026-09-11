# Astro Personal Website Starter
We are trying to have a style similar to this address:
https://huyenchip.com
A simple personal academic website starter built with Astro.

## How to use

1. Open this folder in Cursor.
2. In the terminal, run:

```bash
npm install
npm run dev
```

3. Open the local link shown in the terminal, usually:

```text
http://localhost:4321
```

## How to add a blog post

Create a new Markdown file inside:

```text
src/content/blog/
```

Example:

```text
src/content/blog/my-new-post.md
```

Use this format:

```md
---
title: "My New Post"
date: "2026-06-18"
description: "A short summary of the post."
---

Write your post here.
```

## How to edit the design

Edit:

```text
src/styles/global.css
```

## How to edit shared layout/navigation

Edit:

```text
src/layouts/BaseLayout.astro
```
