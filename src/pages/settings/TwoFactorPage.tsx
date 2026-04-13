import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { disable2FA, enable2FA, get2FA } from '../../api/settings.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'

export function TwoFactorPage() {
  const qc = useQueryClient()
  const [otpOpen, setOtpOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [modalMode, setModalMode] = useState<'enable' | 'disable'>('enable')

  const q = useQuery({ queryKey: ['2fa'], queryFn: get2FA })

  const enableMut = useMutation({
    mutationFn: () => enable2FA({ code: otp }),
    onSuccess: () => {
      toast.success('2FA enabled')
      setOtpOpen(false)
      setOtp('')
      void qc.invalidateQueries({ queryKey: ['2fa'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const disableMut = useMutation({
    mutationFn: () => disable2FA({ code: otp }),
    onSuccess: () => {
      toast.success('2FA disabled')
      setOtpOpen(false)
      setOtp('')
      void qc.invalidateQueries({ queryKey: ['2fa'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const secret = q.data?.data?.secret ?? '6MMP2ZKXKSQXPVEU'
  const otpauth = `otpauth://totp/SafulPay?secret=${secret}&issuer=SafulPay`

  const copySecret = () => {
    void navigator.clipboard.writeText(secret)
    toast.success('Copied')
  }

  const submitOtp = () => {
    if (modalMode === 'enable') enableMut.mutate()
    else disableMut.mutate()
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Two Factor Authenticator</h2>
        {q.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Secret key
            </label>
            <div className="mt-1 flex gap-2">
              <input
                readOnly
                value={secret}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
              />
              <Button type="button" variant="outline" onClick={copySecret}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 flex justify-center rounded-lg bg-gray-50 p-4">
              <QRCodeSVG value={otpauth} size={180} />
            </div>
            <Button
              className="mt-6 w-full !bg-brand-hover"
              type="button"
              onClick={() => {
                setModalMode('enable')
                setOtp('')
                setOtpOpen(true)
              }}
            >
              Enable Two Factor Authenticator
            </Button>
            {q.data?.data?.enabled ? (
              <Button
                type="button"
                variant="danger"
                className="mt-3 w-full"
                onClick={() => {
                  setModalMode('disable')
                  setOtp('')
                  setOtpOpen(true)
                }}
              >
                Disable Two Factor Authenticator
              </Button>
            ) : null}
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Google Authenticator</h2>
        <p className="mt-3 text-sm text-gray-600">
          Google Authenticator is a multifactor app for mobile devices. It generates timed codes used
          during the 2-step verification process. To use Google Authenticator, install the Google
          Authenticator application on your mobile device.
        </p>
        <a
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
          target="_blank"
          rel="noreferrer"
          className="mt-6 block"
        >
          <Button type="button" className="w-full !bg-brand-hover">
            DOWNLOAD APP
          </Button>
        </a>
      </div>

      <Modal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        title={modalMode === 'enable' ? 'Enable 2FA' : 'Disable 2FA'}
      >
        <label className="mb-1 block text-sm text-gray-600">Enter 6-digit code</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-lg tracking-widest outline-none focus:ring-2 focus:ring-brand"
          placeholder="000000"
          autoComplete="one-time-code"
        />
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={submitOtp}
            loading={enableMut.isPending || disableMut.isPending}
          >
            Submit
          </Button>
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setOtpOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
