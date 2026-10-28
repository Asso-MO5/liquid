#!/bin/sh
set -eu

# CapRover may override PORT. Nitro reads its own variables first, so forward
# the runtime port and bind address without baking deployment values in the image.
export NITRO_HOST="${NITRO_HOST:-0.0.0.0}"
export NITRO_PORT="${NITRO_PORT:-${PORT:-3000}}"

exec "$@"
