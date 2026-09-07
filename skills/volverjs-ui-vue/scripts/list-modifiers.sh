#!/usr/bin/env sh
# List the BEM modifiers @volverjs/style defines for each component.
# The `modifiers` prop of a Vv component only produces a class; the class does
# something only if @volverjs/style declares it, so this is the list to trust.
#
# Usage: list-modifiers.sh            # every component
#        list-modifiers.sh vv-button  # that component alone
#        list-modifiers.sh vv-input   # every component whose name starts so

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

# A name that matches a component exactly selects that one, so that vv-button
# does not also print vv-button-group; anything else is taken as a prefix.
REQUESTED="${1:-}"
if [ "$#" -eq 0 ]; then
    set -- "$SETTINGS"/_vv-*.scss
elif [ -f "$SETTINGS/_$1.scss" ]; then
    set -- "$SETTINGS/_$1.scss"
else
    set -- "$SETTINGS"/_"$1"*.scss
fi

found=0
for f in "$@"; do
    [ -f "$f" ] || continue
    found=1
    name="$(basename "$f" .scss | sed 's/^_//')"
    keys="$(awk '
        /^\tmodifier: \(/ { f = 1; next }
        f && /^\t\)/ { f = 0 }
        f && /^\t\t[a-z0-9-]+: \(/ { gsub(/[\t:(]/, "", $1); printf "%s ", $1 }
    ' "$f")"
    echo "$name: ${keys:-(none)}"
done

if [ "$found" -eq 0 ]; then
    echo "no component matches \"$REQUESTED\" in $SETTINGS" >&2
    exit 1
fi
