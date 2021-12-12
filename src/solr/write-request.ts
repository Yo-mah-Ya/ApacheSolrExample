import { CommonIndex } from "./common-core";

export type SolrUpdateRequest<I extends CommonIndex> =
    | { [F in keyof I]: I[F] }
    | {
          add: {
              doc: {
                  [F in keyof I]: I[F] | { boost: number; value: I[F] };
              };
              boost?: number;
          };
      };

export type SolrRemoveQuery<I extends CommonIndex> = {
    delete:
        | {
              [F in keyof I]: I[F];
          }
        | {
              query: string;
          };
};
