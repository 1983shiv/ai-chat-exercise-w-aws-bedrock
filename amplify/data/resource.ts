import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { chat } from "../functions/chat/resource"

const schema = a.schema({
  chat: a
    .query()
    .arguments({ message: a.string()})
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(chat))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
