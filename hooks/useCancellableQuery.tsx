import { QueryOptions, ApolloQueryResult } from "@apollo/client";
import { apolloClient } from "../apollo";

interface CancellablePromise<T> extends Promise<T> {
    cancel: () => void
}

export function useCancellableQuery(options: QueryOptions<any, any>): CancellablePromise<ApolloQueryResult<any>> {
    const abortController = new AbortController()
    const observable = apolloClient.watchQuery({
        ...options,
        fetchPolicy: "no-cache",
        context: {
            fetchOptions: {
                signal: abortController.signal,
            },
            queryDeduplication: false
        }
    });

    let subscription: ZenObservable.Subscription
    let promise = new Promise((resolve, reject) => {
        subscription = observable.subscribe(
            (res) => resolve(res),
            (err) => reject(err)
        )
    }) as CancellablePromise<ApolloQueryResult<any>>
    promise.cancel = () => {
        abortController.abort()
        subscription.unsubscribe()
    }
    return promise;
}