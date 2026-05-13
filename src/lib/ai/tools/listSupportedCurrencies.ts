import { tool } from "ai";
import { z } from "zod";
import { CURRENCIES } from "@/constants/currency";

interface ListSupportedCurrenciesParams {
  /** User's current account currency (ISO 4217), for context in the tool result */
  accountCurrencyCode: string;
}

export const createListSupportedCurrenciesTool = ({
  accountCurrencyCode,
}: ListSupportedCurrenciesParams) =>
  tool({
    description:
      "List every account currency AiXpense supports (ISO code, symbol, full name, region). Use when the user asks which currencies we support, whether a specific currency is available, or how currency works in the app. To switch currency, users use Settings → Profile in the app.",
    inputSchema: z.object({}),
    execute: async () => {
      return {
        success: true,
        accountCurrencyCode,
        supportedCount: CURRENCIES.length,
        currencies: CURRENCIES.map((c) => ({
          code: c.code,
          symbol: c.symbol,
          name: c.name,
          country: c.country,
          flag: c.flag,
        })),
      };
    },
  });
