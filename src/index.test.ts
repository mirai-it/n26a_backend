import { testClient } from "hono/testing";
import app from ".";

describe("/ test", () => {
  it("GET /", async () => {
    const res = await testClient(app);
    console.log(res.json())
  });
});
