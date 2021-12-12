import { initializeSolrClient } from "./client";

type TestIndex = {
    id: string;
    name: string;
    age?: number;
    nationality?: string;
    birthDate?: string;
    isMarried?: "true" | "false";
};

describe("", () => {
    const client = initializeSolrClient<TestIndex, TestIndex>("films");
    test("match", () => {
        expect(client.match("id", "test-id")).toEqual(`id:"test-id"`);
        expect(client.match("id", "*")).toEqual(`id:*`);
        expect(client.match("age", 10)).toEqual(`age:10`);
        expect(client.match("age", "*")).toEqual(`age:*`);
    });
    test("unMatch", () => {
        expect(client.unMatch("id", "test-id")).toEqual(`-id:"test-id"`);
        expect(client.unMatch("id", "*")).toEqual(`-id:*`);
        expect(client.unMatch("age", 10)).toEqual(`-age:10`);
        expect(client.unMatch("age", "*")).toEqual(`-age:*`);
    });
    test("multiMatch", () => {
        expect(client.multiMatch("id", ["test-id1", "test-id2"])).toEqual(
            `id:("test-id1" "test-id2")`
        );
        expect(client.multiMatch("age", [10, 20])).toEqual(`age:(10 20)`);
    });
    test("rangeMatch", () => {
        // from and to test
        expect(
            client.rangeMatch("id", {
                fromEq: true,
                toEq: true,
                from: "test-id1",
                to: "test-id2",
            })
        ).toEqual(`id:["test-id1" TO "test-id2"]`);
        expect(
            client.rangeMatch("id", {
                fromEq: true,
                toEq: true,
                to: "test-id2",
            })
        ).toEqual(`id:[* TO "test-id2"]`);
        expect(
            client.rangeMatch("id", {
                fromEq: true,
                toEq: true,
                from: "test-id1",
            })
        ).toEqual(`id:["test-id1" TO *]`);
        expect(
            client.rangeMatch("age", {
                fromEq: true,
                toEq: true,
                from: 10,
                to: 20,
            })
        ).toEqual(`age:[10 TO 20]`);
        expect(
            client.rangeMatch("age", {
                fromEq: true,
                toEq: true,
                to: 20,
            })
        ).toEqual(`age:[* TO 20]`);
        expect(
            client.rangeMatch("age", {
                fromEq: true,
                toEq: true,
                from: 10,
            })
        ).toEqual(`age:[10 TO *]`);
        expect(
            client.rangeMatch("age", {
                fromEq: true,
                toEq: true,
            })
        ).toEqual(`age:[* TO *]`);
        // fromEq and toEq test
        expect(
            client.rangeMatch("age", {
                fromEq: false,
                toEq: true,
                from: 10,
                to: 20,
            })
        ).toEqual(`age:{10 TO 20]`);
        expect(
            client.rangeMatch("age", {
                fromEq: true,
                toEq: false,
                from: 10,
                to: 20,
            })
        ).toEqual(`age:[10 TO 20}`);
        expect(
            client.rangeMatch("age", {
                fromEq: false,
                toEq: false,
                from: 10,
                to: 20,
            })
        ).toEqual(`age:{10 TO 20}`);
    });
    test("dateRangeMatch", () => {
        expect(
            client.dateRangeMatch("birthDate", {
                fromEq: true,
                toEq: true,
                from: "NOW",
                to: "NOW",
            })
        ).toEqual(`birthDate:[NOW TO NOW]`);
        expect(
            client.dateRangeMatch("birthDate", {
                fromEq: true,
                toEq: true,
                from: new Date("2000-01-01T00:00:00.000Z").toISOString(),
                to: new Date("2010-01-01T00:00:00.000Z").toISOString(),
            })
        ).toEqual(
            `birthDate:["2000-01-01T00:00:00.000Z" TO "2010-01-01T00:00:00.000Z"]`
        );
        expect(
            client.dateRangeMatch("birthDate", {
                fromEq: true,
                toEq: true,
            })
        ).toEqual(`birthDate:[* TO *]`);
    });
});
