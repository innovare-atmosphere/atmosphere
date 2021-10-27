#!/usr/bin/env bash
set -Ex

function apply_path {

    echo "Check that we have BACKEND_URL vars"
    test -n "$BACKEND_URL"

    find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_RUNNER_URL#$BACKEND_URL#g"
}

apply_path
echo "Starting Nextjs"
exec "$@"