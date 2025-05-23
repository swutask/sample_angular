import {
    Injectable
} from '@angular/core';
import {
    ExportedClass as UserService
} from '../../../scripts/custom/userService';
import {
    balanceSheets,
    createBalanceSheet,
    updateBalanceSheet,
    cloneBalanceSheet,
    deleteBalanceSheet,
    balanceSheet
} from 'src/app/scripts/GraphQLQueries/BalanceSheetQueries';
import {
    ExportedClass as GraphQLClientService
} from './GraphQLClientService';


@Injectable()
class BalanceSheetGraphQLService {

    balanceSheetDefault = {
        id: null,
        name: null,
        description: null,
        acceleratorAmount: null,
        acceleratorPayoffText: null,
        annualContribution: null,
        annualIncreaseContribution: null,
        annualWithdrawal: null,
        calculatedDebtAccelInterest: null,
        maximumInterestForAllDebts: null,
        createdAt: new Date().getTime(),
        currentPayoff: null,
        currentTotalInterest: null,
        debtAcceleratorInterest: null,
        debtAcceleratorPayoff: null,
        default: null,
        everyNumberYears: null,
        monthlyEarnedIncome: null,
        monthlyUnearnedIncome: null,
        sortPayoffBy: null,
        updatedAt: new Date().getTime(),
        useND1WealthValue: null,
        useUnearnedIncomeValues: null,
        volatilityDrawdown: null,
        withdrawalStartingYear: null,
        yearlySnapshotsCompoundReturn: null,
        yearlySnapshotsDebtPayoff: null,
        yearsInvested: null,
        userId: this.userSvc.userId,
        __typename: "BalanceSheet"
    }

    constructor(
        private userSvc: UserService,
        private gqlClientSvc: GraphQLClientService
    ) { }

    async getBalanceSheetsFromGraphQL(forceUpdate: boolean) {
        let client = await this.gqlClientSvc.getCognitoHcAsync()

        return client.watchQuery({
            query: balanceSheets,
            fetchPolicy: forceUpdate ? 'cache-and-network' : 'cache-first'
        });
    }

    async getBalanceSheetByIdFromGraphQL(id: string,forceUpdate: boolean) {
        let client = await this.gqlClientSvc.getCognitoHcAsync()

        return client.watchQuery({
            query: balanceSheet,
            variables: {
                id: id
            },
            fetchPolicy: forceUpdate ? 'no-cache' : 'cache-first'
        });
    }

    async createBalanceSheetFromGraphQL(balanceSheet) {
        let client = await this.gqlClientSvc.getCognitoHcAsync()

        return client.mutate({
            mutation: createBalanceSheet,
            variables: {
                name: balanceSheet.name,
                description: balanceSheet.description
            },
            optimisticResponse: () => ({
                createBalanceSheet: {
                    ...this.balanceSheetDefault,
                    ...balanceSheet
                }
            }),
            update: (cache, { data: { createBalanceSheet } }) => {
                const data = cache.readQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId } });
                data.balanceSheets = [
                    ...data.balanceSheets.filter(item => item.id !== createBalanceSheet.id),
                    createBalanceSheet
                ];
                cache.writeQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId }, data });
            }
        });
    }

    async updateBalanceSheetFromGraphQL(balanceSheetUpdatedProperties, balanceSheet) {
        let client = await this.gqlClientSvc.getCognitoHcAsync()

        return client.mutate({
            mutation: updateBalanceSheet,
            variables: {
                id: balanceSheet.id,
                ...balanceSheetUpdatedProperties
            },
            optimisticResponse: () => ({
                updateBalanceSheet: {
                    ...this.balanceSheetDefault,
                    ...balanceSheet
                }
            }),
            update: (cache, { data: { updateBalanceSheet } }) => {
                const data = cache.readQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId } });
                const bsExistingData = data.balanceSheets[
                    data.balanceSheets.findIndex(x => x.id === updateBalanceSheet.id)
                ];
                data.balanceSheets[
                    data.balanceSheets.findIndex(x => x.id === updateBalanceSheet.id)
                ] = { ...bsExistingData, ...updateBalanceSheet };
                cache.writeQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId }, data });
            }
        });
    }

    async cloneBalanceSheetFromGraphQL(balanceSheet) {
        let client = await this.gqlClientSvc.getCognitoHcAsync()

        return client.mutate({
            mutation: cloneBalanceSheet,
            variables: {
                ...balanceSheet
            },
            optimisticResponse: () => ({
                cloneBalanceSheet: {
                    ...this.balanceSheetDefault,
                    ...balanceSheet
                }
            }),
            update: (cache, { data: { cloneBalanceSheet } }) => {
                const data = cache.readQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId } });
                data.balanceSheets = [
                    ...data.balanceSheets.filter(item => item.id !== cloneBalanceSheet.id),
                    cloneBalanceSheet
                ];
                cache.writeQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId }, data });
            }
        });
    }

    async deleteBalanceSheetFromGraphQL(id) {
        let client = await this.gqlClientSvc.getCognitoHcAsync()

        return client.mutate({
            mutation: deleteBalanceSheet,
            variables: {
                id
            },
            optimisticResponse: () => ({
                deleteBalanceSheet: {
                    id,
                    __typename: "BalanceSheet"
                }
            }),
            update: (cache, { data: { deleteBalanceSheet } }) => {
                const data = cache.readQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId } });
                data.balanceSheets = [
                    ...data.balanceSheets.filter(item => item.id !== deleteBalanceSheet.id),
                ];
                cache.writeQuery({ query: balanceSheets, variables: { userId: this.userSvc.userId }, data });
            }
        });
    }
}

export { BalanceSheetGraphQLService as ExportedClass };