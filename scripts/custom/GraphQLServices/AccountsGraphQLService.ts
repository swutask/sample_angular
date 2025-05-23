import {
  Injectable
} from '@angular/core';
import {
  v4 as uuidv4
} from 'uuid';
import {
  ExportedClass as UserService
} from '../userService';
import {
  accounts,
  cloneAccount,
  copyAccount,
  createAccount,
  deleteAccount,
  updateAccount
} from 'src/app/scripts/GraphQLQueries/AccountsQueries';
import {
  ExportedClass as GraphQLClientService
} from './GraphQLClientService';

@Injectable()

class AccountsGraphQLService {
  constructor(
    private userSvc: UserService,
    private gqlClientSvc: GraphQLClientService
  ) { }

  async getAccountsFromGraphQL(forceUpdate: boolean) {
    let client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: accounts,
      variables: { balanceSheetId: this.userSvc.activeBalanceSheet },
      fetchPolicy: forceUpdate ? 'network-only' : 'cache-first'
    });
  }

  async getDefaultAccountsFromGraphQL(forceUpdate: boolean) {
    let client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: accounts,
      variables: { balanceSheetId: this.userSvc.defaultBalanceSheet },
      fetchPolicy: forceUpdate ? 'network-only' : 'cache-first'
    });
  }

  async createAccountFromGraphQL(account) {
    let client = await this.gqlClientSvc.getCognitoHcAsync()

    let accountInput = {
      balanceSheetId: this.userSvc.activeBalanceSheet,
      name: account.name || "",
      description: account.description || "",
      assetType: account.assetType || "",
      currentBalance: typeof account.currentBalance == "number" ? account.currentBalance : null,
      monthlyExpense: account.monthlyExpense || null,
      minPayment: account.minPayment || null,
      interestRate: account.interestRate || null,
      referenceUrl: account.referenceUrl || "",
      accountType: account.accountType || "",
      costBasis: account.costBasis || null,
      userEntity: account.userEntity || null,
      liquidationPriority: account.liquidationPriority || null,
      assetAssociation: account.assetAssociation || "none",
      excludeFromDebtPayoffCalc: account.excludeFromDebtPayoffCalc || false,
      payTaxFromExistingAsset: account.payTaxFromExistingAsset || false,
      investmentType: account.investmentType || "",
      sharesOwned: account.sharesOwned || null,
      sharePrice: account.sharePrice || null,
      unitsOwned: account.unitsOwned || null,
      unitPrice: account.unitPrice || null,
      useNominalValues: account.useNominalValues || false,
      excludeFromWithdrawal: account.excludeFromWithdrawal || false,
      reinvestIntoOtherAssets: account.reinvestIntoOtherAssets || false,
      annualIncomeIncrease: account.annualIncomeIncrease || null,
      zvaIncome: account.zvaIncome || null,
      zvaFrequency: account.zvaFrequency || "",
      additionalContribution: account.additionalContribution || null,
      additionalContribHowOften: account.additionalContribHowOften || "",
      annualAppreciation: account.annualAppreciation || null,
      compoundDRIP: account.compoundDRIP || false,
      currentYield: account.currentYield || null,
      distributionFrequency: account.distributionFrequency || "",
      excludeFromCompoundReturnCalc: account.excludeFromCompoundReturnCalc || false,
      fractionalReinvestment: account.fractionalReinvestment || false,
      liquidityChaosHedge: account.liquidityChaosHedge || false,
      monthlyIncome: account.monthlyIncome || null,
      taxRate: account.taxRate || null,
      liabilityType: account.liabilityType || null,
      yieldGrowthRate: account.yieldGrowthRate || null,
      plaid: account.plaid || false
    }

    return client.mutate({
      mutation: createAccount,
      variables: {
        balanceSheetId: this.userSvc.activeBalanceSheet,
        ...account
      },
      // optimisticResponse: () => ({
      //   createAccount: {
      //     id: uuidv4(),
      //     userId: this.userSvc.userId,
      //     createdAt: new Date().getTime(),
      //     updatedAt: new Date().getTime(),
      //     __typename: 'Account', // This type must match the return type of the query below (listTodos)
      //     ...accountInput,
      //     estimatedYearlyIncome: null
      //   }
      // }),
      update: (cache, { data: { createAccount } }) => {
        const data = cache.readQuery({ query: accounts, variables: { balanceSheetId: accountInput.balanceSheetId } });
        data.accounts = [
          ...data.accounts.filter(item => item.id !== createAccount.id),
          createAccount
        ];
        cache.writeQuery({ query: accounts, variables: { balanceSheetId: accountInput.balanceSheetId }, data });
      }
    });
  }

  async updateAccountByIdFromGraphQL(accountUpdatedProperties, account) {
    let client = await this.gqlClientSvc.getCognitoHcAsync()

    let accountInput = {
      name: account.name || "",
      description: account.description || "",
      assetType: account.assetType || "",
      currentBalance: typeof account.currentBalance == "number" ? account.currentBalance : null,
      monthlyExpense: account.monthlyExpense || null,
      minPayment: account.minPayment || null,
      interestRate: account.interestRate || null,
      referenceUrl: account.referenceUrl || "",
      accountType: account.accountType || "",
      costBasis: account.costBasis || null,
      userEntity: account.userEntity || null,
      liquidationPriority: account.liquidationPriority || null,
      assetAssociation: account.assetAssociation || "none",
      excludeFromDebtPayoffCalc: account.excludeFromDebtPayoffCalc || false,
      payTaxFromExistingAsset: account.payTaxFromExistingAsset || false,
      investmentType: account.investmentType || "",
      sharesOwned: account.sharesOwned || null,
      sharePrice: account.sharePrice || null,
      unitsOwned: account.unitsOwned || null,
      unitPrice: account.unitPrice || null,
      useNominalValues: account.useNominalValues || false,
      excludeFromWithdrawal: account.excludeFromWithdrawal || false,
      reinvestIntoOtherAssets: account.reinvestIntoOtherAssets || false,
      annualIncomeIncrease: account.annualIncomeIncrease || null,
      zvaIncome: account.zvaIncome || null,
      zvaFrequency: account.zvaFrequency || "",
      additionalContribution: account.additionalContribution || null,
      additionalContribHowOften: account.additionalContribHowOften || "",
      annualAppreciation: account.annualAppreciation || null,
      compoundDRIP: account.compoundDRIP || false,
      annualDividend: account.annualDividend || null,
      currentYield: account.currentYield || null,
      distributionFrequency: account.distributionFrequency || "",
      excludeFromCompoundReturnCalc: account.excludeFromCompoundReturnCalc || false,
      fractionalReinvestment: account.fractionalReinvestment || false,
      liquidityChaosHedge: account.liquidityChaosHedge || false,
      monthlyIncome: account.monthlyIncome || null,
      taxRate: account.taxRate || null,
      liabilityType: account.liabilityType || null,
      yieldGrowthRate: account.yieldGrowthRate || null,
      plaid: account.plaid || false
    }

    return client.mutate({
      mutation: updateAccount,
      variables: { ...accountUpdatedProperties, id: account.id },
      // optimisticResponse: () => ({
      //   updateAccount: {
      //     id: account.id,
      //     userId: this.userSvc.userId,
      //     balanceSheetId: this.userSvc.activeBalanceSheet,
      //     createdAt: new Date().getTime(),
      //     updatedAt: new Date().getTime(),
      //     __typename: "Account",
      //     ...accountInput,
      //     estimatedYearlyIncome: null
      //   }
      // }),
      update: (cache, { data: { updateAccount } }) => {
        const accountsList: any = cache.readQuery({ query: accounts, variables: { balanceSheetId: this.userSvc.activeBalanceSheet } });
        const accountExistingData = accountsList.accounts[
          accountsList.accounts.findIndex(x => x.id === updateAccount.id)
        ];
        accountsList.accounts[
          accountsList.accounts.findIndex(x => x.id === updateAccount.id)
        ] = { ...accountExistingData, ...updateAccount };
        cache.writeQuery({ query: accounts, variables: { balanceSheetId: this.userSvc.activeBalanceSheet }, data: accountsList });
      }
    });
  }

  async cloneAccountFromGraphQL(account, balanceSheetId) {
    let client = await this.gqlClientSvc.getCognitoHcAsync()

    let accountInput = {
      name: account.name || "",
      balanceSheetId: account.balanceSheetId || null,
      description: account.description || "",
      assetType: account.assetType || "",
      currentBalance: typeof account.currentBalance == "number" ? account.currentBalance : null,
      monthlyExpense: account.monthlyExpense || null,
      minPayment: account.minPayment || null,
      interestRate: account.interestRate || null,
      referenceUrl: account.referenceUrl || "",
      accountType: account.accountType || "",
      costBasis: account.costBasis || null,
      userEntity: account.userEntity || null,
      liquidationPriority: account.liquidationPriority || null,
      assetAssociation: account.assetAssociation || "none",
      excludeFromDebtPayoffCalc: account.excludeFromDebtPayoffCalc || false,
      payTaxFromExistingAsset: account.payTaxFromExistingAsset || false,
      investmentType: account.investmentType || "",
      sharesOwned: account.sharesOwned || null,
      sharePrice: account.sharePrice || null,
      unitsOwned: account.unitsOwned || null,
      unitPrice: account.unitPrice || null,
      useNominalValues: account.useNominalValues || false,
      excludeFromWithdrawal: account.excludeFromWithdrawal || false,
      reinvestIntoOtherAssets: account.reinvestIntoOtherAssets || false,
      annualIncomeIncrease: account.annualIncomeIncrease || null,
      zvaIncome: account.zvaIncome || null,
      zvaFrequency: account.zvaFrequency || "",
      additionalContribution: account.additionalContribution || null,
      additionalContribHowOften: account.additionalContribHowOften || "",
      annualAppreciation: account.annualAppreciation || null,
      compoundDRIP: account.compoundDRIP || false,
      currentYield: account.currentYield || null,
      distributionFrequency: account.distributionFrequency || "",
      excludeFromCompoundReturnCalc: account.excludeFromCompoundReturnCalc || false,
      fractionalReinvestment: account.fractionalReinvestment || false,
      liquidityChaosHedge: account.liquidityChaosHedge || false,
      monthlyIncome: account.monthlyIncome || null,
      taxRate: account.taxRate || null,
      liabilityType: account.liabilityType || null,
      yieldGrowthRate: account.yieldGrowthRate || null,
      plaid: account.plaid || false,
      reinvestIntoDebtPayOff: account.reinvestIntoDebtPayOff || false,
      excludeFromFurtherInvestment: account.excludeFromFurtherInvestment || false,
      parentHolding: account.parentHolding || null,
      plaidAccountId: account.plaidAccountId || null,
      updateRequired: account.updateRequired || false,
      plaidHoldingId: account.plaidHoldingId || null,
      parentHoldingId: account.parentHoldingId || null,
      childHoldingIds: account.childHoldingIds || null
    }

    return client.mutate({
      mutation: cloneAccount,
      variables: { id: account.id, balanceSheetId },
      optimisticResponse: () => ({
        cloneAccount: {
          ...accountInput,
          id: uuidv4(),
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
          __typename: "Account",
          estimatedYearlyIncome: null
        }
      }),
      update: (cache, { data: { cloneAccount } }) => {
        try {
          const data = cache.readQuery({ query: accounts, variables: { balanceSheetId } });
          console.log(cloneAccount);
          let childHoldings = [];
          if (cloneAccount.childHoldings) {
            childHoldings = cloneAccount.childHoldings
          }
          data.accounts = [
            ...data.accounts.filter(item => item.id !== cloneAccount.id),
            cloneAccount,
            ...childHoldings
          ];
          cache.writeQuery({ query: accounts, variables: { balanceSheetId }, data });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  async copyAccountFromGraphQL(account, copyAccountId, parentAccount) {
    let client = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
      mutation: copyAccount,
      variables: { id: account.id, copyAccountId },
      optimisticResponse: () => ({
        copyAccount: {
          ...parentAccount,
        }
      }),
      update: (cache, { data: { copyAccount } }) => {
        try {
          const data = cache.readQuery({ query: accounts, variables: { balanceSheetId: this.userSvc.activeBalanceSheet } });
          console.log(copyAccount);
          let childHoldings = [];
          if (copyAccount.childHoldings) {
            childHoldings = copyAccount.childHoldings
          }
          const checkIfChildHoldingExists = (item) => {
            return !childHoldings.some(childHolding => childHolding.id === item.id);
          };
          data.accounts = [
            ...data.accounts.filter(item => item.id !== copyAccount.id && checkIfChildHoldingExists(item)),
            copyAccount,
            ...childHoldings
          ];
          cache.writeQuery({ query: accounts, variables: { balanceSheetId: this.userSvc.activeBalanceSheet }, data });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  async deleteAccountFromGraphQL(id) {
    let client = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
      mutation: deleteAccount,
      variables: {
        id
      },
      optimisticResponse: () => ({
        deleteAccount: {
          id,
          __typename: "Account"
        }
      }),
      update: (cache, { data: { deleteAccount } }) => {
        const data = cache.readQuery({ query: accounts, variables: { balanceSheetId: this.userSvc.activeBalanceSheet } });
        data.accounts = [
          ...data.accounts.filter(item => item.id !== deleteAccount.id),
        ];
        cache.writeQuery({ query: accounts, variables: { balanceSheetId: this.userSvc.activeBalanceSheet }, data });
      }
    });
  }
}

export { AccountsGraphQLService as ExportedClass };