#!/usr/bin/env sh
# List the BEM modifiers @volverjs/style defines for each component.
# The `modifiers` prop of a Vv component only produces a class; the class does
# something only if @volverjs/style declares it, so this is the list to trust.
#
# Usage: list-modifiers.sh            # every component
#        list-modifiers.sh vv-button  # one component

set -eu

find_style() {
    dir="$(pwd)"
    while [ "$dir" != "/" ]; do
        if [ -d "$dir/node_modules/@volverjs/style/src/settings/components" ]; then
            echo "$dir/node_modules/@volverjs/style/src/settings/components"
            return 0
        fi
        if [ -d "$dir/src/settings/components" ] && grep -q '"name": "@volverjs/style"' "$dir/package.json" 2>/dev/null; then
            echo "$dir/src/settings/components"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

SETTINGS="$(find_style)" || {
    echo "cannot find @volverjs/style: install it in the project first" >&2
    exit 1
}

PATTERN="${1:-vv-}"
for f in "$SETTINGS"/_"$PATTERN"*.scss; do
    [ -f "$f" ] || continue
    name="$(basename "$f" .scss | sed 's/^_//')"
    keys="$(awk '
        /^\tmodifier: \(/ { f = 1; next }
        f && /^\t\)/ { f = 0 }
        f && /^\t\t[a-z0-9-]+: \(/ { gsub(/[\t:(]/, "", $1); printf "%s ", $1 }
    ' "$f")"
    echo "$name: ${keys:-(none)}"
done
