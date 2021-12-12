import { CommonDocument, CommonIndex } from "./common-core";

export type Response<Document extends CommonDocument> = {
    responseHeader: SolrResponseHeader;
    response: SolrResponse<Document>;
};
type SolrResponseHeader = {
    status: number;
    QTime: number;
    params: Record<string, string>;
};

type SolrResponse<Document extends CommonDocument> = {
    numFound: number;
    start: number;
    docs: Document[];
    maxScore?: number;
    numFoundExact?: boolean;
};

// Grouping
type GroupResponseGroupList<
    Index extends CommonIndex,
    Document extends CommonDocument,
    GroupField extends keyof Index
> = {
    matches: number;
    ngroups?: number;
    groups: {
        groupValue: Index[GroupField];
        doclist: {
            numFound: number;
            start: number;
            docs: Document[];
        };
    }[];
};
export type GroupResponse<
    Index extends CommonIndex,
    Document extends CommonDocument,
    GroupField extends keyof Index
> = {
    responseHeader: SolrResponseHeader;
    grouped: Record<
        GroupField,
        GroupResponseGroupList<Index, Document, GroupField>
    >;
};

// Facet Grouping
type FacetResponseFacetBucket<Document> = {
    val: string;
    count: number;
} & Record<keyof Document, FacetResponseFacet<Document>>;
type FacetResponseFacet<Document> =
    | { buckets: FacetResponseFacetBucket<Document>[] }
    | undefined;

export interface FacetGroupResponse<
    Index extends CommonIndex,
    Document extends CommonDocument,
    GroupField extends keyof Index
> extends GroupResponse<Index, Document, GroupField> {
    facets: { count: number } & Record<
        keyof Document,
        FacetResponseFacet<Document>
    >;
}
