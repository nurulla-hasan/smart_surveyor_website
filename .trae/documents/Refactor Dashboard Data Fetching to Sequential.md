I will resolve the remaining "Too Many Requests" (429) errors by refactoring the `DashboardPage` to fetch data sequentially, similar to the fix I applied to the `BookingsPage`.

### Changes
- **Update `src/app/(dashboard)/dashboard/page.tsx`**:
    - Replace `Promise.all` with sequential `await` calls for `getDashboardStats()`, `getMonthlyStats()`, and `getCalendarData()`.
    - This will ensure that dashboard requests are also staggered, preventing them from hitting the rate limit simultaneously with other requests.

This change, combined with the previous fix in `BookingsPage`, will significantly reduce the number of concurrent API requests and help avoid 429 errors across the dashboard.