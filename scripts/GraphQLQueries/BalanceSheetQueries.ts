import gql from 'graphql-tag';

const balanceSheets = gql`
    query balanceSheets {
        balanceSheets {
            id
            name
            description
            acceleratorAmount
            sortPayoffBy
            useIncomeFromAssets
            incomeFromReinvestIntoDebtPayoff
            acceleratorPayoffText
            calculatedDebtAccelInterest
            maximumInterestForAllDebts
            currentPayoff
            currentTotalInterest
            debtAcceleratorPayoff
            debtAcceleratorInterest
            yearlySnapshotsDebtPayoff {
                year
                month
                last
                balanceOfAllDebts
                balanceOfAllDebtsWithAccel
            }
            monthlyEarnedIncome
            monthlyUnearnedIncome
            annualContribution
            annualIncreaseContribution
            annualWithdrawal
            withdrawalStartingYear
            volatilityDrawdown
            everyNumberYears
            yearsInvested
            useND1WealthValue
            useUnearnedIncomeValues
            yearlySnapshotsCompoundReturn {
                year
                income
                yearlyIncome
                yield
                yieldOnCost
                balance
            }
            createdAt
            updatedAt
        }
    }
`;

const balanceSheet = gql`
    query balanceSheet($id: ID!) {
        balanceSheet(id: $id){
            id
            name
            description
            acceleratorAmount
            sortPayoffBy
            useIncomeFromAssets
            incomeFromReinvestIntoDebtPayoff
            acceleratorPayoffText
            calculatedDebtAccelInterest
            maximumInterestForAllDebts
            currentPayoff
            currentTotalInterest
            debtAcceleratorPayoff
            debtAcceleratorInterest
            yearlySnapshotsDebtPayoff {
                year
                month
                last
                balanceOfAllDebts
                balanceOfAllDebtsWithAccel
            }
            monthlyEarnedIncome
            monthlyUnearnedIncome
            annualContribution
            annualIncreaseContribution
            annualWithdrawal
            withdrawalStartingYear
            volatilityDrawdown
            everyNumberYears
            yearsInvested
            useND1WealthValue
            useUnearnedIncomeValues
            yearlySnapshotsCompoundReturn {
                year
                income
                yearlyIncome
                yield
                yieldOnCost
                balance
            }
            createdAt
            updatedAt
        }
    }
`;

const createBalanceSheet = gql`
    mutation createBalanceSheet(
        $name: String!
        $description: String
        $acceleratorAmount: Float
        $sortPayoffBy: String
        $useIncomeFromAssets: Boolean
        $incomeFromReinvestIntoDebtPayoff: Float
        $acceleratorPayoffText: String
        $calculatedDebtAccelInterest: String
        $maximumInterestForAllDebts: Float
        $currentPayoff: String
        $currentTotalInterest: String
        $debtAcceleratorPayoff: String
        $debtAcceleratorInterest: String
        $yearlySnapshotsDebtPayoff: [YearlySnapshotsDebtPayoffInput!]
        $monthlyEarnedIncome: Float
        $monthlyUnearnedIncome: Float
        $annualContribution: Float
        $annualIncreaseContribution: Float
        $annualWithdrawal: Float
        $withdrawalStartingYear: Int
        $volatilityDrawdown: Float
        $everyNumberYears: Int
        $yearsInvested: Int
        $useND1WealthValue: Boolean
        $useUnearnedIncomeValues: Boolean
        $yearlySnapshotsCompoundReturn: [YearlySnapshotsCompoundReturnInput!]
    ){
        createBalanceSheet(balanceSheet:{
            name: $name
            description: $description
            acceleratorAmount: $acceleratorAmount
            sortPayoffBy: $sortPayoffBy
            useIncomeFromAssets: $useIncomeFromAssets
            incomeFromReinvestIntoDebtPayoff: $incomeFromReinvestIntoDebtPayoff
            acceleratorPayoffText: $acceleratorPayoffText
            calculatedDebtAccelInterest: $calculatedDebtAccelInterest
            maximumInterestForAllDebts: $maximumInterestForAllDebts
            currentPayoff: $currentPayoff
            currentTotalInterest: $currentTotalInterest
            debtAcceleratorPayoff: $debtAcceleratorPayoff
            debtAcceleratorInterest: $debtAcceleratorInterest
            yearlySnapshotsDebtPayoff: $yearlySnapshotsDebtPayoff
            monthlyEarnedIncome: $monthlyEarnedIncome
            monthlyUnearnedIncome: $monthlyUnearnedIncome
            annualContribution: $annualContribution
            annualIncreaseContribution: $annualIncreaseContribution
            annualWithdrawal: $annualWithdrawal
            withdrawalStartingYear: $withdrawalStartingYear
            volatilityDrawdown: $volatilityDrawdown
            everyNumberYears: $everyNumberYears
            yearsInvested: $yearsInvested
            useND1WealthValue: $useND1WealthValue
            useUnearnedIncomeValues: $useUnearnedIncomeValues
            yearlySnapshotsCompoundReturn: $yearlySnapshotsCompoundReturn
    }){
        id
        name
        description
        acceleratorAmount
        sortPayoffBy
        useIncomeFromAssets
        incomeFromReinvestIntoDebtPayoff
        acceleratorPayoffText
        calculatedDebtAccelInterest
        maximumInterestForAllDebts
        currentPayoff
        currentTotalInterest
        debtAcceleratorPayoff
        debtAcceleratorInterest
        yearlySnapshotsDebtPayoff {
            year
            month
            last
            balanceOfAllDebts
            balanceOfAllDebtsWithAccel
        }
        monthlyEarnedIncome
        monthlyUnearnedIncome
        annualContribution
        annualIncreaseContribution
        annualWithdrawal
        withdrawalStartingYear
        volatilityDrawdown
        everyNumberYears
        yearsInvested
        useND1WealthValue
        useUnearnedIncomeValues
        yearlySnapshotsCompoundReturn {
            year
            income
            yearlyIncome
            yield
            yieldOnCost
            balance
        }
        createdAt
        updatedAt
    }
}
`

const updateBalanceSheet = gql`
    mutation updateBalanceSheet(
        $name: String
        $description: String
        $acceleratorAmount: Float
        $sortPayoffBy: String
        $useIncomeFromAssets: Boolean
        $incomeFromReinvestIntoDebtPayoff: Float
        $acceleratorPayoffText: String
        $calculatedDebtAccelInterest: String
        $maximumInterestForAllDebts: Float
        $currentPayoff: String
        $currentTotalInterest: String
        $debtAcceleratorPayoff: String
        $debtAcceleratorInterest: String
        $yearlySnapshotsDebtPayoff: [YearlySnapshotsDebtPayoffInput!]
        $monthlyEarnedIncome: Float
        $monthlyUnearnedIncome: Float
        $annualContribution: Float
        $annualIncreaseContribution: Float
        $annualWithdrawal: Float
        $withdrawalStartingYear: Int
        $volatilityDrawdown: Float
        $everyNumberYears: Int
        $yearsInvested: Int
        $useND1WealthValue: Boolean
        $useUnearnedIncomeValues: Boolean
        $yearlySnapshotsCompoundReturn: [YearlySnapshotsCompoundReturnInput!]
        $id: ID!
    ){
        updateBalanceSheet(balanceSheet:{
            name: $name
            description: $description
            acceleratorAmount: $acceleratorAmount
            sortPayoffBy: $sortPayoffBy
            useIncomeFromAssets: $useIncomeFromAssets
            incomeFromReinvestIntoDebtPayoff: $incomeFromReinvestIntoDebtPayoff
            acceleratorPayoffText: $acceleratorPayoffText
            calculatedDebtAccelInterest: $calculatedDebtAccelInterest
            maximumInterestForAllDebts: $maximumInterestForAllDebts
            currentPayoff: $currentPayoff
            currentTotalInterest: $currentTotalInterest
            debtAcceleratorPayoff: $debtAcceleratorPayoff
            debtAcceleratorInterest: $debtAcceleratorInterest
            yearlySnapshotsDebtPayoff: $yearlySnapshotsDebtPayoff
            monthlyEarnedIncome: $monthlyEarnedIncome
            monthlyUnearnedIncome: $monthlyUnearnedIncome
            annualContribution: $annualContribution
            annualIncreaseContribution: $annualIncreaseContribution
            annualWithdrawal: $annualWithdrawal
            withdrawalStartingYear: $withdrawalStartingYear
            volatilityDrawdown: $volatilityDrawdown
            everyNumberYears: $everyNumberYears
            yearsInvested: $yearsInvested
            useND1WealthValue: $useND1WealthValue
            useUnearnedIncomeValues: $useUnearnedIncomeValues
            yearlySnapshotsCompoundReturn: $yearlySnapshotsCompoundReturn
    }, id: $id){
        id
        name
        description
        acceleratorAmount
        sortPayoffBy
        useIncomeFromAssets
        incomeFromReinvestIntoDebtPayoff
        acceleratorPayoffText
        calculatedDebtAccelInterest
        maximumInterestForAllDebts
        currentPayoff
        currentTotalInterest
        debtAcceleratorPayoff
        debtAcceleratorInterest
        yearlySnapshotsDebtPayoff {
            year
            month
            last
            balanceOfAllDebts
            balanceOfAllDebtsWithAccel
        }
        monthlyEarnedIncome
        monthlyUnearnedIncome
        annualContribution
        annualIncreaseContribution
        annualWithdrawal
        withdrawalStartingYear
        volatilityDrawdown
        everyNumberYears
        yearsInvested
        useND1WealthValue
        useUnearnedIncomeValues
        yearlySnapshotsCompoundReturn {
            year
            income
            yearlyIncome
            yield
            yieldOnCost
            balance
        }
        createdAt
        updatedAt
    }
}
`

const cloneBalanceSheet = gql`
    mutation cloneBalanceSheet(
        $id: ID!
        $name: String
        $description: String
    ){
        cloneBalanceSheet(
            id: $id
            name: $name
            description: $description
        ){
        id
        name
        description
        acceleratorAmount
        sortPayoffBy
        useIncomeFromAssets
        incomeFromReinvestIntoDebtPayoff
        acceleratorPayoffText
        calculatedDebtAccelInterest
        maximumInterestForAllDebts
        currentPayoff
        currentTotalInterest
        debtAcceleratorPayoff
        debtAcceleratorInterest
        yearlySnapshotsDebtPayoff {
            year
            month
            last
            balanceOfAllDebts
            balanceOfAllDebtsWithAccel
        }
        monthlyEarnedIncome
        monthlyUnearnedIncome
        annualContribution
        annualIncreaseContribution
        annualWithdrawal
        withdrawalStartingYear
        volatilityDrawdown
        everyNumberYears
        yearsInvested
        useND1WealthValue
        useUnearnedIncomeValues
        yearlySnapshotsCompoundReturn {
            year
            income
            yearlyIncome
            yield
            yieldOnCost
            balance
        }
        createdAt
        updatedAt
    }
}
`

const deleteBalanceSheet = gql`
    mutation deleteBalanceSheet(
        $id: ID!
    ){
        deleteBalanceSheet(
            id: $id
        ){
        id
    }
}
`

export {
    balanceSheets,
    balanceSheet,
    createBalanceSheet,
    updateBalanceSheet,
    cloneBalanceSheet,
    deleteBalanceSheet
}