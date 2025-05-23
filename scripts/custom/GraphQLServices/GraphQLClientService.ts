import {
    Injectable
} from '@angular/core';

@Injectable()

class GraphQLClientService {
    public apiKeyClient: any;
    public cognitoClient: any;

    constructor() { }

    public getCognitoHcAsync() {
        return this.cognitoClient.hydrated();
    }

    public getCognitoClient() {
        return new Promise((resolve) => resolve(this.cognitoClient));
    }

    public getApiKeyClient() {
        return new Promise((resolve) => resolve(this.apiKeyClient));
    }

    public setCognitoClient(client: any) {
        this.cognitoClient = client;
    }

    public setApiKeyClient(client: any) {
        this.apiKeyClient = client;
    }
}

export { GraphQLClientService as ExportedClass };