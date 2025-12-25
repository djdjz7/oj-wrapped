# OpenJudge Wrapped

Wrap up your past year on http://openjudge.cn

## Build Dependencies

- Bun.js
- Node.js

## Build

```sh
bun install
bun build
```

Output at `./dist`

Note: Server bundle target defaults to bun-linux-x64, modify `package.json` if needed.

## Deploy Dependencies

- Caddy

## Deploy

1. Copy output directory to target server
2. Modify Caddyfile
3. Start `./dist/server`
4. Start Caddy

Note: Theoretically, server bundle should not require Bun.js to run. But if you encounter Segmentation Fault, try installing Bun.js on target server.