interface TCompoundReturn {
    _id?: string;
    monthlyEarnedIncome?: number;
    useND1WealthValue?: boolean;
    monthlyUnearnedIncome?: number;
    useUnearnedIncomeValues?: boolean;
    annualContribution?: number;
    annualIncreaseContribution?: number;
    annualWithdrawal?: number;
    withdrawalStartingYear?: number;
    volatilityDrawdown?: number;
    everyNumberYears?: number;
    yearsInvested?: number;
    showMonthly?: boolean;
}

export {
    TCompoundReturn as ExportedClass
};