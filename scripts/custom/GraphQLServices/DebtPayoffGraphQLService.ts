import {
    Injectable
} from '@angular/core';
import {
    calculateDebtPayoff
} from '../../GraphQLQueries/DebtPayoffQueries';
import {
    ExportedClass as GraphQLClientService
} from './GraphQLClientService';

@Injectable()

class DebtPayoffGraphQLService {
    constructor(
        private gqlClientSvc: GraphQLClientService
    ) { }

    async calculateDebtPayoff(sortPayoffBy: string) {
        const client: any = await this.gqlClientSvc.getCognitoClient();

        return client.mutate({
            mutation: calculateDebtPayoff,
            variables: { sortPayoffBy },
            fetchPolicy: "no-cache"
        })
    }
}

export { DebtPayoffGraphQLService as ExportedClass };