import winston from "winston";
import * as fs from "fs";
import * as path from "path";

const logDir = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message}\n${stack}`
      : `${timestamp} [${level}]: ${message}`;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: fileFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    }),
    new winston.transports.File({
      filename: path.join(logDir, "framework.log"),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5
    })
  ],
  exitOnError: false
});

/**
 * Create scenario-specific child logger
 */
export const createScenarioLogger = (
  scenarioName: string,
  scenarioId: string
) => {
  return logger.child({
    scenario: scenarioName,
    scenarioId
  });
};
