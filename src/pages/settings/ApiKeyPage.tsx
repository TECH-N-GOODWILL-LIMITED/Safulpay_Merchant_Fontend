import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateApiKey, getApiKeys } from '../../api/settings.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

function truncate(s: string, len = 24) {
  if (s.length <= len) return s
  return `${s.slice(0, len)}…`
}

export function ApiKeyPage() {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['api-keys'], queryFn: getApiKeys })

  const gen = useMutation({
    mutationFn: generateApiKey,
    onSuccess: () => {
      toast.success('API key generated')
      void qc.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const copy = (text: string) => {
    void navigator.clipboard.writeText(text)
    toast.success('Copied')
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Business Api key</h1>
        <p className="mt-1 text-sm text-gray-600">-Endeavour to generate new key every year</p>
        {q.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Bearer Token:
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  readOnly
                  value={truncate(q.data?.data?.bearer_token ?? '')}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                />
                <Button type="button" variant="outline" onClick={() => copy(q.data?.data?.bearer_token ?? '')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Refresh Token:
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  readOnly
                  value={truncate(q.data?.data?.refresh_token ?? '')}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                />
                <Button type="button" variant="outline" onClick={() => copy(q.data?.data?.refresh_token ?? '')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        <Button
          type="button"
          className="mt-8 w-full !bg-brand-hover"
          loading={gen.isPending}
          onClick={() => gen.mutate()}
        >
          Generate Api Key
        </Button>
      </div>
    </div>
  )
}
