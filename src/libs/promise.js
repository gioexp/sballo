// export const retryPromise = (fn, params, maxRetry = 3, timeout = 200) => {
//     return new Promise((resolve, reject) => {
//         fn(...params)
//             .then(resolve)
//             .catch(error => {
//                 if (maxRetry === 0) reject(error);
//                 setTimeout(() => {
//                     console.log("retry: " + maxRetry);
//                     return retryPromise(fn, params, maxRetry - 1, timeout);
//                 }, timeout);
//             });
//     });
// };

export const retryPromise = (fn, params, maxRetry = 3, timeout = 200) => {
    let promise = Promise.reject();
    for (let i = 0; i < maxRetry; i++) {
        promise = promise.catch(() => fn(...params));
    }
    promise.catch(() => {
        throw new Error(`Failed retrying ${maxRetry} times`);
    });
    return promise;
};