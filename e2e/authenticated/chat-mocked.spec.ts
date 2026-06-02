import { test, expect } from "@playwright/test";

test.describe("Chat (mocked API)", () => {
  test("sends user message and renders mocked assistant reply", async ({
    page,
  }) => {
    let chatMockHit = false;
    await page.route("**/api/user/trials", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ freeTrials: 99, isPremium: true }),
      });
    });

    await page.route("**/api/chat", async (route) => {
      chatMockHit = true;
      const streamBody = [
        'data: {"type":"start","messageId":"m1"}\n',
        'data: {"type":"text-start","id":"t1"}\n',
        'data: {"type":"text-delta","id":"t1","delta":"Mock assistant reply from Playwright"}\n',
        'data: {"type":"text-end","id":"t1"}\n',
        'data: {"type":"finish"}\n',
        "\n",
      ].join("");

      await route.fulfill({
        status: 200,
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache",
          connection: "keep-alive",
        },
        body: streamBody,
      });
    });

    await page.goto("/aixpense");
    await expect(page.getByText("What can I help")).toBeVisible();

    await page
      .getByPlaceholder("Coffee 50  or  Salary received 55000")
      .fill("Uber 650");

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText("Uber 650").first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(chatMockHit).toBeTruthy();
  });
});
