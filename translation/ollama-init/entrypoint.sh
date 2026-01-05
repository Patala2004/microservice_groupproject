#!/bin/sh
set -e

ollama serve &

until ollama list >/dev/null 2>&1; do
  sleep 1
done

MODEL="${OLLAMA_MODEL_NAME}"

if ! ollama list | grep -q "^$MODEL"; then
  echo "Downloading $MODEL"
  ollama pull $MODEL
else
  echo "$MODEL already exists"
fi

wait