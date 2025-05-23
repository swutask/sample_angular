import gql from 'graphql-tag';

const accounts = gql`
        query accounts($balanceSheetId: ID) {
            accounts(balanceSheetId: $balanceSheetId) {
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
                reinvestIntoDebtPayOff
                estimatedYearlyIncome
                annualIncomeIncrease
                zvaIncome
                zvaFrequency
                additionalContribution
                additionalContribHowOften
                annualAppreciation
                compoundDRIP
                annualDividend
                currentYield
                distributionFrequency
                excludeFromCompoundReturnCalc
                fractionalReinvestment
                liquidityChaosHedge
                monthlyIncome
                taxRate
                yieldGrowthRate
                createdAt
                updatedAt
                interestRate
                liabilityType
                plaid
                plaidAccountId
                excludeFromFurtherInvestment
                updateRequired
                parentHolding
                parentHoldingId
                plaidHoldingId
                childHoldingIds
                priorityDebtPayoff
                balanceSheetId
            }
        }
    `;

const updateAccount = gql`
    mutation updateAccount(
        $description: String
        $name: String
        $assetType: String
        $currentBalance: Float
        $monthlyExpense: Float
        $minPayment: Float
        $referenceUrl: String
        $accountType: String
        $costBasis: Float
        $userEntity: String
        $liquidationPriority: Int
        $assetAssociation: String
        $excludeFromDebtPayoffCalc: Boolean
        $payTaxFromExistingAsset: Boolean
        $investmentType: String
        $sharesOwned: Float
        $sharePrice: Float
        $unitsOwned: Float
        $unitPrice: Float
        $useNominalValues: Boolean
        $excludeFromWithdrawal: Boolean
        $reinvestIntoOtherAssets: Boolean
        $reinvestIntoDebtPayOff: Boolean
        $annualIncomeIncrease: Float
        $zvaIncome: Float
        $zvaFrequency: String
        $additionalContribution: Float
        $additionalContribHowOften: String
        $annualAppreciation: Float
        $compoundDRIP: Boolean
        $annualDividend: Float
        $currentYield: Float
        $distributionFrequency: String
        $excludeFromCompoundReturnCalc: Boolean
        $fractionalReinvestment: Boolean
        $liquidityChaosHedge: Boolean
        $monthlyIncome: Float
        $taxRate: Float
        $yieldGrowthRate: Float
        $liabilityType: String
        $interestRate: Float
        $id: ID!
        $plaid: Boolean
        $excludeFromFurtherInvestment: Boolean
        $parentHolding: Boolean
        $plaidHoldingId: String
        $parentHoldingId: String
        $childHoldingIds: [String]
        $priorityDebtPayoff: Boolean
    ){
        updateAccount(account:{
            name: $name
            description: $description
            assetType: $assetType
            currentBalance: $currentBalance
            monthlyExpense: $monthlyExpense
            minPayment: $minPayment
            referenceUrl: $referenceUrl
            accountType: $accountType
            costBasis: $costBasis
            userEntity: $userEntity
            liquidationPriority: $liquidationPriority
            assetAssociation: $assetAssociation
            excludeFromDebtPayoffCalc: $excludeFromDebtPayoffCalc
            payTaxFromExistingAsset: $payTaxFromExistingAsset
            investmentType: $investmentType
            sharesOwned: $sharesOwned
            sharePrice: $sharePrice
            unitsOwned: $unitsOwned
            unitPrice: $unitPrice
            useNominalValues: $useNominalValues
            excludeFromWithdrawal: $excludeFromWithdrawal
            reinvestIntoOtherAssets: $reinvestIntoOtherAssets
            reinvestIntoDebtPayOff: $reinvestIntoDebtPayOff
            annualIncomeIncrease: $annualIncomeIncrease
            zvaIncome: $zvaIncome
            zvaFrequency: $zvaFrequency
            additionalContribution: $additionalContribution
            additionalContribHowOften: $additionalContribHowOften
            annualAppreciation: $annualAppreciation
            compoundDRIP: $compoundDRIP
            annualDividend: $annualDividend
            currentYield: $currentYield
            distributionFrequency: $distributionFrequency
            excludeFromCompoundReturnCalc: $excludeFromCompoundReturnCalc
            fractionalReinvestment: $fractionalReinvestment
            liquidityChaosHedge: $liquidityChaosHedge
            monthlyIncome: $monthlyIncome
            taxRate: $taxRate
            yieldGrowthRate: $yieldGrowthRate
            liabilityType: $liabilityType
            interestRate: $interestRate
            plaid: $plaid
            excludeFromFurtherInvestment: $excludeFromFurtherInvestment
            parentHolding: $parentHolding
            plaidHoldingId: $plaidHoldingId
            parentHoldingId: $parentHoldingId
            childHoldingIds: $childHoldingIds
            priorityDebtPayoff: $priorityDebtPayoff
    }, id: $id){
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
        reinvestIntoDebtPayOff
        reinvestIntoOtherAssets
        estimatedYearlyIncome
        annualIncomeIncrease
        zvaIncome
        zvaFrequency
        additionalContribution
        additionalContribHowOften
        annualAppreciation
        compoundDRIP
        annualDividend
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
        liabilityType
        userId
        plaid
        excludeFromFurtherInvestment
        updateRequired
        parentHolding
        plaidHoldingId
        parentHoldingId
        childHoldingIds
        priorityDebtPayoff
    }
}
`
const createAccount = gql`
  mutation createAccount(
      $balanceSheetId: ID!
      $name: String!
      $description: String
      $assetType: String
      $currentBalance: Float
      $monthlyExpense: Float
      $minPayment: Float
      $referenceUrl: String
      $accountType: String!
      $costBasis: Float
      $userEntity: String
      $liquidationPriority: Int
      $assetAssociation: String
      $excludeFromDebtPayoffCalc: Boolean
      $payTaxFromExistingAsset: Boolean
      $investmentType: String
      $sharesOwned: Float
      $sharePrice: Float
      $unitsOwned: Float
      $unitPrice: Float
      $useNominalValues: Boolean
      $excludeFromWithdrawal: Boolean
      $reinvestIntoOtherAssets: Boolean
      $reinvestIntoDebtPayOff: Boolean
      $annualIncomeIncrease: Float
      $zvaIncome: Float
      $zvaFrequency: String
      $additionalContribution: Float
      $additionalContribHowOften: String
      $annualAppreciation: Float
      $compoundDRIP: Boolean
      $annualDividend: Float
      $currentYield: Float
      $distributionFrequency: String
      $excludeFromCompoundReturnCalc: Boolean
      $fractionalReinvestment: Boolean
      $liquidityChaosHedge: Boolean
      $monthlyIncome: Float
      $taxRate: Float
      $yieldGrowthRate: Float
      $liabilityType: String
      $interestRate: Float
      $plaid: Boolean
      $plaidAccountId: String
      $plaidItemid: String
      $excludeFromFurtherInvestment: Boolean
      $parentHolding: Boolean
      $plaidHoldingId: String
      $parentHoldingId: String
      $childHoldingIds: [String]
      $priorityDebtPayoff: Boolean
  ){
      createAccount(account:{
          balanceSheetId: $balanceSheetId
          name: $name
          description: $description
          assetType: $assetType
          currentBalance: $currentBalance
          monthlyExpense: $monthlyExpense
          minPayment: $minPayment
          referenceUrl: $referenceUrl
          accountType: $accountType
          costBasis: $costBasis
          userEntity: $userEntity
          liquidationPriority: $liquidationPriority
          assetAssociation: $assetAssociation
          excludeFromDebtPayoffCalc: $excludeFromDebtPayoffCalc
          payTaxFromExistingAsset: $payTaxFromExistingAsset
          investmentType: $investmentType
          sharesOwned: $sharesOwned
          sharePrice: $sharePrice
          unitsOwned: $unitsOwned
          unitPrice: $unitPrice
          useNominalValues: $useNominalValues
          excludeFromWithdrawal: $excludeFromWithdrawal
          reinvestIntoOtherAssets: $reinvestIntoOtherAssets
          reinvestIntoDebtPayOff: $reinvestIntoDebtPayOff
          annualIncomeIncrease: $annualIncomeIncrease
          zvaIncome: $zvaIncome
          zvaFrequency: $zvaFrequency
          additionalContribution: $additionalContribution
          additionalContribHowOften: $additionalContribHowOften
          annualAppreciation: $annualAppreciation
          compoundDRIP: $compoundDRIP
          annualDividend: $annualDividend
          currentYield: $currentYield
          distributionFrequency: $distributionFrequency
          excludeFromCompoundReturnCalc: $excludeFromCompoundReturnCalc
          fractionalReinvestment: $fractionalReinvestment
          liquidityChaosHedge: $liquidityChaosHedge
          monthlyIncome: $monthlyIncome
          taxRate: $taxRate
          yieldGrowthRate: $yieldGrowthRate
          liabilityType: $liabilityType
          interestRate: $interestRate
          plaid: $plaid
          plaidAccountId: $plaidAccountId
          plaidItemid: $plaidItemid
          excludeFromFurtherInvestment: $excludeFromFurtherInvestment
          parentHolding: $parentHolding
          plaidHoldingId: $plaidHoldingId
          parentHoldingId: $parentHoldingId
          childHoldingIds: $childHoldingIds
          priorityDebtPayoff: $priorityDebtPayoff
  }){
      id
      userId
      balanceSheetId
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
      reinvestIntoDebtPayOff
      reinvestIntoOtherAssets
      estimatedYearlyIncome
      annualIncomeIncrease
      zvaIncome
      zvaFrequency
      additionalContribution
      additionalContribHowOften
      annualAppreciation
      compoundDRIP
      annualDividend
      currentYield
      distributionFrequency
      excludeFromCompoundReturnCalc
      fractionalReinvestment
      liquidityChaosHedge
      monthlyIncome
      taxRate
      yieldGrowthRate
      createdAt
      updatedAt
      interestRate
      liabilityType
      userId
      plaid
      plaidAccountId
      excludeFromFurtherInvestment
      updateRequired
      parentHolding
      plaidHoldingId
      parentHoldingId
      childHoldingIds
      priorityDebtPayoff
  }
}
`

const cloneAccount = gql`
  mutation cloneAccount(
      $id: ID!
      $balanceSheetId: ID!
  ){
      cloneAccount(
          id: $id
          balanceSheetId: $balanceSheetId
      ){
        id
        balanceSheetId
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
        reinvestIntoDebtPayOff
        reinvestIntoOtherAssets
        estimatedYearlyIncome
        annualIncomeIncrease
        zvaIncome
        zvaFrequency
        additionalContribution
        additionalContribHowOften
        annualAppreciation
        compoundDRIP
        annualDividend
        currentYield
        distributionFrequency
        excludeFromCompoundReturnCalc
        fractionalReinvestment
        liquidityChaosHedge
        monthlyIncome
        taxRate
        yieldGrowthRate
        createdAt
        updatedAt
        interestRate
        liabilityType
        plaid
        excludeFromFurtherInvestment
        parentHolding
        plaidAccountId
        updateRequired
        plaidHoldingId
        parentHoldingId
        childHoldingIds
        priorityDebtPayoff
        childHoldings {
            id
            balanceSheetId
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
            reinvestIntoDebtPayOff
            reinvestIntoOtherAssets
            estimatedYearlyIncome
            annualIncomeIncrease
            zvaIncome
            zvaFrequency
            additionalContribution
            additionalContribHowOften
            annualAppreciation
            compoundDRIP
            annualDividend
            currentYield
            distributionFrequency
            excludeFromCompoundReturnCalc
            fractionalReinvestment
            liquidityChaosHedge
            monthlyIncome
            taxRate
            yieldGrowthRate
            createdAt
            updatedAt
            interestRate
            liabilityType
            plaid
            excludeFromFurtherInvestment
            parentHolding
            plaidAccountId
            updateRequired
            plaidHoldingId
            parentHoldingId
            childHoldingIds
            priorityDebtPayoff
        }
  }
}
`

const copyAccount = gql`
  mutation copyAccount(
      $id: ID!
      $copyAccountId: ID!
  ){
      copyAccount(
          id: $id
          copyAccountId: $copyAccountId
      ){
        id
        balanceSheetId
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
        reinvestIntoDebtPayOff
        reinvestIntoOtherAssets
        estimatedYearlyIncome
        annualIncomeIncrease
        zvaIncome
        zvaFrequency
        additionalContribution
        additionalContribHowOften
        annualAppreciation
        compoundDRIP
        annualDividend
        currentYield
        distributionFrequency
        excludeFromCompoundReturnCalc
        fractionalReinvestment
        liquidityChaosHedge
        monthlyIncome
        taxRate
        yieldGrowthRate
        createdAt
        updatedAt
        interestRate
        liabilityType
        plaid
        excludeFromFurtherInvestment
        parentHolding
        plaidAccountId
        updateRequired
        plaidHoldingId
        parentHoldingId
        childHoldingIds
        priorityDebtPayoff
        childHoldings {
            id
            balanceSheetId
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
            reinvestIntoDebtPayOff
            reinvestIntoOtherAssets
            estimatedYearlyIncome
            annualIncomeIncrease
            zvaIncome
            zvaFrequency
            additionalContribution
            additionalContribHowOften
            annualAppreciation
            compoundDRIP
            annualDividend
            currentYield
            distributionFrequency
            excludeFromCompoundReturnCalc
            fractionalReinvestment
            liquidityChaosHedge
            monthlyIncome
            taxRate
            yieldGrowthRate
            createdAt
            updatedAt
            interestRate
            liabilityType
            plaid
            excludeFromFurtherInvestment
            parentHolding
            plaidAccountId
            updateRequired
            plaidHoldingId
            parentHoldingId
            childHoldingIds
            priorityDebtPayoff
        }
  }
}
`

const deleteAccount = gql`
  mutation deleteAccount(
      $id: ID!
  ){
      deleteAccount(
          id: $id
      ){
        id
  }
}
`

export {
    accounts,
    updateAccount,
    createAccount,
    cloneAccount,
    copyAccount,
    deleteAccount
}