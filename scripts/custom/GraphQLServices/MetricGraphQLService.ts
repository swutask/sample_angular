import { Injectable } from "@angular/core";
import {
    ExportedClass as GraphQLClientService
} from './GraphQLClientService';
import { metricQuery,metricHistoryByAccount } from '../../GraphQLQueries/MetricQueries'


@Injectable()

class MetricGraphQLService {
    constructor(private gqlClientSvc: GraphQLClientService) {

    }

    async getMetricHistoryByAccount(accountId, metricName) { 
        const client: any = await this.gqlClientSvc.getCognitoHcAsync();
        return client.mutate({
            mutation: metricHistoryByAccount,
            variables: { metricName,accountId },
        })
    }

    getMetricHistoryByBalanceSheet() { }

    async getMetricHistoryUser(metricName) {
        const client: any = await this.gqlClientSvc.getCognitoHcAsync();
        return client.mutate({
            mutation: metricQuery,
            variables: { metricName },
        })
    }

}
export { MetricGraphQLService as ExportedClass }