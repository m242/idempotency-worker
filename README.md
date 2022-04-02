# idempotency-worker

A simple proof of concept of a Cloudflare worker that caches based on the Idempotency-Key header.

Usage: 

1. Edit wrangler.toml to point at your Cloudflare account and route
2. Run "wrangler dev", then run this curl:

```bash
curl -D - -X POST -H "Idempotency-Key: foo" http://localhost:8787/ (whatever route you chose)
```

On a cache miss for the idempotency key, you'll get back the current time.
On a cache hit, you'll get the original response (and time) back.


## Example

```bash
curl -D - -X POST -H "Idempotency-Key: foo" https://mark.run/idempotency
```
