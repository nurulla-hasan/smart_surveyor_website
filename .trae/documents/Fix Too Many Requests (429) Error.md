I will resolve the "Too Many Requests" (429) error by refactoring the data fetching logic in `BookingsPage`.

### Changes
- **Update `src/app/(dashboard)/bookings/page.tsx`**:
    - **Remove `Promise.all`**: Change the data fetching from parallel to sequential. This will prevent triggering the backend's rate limit caused by simultaneous requests.
    - **Optimize Redundant Requests**: If the active tab is "pending", I will skip the extra `getBookings({ filter: "pending", limit: "1" })` call and instead use the total items count from the main bookings response.
    - **Sequential Fetching**:
        1. Fetch `calendarResponse`.
        2. Fetch `bookingsResponse`.
        3. Fetch `pendingCountResponse` (only if not already fetching pending bookings).

This approach ensures the backend is not overwhelmed and the page loads successfully without rate limit errors.