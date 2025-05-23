interface TND1Calculator {
    _id?: string;
    giving?: number;
    wealth?: number;
    debt?: number;
    living?: number;
    earnedIncome?: number;
    isDebtFree?: boolean;
    customAccounts?: any;
}

export {
    TND1Calculator as ExportedClass
};