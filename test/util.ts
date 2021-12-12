import { SolrClient } from "../src/solr";
import { CommonIndex, CommonDocument } from "../src/solr/common-core";

const removeAll = async <I extends CommonIndex, D extends CommonDocument>(
    client: SolrClient<I, D>
): Promise<void> => await client.remove({ delete: { query: "*:*" } });

export const withTestData = async <
    I extends CommonIndex,
    D extends CommonDocument
>(
    client: SolrClient<I, D>,
    testData: I[],
    func: () => Promise<void>
): Promise<void> => {
    await removeAll(client);
    await client.update(testData);
    await func();
    await removeAll(client);
};
