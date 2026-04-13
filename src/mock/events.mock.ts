import type { Event, EventAnalyticsData } from '../types'

export const mockEventsList = {
  status: true,
  data: {
    events: [
      {
        id: 1,
        title: 'Freetown Music Night',
        description: 'Live music and food in the capital.',
        organizer: { name: "TECH'N GOODWIL LTD", role: 'Creator' },
        venue: 'National Stadium',
        image_url: '',
        start_date: '25 Nov 2025',
        start_time: '09:00 PM',
        end_date: '26 Nov 2025',
        end_time: '11:00 PM',
        tickets: { categories: 1, sold: 10, max_tickets: null },
        status: 'active' as const,
        public_url: 'https://app.safulpay.com/e/tickets/demo-1',
      },
      {
        id: 2,
        title: 'Community Workshop',
        description: 'Skills training session.',
        organizer: { name: 'Toluwani Adepoju', role: 'Manager' },
        venue: 'City Hall',
        image_url: '',
        start_date: '10 Dec 2025',
        start_time: '02:00 PM',
        end_date: '10 Dec 2025',
        end_time: '05:00 PM',
        tickets: { categories: 2, sold: 3, max_tickets: 100 },
        status: 'inactive' as const,
        public_url: 'https://app.safulpay.com/e/tickets/demo-2',
      },
    ] satisfies Event[],
  },
}

export const mockEventAnalytics: EventAnalyticsData & { event?: Event } = {
  event: mockEventsList.data.events[0],
  tickets_sold: 10,
  tickets_total_percent: '76.9% of total',
  total_revenue: 1000,
  avg_per_ticket: 100,
  scanned: 0,
  attendance_rate: '0% Attendance Rate',
  unique_buyers: 4,
  tickets_per_buyer: '2.5 tickets/buyer',
  status_breakdown: {
    active: 10,
    inside: 0,
    outside: 0,
    available: 0,
    invalidated: 3,
    total: 13,
  },
  sales_over_time: [
    { date: '2025-11-20', count: 2 },
    { date: '2025-11-21', count: 5 },
    { date: '2025-11-22', count: 3 },
  ],
  revenue_by_category: [{ name: 'General', value: 1000 }],
  category_performance: [
    {
      category: 'General',
      price: 100,
      sold: 10,
      available: 'Unlimited',
      revenue: 1000,
      progress: '-',
    },
  ],
  performance: { avg_price: 100, best_category: 'General' },
  peak: { hour: '06:00', day: 'Monday', velocity: '0.07 tickets/day', attendance: '0%' },
  timeline: {
    days_since_start: -137,
    start: '25 Nov 2025',
    end: '26 Nov 2025',
    projected_revenue: 1000,
  },
  revenue_by_currency: [{ currency: 'SLE', tickets: 10, amount: 1000 }],
  recent_sales: [
    { ticket: 'TKT-001', buyer: 'Jane Doe', amount: 100, time: '2025-11-21 18:00' },
  ],
}

export const mockEventCategories = {
  status: true,
  data: {
    categories: [
      {
        id: 1,
        name: 'General',
        price: 100,
        currency: 'SLE',
        description: 'Standard entry',
        max_tickets: null,
        sold: 10,
        status: 'active',
      },
    ],
  },
}

export const mockEventOrganizers = {
  status: true,
  data: {
    organizers: [
      {
        id: 1,
        name: "TECH'N GOODWIL LTD",
        email: 'info@techengood.com',
        phone: '23278057664',
        role: 'Creator',
        assigned_at: '2025-11-17 05:14 AM',
        is_creator: true,
      },
      {
        id: 2,
        name: 'Toluwani Adepoju',
        email: 'tmedal007@gmail.com',
        phone: '23278672866',
        role: 'Manager',
        assigned_at: '2025-12-24 03:42 AM',
        is_creator: false,
      },
    ],
  },
}

export const mockEventTickets = {
  status: true,
  data: {
    tickets: [
      {
        id: 1,
        ticket_number: 'TKT-GPJ5VINI-1766655717-0',
        category: 'General',
        buyer_name: 'Jane Doe',
        buyer_email: 'jane@example.com',
        buyer_phone: '23278123456',
        price: 100,
        currency: 'SLE',
        status: 'Active',
        image_url: null,
        purchased_at: '2025-11-21 18:00:00',
      },
    ],
  },
}

export const mockCreateEventResponse = {
  status: true,
  data: {
    event: mockEventsList.data.events[0],
  },
}
