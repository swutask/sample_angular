import { Injectable } from '@angular/core';
import { ApolloLink } from 'apollo-link';
import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink } from 'aws-appsync';
import { onError } from 'apollo-link-error';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import {
  ExportedClass as AuthService
} from './../custom/AuthService';
import {
  ExportedClass as GraphQLClientService
} from './../custom/GraphQLServices/GraphQLClientService';
import {
  ExportedClass as AppSideMenuService
} from '../../scripts/custom/AppSideMenuService';

@Injectable()
export class AppSyncService {

  constructor(private toastCtrl: ToastController, private authService: AuthService, private gqlClientSvc: GraphQLClientService, public appSideMenuService: AppSideMenuService) {
    this.authService.off(AuthService.COGNITO_CLIENT_EVENT, this.initiateCognitoClient.bind(this)).on(AuthService.COGNITO_CLIENT_EVENT, this.initiateCognitoClient.bind(this));
    this.createUnprotectedClient();
  }

  onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {

      graphQLErrors.map(({ message, locations, path }) => {
        if (message === 'Token has expired.') {
          this.appSideMenuService.bindHandlers();
          this.authService.logout();
        }
        this.toast(message)

        return message

      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  initiateCognitoClient(token) {
    this.createProtectedClient(token)
  }

  createUnprotectedClient() {
    const { apiKeyClient } = environment;

    const client = new AWSAppSyncClient({
      disableOffline: apiKeyClient.disableOffline,
      url: apiKeyClient.url,
      region: apiKeyClient.region,
      auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: apiKeyClient.auth.apiKey,
      }
    }, {
      link: ApolloLink.from([
        this.onErrorLink,
        createAppSyncLink({
          url: apiKeyClient.url,
          region: apiKeyClient.region,
          auth: {
            type: AUTH_TYPE.API_KEY,
            apiKey: apiKeyClient.auth.apiKey,
          },
          complexObjectsCredentials: apiKeyClient.complexObjectsCredentials
        })
      ])
    });

    this.gqlClientSvc.setApiKeyClient(client);

    return client;
  }

  createProtectedClient(token: string) {
    const { cognitoClient } = environment;

    const client = new AWSAppSyncClient({
      disableOffline: cognitoClient.disableOffline,
      url: cognitoClient.url,
      region: cognitoClient.region,
      auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => {
          return token
        },
      },
      // offlineConfig: {
      //   callback: (err, succ) => {
      //     if (err) {
      //       const { mutation, variables } = err;

      //       console.error(`ERROR for ${mutation}`, err);
      //     } else {
      //       const { mutation, variables } = succ;

      //       console.info(`SUCCESS for ${mutation}`, succ);
      //     }
      //   },
      //   keyPrefix: cognitoClient.keyPrefix
      // },
    }, {
      link: ApolloLink.from([
        this.onErrorLink,
        createAppSyncLink({
          url: cognitoClient.url,
          region: cognitoClient.region,
          auth: {
            type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
            jwtToken: async () => {
              return token
            },
          },
          complexObjectsCredentials: cognitoClient.complexObjectsCredentials
        })
      ])
    });

    this.gqlClientSvc.setCognitoClient(client)

    return client;
  }

  async toast(msg: string) {
    const toastInst = await this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom',
      mode: 'md'
    });
    await toastInst.present();
  }

}

export {
  AppSyncService as ExportedClass
};
