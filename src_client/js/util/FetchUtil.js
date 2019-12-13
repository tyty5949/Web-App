import React from 'react';
import {
  withScope as SentryWithScope,
  captureException as SentryCaptureException
} from '@sentry/browser';

const verifyResOk = res => {
  if (!res.ok) {
    // If response has status >= 300, build error and throw it
    const error = new Error(`${res.status} ${res.statusText}`);
    error.status = res.status;
    error.statusText = res.statusText;
    error.url = res.url;
    throw error;
  }
};

const sentryCaptureException = (url, options, err) => {
  SentryWithScope(scope => {
    scope.setExtra('url', url);
    scope.setExtra('options', options);
    scope.setExtra('err', {
      status: err.status,
      statusText: err.statusText,
      url: err.url
    });
    SentryCaptureException(err);
  });
};

/**
 * Wrapper for the fetch API which extends functionality by capturing exceptions with Sentry
 * resolving promise with successful response.
 *
 * @param {string} url - Fetch url
 * @param {object} options - Fetch init object
 * @returns {Promise<Response>} - A promise to the Response
 */
export const execFetch = (url, options) => {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(res => {
        // Throw error if res returned with status > 299
        verifyResOk(res);
        // Otherwise pass response on
        return res;
      })
      // Resolve with successful response
      .then(res => resolve(res))
      .catch(err => {
        // Capture error with Sentry
        sentryCaptureException(url, options, err);
        // Reject with error
        reject(err);
      });
  });
};

/**
 * React hook for wrapping fetch API.
 * Automatically captures exceptions with Sentry.
 *
 * @param {string} url - Fetch url
 * @param {object} options - Fetch init object
 * @returns {{isLoading: boolean, response: Response, error: Error}}
 */
export const useFetch = (url, options) => {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchWrapper = () => {
      setIsLoading(true);
      execFetch(url, options)
        .then(res => res.json())
        .then(res => {
          setResponse(res);
        })
        .catch(err => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchWrapper();
  }, []);

  return { response, error, isLoading };
};
