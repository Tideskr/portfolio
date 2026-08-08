---
title: 'The Hard Part of Small Software'
description: 'Why scope, defaults, and maintenance matter more than a long feature list.'
pubDate: 2026-08-05
lang: 'en'
tags: ['software', 'practice', 'maintenance']
---

I used to think small tools were easy because there was less code to write. The opposite is usually true. When a project is only a few hundred lines, there is nowhere for a vague decision to hide. A surprising default, a careless error message, or a data format that cannot be migrated becomes the product.

## Make the problem smaller first

The most common failure in a small project is not an undersized feature set. It is an undefined problem.

“Build a tool for saving web pages” leaves almost everything open. Are we saving a URL or the article itself? Should images be kept? What happens without a connection? What counts as a duplicate? If those questions are answered one at a time during implementation, the code starts growing around exceptions instead of around a clear job.

I now try to rewrite the goal as something testable: “Save the readable part of an article so I can open it locally in under three minutes.” That sentence sets useful boundaries. It does not promise device synchronisation, social bookmarking, or a replacement for a browser. A narrow scope makes the trade-offs visible, which is the first step toward making good ones.

## Defaults are product decisions

When a user does not choose, the software still chooses for them. The default directory, whether a duplicate is overwritten, and whether a failed request is retried are all product behaviour, not implementation trivia.

A good default makes the common path easy and keeps mistakes cheap. Ask before replacing a file. Say that a save failed instead of displaying a reassuring but empty progress state. A useful default disappears into the experience; a bad one becomes the longest paragraph in the documentation.

This is why I write down failure paths alongside success paths. A tool can look excellent in a demo and still lose its users the first time the network drops, a file already exists, or an input is incomplete. Reliability is mostly the collection of these small decisions.

## Maintenance starts before release

“We can maintain it later” usually means there is no maintenance plan. Even a tiny project will meet dependency upgrades, changing data formats, and environments where the original setup no longer works.

Every tool does not need an elaborate architecture, but it should answer a few practical questions. Where does the data live? Can it be exported? What evidence is left when something fails? Can I get it running again six months from now without reconstructing the original machine?

For small software, deleting things is often a better investment than adding abstractions. Remove a dependency that provides little value. Remove a configuration option nobody can test. Remove an extension point that exists only for an imagined future. Every hidden state is another thing someone will have to guess about later.

## Documentation is another interface

Code tells a machine how to produce a result. Documentation tells a person whether that result is appropriate for their problem. They are different interfaces with different jobs.

A useful README does not need to be long. It should answer what the tool replaces, what it deliberately does not do, the shortest path to a useful result, and where to look when it fails. The examples should include at least one imperfect case and a way to recover from it.

Writing the explanation is also a design test. If I cannot describe an option in two plain sentences, the problem is often not the prose. The option itself does not represent a stable idea. An API that needs a paragraph of apology is usually an API that will be difficult to keep.

## Shipping is the start of feedback

Putting a tool in front of people turns assumptions into observable behaviour. Pay attention to where they stop, which settings they change immediately, and which errors recur. This does not always require analytics. A single thoughtful email can reveal more than a dashboard full of clicks.

Feedback should not automatically become a feature request. It is worth understanding every request, but the right fix may be a clearer default, better output, or a more honest boundary. Fixing that foundation is often more valuable than adding another capability on top of it.

I now think of small software as a promise to do one job well and to make the edges of that job clear. The important measure of “small” is not the number of lines. It is the number of rules the person using the tool has to remember.
