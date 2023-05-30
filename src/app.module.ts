import { DynamooseModule } from 'nestjs-dynamoose';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './modules/config/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  AuthGuard, KeycloakConnectModule,
  ResourceGuard,
  RoleGuard
} from 'nest-keycloak-connect';
import { KeycloakConfigService } from './modules/config/keycloak-config.service';

import { NotificationModule } from './modules/notification/notification.module';
import { RecordModule } from './modules/record/record.module';
@Module({
  imports: [
    // ConfigModule.forRoot(),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [ConfigModule]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    DynamooseModule.forRoot({
      local: process.env.IS_DDB_LOCAL === 'true',
      aws: { region: process.env.REGION },
      table: {
        create: process.env.IS_DDB_LOCAL === 'true',
        prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
        suffix: '-table',
      },
    }),
    NotificationModule,
    RecordModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
