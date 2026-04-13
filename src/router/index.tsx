import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { TransactionsPage } from '../pages/transactions/TransactionsPage'
import { EventsPage } from '../pages/events/EventsPage'
import { CreateEventPage } from '../pages/events/CreateEventPage.tsx'
import { EditEventPage } from '../pages/events/EditEventPage.tsx'
import { EventAnalyticsPage } from '../pages/events/EventAnalyticsPage.tsx'
import { EventCategoriesPage } from '../pages/events/EventCategoriesPage.tsx'
import { EventOrganizersPage } from '../pages/events/EventOrganizersPage'
import { EventTicketsPage } from '../pages/events/EventTicketsPage'
import { PrintTicketsPage } from '../pages/events/PrintTicketsPage'
import { PaymentLinksPage } from '../pages/paymentLinks/PaymentLinksPage'
import { CreatePaymentLinkPage } from '../pages/paymentLinks/CreatePaymentLinkPage'
import { SinglePaymentPage } from '../pages/singlePayment/SinglePaymentPage'
import { SinglePaymentHistoryPage } from '../pages/singlePayment/SinglePaymentHistoryPage'
import { BulkPaymentsPage } from '../pages/bulkPayments/BulkPaymentsPage'
import { GroupMembersPage } from '../pages/bulkPayments/GroupMembersPage.tsx'
import { AddMemberPage } from '../pages/bulkPayments/AddMemberPage.tsx'
import { EditMemberPage } from '../pages/bulkPayments/EditMemberPage.tsx'
import { RequestLogPage } from '../pages/bulkPayments/RequestLogPage'
import { RequestDetailsPage } from '../pages/bulkPayments/RequestDetailsPage'
import { CreateBulkRequestPage } from '../pages/bulkPayments/CreateBulkRequestPage.tsx'
import { AccountStatementPage } from '../pages/reports/AccountStatementPage'
import { ProfileSettingPage } from '../pages/settings/ProfileSettingPage'
import { PinSettingPage } from '../pages/settings/PinSettingPage'
import { TwoFactorPage } from '../pages/settings/TwoFactorPage'
import { QRCodePage } from '../pages/settings/QRCodePage.tsx'
import { ApiKeyPage } from '../pages/settings/ApiKeyPage.tsx'

function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
        <Route path="/events/:id/analytics" element={<EventAnalyticsPage />} />
        <Route path="/events/:id/categories" element={<EventCategoriesPage />} />
        <Route path="/events/:id/organizers" element={<EventOrganizersPage />} />
        <Route path="/events/:id/tickets" element={<EventTicketsPage />} />
        <Route path="/events/:id/tickets/print" element={<PrintTicketsPage />} />
        <Route path="/payment-links" element={<PaymentLinksPage />} />
        <Route path="/payment-links/create" element={<CreatePaymentLinkPage />} />
        <Route path="/single-payment" element={<SinglePaymentPage />} />
        <Route path="/single-payment/history" element={<SinglePaymentHistoryPage />} />
        <Route path="/bulk-payments" element={<BulkPaymentsPage />} />
        <Route path="/bulk-payments/:id/members" element={<GroupMembersPage />} />
        <Route path="/bulk-payments/:id/members/add" element={<AddMemberPage />} />
        <Route path="/bulk-payments/:id/members/:memberId/edit" element={<EditMemberPage />} />
        <Route path="/bulk-payments/:id/request-log" element={<RequestLogPage />} />
        <Route path="/bulk-payments/:id/request/:tag" element={<RequestDetailsPage />} />
        <Route path="/bulk-payments/:id/request/create" element={<CreateBulkRequestPage />} />
        <Route path="/reports/account-statement" element={<AccountStatementPage />} />
        <Route path="/settings/profile" element={<ProfileSettingPage />} />
        <Route path="/settings/pin" element={<PinSettingPage />} />
        <Route path="/settings/2fa" element={<TwoFactorPage />} />
        <Route path="/settings/qr-code" element={<QRCodePage />} />
        <Route path="/settings/api-key" element={<ApiKeyPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
