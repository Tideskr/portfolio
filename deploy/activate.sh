#!/usr/bin/env bash
#
# Activate an uploaded release. Run on the server by CI, after rsync has put a
# build into /srv/skr.moe/releases/<sha>.
#
# The swap is a symlink rename, which is atomic on the same filesystem: a
# request either sees the whole old release or the whole new one, never a
# half-copied tree.

set -euo pipefail

ROOT=/srv/skr.moe
RELEASES="$ROOT/releases"
KEEP=5

SHA="${1:?usage: activate.sh <release-sha>}"
TARGET="$RELEASES/$SHA"

[ -d "$TARGET" ] || { echo "no such release: $TARGET" >&2; exit 1; }
# A release without an index is a failed upload, not something to point at.
[ -f "$TARGET/index.html" ] || { echo "release has no index.html: $TARGET" >&2; exit 1; }

# The CSP allows this release's inline scripts by hash, so it has to be
# regenerated from the release being activated. Written before the swap: a
# stale policy would block the new scripts for as long as it took to notice.
python3 "$ROOT/gen-csp.py" "$TARGET" "$ROOT/shared/csp.caddy"

ln -sfn "$TARGET" "$ROOT/current.tmp"
mv -Tf "$ROOT/current.tmp" "$ROOT/current"
echo "activated $SHA"

# Pick up the new CSP snippet. A reload is graceful — in-flight requests finish
# against the old config rather than being dropped.
sudo -n systemctl reload caddy

# Keep the last few releases so a rollback is a symlink away. Never delete the
# one currently linked, even if it falls outside the window.
CURRENT="$(readlink -f "$ROOT/current")"
cd "$RELEASES"
ls -1dt "$RELEASES"/*/ 2>/dev/null | tail -n "+$((KEEP + 1))" | while read -r old; do
  old="${old%/}"
  [ "$(readlink -f "$old")" = "$CURRENT" ] && continue
  echo "pruning $(basename "$old")"
  rm -rf -- "$old"
done

exit 0
