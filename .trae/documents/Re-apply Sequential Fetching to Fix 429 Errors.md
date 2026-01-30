I will fix the "Too Many Requests" error by ensuring both the Bookings and Dashboard pages use sequential fetching. I accidentally reverted these changes earlier, which is why the error persisted.

### Corrective Steps
- **Update `src/app/(dashboard)/bookings/page.tsx`**:
    - Remove `Promise.all` and fetch `calendarData`, `bookings`, and `pendingCount` one after another.
    - Optimize by skipping the `pendingCount` request if the user is already on the "pending" tab.
- **Update `src/app/(dashboard)/dashboard/page.tsx`**:
    - Remove `Promise.all` and fetch `dashboardStats`, `monthlyStats`, and `calendarData` sequentially.

This will ensure that the server is not hit with multiple simultaneous requests from the same page load, effectively staying within the rate limits.