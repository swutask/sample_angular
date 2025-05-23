import {
  Injectable
} from '@angular/core';
import {
  articles,
  configurations,
  createFile,
  deleteUser,
  createPortalStripe,
  getSignedUrl,
  putSignedUrl,
  resource,
  resources,
  updateEmail,
  updatePhone,
  updateUser,
  user,
  verifyEmail,
  verifyPhone,
  bitrixToWbSyncQuery
} from '../../GraphQLQueries/UserQueries';
import {
  ExportedClass as GraphQLClientService
} from './GraphQLClientService';

@Injectable()
class UserGraphQLService {
  constructor(
    private gqlClientSvc: GraphQLClientService
  ) { }

  async updateUser(updateUserInput, userExistingData) {
    const client = await this.gqlClientSvc.getCognitoHcAsync();

    // Remove typename from customAccounts for mutation input
    let customAccounts;
    if ("customAccounts" in updateUserInput) {
      customAccounts = updateUserInput.customAccounts.map(acc => ({ label: acc.label, value: acc.value }));
    }
    // Remove typename from customGoals for mutation input
    let customGoals;
    if ("customGoals" in updateUserInput) {
      customGoals = updateUserInput.customGoals.map(acc => ({ label: acc.label, value: acc.value }));
    }

    return client.mutate({
      mutation: updateUser,
      variables: { ...updateUserInput, customAccounts, customGoals},
      optimisticResponse: () => ({
        updateUser: {
          ...userExistingData,
          ...updateUserInput
        }
      }),
      update: (cache, { data: { updateUser } }) => {
        const data = cache.readQuery({ query: user });
        data.user = { ...updateUser };
        cache.writeQuery({ query: user, data });
      }
    })
  }

  async getUser(forceUpdate: boolean = false) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: user,
      fetchPolicy: forceUpdate ? 'cache-and-network' : 'cache-first'
    });
  }

  async getUserOnce() {
    const client: any = await this.gqlClientSvc.getCognitoClient()

    return client.watchQuery({
      query: user,
      fetchPolicy: 'no-cache'
    });
  }

  async verifyEmail(email: string) {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: verifyEmail,
      variables: { email }
    })
  }

  async verifyPhone(phone: string) {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: verifyPhone,
      variables: { phone }
    })
  }

  async updateEmail(email: string, otp: string) {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: updateEmail,
      variables: { email, otp }
    })
  }

  async updatePhone(phone: string, otp: string) {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: updatePhone,
      variables: { phone, otp }
    })
  }

  async getArticles(forceUpdate: boolean = false) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: articles,
      fetchPolicy: forceUpdate ? 'cache-and-network' : 'cache-first'
    });
  }

  async getResources(forceUpdate: boolean = false) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: resources,
      fetchPolicy: forceUpdate ? 'cache-and-network' : 'cache-first'
    });
  }

  async getResource(id: string, forceUpdate: boolean = false) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: resource,
      variables: { id },
      fetchPolicy: forceUpdate ? 'cache-and-network' : 'cache-first'
    });
  }

  async getSignedUrl(fileName: string, forceUpdate: boolean = false) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.watchQuery({
      query: getSignedUrl,
      variables: { fileName },
      fetchPolicy:  forceUpdate ? 'cache-and-network' : 'cache-first'
    });
  }

  async putSignedUrl(fileName: string, fileType: string) {
    const client: any = await this.gqlClientSvc.getCognitoHcAsync()

    return client.query({
      query: putSignedUrl,
      variables: { fileName, fileType },
      fetchPolicy: "network-only"
    });
  }

  async createFile(file) {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: createFile,
      variables: { file }
    })
  }

  async deleteUser() {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: deleteUser
    })
  }
  
  async configurations(forceUpdate?: boolean) {
    const client: any = await this.gqlClientSvc.getApiKeyClient();

    return client.query({
      query: configurations,
      fetchPolicy: forceUpdate ? 'network-only' : 'cache-first'
    });
  }

  async createPortal() {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: createPortalStripe
    })
  }

  async bitrixToWbSync() {
    const client: any = await this.gqlClientSvc.getCognitoClient();

    return client.mutate({
      mutation: bitrixToWbSyncQuery
    })
  }
}

export { UserGraphQLService as ExportedClass };