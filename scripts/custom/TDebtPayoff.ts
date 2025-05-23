interface TDebtPayoff {
    _id?: string;
    acceleratorAmount?: number;
    incomeFromAssets?: number;
    totalAcceleratotAmount?: number;
    sortPayoffBy?: string;
    useIncomeFromAssets?: boolean;
    acceleratorPayoffText?: string;
    calculatedDebtAccelInterest?: string;
    maximumInterestForAllDebts?: number;
}

export {
    TDebtPayoff as ExportedClass
};