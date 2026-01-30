I will implement a more aggressive and intelligent retry mechanism in `serverFetch` to overcome the persistent "Too Many Requests" (429) errors.

### Changes
- **Modify `src/lib/fetcher.ts`**:
    - **Increase Retries**: Set default retries to 5.
    - **Longer Backoff**: Increase wait times significantly (e.g., 3s, 6s, 12s, 24s) to give the server more time to reset the rate limit.
    - **Retry-After Support**: If the server sends a `Retry-After` header, use that value for the delay.
    - **Global Wait (Local)**: Add a simple module-level lock to prevent concurrent requests from hammering the server simultaneously when a rate limit is detected.

This should finally resolve the 429 errors by being more patient and respectful of the server's limits.