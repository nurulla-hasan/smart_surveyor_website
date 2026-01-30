I will implement a robust retry mechanism in `serverFetch` to handle the "Too Many Requests" (429) error globally.

### Changes
- **Modify `src/lib/fetcher.ts`**:
    - Add a `sleep` helper function to create delays.
    - Wrap the `fetch` call and response handling in a loop that allows for retries (up to 3 times).
    - Specifically, if the response status is `429`, the function will wait for 1 second before retrying the request.
    - If it still fails after 3 retries, it will throw the error as usual.

This global solution will handle rate limits automatically across the entire application, whether they occur in parallel or sequential requests.