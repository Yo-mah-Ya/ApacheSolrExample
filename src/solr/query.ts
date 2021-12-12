import { CommonIndex, CommonDocument } from "./common-core";
import {
    Sort,
    StandardQuery,
    EdismaxQuery,
    GroupQuery,
    GroupFacetQuery,
    SolrStandardQuery,
    SolrEdismaxQuery,
    SolrGroupQuery,
    SolrGroupFacetQuery,
} from "./read-request";

export type WildCardAnd<T> = T | "*";
export type RangeMatch<V> = {
    fromEq: boolean;
    from?: V;
    toEq: boolean;
    to?: V;
};

/**
 * Build Request Query
 */
const sortWith = <I extends CommonIndex>(s: Sort<I>): string =>
    `${s.field.toString()} ${s.order}`;
export const buildStandardQuery = <
    I extends CommonIndex,
    D extends CommonDocument
>(
    query: StandardQuery<I, D>
): SolrStandardQuery<I> => ({
    q: query.q ?? "*:*",
    "q.op": query["q.op"] ?? "OR",
    fq: query.fq,
    start: query.start,
    rows: query.rows,
    sort: query.sort ? query.sort.map(sortWith).join(",") : undefined,
    fl: query.fl ? query.fl.join(",") : undefined,
    group: false,
    indent: query.indent,
    wt: query.wt ?? "json",
    // spatial search
    spatial: query.spatial,
    pt: query.pt ? `${query.pt.latitude},${query.pt.longitude}` : undefined,
    d: query.d,
    shield: query.shield,
});
export const buildEdismaxQuery = <
    I extends CommonIndex,
    D extends CommonDocument
>(
    query: EdismaxQuery<I, D>
): SolrEdismaxQuery<I> => ({
    ...buildStandardQuery(query),
    qf: query.qf
        ?.map(({ weight, field }) =>
            weight ? `${field.toString()}^${weight}` : field
        )
        .join(" "),
    defType: "edismax",
});
export const buildSolrGroupQuery = <
    I extends CommonIndex,
    D extends CommonDocument,
    GF extends keyof I
>(
    query: GroupQuery<I, D, GF>
): SolrGroupQuery<I, GF> => ({
    ...buildStandardQuery(query),
    group: true,
    "group.format": "grouped",
    "group.field": query.group.field,
    "group.sort": query.group.sort ? sortWith(query.group.sort) : undefined,
    "group.ngroups": query.group.ngroups,
    "group.limit": query.group.limit ?? undefined,
});
export const buildSolrGroupFacetQuery = <
    I extends CommonIndex,
    D extends CommonDocument,
    GF extends keyof I
>(
    query: GroupFacetQuery<I, D, GF>
): SolrGroupFacetQuery<I, GF> => ({
    ...buildSolrGroupQuery(query),
    "group.truncate": query.group.truncate,
    "json.facet": JSON.stringify(query.facet),
});

/**
 * Build Base Query
 */
const stringFilterQuery = <I extends CommonIndex, F extends keyof I>(query: {
    field: F;
    value: string;
}): string => `${query.field}:${query.value}`;

const stringEscape = (value: string): string =>
    `"${value.replace(/\\/g, "").replace(/"/g, '\\"')}"`;

const escapeValue = <I extends CommonIndex, F extends keyof I>(
    value: I[F]
): string =>
    typeof value === "string" ? stringEscape(value) : value.toString();

export const matchWith =
    <I extends CommonIndex>() =>
    <F extends keyof I>(field: F, value: WildCardAnd<I[F]>): string =>
        stringFilterQuery({
            field: field.toString(),
            value: value === "*" ? value : escapeValue(value),
        });

export const unMatchWith =
    <I extends CommonIndex>() =>
    <F extends keyof I>(field: F, value: WildCardAnd<I[F]>): string =>
        stringFilterQuery({
            field: `-${field}`,
            value: value === "*" ? value : escapeValue(value),
        });

export const multiMatchWith =
    <I extends CommonIndex>() =>
    <F extends keyof I>(field: F, value: I[F][]): string =>
        stringFilterQuery({
            field: field.toString(),
            value: `(${value.map(escapeValue).join(" ")})`,
        });

const rangeValueFrom = (query: RangeMatch<string | number>): string =>
    `${query.fromEq ? "[" : "{"}${query.from} TO ${query.to}${
        query.toEq ? "]" : "}"
    }`;

export const rangeMatchWith =
    <I extends CommonIndex>() =>
    <F extends keyof I>(
        field: F,
        range: RangeMatch<WildCardAnd<I[F]>>
    ): string =>
        stringFilterQuery({
            field: field.toString(),
            value: rangeValueFrom({
                ...range,
                from:
                    range.from == undefined || range.from === "*"
                        ? "*"
                        : escapeValue(range.from),
                to:
                    range.to == undefined || range.to === "*"
                        ? "*"
                        : escapeValue(range.to),
            }),
        });

export const dateRangeMatchWith =
    <I extends CommonIndex>() =>
    <F extends keyof I>(field: F, range: RangeMatch<"NOW" | I[F]>): string =>
        stringFilterQuery({
            field: field.toString(),
            value: rangeValueFrom({
                ...range,
                from:
                    range.from === "NOW" || range.from === "*"
                        ? range.from
                        : range.from == undefined
                        ? "*"
                        : escapeValue(range.from),
                to:
                    range.to === "NOW" || range.to === "*"
                        ? range.to
                        : range.to == undefined
                        ? "*"
                        : escapeValue(range.to),
            }),
        });
