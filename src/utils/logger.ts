export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogMetadata = {
  [key: string]: unknown;
  requestId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  error?: Error | unknown;
};

const COLORS = {
  RESET: "\x1b[0m",
  DIM: "\x1b[2m",
  BRIGHT: "\x1b[1m",
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
} as const;

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: COLORS.CYAN,
  info: COLORS.GREEN,
  warn: COLORS.YELLOW,
  error: COLORS.RED,
};

function formatMetadata(metadata: LogMetadata): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined) continue;

    if (key === "error" && value instanceof Error) {
      parts.push(`\n${COLORS.RED}Error: ${value.message}${COLORS.RESET}`);
    } else if (typeof value === "object") {
      parts.push(`${key}=${JSON.stringify(value)}`);
    } else {
      parts.push(`${key}=${value}`);
    }
  }

  return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}

export type Logger = {
  debug: (message: string, metadata?: LogMetadata) => void;
  info: (message: string, metadata?: LogMetadata) => void;
  warn: (message: string, metadata?: LogMetadata) => void;
  error: (message: string, metadata?: LogMetadata) => void;
};

export function createLogger(category: string): Logger {
  const log = (
    level: LogLevel,
    message: string,
    metadata?: LogMetadata,
  ): void => {
    const timestamp = new Date().toISOString();
    const color = LEVEL_COLORS[level];
    const levelStr = level.toUpperCase().padEnd(5);
    const metadataStr = metadata ? formatMetadata(metadata) : "";

    const logLine = `${COLORS.DIM}[${timestamp}]${COLORS.RESET} ${color}${levelStr}${COLORS.RESET} ${COLORS.BRIGHT}[${category}]${COLORS.RESET} ${message}${metadataStr}`;

    if (level === "error" || level === "warn") {
      console.error(logLine);
    } else {
      console.log(logLine);
    }
  };

  return {
    debug: (message: string, metadata?: LogMetadata) =>
      log("debug", message, metadata),
    info: (message: string, metadata?: LogMetadata) =>
      log("info", message, metadata),
    warn: (message: string, metadata?: LogMetadata) =>
      log("warn", message, metadata),
    error: (message: string, metadata?: LogMetadata) =>
      log("error", message, metadata),
  };
}
