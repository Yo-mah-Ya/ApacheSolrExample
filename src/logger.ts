type LogMessage = {
    message: string;
    callSite?: {
        file: string;
        function?: string;
        line?: string;
    };
};

enum LogLevel {
    Trace = "TRACE",
    Debug = "DEBUG",
    Info = "INFO",
    Warn = "WARN",
    Error = "ERROR",
    Critical = "CRITICAL",
}
const messageWith =
    (paramLogLevel: LogLevel) =>
    <T extends LogMessage>(message: T): void => {
        console.log(
            `[${paramLogLevel}] ${new Date().toISOString()} ${JSON.stringify(
                message
            )}`
        );
    };

export const trace = messageWith(LogLevel.Trace);
export const debug = messageWith(LogLevel.Debug);
export const info = messageWith(LogLevel.Info);
export const warn = messageWith(LogLevel.Warn);
export const error = messageWith(LogLevel.Error);
export const critical = messageWith(LogLevel.Critical);
