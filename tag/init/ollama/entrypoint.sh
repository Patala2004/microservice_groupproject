set -e

ollama serve &

until ollama list >/dev/null 2>&1; do
  sleep 1
done

MODEL="qwen3:8b"

if ! ollama list | grep -q "^$MODEL"; then
  echo "Downloading $MODEL"
  ollama pull $MODEL
else
  echo "$MODEL already exists"
fi

wait
