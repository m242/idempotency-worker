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


## Why would you need this?

Mobile applications tend to run in environments where network connections aren't as stable as a
laptop or desktop. Think of someone using their phone walking through their house, switching
from access point to access point, or switching cell towers, going through a tunnel, or just
dropping cell signal.

In an application where you depend on at-most-once message delivery from a client to your platform,
for instance when you're mutating data by adding a request to an existing data set, you don't
want to have a client retry its network request without the ability to tell the client "I already did
that action".

Idempotency ensures that no matter how many times a client sends a mutation request, that request
is only ever acted upon once. This removes the more traditional two-phase-commit workflow that
clients use which treats the symptom but doesn't really solve the problem.

This implementation is not 100% bulletproof, as a user could in theory move from one Cloudflare
POP to another within a network retry window; as that's a fairly edgy edge case, we aren't
concerned about that within this implementation.
