import React, { useEffect, useState } from 'react';
import { useAdvStateManager } from './useUndo';
import { useModify } from './useModify';

const basicTierListTemplate = () => {
    const newListId = `list-${Math.random().toString(36).substring(2, 9)}`;

    const basicTierList = {
        id: newListId,
        title: 'Insert Title',
        rows: [
            { id: 'row-s', label: 'S Tier', color: 'bg-pink-300', items: [] },
            { id: 'row-a', label: 'A Tier', color: 'bg-red-300', items: [] },
            { id: 'row-b', label: 'B Tier', color: 'bg-orange-300', items: [] },
            { id: 'row-c', label: 'C Tier', color: 'bg-yellow-300', items: [] },
        ],
        unranked: [],
    };

    return basicTierList;
}

export function useDataManager (userId, listId) {
    const shortId = userId.substring(0, 4);

    const isNewList = !listId;
    const apiUrl = isNewList ? null : `/api/tierlists/${userId}/${listId}`;

    const [ isDataLoading, setIsDataLoading ] = useState(!isNewList);
    const [ dataError, setDataError ] = useState(null);

    const { state: tierList, set: setTierList, ...tierListUtil } = useAdvStateManager(
        isNewList ? basicTierListTemplate() : null
    );
    const tierListModify = useModify(setTierList);

    useEffect(() => {
        if (!tierList) return;
        console.log("[useDataManager] --- TierList changed: ", tierList);
        
    }, [tierList]);
    
    useEffect(() => {
        if (!apiUrl) {
            console.log("No URL found, returning!", apiUrl);
            return;
        };

        const controller = new AbortController();
        const fetchData = async () => {
            setIsDataLoading(true);
            setDataError(null);
            try {
                const response = await fetch(apiUrl, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Fetching tierList as listId: ${listId} --- [FAILED]`);
                }

                const data = await response.json();
                setTierList(data);
            } catch (err) {
                if (err.name !== 'AbortError') setDataError(err.message);
            } finally {
                if (!controller.signal.aborted) setIsDataLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [apiUrl, setTierList]);

    return {
        isNewList,
        tierList,
        isDataLoading,
        dataError,
        tierListUtil,
        tierListModify,
    }
    
}