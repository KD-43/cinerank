import React, { useState, useEffect, useRef } from 'react';
import { TierListItem } from './TierListItem';
import { ErrorBoundary } from 'react-error-boundary';

export function TierRender ({ tiers, newTier, insertNewTier, group }) {

    console.log('Before: ', tiers);
    console.log('newTier: ', newTier);

    useEffect(() => {
        if (!newTier) {
            return
        }

        insertNewTier(newTier, group(newTier.id));
        
    }, [newTier])

    console.log('Updated TierList: ', tiers);

    return (
        <>
            {(tiers?.initial ?? []).map((tier) => (
                <TierListItem key={tier.id} tierLabel={tier.label} tierColor={tier.color} />
            ))}
            {(tiers?.additional ?? []).map((tier) => (
                <TierListItem key={tier.id} tierLabel={tier.label} tierColor={tier.color} />
            ))}
            {/* {additionalTierList.map((tier, index) => (
                <TierListItem key={tier.id} index={index} tierLabel={tier.label} tierColor={tier.color} />
            ))} */}
        </>
    )
}