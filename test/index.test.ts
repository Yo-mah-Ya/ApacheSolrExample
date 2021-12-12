import { initializeSolrClient } from "../src/solr";
import { FilmsIndex, FilmsDocument } from "./cores/films";
import { withTestData } from "./util";
import { testData } from "./test-data";
import { isNotNullish } from "../src/util";
import * as Logger from "../src/logger";

describe("SolrClient", () => {
    const core = "films";
    const client = initializeSolrClient<FilmsIndex, FilmsDocument>(core);
    test("StandardQuery", async () => {
        await withTestData(client, testData, async () => {
            const standardQueryResponse = await client.select(
                client.buildEdismaxQuery({
                    indent: true,
                    wt: "json",
                    q: "*:*",
                    qf: [{ field: "genre", weight: 5 }],
                    fl: ["id", "name", "initial_release_date"],
                    sort: [{ field: "id", order: "desc" }],
                    fq: [
                        client.dateRangeMatch("initial_release_date", {
                            fromEq: true,
                            toEq: true,
                            from: new Date("2010-01-01").toISOString(),
                            to: new Date("2010-12-31").toISOString(),
                        }),
                    ].filter(isNotNullish),
                })
            );
            Logger.info({
                message: JSON.stringify(
                    standardQueryResponse.response.docs.slice(0, 5)
                ),
            });

            const groupResponse = await client.groupQuery(
                client.buildSolrGroupQuery({
                    group: {
                        sort: { field: "id", order: "desc" },
                        field: ["name"],
                        ngroups: true,
                        limit: 100,
                    },
                })
            );
            Logger.info({
                message: JSON.stringify(
                    groupResponse.grouped.name.groups.slice(0, 5)
                ),
            });

            const facetGroupResponse = await client.groupFacetQuery(
                client.buildSolrGroupFacetQuery({
                    group: {
                        sort: { field: "id", order: "desc" },
                        field: ["name"],
                        ngroups: true,
                        limit: 100,
                        truncate: true,
                    },
                    facet: {
                        name: {
                            type: "terms",
                            field: "name",
                            limit: -1,
                        },
                    },
                })
            );
            Logger.info({
                message: JSON.stringify(
                    facetGroupResponse.facets.name?.buckets.slice(0, 5)
                ),
            });
        });
    });
});
