const cache: Cache = caches.default

export async function handleRequest(request: Request): Promise<Response> {
  const idempotencyKey: string | null = request.headers.get('idempotency-key')
  // Only run our code if the user supplied an Idempotency-Key header.
  if (idempotencyKey) {
    const host: string = request.headers.get('Host') || 'foo.com'
    // Cloudflare requires the cache key be a well-formed url.
    const cacheKey = `https://${host}/__idempotency/${idempotencyKey}`
    const cachedResponse: Response | undefined = await cache.match(cacheKey)
    if (cachedResponse) {
      // Cache hit.
      // Just return our cached response.
      return cachedResponse
    } else {
      // Cache miss.
      // This is our mock response. You may want to run a fetch to your origin server.
      const response: Response = new Response(
        `Hello, world ${new Date().toISOString()}`,
      )
      // Save our response to the cache and return it.
      await cache.put(cacheKey, response.clone())
      return response
    }
  } else {
    return new Response(`You need an Idempotency-Key header.`)
  }
}
