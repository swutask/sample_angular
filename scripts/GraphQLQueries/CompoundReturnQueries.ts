import gql from "graphql-tag";

const calculateCompoundReturn = gql`
  mutation calculateCompoundReturn(
    $monthlyEarnedIncome: Float
    $useND1WealthValue: Boolean
    $monthlyUnearnedIncome: Float
    $useUnearnedIncomeValues: Boolean
    $annualContribution: Float
    $annualIncreaseContribution: Float
    $annualWithdrawal: Float
    $withdrawalStartingYear: Int
    $volatilityDrawdown: Float
    $everyNumberYears: Int
    $yearsInvested: Int
    $showMonthly: Boolean
  ){
      calculateCompoundReturn(input: {
        monthlyEarnedIncome: $monthlyEarnedIncome
        useND1WealthValue: $useND1WealthValue
        monthlyUnearnedIncome: $monthlyUnearnedIncome
        useUnearnedIncomeValues: $useUnearnedIncomeValues
        annualContribution: $annualContribution
        annualIncreaseContribution: $annualIncreaseContribution
        annualWithdrawal: $annualWithdrawal
        withdrawalStartingYear: $withdrawalStartingYear
        volatilityDrawdown: $volatilityDrawdown
        everyNumberYears: $everyNumberYears
        yearsInvested: $yearsInvested
        showMonthly: $showMonthly
      }){
        results {
            additionalContribution
            additionalContribHowOften
            aggregatedMonthlyContributions
            aggregatedMonthlyContributionsResetYearly
            aggregatedMonthlyIncome
            aggregatedYearlyContributions
            aggregatedYearlyZvaIncome
            annualIncomeIncrease
            annualIncrease
            annualContribution
            annualWithdrawal
            weightedAnnualWithdrawal
            assetsOwned
            balance
            basis
            distributionFrequency
            distributionFrequencyPeriods
            dividendInAbsoluteDollars
            drip
            endOfYearCycle
            excludeFromWithdrawal
            fractional
            growthRate
            income
            investmentType
            isPortfolio
            isZVA
            lastMonthsAssetPrice
            lastMonthsBalance
            lastMonthsYield
            lastYearsAssetPrice
            lastYearsBalance
            lastYearsYield
            month
            monthCounter
            monthlyContribution
            numberOfStandardAssets
            originalAssetPrice
            originalBalance
            payTaxFromAsset
            reinvestIntoOtherAssets
            riskAdjustedBasis
            rollOver
            startingCapital
            taxRate
            totalAnnualWithdrawal
            totalDistribution
            year
            yearCounter
            zvaAssetsThatReinvestIntoOtherAssets {
                id
                name
                description
                assetType
                currentBalance
                monthlyExpense
                minPayment
                referenceUrl
                accountType
                costBasis
                userEntity
                liquidationPriority
                assetAssociation
                excludeFromDebtPayoffCalc
                payTaxFromExistingAsset
                investmentType
                sharesOwned
                sharePrice
                unitsOwned
                unitPrice
                useNominalValues
                excludeFromWithdrawal
                reinvestIntoOtherAssets
                estimatedYearlyIncome
                annualIncomeIncrease
                zvaIncome
                zvaFrequency
                additionalContribution
                additionalContribHowOften
                annualAppreciation
                compoundDRIP
                currentYield
                distributionFrequency
                excludeFromCompoundReturnCalc
                fractionalReinvestment
                liquidityChaosHedge
                monthlyIncome
                taxRate
                yieldGrowthRate
                updatedAt
                interestRate
            }
            zvaFrequency
            zvaIncome
            taxPaid
            monthlyIncome
            yieldOnCost
            returns
            perAnnumContributed
            totalContributed
            totalNumberOfNewAssetsPurchased
            totalNumberOfAssetsAdjustedForTaxAndWithdrawal
        }
        calculatedOutputs {
            assetsOwned
            dividendInAbsoluteDollars
            lastMonthsYield
            lastMonthsAssetPrice
            balance
            isUnits
            year
            yieldOnCost
            basis
            riskAdjustedBasis
            totalDistribution
            totalContributions
            income
            returns
            totalAnnualWithdrawal
            isPortfolio
            isMultipleAssets
        }
        weightedResults {
            additionalContribution
            additionalContribHowOften
            aggregatedMonthlyContributions
            aggregatedMonthlyContributionsResetYearly
            aggregatedMonthlyIncome
            aggregatedYearlyContributions
            aggregatedYearlyZvaIncome
            annualIncomeIncrease
            annualIncrease
            annualContribution
            annualWithdrawal
            weightedAnnualWithdrawal
            assetsOwned
            balance
            basis
            distributionFrequency
            distributionFrequencyPeriods
            dividendInAbsoluteDollars
            drip
            endOfYearCycle
            excludeFromWithdrawal
            fractional
            growthRate
            income
            investmentType
            isPortfolio
            isZVA
            lastMonthsAssetPrice
            lastMonthsBalance
            lastMonthsYield
            lastYearsAssetPrice
            lastYearsBalance
            lastYearsYield
            month
            monthCounter
            monthlyContribution
            numberOfStandardAssets
            originalAssetPrice
            originalBalance
            payTaxFromAsset
            reinvestIntoOtherAssets
            riskAdjustedBasis
            rollOver
            startingCapital
            taxRate
            totalAnnualWithdrawal
            totalDistribution
            year
            yearCounter
            zvaAssetsThatReinvestIntoOtherAssets {
                id
                name
                description
                assetType
                currentBalance
                monthlyExpense
                minPayment
                referenceUrl
                accountType
                costBasis
                userEntity
                liquidationPriority
                assetAssociation
                excludeFromDebtPayoffCalc
                payTaxFromExistingAsset
                investmentType
                sharesOwned
                sharePrice
                unitsOwned
                unitPrice
                useNominalValues
                excludeFromWithdrawal
                reinvestIntoOtherAssets
                estimatedYearlyIncome
                annualIncomeIncrease
                zvaIncome
                zvaFrequency
                additionalContribution
                additionalContribHowOften
                annualAppreciation
                compoundDRIP
                currentYield
                distributionFrequency
                excludeFromCompoundReturnCalc
                fractionalReinvestment
                liquidityChaosHedge
                monthlyIncome
                taxRate
                yieldGrowthRate
                updatedAt
                interestRate
            }
            zvaFrequency
            zvaIncome
            taxPaid
            monthlyIncome
            yieldOnCost
            returns
            perAnnumContributed
            totalContributed
            totalNumberOfNewAssetsPurchased
            totalNumberOfAssetsAdjustedForTaxAndWithdrawal
        }
        freedomAndLifestyleNumbers {
            freedomMonth
            freedomNumber
            lifestyleMonth
            lifestyleNumber
        }
        customNumbers {
            customName
            customMonth
            customNumber
            customText
        }
        freedomText
        lifestyleText
  }
}
`

export {
    calculateCompoundReturn
}