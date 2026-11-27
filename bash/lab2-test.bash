URL=$(node -p "require('./amplify_outputs.json').data.url")
curl -s "$URL" -H 'Content-Type: application/json' -d '{"query":"query { chat }"}'