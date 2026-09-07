#!/usr/bin/env sh
# Print the public API of a @volverjs/ui-vue component straight from its source:
# the props definition (with JSDoc), the emitted events and the slots with their scope.
#
# Usage: inspect-component.sh VvButton [VvDialog ...]
#
# Works both inside the library repository and inside a project that installed
# the package (the package ships its `src/` folder).

set -eu

if [ "$#" -eq 0 ]; then
    echo "usage: $0 Vv<Name> [Vv<Name> ...]" >&2
    exit 1
fi

find_root() {
    dir="$(pwd)"
    while [ "$dir" != "/" ]; do
        if [ -f "$dir/src/components/index.ts" ] && grep -q '"name": "@volverjs/ui-vue"' "$dir/package.json" 2>/dev/null; then
            echo "$dir"
            return 0
        fi
        if [ -d "$dir/node_modules/@volverjs/ui-vue/src/components" ]; then
            echo "$dir/node_modules/@volverjs/ui-vue"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

ROOT="$(find_root)" || {
    echo "cannot find @volverjs/ui-vue: run from the library repo or from a project that installed it" >&2
    exit 1
}

for NAME in "$@"; do
    # VvNavItem and VvNavSeparator live in VvNav, VvDropdown* live in VvDropdown
    DIR="$ROOT/src/components/$NAME"
    case "$NAME" in
        VvNavItem|VvNavSeparator) DIR="$ROOT/src/components/VvNav" ;;
        VvDropdownAction|VvDropdownItem|VvDropdownOption|VvDropdownOptgroup) DIR="$ROOT/src/components/VvDropdown" ;;
    esac
    VUE="$DIR/$NAME.vue"
    if [ ! -f "$VUE" ]; then
        echo "### $NAME: not found (expected $VUE)" >&2
        continue
    fi

    echo "################################################################"
    echo "# $NAME"
    echo "# source: $VUE"
    echo "################################################################"

    if [ -f "$DIR/index.ts" ]; then
        echo
        echo "## Props and events ($DIR/index.ts)"
        # Print the exported props / events / emits blocks with their JSDoc.
        # The name has to end there, so that a `VvFooPropsTypes` alias does not
        # open a block that runs on into the helpers below it, and a block ends
        # on either bracket, because the events are an array and the props an
        # object. An export that opens neither is a one liner, printed as is.
        # Some components only re-export their props: that line is the pointer
        # to where they are actually defined.
        awk '
            /^export \{[^}]*\} from/ { print; print ""; next }
            /^export (const|type) Vv[A-Za-z]+(Props|Events|Emits)[[:space:]=]/ {
                print
                p = 1
                if ($0 !~ /[[{][[:space:]]*$/) {
                    p = 0
                    print ""
                }
                next
            }
            p { print }
            p && /^[]}][,;]?[[:space:]]*$/ { p = 0; print "" }
        ' "$DIR/index.ts"
    fi

    echo
    echo "## Props defined inline in the .vue (if any)"
    awk '/defineProps\(\{|defineProps</ { p = 1 } p { print } p && /\}\)|\)$/ { p = 0 }' "$VUE" | head -60

    echo
    echo "## Slots (name and scope)"
    grep -nE '<slot' "$VUE" | sed -E 's/^\s+//' || true

    echo
    echo "## Emits in template/script"
    grep -nE "defineEmits|emit\('[a-zA-Z:]+'" "$VUE" | sed -E 's/^\s+//' | sort -u || true

    STORIES="$ROOT/src/stories/$(echo "$NAME" | sed 's/^Vv//')"
    if [ -d "$STORIES" ]; then
        echo
        echo "## Stories with real usage examples"
        ls "$STORIES"/*.stories.ts 2>/dev/null
    fi
    echo
done
