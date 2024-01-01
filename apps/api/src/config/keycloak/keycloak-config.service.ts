import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakConnectOptions, KeycloakConnectOptionsFactory, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {

  constructor(private configService: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.configService.get<string>('AUTH_SERVER_URL'),
      realm: this.configService.get<string>('REALM'),
      clientId: this.configService.get<string>('CLIENT_ID'),
      secret: this.configService.get<string>('SECRET_KEY'),
      cookieKey: this.configService.get<string>('COOKIE_KEY'),
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.OFFLINE,
      logLevels: ['warn', 'error'],
      useNestLogger: false
    };
  }
  
}