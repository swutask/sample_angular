// interface TBalanceSheet {
//     _id?: string;
//     name: string;
//     description?: string;
//     default?: boolean;
//     _createdAt?: any;
// }

interface TBalanceSheet {
    id: string,
    userId? : string,
    name? : string,
    default? : boolean,
    description? : string,
    acceleratorAmount? : number,
    sortPayoffBy? : string,
    acceleratorPayoffText? : string,
    calculatedDebtAccelInterest? : string,
    maximumInterestForAllDebts? : number,
    currentPayoff? : string,
    currentTotalInterest? : string,
    debtAcceleratorPayoff? : string,
    debtAcceleratorInterest? : string,
    yearlySnapshotsDebtPayoff? : [
        {
            year: number,
            month: number,
            last: boolean,
            balanceOfAllDebts: number,
            balanceOfAllDebtsWithAccel: number
        }
    ],
    monthlyEarnedIncome? : number,
    monthlyUnearnedIncome? : number,
    annualContribution? : number,
    annualIncreaseContribution? : number,
    annualWithdrawal? : number,
    withdrawalStartingYear? : number,
    volatilityDrawdown? : number,
    everyNumberYears? : number,
    yearsInvested? : number,
    useND1WealthValue? : boolean,
    useUnearnedIncomeValues? : boolean,
    yearlySnapshotsCompoundReturn? : [
        {
            year: number,
            income: number,
            yearlyIncome: number,
            yield: number,
            yieldOnCost: number,
            balance: number
        }
    ],
    createdAt? : number,
    updatedAt? : number
}

export {
    TBalanceSheet as ExportedClass
};