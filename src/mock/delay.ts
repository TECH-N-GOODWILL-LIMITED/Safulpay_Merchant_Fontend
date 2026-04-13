/** Simulate network latency so loading states behave realistically with mocks */
export function mockDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
