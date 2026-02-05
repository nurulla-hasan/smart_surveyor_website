I will fix the type errors in `src/app/(dashboard)/bookings/page.tsx` by ensuring all `searchParams` values are properly checked before use.

### Changes
- **Update `src/app/(dashboard)/bookings/page.tsx`**:
    - Add type guards (e.g., `typeof ... === 'string'`) for `month`, `year`, `page`, `limit`, `tab`, and `date` to ensure they are single strings before processing.
    - This will resolve the `parseInt` type error and ensure type safety for all other parameters extracted from `searchParams`.

This approach ensures the code is robust against unexpected `string[]` values in the URL.