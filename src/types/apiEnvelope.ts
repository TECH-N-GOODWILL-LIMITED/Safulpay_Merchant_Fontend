/** Standard API success envelope — align real backend responses with this shape */
export interface ApiEnvelope<T> {
  status: boolean
  message?: string
  data: T
}
