import { Injectable } from '@angular/core';
import { loginOTP, sendOTP, sendOTPWordpress, loginOTPWordpress, signUp } from '../../GraphQLQueries/AuthQueries';
import {
  ExportedClass as GraphQLClientService
} from './GraphQLClientService';

@Injectable()

class AuthGraphQLService {
  constructor(
    private gqlClientSvc: GraphQLClientService
  ) { }

  async sendOTP(username: string, recaptchaToken: string) {
    let client: any = await this.gqlClientSvc.getApiKeyClient();

    return client.mutate({
      mutation: sendOTP,
      variables: { username, recaptchaToken },
    });
  }

  async sendOTPWordpress(username: string, recaptchaToken: string, wplicensetoken: string) {
    let client: any = await this.gqlClientSvc.getApiKeyClient();

    return client.mutate({
      mutation: sendOTPWordpress,
      variables: { username, recaptchaToken, isWordpress: true },
      context: {
        headers: {
          wplicensetoken
        }
      }
    });
  }

  async loginOTP(username: string, otp: string, recaptchaToken: string) {
    let client: any = await this.gqlClientSvc.getApiKeyClient();

    let variables: any = { otp, recaptchaToken };

    // username will be null when redirected from email login link
    if (username) {
      variables.username = username;
    }

    return client.mutate({
      mutation: loginOTP,
      variables
    });
  }

  async loginOTPWordpress(username: string, otp: string, recaptchaToken: string, wplicensetoken: string) {
    let client: any = await this.gqlClientSvc.getApiKeyClient();

    let variables: any = { otp, recaptchaToken, isWordpress: true };

    // username will be null when redirected from email login link
    if (username) {
      variables.username = username;
    }

    return client.mutate({
      mutation: loginOTPWordpress,
      variables,
      context: {
        headers: {
          wplicensetoken
        }
      }
    });
  }

  async signUp(countryCode: string, phone: string, recaptchaToken: string) {

    let client:any = await this.gqlClientSvc.getApiKeyClient();

    return client.mutate({
      mutation: signUp,
      variables: { countryCode, phone, recaptchaToken }
    });
  }
}

export { AuthGraphQLService as ExportedClass };