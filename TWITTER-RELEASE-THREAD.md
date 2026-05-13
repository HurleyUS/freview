# freview Release Thread

1/ We shipped `freview` — a tiny pre-push review harness for teams that would rather catch garbage before `main` than explain it in prod.

One command. Five reviews. Durable `REVIEW.md`. Quiet when clean, loud when it matters.

https://github.com/HurleyUS/freview

2/ What it runs:

• Fallow health + complexity
• Fallow audit
• Dead-code review
• Duplication review
• Scribe docstring coverage

The output gets stitched into one `REVIEW.md` so review findings survive the terminal scrollback graveyard.

3/ The killer use case is pre-push protection.

Wire it into `.git/hooks/pre-push`, and protected branch pushes run the review suite automatically. If there are issues, it fails before the branch does damage.

Boring guardrails. Beautiful outcomes.

4/ It also has CI-friendly mode:

```bash
freview --ci
```

That flips to quiet/SARIF-oriented output and fails on issues, so GitHub Actions can enforce the same standard the local hook does.

5/ Install is intentionally stupid-simple:

```bash
curl -fsSL https://raw.githubusercontent.com/HurleyUS/freview/main/bin/freview -o ~/bin/freview
chmod +x ~/bin/freview
```

Then run:

```bash
freview
```

6/ Why build this?

Because teams don’t need another dashboard. They need one command that says: “this project is healthy enough to push” or “fix this before future-you hates current-you.”

`freview` is MIT licensed. Use it, fork it, make it meaner.

https://github.com/HurleyUS/freview
