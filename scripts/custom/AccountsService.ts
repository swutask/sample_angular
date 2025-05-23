import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ExportedClass as TAccount } from '../custom/TAccount';
import { ExportedClass as TAccountList } from '../custom/TAccountList';
import { ExportedClass as UserService } from '../custom/userService';
import { ExportedClass as AuthService } from '../custom/AuthService';
import { ExportedClass as BalanceSheetService } from '../custom/BalanceSheetService';
import { ExportedClass as AccountsGraphQLService } from './GraphQLServices/AccountsGraphQLService';

/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
class AccountsService {
    private static readonly accountsSummaryDefaults = {
        netWorth: 0,
        assetWorth: 0,
        liabilityWorth: 0,
        excludedLiabilityWorth: 0,
        tier1: 0,
        tier2: 0,
        tier3: 0,
        totalWealthAccount: 0
    }
    accounts: TAccountList = [];
    defaultAccounts: TAccountList = [];
    assetList: { id: string, name: string, currentBalance: number, parentHoldingId: string }[];
    outdated = true;
    accountsSummary = AccountsService.accountsSummaryDefaults;

    constructor(
        private userSvc: UserService,
        private authService: AuthService,
        private balanceSheetService: BalanceSheetService,
        private accountsGraphQLService: AccountsGraphQLService
    ) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
        this.balanceSheetService.off(BalanceSheetService.BS_CHANGE_EVENT, this.invalidate.bind(this)).on(BalanceSheetService.BS_CHANGE_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.outdated = true;
        this.accounts = [];
        this.assetList = [];
        this.accountsSummary = AccountsService.accountsSummaryDefaults;
    }

    refreshAccountsData() {
        let netWorth = 0,
            assetWorth = 0,
            liabilityWorth = 0,
            excludedLiabilityWorth = 0,
            tier1 = 0,
            tier2 = 0,
            tier3 = 0,
            totalWealthAccount = 0;

        this.accounts.forEach(a => {
            if (typeof a.currentBalance == 'number' && a.parentHolding != true) {
                const isAsset = a.accountType === "Asset";
                const isLiability = a.accountType === "Liability";
                const isExcludedFromDebtPayoff = a.accountType === "Liability" && a.excludeFromDebtPayoffCalc;
                netWorth += (isAsset ? 1 : -1) * a.currentBalance;
                assetWorth += isAsset ? a.currentBalance : 0;
                liabilityWorth += isAsset ? 0 : a.currentBalance;
                excludedLiabilityWorth += isAsset || isExcludedFromDebtPayoff ? 0 : a.currentBalance;

                if (a.liquidityChaosHedge) {
                    tier1 += a.currentBalance;
                }

                if (a.assetType === 'CFA') {
                    if (isAsset) tier2 += a.currentBalance;
                }

                if (a.assetType === 'AA') {
                    if (isAsset) tier3 += a.currentBalance;
                }

                // if the account is a liability AND associated with an asset
                // then subtract that amount from the tier
                if (isLiability && a.assetAssociation) {
                    // find the account with the id of the assetAssociation
                    const acct = this.accounts.find(obj => obj.id === a.assetAssociation);

                    if (acct) {
                        const { assetType, liquidityChaosHedge } = acct;
                        if ((assetType === 'C' || assetType === 'DA') && liquidityChaosHedge) {
                            tier1 -= a.currentBalance;
                        }
                        if (assetType === 'CFA') {
                            tier2 -= a.currentBalance
                        }
                        if (assetType === 'AA') {
                            tier3 -= a.currentBalance;
                        }
                    }
                }

            } else {
                if (typeof a.currentBalance != 'number') {
                    console.error(a, 'current balance is not a number');
                }
            }

            totalWealthAccount = tier1 + tier2 + tier3;

        });
        this.accountsSummary.netWorth = netWorth;
        this.accountsSummary.assetWorth = assetWorth;
        this.accountsSummary.liabilityWorth = liabilityWorth;
        this.accountsSummary.excludedLiabilityWorth = excludedLiabilityWorth;
        this.accountsSummary.tier1 = tier1;
        this.accountsSummary.tier2 = tier2;
        this.accountsSummary.tier3 = tier3;
        this.accountsSummary.totalWealthAccount = totalWealthAccount;
        this.assetList = this.accounts
            .filter(account => account.accountType === "Asset"  && account.parentHolding != true)
            .map(x => ({ id: x.id, name: x.name, currentBalance: x.currentBalance, parentHoldingId: x.parentHoldingId }));
    }

    getAccounts(forceUpdate = false): Observable<TAccount[]> {
        /*
        forceUpdate = false it means we only get data from cache
        forceUpdate = true it means we first get data from cache and also make network request.
        */
        return from(this.accountsGraphQLService.getAccountsFromGraphQL(forceUpdate))
            .pipe(
                switchMap(observable => {
                    return observable
                }),
                tap((result: any) => {
                    this.accounts = result.data ? result.data.accounts : [];
                    this.refreshAccountsData();
                })
            )
    }

    getDefaultAccounts(forceUpdate = false): Observable<TAccount[]> {
        /*
        forceUpdate = false it means we only get data from cache
        forceUpdate = true it means we first get data from cache and also make network request.
        */
        return from(this.accountsGraphQLService.getDefaultAccountsFromGraphQL(forceUpdate))
            .pipe(
                switchMap(observable => {
                    return observable
                }),
                tap((result: any) => {
                    this.defaultAccounts = result.data ? result.data.accounts : [];
                })
            )
    }

    createOrUpdateAccount(accountUpdatedProperties, account: TAccount, id: string) {
        if (id === 'new') {
            return of(this.accountsGraphQLService.createAccountFromGraphQL({
                userId: this.userSvc.userId,
                ...account
            }));
        } else {
            return of(this.accountsGraphQLService.updateAccountByIdFromGraphQL(accountUpdatedProperties, account));
        }
    }

    cloneAccount(account, balanceSheetId) {
        return of(this.accountsGraphQLService.cloneAccountFromGraphQL(account, balanceSheetId));
    }

    copyAccount(account, copyAccountId, parentAccount) {
        return of(this.accountsGraphQLService.copyAccountFromGraphQL(account, copyAccountId, parentAccount));
    }

    deleteAccount(id) {
        return of(this.accountsGraphQLService.deleteAccountFromGraphQL(id));
    }

    getAccount(id): TAccount {
        return this.accounts.find(account => account.id === id);
    }
}

/*
    Service class should be exported as ExportedClass
*/
export { AccountsService as ExportedClass };