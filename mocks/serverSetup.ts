import { server } from "./mswServer";

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
