import { createLogger, format, transports } from "winston";
import { networkInterfaces } from "os";

const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

const log = (level) => {
  const service = `metadata-${process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV}`;

  const logger = createLogger({
    exitOnError: false,
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.json()
    ),
    transports: [
      process.env.DATADOG_API_KEY
        ? new transports.Http({
            host: "http-intake.logs.datadoghq.com",
            path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${service}`,
            ssl: true,
          })
        : // Fallback to logging to standard output
          new transports.Console(),
    ],
  });

  return (component, message) =>
    logger.log(level, message, {
      component,
      version: process.env.npm_package_version,
      networkInterfaces: results,
      railwaySnapshotId: process.env.RAILWAY_SNAPSHOT_ID,
    });
};

export const logger = {
  error: log("error"),
  info: log("info"),
  warn: log("warn"),
};
