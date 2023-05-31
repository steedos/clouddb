import { DynamooseModule } from 'nestjs-dynamoose';

// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';

// import { NotificationModule } from './modules/notification/notification.module';
import { RecordModule } from './modules/record/record.module';

export const setupSwagger = (app: any)=>{

  // swagger
  const config = new DocumentBuilder()
    .setTitle('CloudDB')
    .setDescription('The CloudDB API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/swagger', app, document);
}
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule.forRoot({
      oidcAuthority: 'https://id.steedos.cn/realms/master',
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   playground: true,
    // }),
    DynamooseModule.forRoot({
      local: process.env.IS_DDB_LOCAL === 'true',
      aws: { region: process.env.REGION },
      table: {
        create: process.env.IS_DDB_LOCAL === 'true',
        prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
        suffix: '-table',
      },
    }),
    // NotificationModule,
    RecordModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
