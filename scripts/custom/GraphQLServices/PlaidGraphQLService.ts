import { Injectable } from '@angular/core';
import { createLink, setAccess, getAccounts, getBalance, getTransactions, deleteAccountByPlaidItem, getPlaidAccountsByUserId, updateLink, updateAccount, unlinkPlaidItemQuery, syncByPlaidItem, syncAllPlaidItem } from '../../GraphQLQueries/PlaidQueries';
import {
    ExportedClass as GraphQLClientService
  } from './GraphQLClientService';


@Injectable()
class PlaidGraphQLService {
  constructor(
    private gqlClientSvc: GraphQLClientService
  ) { }

  async createLinkToken(liability?: boolean, all?: boolean) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: createLink,
        variables: { liability, all }
    });
  }

  async updateLinkToken(plaidItemId?: string, newAccount?: boolean) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: updateLink,
        variables: { plaidItemId, newAccount}
    });
  }

  async setAccessToken(public_token: string, institution_id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: setAccess,
        variables: { public_token, institution_id }
    });
  }

  async getPlaidAccounts(item_id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: getAccounts,
        variables: { item_id }
    });
  }

  async getPlaidBalance(item_id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: getBalance,
        variables: { item_id }
    });
  }

  async getPlaidTransactions(id: string, start_date: string, end_date: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: getTransactions,
        variables: { id, start_date, end_date }
    });
  }

  async deleteAccountByPlaidItemId (id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: deleteAccountByPlaidItem,
        variables: { id }
    });
  }

  async unlinkPlaidItem (id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: unlinkPlaidItemQuery,
        variables: { id }
    });
  }

  async getPlaidAccountsByUserId () {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: getPlaidAccountsByUserId,
    });
  }

  async updateAccountsResetByItemId (id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: updateAccount,
        variables: { id }
    });
  }

  async syncByPlaidItemId (id: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: syncByPlaidItem,
        variables: { id }
    });
  }

  async syncAllPlaidItems () {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.mutate({
        mutation: syncAllPlaidItem
    });
  }
}

export { PlaidGraphQLService as ExportedClass };