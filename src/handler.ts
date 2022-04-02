const cache: Cache = caches.default

export async function handleRequest(request: Request): Promise<Response> {
  const idempotencyKey: string | null = request.headers.get('idempotency-key')
  const response: Response = new Response(
    `Hello, world ${new Date().toISOString()}`,
  )
  if (idempotencyKey) {
    const host: string = request.headers.get('Host') || 'foo.com'
    const cacheKey = `https://${host}/__idempotency/${idempotencyKey}`
    const cachedResponse: Response | undefined = await cache.match(cacheKey)
    if (cachedResponse) {
      return cachedResponse
    } else {
      await cache.put(cacheKey, response.clone())
      return response
    }
  } else {
    return response
  }
}
