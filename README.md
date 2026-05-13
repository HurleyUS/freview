# freview 🔎

**One command. Five reviews. Zero mystery meat before push.**

`freview` is the tiny pre-push review harness we use to keep JavaScript/TypeScript projects from faceplanting on `main`. It runs the local Fallow + Scribe review stack, writes a durable `REVIEW.md`, and only prints the full report when something actually needs attention.

It is intentionally boring. Boring is how code ships.

## What it runs

`freview` builds one review report from:

- **Health** — project health + complexity review
- **Audit** — risky implementation patterns and maintainability issues
- **Dead code** — unused files, exports, and stale surface area
- **Duplication** — copy/paste debt before it metastasizes
- **Docstrings** — public surface documentation via `scribe`

Output lands in `REVIEW.md` at the repo root.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/HurleyUS/freview/main/bin/freview -o ~/bin/freview
chmod +x ~/bin/freview
```

Or clone it:

```bash
git clone git@github.com:HurleyUS/freview.git
ln -sf "$PWD/freview/bin/freview" ~/bin/freview
```

## Usage

```bash
freview
freview --root ~/Projects/uncap.us
freview --summary --explain
freview --ci
```

### Flags

| Flag | Purpose |
| --- | --- |
| `-r, --root <path>` | Review another project root |
| `-f, --format <format>` | Forward output format to Fallow/Scribe |
| `-q, --quiet` | Reduce command chatter |
| `--summary` | Request summary output from underlying tools |
| `--explain` | Include explanatory findings |
| `--ci` | SARIF-oriented CI mode, quiet + fail-on-issues |
| `--fail-on-issues` | Return non-zero when findings exist |

## Pre-push hook

Drop this in `scripts/hooks/pre-push` and symlink/copy it into `.git/hooks/pre-push`:

```bash
#!/usr/bin/env bash
set -euo pipefail

protected_ref='refs/heads/(main|master)$'

while read -r local_ref _local_sha remote_ref _remote_sha; do
  if [[ "$local_ref" =~ $protected_ref || "$remote_ref" =~ $protected_ref ]]; then
    exec "$HOME/bin/freview"
  fi
done
```

Recommended setup:

```bash
mkdir -p scripts/hooks .git/hooks
cp scripts/hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## Requirements

- macOS/Linux shell with `zsh`
- [Bun](https://bun.sh/)
- `fallow` available through `bunx --bun fallow`
- `scribe` available on `PATH`

`freview` will run `fallow init --quiet` and `fallow setup-hooks --quiet` before reviewing so the target project has the expected local Fallow scaffolding.

## Why this exists

Pushing to protected branches should hurt a little when the code is sketchy and be silent when the code is clean. `freview` gives us that: a shareable `REVIEW.md`, CI-friendly failure modes, and one command the whole team can wire into hooks.

## License

MIT — ship it, fork it, make it yell at your own bad code.
