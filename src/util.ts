import * as Logger from "./logger";

export const isNotNullish = <T>(value: T): value is NonNullable<T> =>
    value != undefined;

export const isObject = (data: unknown): data is Record<PropertyKey, unknown> =>
    typeof data === "object" && data !== null && !Array.isArray(data);

export const errorMessageOf = (error: unknown): string =>
    error instanceof Error ? error.message : "unknown error";

export const unexpectedDefault = <T>(
    unknownValue: never,
    defaultValue: T
): T => {
    Logger.warn({
        message: `unknown value : ${
            typeof unknownValue === "string"
                ? unknownValue
                : JSON.stringify(unknownValue)
        }`,
        callSite: {
            file: __filename,
            function: unexpectedDefault.name,
        },
    });
    return defaultValue;
};

export function toNumber(n: number): number;
export function toNumber(n: string): number | undefined;
export function toNumber(n: string | undefined): number | undefined;
export function toNumber(n: number | string | undefined): number | undefined {
    if (typeof n === "number") return n;
    const res = Number(n);
    return Number.isNaN(res) || typeof n !== "string" ? undefined : res;
}

export const fulfilledOnly = async <T>(
    promises: Array<Promise<T | undefined>>
): Promise<T[]> =>
    (await Promise.allSettled(promises))
        .map((result) =>
            result.status === "fulfilled" ? result.value : undefined
        )
        .filter(isNotNullish);

export const omitNullish = <T>(
    obj: Record<PropertyKey, T | undefined | null>
): Record<PropertyKey, T> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value != undefined)
    ) as Record<PropertyKey, T>;

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    properties: readonly K[]
): Pick<T, K> =>
    !Object.keys(obj).length
        ? obj
        : properties.reduce((acc, name) => {
              if (name in obj) {
                  acc[name] = obj[name];
              }
              return acc;
          }, {} as Pick<T, K>);

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    properties: readonly K[]
): Omit<T, K> => {
    const set = new Set(properties as readonly string[]);
    return !Object.keys(obj).length
        ? obj
        : (Object.entries(obj).reduce((acc, [name, value]) => {
              if (!set.has(name)) {
                  acc[name] = value;
              }
              return acc;
          }, {} as Record<string, unknown>) as Omit<T, K>);
};

export const sleep = (milliseconds: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });

export const promiseRetry = async <T = undefined>(
    func: () => Promise<T>,
    options: { retries: number; delay?: number }
): Promise<T> => {
    // Do not retry more than 10 times in any cases
    options.retries = options.retries > 10 ? 10 : options.retries;
    while (0 <= options.retries) {
        try {
            return await func();
        } catch (error) {
            options.retries--;
            if (0 <= options.retries) {
                Logger.warn({
                    message: errorMessageOf(error),
                    callSite: {
                        file: __filename,
                        function: promiseRetry.name,
                    },
                });
                await sleep(options.delay ?? 1000);
                continue;
            }
            throw error;
        }
    }
    throw new Error(`Failed to Promise Retry`);
};

export const assertGetEnvValueFrom = (key: string): string => {
    if (typeof key !== "string")
        throw new Error(
            `Cannot get Environment Value. key: ${key} is not string`
        );
    const value = process.env[key];
    if (value == undefined)
        throw new Error(
            `Cannot get Environment Value. value is undefined, key: ${key}`
        );
    return value;
};
