# Smoke Test Report

## Command Used
```bash
npm run preview -- --host 127.0.0.1 --port 4173 &
sleep 2
curl -I -s http://127.0.0.1:4173 | head -n 1
pkill -f "vite preview"
```

## HTTP Status Line
`HTTP/1.1 200 OK`

## Timestamp
2026-01-30T20:01:29Z
