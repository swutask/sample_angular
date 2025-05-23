import { Injectable } from "@angular/core";
import { Observable } from "apollo-link";
import { from } from "rxjs";
import {
    ExportedClass as MetricGraphQLService
} from "../../scripts/custom/GraphQLServices/MetricGraphQLService"

@Injectable()

class MetricService {
    constructor(private metricGraphQLService: MetricGraphQLService) { }

    metricData(name) {
        return from(this.metricGraphQLService.getMetricHistoryUser(name));
    }
    metricHistoryByAccount(accountId,name){
        return from(this.metricGraphQLService.getMetricHistoryByAccount(accountId, name));
    }
}
export { MetricService as ExportedClass }