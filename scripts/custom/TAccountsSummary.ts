interface TAccountsSummary {
    netWorth: number,
    assetWorth: number,
    liabilityWorth: number,
    excludedLiabilityWorth: number,
    tier1: number,
    tier2: number,
    tier3: number,
    totalWealthAccount: number
}

export {
    TAccountsSummary as ExportedClass
};