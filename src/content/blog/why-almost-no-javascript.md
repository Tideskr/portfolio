---
title: 'Why this site ships almost no JavaScript'
description: 'A personal site is a document, not an application. Here is what that costs and what it buys.'
pubDate: 2026-08-05
lang: 'en'
tags: ['astro', 'web', 'performance']
---

Every personal site I have built before this one started as a document and
ended as an application. A framework goes in to make the blog listing easier,
then a state library to make the framework easier, and eventually a page whose
only job is to show eleven paragraphs of text is shipping 180 kB of JavaScript
to do it.

So this time the rule was simple: **the browser gets HTML unless there is a
concrete reason for it to get anything else.**

## What actually needs JavaScript

Being honest about this list is the whole exercise. On this site it comes to
four things:

- the colour theme toggle, which has to read `localStorage` before first paint
- the mobile menu, because a `<details>` element cannot be made to behave the
  way a menu should on a phone
- the header's scrolled state
- the back-to-top button's visibility

That is roughly 60 lines total, none of it framework code, all of it inlined or
in a single small module. Everything else — the starfield, the beacon sweep on
the horizon, the hover underlines, the compass that turns when you point at the
wordmark — is CSS.

> The starfield is eight tiled `radial-gradient` stops with a mask. It costs one
> declaration block and zero bytes of script.

## What it costs

Two things, and it would be dishonest to pretend otherwise.

**View transitions are harder.** Full page loads are genuinely fast on a static
host, but they are still page loads. You give up the "app-like" continuity that
a client router buys you for free.

**Interactive widgets get expensive fast.** The moment I want something like a
live-filtering search over posts, I have to either write it by hand or pull in
an island — and the second one reintroduces exactly the thing I was avoiding.

## What it buys

The homepage is a single HTML document, a stylesheet, two variable-font subsets
and one AVIF portrait. It renders before the fonts finish loading and does not
move when they arrive. On a throttled connection it is legible in under a
second, and on a phone with no signal in a lift, the pages you already visited
still open.

That is not a technical achievement. It is just what a document costs when you
stop making it an application.
