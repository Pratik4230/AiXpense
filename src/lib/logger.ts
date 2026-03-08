import { connectDB } from "@/lib/db";
import { AppLog, LogEvent, LogLevel } from "@/models/AppLog";

interface LogPayload {
  userId?: string;
  data?: Record<string, unknown>;
  error?: unknown;
}

function serializeError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function truncateData(
  data?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!data) return undefined;
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === "string" && val.length > 500) {
      result[key] = val.slice(0, 500) + "…";
    } else {
      result[key] = val;
    }
  }
  return result;
}

async function writeLog(
  level: LogLevel,
  event: LogEvent,
  payload: LogPayload,
) {
  try {
    await connectDB();
    await AppLog.create({
      level,
      event,
      userId: payload.userId,
      data: truncateData(payload.data),
      error: serializeError(payload.error),
    });
  } catch {
  }
}

export const logger = {
  info(event: LogEvent, payload: LogPayload = {}) {
    void writeLog("info", event, payload);
  },
  warn(event: LogEvent, payload: LogPayload = {}) {
    void writeLog("warn", event, payload);
  },
  error(event: LogEvent, payload: LogPayload = {}) {
    console.error(`[${event}]`, payload.error ?? payload.data);
    void writeLog("error", event, payload);
  },
};
