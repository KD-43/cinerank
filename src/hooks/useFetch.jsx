import { useState, useEffect, useCallback } from 'react';

export function useFetch(url) {
    const [ data, setData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (!url || url === null) return;

        const controller = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url]);

    return { data, isLoading, error, };
};

export function useFetchExecute() {
    const [ data, setData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const execute = useCallback(async (url, options) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setData(result);
            return result;

        } catch (err) {
            setError(err);
            throw err;

        } finally {
            setIsLoading(false);

        }
    }, []);

    return { data, isLoading, error, execute };
};

