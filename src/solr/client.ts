import { CommonIndex, CommonDocument } from "./common-core";
import {
    StandardQuery,
    EdismaxQuery,
    GroupQuery,
    GroupFacetQuery,
    SolrStandardQuery,
    SolrEdismaxQuery,
    SolrGroupQuery,
    SolrGroupFacetQuery,
} from "./read-request";
import { SolrRemoveQuery, SolrUpdateRequest } from "./write-request";
import { Response, GroupResponse, FacetGroupResponse } from "./read-response";
import { AxiosRequestConfig } from "axios";
import * as HttpClient from "../http-client";
import {
    WildCardAnd,
    RangeMatch,
    matchWith,
    unMatchWith,
    multiMatchWith,
    rangeMatchWith,
    dateRangeMatchWith,
    buildStandardQuery,
    buildEdismaxQuery,
    buildSolrGroupQuery,
    buildSolrGroupFacetQuery,
} from "./query";

const solrBaseUrl = process.env.SOLR_BASE_URL ?? "http://localhost:8983/solr";

const select = async <I extends CommonIndex, D extends CommonDocument>(
    core: string,
    params: SolrStandardQuery<I> | SolrEdismaxQuery<I>,
    config?: AxiosRequestConfig
): Promise<Response<D>> =>
    await HttpClient.request<Response<D>>({
        ...config,
        url: `${solrBaseUrl}/${core}/select`,
        params,
    });
const groupQuery = async <
    I extends CommonIndex,
    D extends CommonDocument,
    GF extends keyof I
>(
    core: string,
    params: SolrGroupQuery<I, GF>,
    config?: AxiosRequestConfig
): Promise<GroupResponse<I, D, GF>> =>
    await HttpClient.request<GroupResponse<I, D, GF>>({
        ...config,
        url: `${solrBaseUrl}/${core}/select`,
        params,
    });
const groupFacetQuery = async <
    I extends CommonIndex,
    D extends CommonDocument,
    GF extends keyof I
>(
    core: string,
    params: SolrGroupFacetQuery<I, GF>,
    config?: AxiosRequestConfig
): Promise<FacetGroupResponse<I, D, GF>> =>
    await HttpClient.request<FacetGroupResponse<I, D, GF>>({
        ...config,
        url: `${solrBaseUrl}/${core}/select`,
        params,
    });
const update = async <I extends CommonIndex>(
    core: string,
    data: SolrUpdateRequest<I>[],
    config?: AxiosRequestConfig
): Promise<void> => {
    await HttpClient.request({
        ...config,
        url: `${solrBaseUrl}/${core}/update?commit=true`,
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        data: JSON.stringify(data),
    });
};
const remove = async <I extends CommonIndex>(
    core: string,
    data: SolrRemoveQuery<I>,
    config?: AxiosRequestConfig
): Promise<void> => {
    await HttpClient.request({
        ...config,
        url: `${solrBaseUrl}/${core}/update?commit=true`,
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        data: JSON.stringify(data),
    });
};

export type SolrClient<I extends CommonIndex, D extends CommonDocument> = {
    match: <F extends keyof I>(field: F, value: WildCardAnd<I[F]>) => string;
    unMatch: <F extends keyof I>(field: F, value: WildCardAnd<I[F]>) => string;
    multiMatch: <F extends keyof I>(field: F, value: I[F][]) => string;
    rangeMatch: <F extends keyof I>(
        field: F,
        range: RangeMatch<WildCardAnd<I[F]>>
    ) => string;
    dateRangeMatch: <F extends keyof I>(
        field: F,
        range: RangeMatch<"NOW" | I[F]>
    ) => string;
    buildStandardQuery: (query: StandardQuery<I, D>) => SolrStandardQuery<I>;
    buildEdismaxQuery: (query: EdismaxQuery<I, D>) => SolrEdismaxQuery<I>;
    buildSolrGroupQuery: <GF extends keyof I>(
        query: GroupQuery<I, D, GF>
    ) => SolrGroupQuery<I, GF>;
    buildSolrGroupFacetQuery: <GF extends keyof I>(
        query: GroupFacetQuery<I, D, GF>
    ) => SolrGroupFacetQuery<I, GF>;
    select: (
        params: SolrStandardQuery<I>,
        config?: AxiosRequestConfig
    ) => Promise<Response<D>>;
    groupQuery: <GF extends keyof I>(
        params: SolrGroupQuery<I, GF>,
        config?: AxiosRequestConfig
    ) => Promise<GroupResponse<I, D, GF>>;
    groupFacetQuery: <GF extends keyof I>(
        params: SolrGroupFacetQuery<I, GF>,
        config?: AxiosRequestConfig
    ) => Promise<FacetGroupResponse<I, D, GF>>;
    update: (
        params: SolrUpdateRequest<I>[],
        config?: AxiosRequestConfig
    ) => Promise<void>;
    remove: (
        params: SolrRemoveQuery<I>,
        config?: AxiosRequestConfig
    ) => Promise<void>;
};
export const initializeSolrClient = <
    I extends CommonIndex,
    D extends CommonDocument
>(
    core: string
): SolrClient<I, D> => ({
    // build Base Query
    match: matchWith<I>(),
    unMatch: unMatchWith<I>(),
    multiMatch: multiMatchWith<I>(),
    rangeMatch: rangeMatchWith<I>(),
    dateRangeMatch: dateRangeMatchWith<I>(),
    // build Solr Query
    buildStandardQuery: (query: StandardQuery<I, D>) =>
        buildStandardQuery(query),
    buildEdismaxQuery: (query: EdismaxQuery<I, D>) => buildEdismaxQuery(query),
    buildSolrGroupQuery: <GF extends keyof I>(query: GroupQuery<I, D, GF>) =>
        buildSolrGroupQuery(query),
    buildSolrGroupFacetQuery: <GF extends keyof I>(
        query: GroupFacetQuery<I, D, GF>
    ) => buildSolrGroupFacetQuery(query),
    // read client
    select: (params: SolrStandardQuery<I>, config?: AxiosRequestConfig) =>
        select<I, D>(core, params, config),
    groupQuery: <GF extends keyof I>(
        params: SolrGroupQuery<I, GF>,
        config?: AxiosRequestConfig
    ) => groupQuery<I, D, GF>(core, params, config),
    groupFacetQuery: <GF extends keyof I>(
        params: SolrGroupFacetQuery<I, GF>,
        config?: AxiosRequestConfig
    ) => groupFacetQuery(core, params, config),
    // write client
    update: (params: SolrUpdateRequest<I>[], config?: AxiosRequestConfig) =>
        update<I>(core, params, config),
    remove: (params: SolrRemoveQuery<I>, config?: AxiosRequestConfig) =>
        remove<I>(core, params, config),
});
