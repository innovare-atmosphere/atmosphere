#!/usr/bin/env sh

apply_path() {

    echo "Check that we have BACKEND_URL vars"
    test -n "$BACKEND_URL"
    echo "Check that we have COMPILE_VERSION vars"
    test -n "$COMPILE_VERSION"

    find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_RUNNER_URL#$BACKEND_URL#g"
    find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_VERSION#$COMPILE_VERSION#g"
}

apply_path
echo "Starting Nextjs"d
exec "$@"