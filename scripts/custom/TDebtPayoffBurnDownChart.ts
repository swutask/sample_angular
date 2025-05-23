interface TDebtPayoffBurnDownChart {
    _id?: string;
    currentTotalInterest?: string;
    debtAcceleratorInterest?: string;
    debtAcceleratorPayoff?: string;
    currentPayoff?: string;
    yearlySnapshots?: [
        {
            year: number
            month: number
            last: boolean
            balanceOfAllDebts: number
            balanceOfAllDebtsWithAccel: number
        }
    ]
}

export {
    TDebtPayoffBurnDownChart as ExportedClass
};