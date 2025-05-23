import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { ExportedClass as PlaidGraphQLService } from './GraphQLServices/PlaidGraphQLService';

@Injectable()
class PlaidService {

    constructor(public plaidGraphQLService: PlaidGraphQLService){
    }

    createLinkToken(liability?: boolean, all?: boolean) {
        return from(this.plaidGraphQLService.createLinkToken(liability, all));
    }

    updateLinkToken(plaidItemId?: string, newAccount?: boolean) {
        return from(this.plaidGraphQLService.updateLinkToken(plaidItemId, newAccount));
    }

    setAccessToken(public_token: string, institution_id: string) {
        return from(this.plaidGraphQLService.setAccessToken(public_token, institution_id));
    }

    getPlaidAccounts(item_id: string) {
        return from(this.plaidGraphQLService.getPlaidAccounts(item_id));
    }

    getPlaidBalance(item_id: string){
        return from(this.plaidGraphQLService.getPlaidBalance(item_id));
    }

    getPlaidTransactions(id: string, start_date: string, end_date: string){
        return from(this.plaidGraphQLService.getPlaidTransactions(id, start_date, end_date));
    }

    unlinkPlaidItem(id: string ){
        return from(this.plaidGraphQLService.unlinkPlaidItem(id));
    }

    deleteAccountByPlaidItemId(id: string ){
        return from(this.plaidGraphQLService.deleteAccountByPlaidItemId(id));
    }

    getPlaidAccountsByUserId(){
        return from(this.plaidGraphQLService.getPlaidAccountsByUserId());
    }

    updateAccountsResetByItemId(id: string ){
        return from(this.plaidGraphQLService.updateAccountsResetByItemId(id));
    }

    syncByPlaidItemId(id: string ){
        return from(this.plaidGraphQLService.syncByPlaidItemId(id));
    }

    syncAllPlaidItems(){
        return from(this.plaidGraphQLService.syncAllPlaidItems());
    }
}

export {
    PlaidService as ExportedClass
};