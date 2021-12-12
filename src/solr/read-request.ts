import { CommonIndex } from "./common-core";

export type LogicalOperation = "AND" | "OR";

/**
 * For TypeScript Application
 */

export type Sort<Index extends CommonIndex> = {
    field: keyof Index;
    order: "asc" | "desc";
};

type QueryField<I> = {
    field: keyof I;
    weight?: number;
};
export type StandardQuery<Index extends CommonIndex, Document> = {
    q?: string;
    "q.op"?: LogicalOperation;
    fq?: string[];
    qf?: QueryField<Index>[];
    fl?: (keyof Document)[];
    df?: keyof Index;
    wt?: "json" | "xml";
    indent?: "on" | "off" | boolean;
    sort?: Sort<Index>[];
    start?: number;
    rows?: number;
    // spatial search
    spatial?: boolean;
    pt?: { latitude: number; longitude: number };
    d?: number;
    shield?: keyof Index;
};
export interface EdismaxQuery<Index extends CommonIndex, Document>
    extends StandardQuery<Index, Document> {
    qf?: QueryField<Index>[];
}

type Group<Index extends CommonIndex, GroupField extends keyof Index> = {
    field: GroupField[];
    ngroups?: boolean;
    sort?: Sort<Index>;
    limit?: number;
    truncate?: boolean;
};

export interface GroupQuery<
    Index extends CommonIndex,
    Document,
    GroupField extends keyof Index
> extends StandardQuery<Index, Document> {
    group: Group<Index, GroupField>;
}
type Facet<
    Index extends CommonIndex,
    Field extends keyof Index
> = Field extends string
    ? Record<
          Field,
          | {
                type: "terms";
                // The field name to facet over.
                field: Field;
                // Limits the number of buckets returned. Defaults to 10.
                limit: number;
                facet?: Facet<Index, keyof Index>;
                // Specifies how to sort the buckets produced.
                sort?: string;
                // Number of buckets beyond the limit to internally request from shards during a distributed search.
                overrequest?: number;
            }
          | {
                type: "query";
                q: string;
                facet?: Facet<Index, keyof Index>;
            }
          | {
                type: "range";
                // The field name to facet over.
                field: Field;
                start: number;
                end: number;
                gap: number;
                hardend: string;
                other: string;
                include?: string;
                facet?: Facet<Index, keyof Index>;
            }
          | {
                type: "heatmap";
                field: Field;
                geom: string;
                gridLevel: number;
            }
      >
    : never;
export interface GroupFacetQuery<
    Index extends CommonIndex,
    Document,
    GroupField extends keyof Index
> extends StandardQuery<Index, Document> {
    group: Group<Index, GroupField>;
    facet: Facet<Index, keyof Index>;
}

/**
 * For Apache Solr
 */

export type SolrStandardQuery<Index extends CommonIndex> = {
    q?: string;
    "q.op"?: LogicalOperation;
    fq?: string[];
    start?: number;
    rows?: number;
    sort?: string;
    fl?: string;
    wt?: "json" | "xml";
    indent?: "on" | "off" | boolean;
    group?: boolean;
    // spatial search
    spatial?: boolean;
    pt?: string;
    d?: number;
    shield?: keyof Index;
};

export interface SolrEdismaxQuery<Index extends CommonIndex>
    extends SolrStandardQuery<Index> {
    sow?: boolean;
    mm?: string;
    "mm.autoRelax"?: string;
    "q.alt"?: string;
    qf?: string;
    qs?: number;
    ps?: number;
    tie?: number;
    bq?: string;
    bf?: string;
    defType: "edismax";
}

export interface SolrGroupQuery<
    Index extends CommonIndex,
    GroupField extends keyof Index
> extends SolrStandardQuery<Index> {
    // If true, query results will be grouped.
    group: boolean;
    /**
     * The name of the field by which to group results.
     * The field must be single-valued, and either be indexed or a field type that has a value source and works in a function query, such as ExternalFileField.
     * It must also be a string-based field, such as StrField or TextField
     */
    "group.field"?: GroupField[];
    // Group based on the unique values of a function query.
    "group.func"?: string;
    // Return a single group of documents that match the given query.
    "group.query"?: string;
    // Specifies the number of results to return for each group. The default value is 1
    "group.limit"?: number;
    // Specifies an initial offset for the document list of each group.
    "group.offset"?: string;
    //Specifies how Solr sorts documents within each group. The default behavior if group.sort is not specified is to use the same effective value as the sort parameter.
    "group.sort"?: string;
    // If this parameter is set to simple, the grouped documents are presented in a single flat list,
    // and the start and rows parameters affect the numbers of documents instead of groups. An alternate value for this parameter is grouped
    "group.format"?: "grouped" | "simple";
    // response format. if true is past, the response format will be almost the same to usual one
    "group.main"?: boolean;
    // "ngroups" is effective for pagination. this
    "group.ngroups"?: boolean;
    /**
     * Setting this parameter to a number greater than 0 enables caching for result grouping.
     * Result Grouping executes two searches; this option caches the second search.
     * The default value is 0. The maximum value is 100.
     */
    "group.cache.percent"?: number;
}
export interface SolrGroupFacetQuery<
    Index extends CommonIndex,
    GroupField extends keyof Index
> extends SolrGroupQuery<Index, GroupField> {
    // If true, facet counts are based on the most relevant document of each group matching the query. The default value is false.
    "group.truncate"?: boolean;
    // deprecated. There can be a heavy performance cost to this option.
    // https://solr.apache.org/guide/8_1/result-grouping.html
    // group.facet
    "json.facet"?: string;
}

export type StandardHighlight = {
    hl: boolean | "blank";
};
