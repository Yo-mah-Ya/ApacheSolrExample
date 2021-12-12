import * as Util from "./util";

describe("Util", () => {
    test("isNotNullish", () => {
        expect(Util.isNotNullish(undefined)).toBeFalsy();
        expect(Util.isNotNullish(null)).toBeFalsy();
    });
    test("isObject", () => {
        expect(Util.isObject({})).toBeTruthy();
        expect(Util.isObject({ a: "a" })).toBeTruthy();
        expect(Util.isObject("string")).toBeFalsy();
        expect(Util.isObject(0)).toBeFalsy();
        expect(Util.isObject(undefined)).toBeFalsy();
        expect(Util.isObject(null)).toBeFalsy();
        expect(Util.isObject([])).toBeFalsy();
        expect(Util.isObject(() => {})).toBeFalsy();
        expect(Util.isObject(Error)).toBeFalsy();
        expect(Util.isObject(Date)).toBeFalsy();
    });
    test("errorMessageOf", () => {
        expect(Util.errorMessageOf(new Error("test error"))).toBe("test error");
        expect(Util.errorMessageOf("test error")).toBe("unknown error");
    });
    test("unexpectedDefault", () => {
        const error = new Error("test error");
        expect(Util.unexpectedDefault("unexpected" as never, error)).toBe(
            error
        );
        expect(Util.unexpectedDefault(0 as never, error)).toBe(error);
    });
    test("isNumber", () => {
        expect(Util.toNumber("string")).toBe(undefined);
        expect(Util.toNumber("0")).toBe(0);
        expect(Util.toNumber("100")).toBe(100);
        expect(Util.toNumber("100.0")).toBe(100.0);
        expect(Util.toNumber(0)).toBe(0);
        expect(Util.toNumber(100)).toBe(100);
        expect(Util.toNumber(100.0)).toBe(100.0);
        expect(Util.toNumber(undefined)).toBe(undefined);
    });
    test("fulfilledOnly", async () => {
        expect(
            await Util.fulfilledOnly([
                Promise.resolve(1),
                Promise.reject(new Error("failed")),
                Promise.resolve(3),
                Promise.resolve(undefined),
            ])
        ).toStrictEqual(expect.arrayContaining([1, 3]));
    });
    test("omitNullish", () => {
        expect(Util.omitNullish({ a: "a", b: 0, c: undefined })).toStrictEqual({
            a: "a",
            b: 0,
        });
        expect(Util.omitNullish({ a: "a", b: 0, c: null })).toStrictEqual({
            a: "a",
            b: 0,
        });
    });
    test("pick", () => {
        expect(Util.pick({ a: "a" }, ["a"])).toStrictEqual({ a: "a" });
        expect(Util.pick({ a: "a", b: 0 }, ["a"])).toStrictEqual({ a: "a" });
        expect(
            Util.pick({ a: "a", b: { a: "a", b: [0, 1, 2] } }, ["b"])
        ).toStrictEqual({ b: { a: "a", b: [0, 1, 2] } });
    });
    test("omit", () => {
        expect(Util.omit({ a: "a" }, ["a"])).toStrictEqual({});
        expect(Util.omit({ a: "a", b: 0 }, ["b"])).toStrictEqual({ a: "a" });
        expect(
            Util.omit({ a: "a", b: { a: "a", b: [0, 1, 2] } }, ["a"])
        ).toStrictEqual({ b: { a: "a", b: [0, 1, 2] } });
    });
});
