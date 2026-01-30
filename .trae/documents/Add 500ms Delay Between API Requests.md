I will add a 500ms delay between sequential API requests in both the Bookings and Dashboard pages to ensure the server's rate limit is not exceeded.

### Changes
- **Define `sleep` helper**: Create a small utility to pause execution.
- **Update `src/app/(dashboard)/bookings/page.tsx`**:
    - Add `await sleep(500)` after `getCalendarData`.
    - Add `await sleep(500)` after the main `getBookings` call.
- **Update `src/app/(dashboard)/dashboard/page.tsx`**:
    - Add `await sleep(500)` after `getDashboardStats`.
    - Add `await sleep(500)` after `getMonthlyStats`.

This controlled delay will provide a safer buffer for the backend API, effectively preventing the 429 error.