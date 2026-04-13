import { Toaster } from 'react-hot-toast'

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: '!text-sm',
        success: {
          style: {
            background: '#10B981',
            color: '#fff',
          },
          iconTheme: { primary: '#fff', secondary: '#10B981' },
        },
        error: {
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          iconTheme: { primary: '#fff', secondary: '#EF4444' },
        },
      }}
    />
  )
}
