import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { downloadQRCode, getQRCode } from '../../api/settings.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

export function QRCodePage() {
  const q = useQuery({ queryKey: ['qr-code'], queryFn: getQRCode })

  const dl = useMutation({
    mutationFn: downloadQRCode,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qr-code.png'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Download started')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Your Unique QR Code</h1>
        <div className="mt-8 flex justify-center">
          {q.isLoading ? (
            <Spinner size="lg" />
          ) : q.data?.data?.qr_code_url ? (
            <img src={q.data.data.qr_code_url} alt="Merchant QR" className="h-56 w-56 object-contain" />
          ) : (
            <p className="text-sm text-gray-500">No QR code URL returned</p>
          )}
        </div>
        <Button
          type="button"
          className="mt-8 w-full !bg-brand-hover"
          loading={dl.isPending}
          onClick={() => dl.mutate()}
        >
          Download as Image
        </Button>
      </div>
    </div>
  )
}
