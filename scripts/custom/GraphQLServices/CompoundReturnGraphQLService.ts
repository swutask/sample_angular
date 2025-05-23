import {
    Injectable
} from '@angular/core';
import {
    calculateCompoundReturn
} from '../../GraphQLQueries/CompoundReturnQueries';
import {
    ExportedClass as GraphQLClientService
} from './GraphQLClientService';
import {
    ExportedClass as TCompoundReturn
} from '../../custom/TCompoundReturn';

@Injectable()

class CompoundReturnGraphQLService {
    constructor(
        private gqlClientSvc: GraphQLClientService
    ) { }

    async calculateCompoundReturn(input: TCompoundReturn) {
        const client: any = await this.gqlClientSvc.getCognitoClient();

        return client.mutate({
            mutation: calculateCompoundReturn,
            variables: { ...input },
            fetchPolicy: "no-cache"
        })
    }
}

export { CompoundReturnGraphQLService as ExportedClass };