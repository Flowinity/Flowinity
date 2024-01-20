import { afterAll, beforeAll, expect, test, describe } from "@jest/globals"
import "@app/lib/init-tests"
import { gCall } from "@app/lib/test-utils/gCall"
import { RegisterMutation } from "../../../frontend/src/graphql/auth/register.graphql"
import { LoginMutation } from "../../../frontend/src/graphql/auth/login.graphql"
import { CoreStateQuery } from "../../../frontend/src/graphql/core/state.graphql"
import cryptoRandomString from "crypto-random-string"
import { ProfileQuery } from "../../../frontend/src/graphql/user/profile.graphql"
import { User } from "@app/models/user.model"
import {
  SendEmailVerificationMutation,
  VerifyEmailMutation
} from "../../../frontend-v5/src/graphql/user/verifyEmail.graphql"
import { SessionsQuery } from "../../../frontend-v5/src/graphql/user/sessions.graphql"
import { UpdateUserMutation } from "../../../frontend/src/graphql/user/update.graphql"
import { UpdateUserStatusMutation } from "../../../frontend-v5/src/graphql/user/update.graphql"
import { UserStoredStatus } from "../../../frontend/src/gql/graphql"
import {
  ChangeUserEmailMutation,
  ChangeUserPasswordMutation
} from "../../../frontend/src/graphql/user/changeUsername.graphql"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
import { errorConverter } from "@app/lib/test-utils/errorConverter"
import { resetState } from "@app/lib/init-tests"
import { AdminService } from "@app/services/admin.service"
import { OAuthAppResolver } from "@app/controllers/graphql/oAuthApp.resolver"
import { CreateOauthAppMutation } from "../../../frontend-v5/src/graphql/developer/createApp.graphql"
import {
  MyAppQuery,
  MyAppsQuery
} from "../../../frontend-v5/src/graphql/developer/myApps.graphql"
import utils from "@app/lib/utils"
import {
  AuthorizeAppMutation,
  DeauthorizeAppMutation,
  OauthAppConsentQuery
} from "../../../frontend-v5/src/graphql/developer/consent.graphql"
import supertest from "supertest"
import { Container } from "typedi"
import { Server } from "@app/server"
import { Application } from "@app/app"
import Errors from "@app/lib/errors"
import {
  AddOauthUserMutation,
  ResetOauthAppSecretMutation,
  UpdateOauthAppMutation
} from "../../../frontend-v5/src/graphql/developer/updateApp.graphql"
import { CreateBotAccountMutation } from "../../../frontend/src/graphql/developer/createApp.graphql"

let adminUser: TestUser | null = null
let user: TestUser | null = null
let manualUser: TestUser | null = null
const rid = cryptoRandomString({
  length: 10,
  type: "alphanumeric"
})
let appId = ""
let appToken = ""
let explicitAppToken = ""
let nonOwnerAppToken = ""
let req: supertest.SuperTest<supertest.Test> | null = null
let appSecret = ""

describe("OAuthAppResolver", () => {
  test("Create OAuth app", async () => {
    const data = await gCall({
      source: CreateOauthAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          name: "Test app",
          description: "Test app description",
          redirectUri: "http://localhost:3000",
          private: false,
          verified: false
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.createOauthApp).toMatchObject({
      id: expect.any(String)
    })
    appId = data.data.createOauthApp.id
  })

  test("Ensure admins can create verified apps", async () => {
    const data = await gCall({
      source: CreateOauthAppMutation,
      token: adminUser!.token,
      variableValues: {
        input: {
          name: "Test app for admin",
          description: "Test app description",
          redirectUri: "https://test.com",
          private: false,
          verified: true
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.createOauthApp).toMatchObject({
      id: expect.any(String)
    })
  })

  test("Ensure regular users can't create verified apps", async () => {
    const data = await gCall({
      source: CreateOauthAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          name: "Test app for admin",
          description: "Test app description",
          redirectUri: "https://192.168.0.1",
          private: false,
          verified: true
        }
      }
    })
    expect(data.errors).toMatchObject([errorConverter(undefined, "NOT_ADMIN")])
  })

  test("Ensure the apps were created", async () => {
    const data = await gCall({
      source: MyAppsQuery,
      token: user!.token
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.oauthApps).toMatchObject([
      {
        name: "Test app",
        description: "Test app description",
        redirectUri: "http://localhost:3000",
        private: false,
        verified: false
      }
    ])
    expect(data.data.oauthApps.length).toBe(1)

    const data2 = await gCall({
      source: MyAppsQuery,
      token: adminUser!.token
    })
    expect(data2.errors).toBeUndefined()
    expect(data2.data.oauthApps).toMatchObject([
      {
        name: "Test app for admin",
        description: "Test app description",
        redirectUri: "https://test.com",
        private: false,
        verified: true
      }
    ])
    expect(data2.data.oauthApps.length).toBe(1)
  })

  test("Get secret", async () => {
    const data = await gCall({
      source: MyAppQuery,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.oauthApp.secret).toBeDefined()
    appSecret = data.data.oauthApp.secret
  })

  test("Test Oauth login consent flow with invalid scopes", async () => {
    const consentApp = await gCall({
      source: OauthAppConsentQuery,
      token: adminUser!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(consentApp.errors).toBeUndefined()
    expect(consentApp.data.oauthAppConsent).toMatchObject({
      id: appId,
      name: "Test app",
      description: "Test app description",
      redirectUri: "http://localhost:3000",
      private: false,
      verified: false
    })
    expect(consentApp.data.oauthAppConsent.secret).toBeUndefined()

    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: "*"
        }
      }
    })
    expect(authorize.errors).toMatchObject([
      errorConverter("Scopes do not match.", undefined)
    ])
  })

  test("Test Oauth login consent flow", async () => {
    const consentApp = await gCall({
      source: OauthAppConsentQuery,
      token: adminUser!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(consentApp.errors).toBeUndefined()
    expect(consentApp.data.oauthAppConsent).toMatchObject({
      id: appId,
      name: "Test app",
      description: "Test app description",
      redirectUri: "http://localhost:3000",
      private: false,
      verified: false
    })
    expect(consentApp.data.oauthAppConsent.secret).toBeUndefined()

    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: consentApp.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize.errors).toBeUndefined()
    expect(authorize.data.oauthAppAuthorize).toMatchObject({
      token: expect.any(String)
    })
    appToken = authorize.data.oauthAppAuthorize.token

    const authorize2 = await gCall({
      source: AuthorizeAppMutation,
      token: adminUser!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: consentApp.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize2.errors).toBeUndefined()
    expect(authorize2.data.oauthAppAuthorize).toMatchObject({
      token: expect.any(String)
    })
    nonOwnerAppToken = authorize2.data.oauthAppAuthorize.token
  })

  test("Get user from app", async () => {
    // We're using Supertest as we need to use the legacy APIv3
    const data = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json",
      // strict app enforcement
      "X-TPU-App-Id": appId
    })

    expect(data.body).toMatchObject({
      id: user!.id,
      username: user!.username,
      email: user!.email
    })

    // We don't have those scopes, so they shouldn't be returned
    expect(data.body.avatar).toBeUndefined()
    expect(data.body.save).toBeUndefined()
  })

  test("Get user from app with invalid strict app enforcement", async () => {
    // We're using Supertest as we need to use the legacy APIv3
    const data = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json",
      // strict app enforcement
      "X-TPU-App-Id": "invalid"
    })

    expect(data.body).toMatchObject({
      errors: [
        {
          ...Errors.SECURITY_APP_ID_ERROR,
          name: "SECURITY_APP_ID_ERROR"
        }
      ]
    })
    expect(data.statusCode).toBe(400)
  })

  test("Get user from app with no strict app enforcement", async () => {
    const data = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })

    expect(data.body).toMatchObject({
      id: user!.id,
      username: user!.username,
      email: user!.email
    })

    // We don't have those scopes, so they shouldn't be returned
    expect(data.body.avatar).toBeUndefined()
    expect(data.body.save).toBeUndefined()
  })

  test("Try an oauth.save without scope", async () => {
    const data = await req!
      .post("/api/v3/oauth/save")
      .set({
        Authorization: appToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      })
      .send({
        data: {
          myData: "yes"
        }
      })

    expect(data.body).toMatchObject({
      errors: [
        {
          ...Errors.SCOPE_REQUIRED,
          name: "SCOPE_REQUIRED"
        }
      ]
    })
    expect(data.statusCode).toBe(400)

    const app = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })

    expect(app.body).toMatchObject({
      id: user!.id,
      username: user!.username,
      email: user!.email
    })
    expect(app.body.save).toBeUndefined()
  })

  test("Change app scopes", async () => {
    const data = await gCall({
      source: UpdateOauthAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: [
            "oauth.user.avatar",
            "oauth.save",
            "oauth.user.id",
            "oauth.user.username"
          ],
          name: "Test app",
          description: "Test app description",
          redirectUri: "http://localhost:3000",
          private: false,
          verified: false
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.updateOauthApp.success).toBe(true)
  })

  test("Ensure scope persistence, requiring you to reconsent", async () => {
    const data = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })

    expect(data.body).toMatchObject({
      id: user!.id,
      username: user!.username,
      email: user!.email
    })
  })

  test("De-authorize from app", async () => {
    const deauthorize = await gCall({
      source: DeauthorizeAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(deauthorize.errors).toBeUndefined()
    expect(deauthorize.data.oauthAppDeauthorize.success).toBe(true)

    const data = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })
    expect(data.body).toMatchObject({
      errors: [
        {
          ...Errors.INVALID_TOKEN,
          name: "INVALID_TOKEN"
        }
      ]
    })
    expect(data.statusCode).toBe(400)
  })

  test("Re-authorize app", async () => {
    const app = await gCall({
      source: OauthAppConsentQuery,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: app.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize.errors).toBeUndefined()
    expect(authorize.data.oauthAppAuthorize).toMatchObject({
      token: expect.any(String)
    })
    appToken = authorize.data.oauthAppAuthorize.token
  })

  test("Try an oauth.save with scope", async () => {
    const data = await req!
      .post("/api/v3/oauth/save")
      .set({
        Authorization: appToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      })
      .send({
        data: {
          myData: "yes"
        }
      })

    expect(data.statusCode).toBe(204)

    const app = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })

    expect(app.body).toMatchObject({
      id: user!.id,
      username: user!.username,
      save: {
        myData: "yes"
      }
    })
    expect(app.body.email).toBeUndefined()

    await req!
      .post("/api/v3/oauth/save")
      .set({
        Authorization: appToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      })
      .send({
        data: {
          myData: "no"
        }
      })
  })

  test("Test save version control", async () => {
    const oauth = (await db.models.OauthSave.findOne({
      where: {
        userId: user!.id,
        oauthAppId: appId
      }
    })) as any
    expect(oauth.history[0].data).toMatchObject({
      myData: "yes"
    })
    expect(oauth.data).toMatchObject({
      myData: "no"
    })
  })

  test("Ensure non admins cannot update the app to verified", async () => {
    const data = await gCall({
      source: UpdateOauthAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: [
            "oauth.user.avatar",
            "oauth.save",
            "oauth.user.id",
            "oauth.user.username"
          ],
          name: "Test app",
          description: "Test app description",
          redirectUri: "http://localhost:3000",
          private: false,
          verified: true
        }
      }
    })
    expect(data.errors).toMatchObject([errorConverter(undefined, "NOT_ADMIN")])

    const app = await gCall({
      source: OauthAppConsentQuery,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(app.errors).toBeUndefined()
    expect(app.data.oauthAppConsent).toMatchObject({
      id: appId,
      name: "Test app",
      description: "Test app description",
      redirectUri: "http://localhost:3000",
      private: false,
      verified: false
    })
  })

  test("Add explicit user to app", async () => {
    const data = await gCall({
      source: AddOauthUserMutation,
      token: user!.token,
      variableValues: {
        input: {
          username: manualUser!.username,
          oauthAppId: appId,
          manage: true
        }
      }
    })
    expect(data.errors).toBeUndefined()

    const app = await gCall({
      source: MyAppQuery,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(app.errors).toBeUndefined()
    expect(app.data.oauthApp.oauthUsers).toMatchObject([
      {
        id: expect.any(String),
        userId: manualUser!.id,
        oauthAppId: appId,
        manage: true,
        active: true,
        user: {
          username: manualUser!.username,
          id: manualUser!.id
        }
      }
    ])
    expect(app.data.oauthApp.oauthUsers.length).toBe(1)
  })

  test("Consent with explicit user", async () => {
    const consentApp = await gCall({
      source: OauthAppConsentQuery,
      token: manualUser!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(consentApp.errors).toBeUndefined()
    expect(consentApp.data.oauthAppConsent).toMatchObject({
      id: appId,
      name: "Test app",
      description: "Test app description",
      redirectUri: "http://localhost:3000",
      private: false,
      verified: false
    })
    expect(consentApp.data.oauthAppConsent.secret).toBeUndefined()

    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: manualUser!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: consentApp.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize.errors).toBeUndefined()
    expect(authorize.data.oauthAppAuthorize).toMatchObject({
      token: expect.any(String)
    })
    explicitAppToken = authorize.data.oauthAppAuthorize.token
  })

  test("Set app to private", async () => {
    const data = await gCall({
      source: UpdateOauthAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: [
            "oauth.user.avatar",
            "oauth.save",
            "oauth.user.id",
            "oauth.user.username"
          ],
          name: "Test app",
          description: "Test app description",
          redirectUri: "http://localhost:3000",
          private: true,
          verified: false
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.updateOauthApp.success).toBe(true)
  })

  test("Test destruction of existing sessions after privacy update", async () => {
    // The explicitly added user should not have their session destroyed.
    const u = await req!.get("/api/v3/oauth/user").set({
      Authorization: explicitAppToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })
    expect(u.body).toMatchObject({
      id: manualUser!.id,
      username: manualUser!.username
    })

    // The owner should also not have their session destroyed.
    const owner = await req!.get("/api/v3/oauth/user").set({
      Authorization: appToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })
    expect(owner.body).toMatchObject({
      id: user!.id,
      username: user!.username
    })

    // A user who is not explicitly added should have their session destroyed.
    const nonOwner = await req!.get("/api/v3/oauth/user").set({
      Authorization: nonOwnerAppToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })
    expect(nonOwner.body).toMatchObject({
      errors: [
        {
          ...Errors.INVALID_TOKEN,
          name: "INVALID_TOKEN"
        }
      ]
    })
    expect(nonOwner.statusCode).toBe(400)
  })

  test("Try private login flow", async () => {
    const consentApp = await gCall({
      source: OauthAppConsentQuery,
      token: adminUser!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(consentApp.errors).toBeUndefined()
    expect(consentApp.data.oauthAppConsent).toMatchObject({
      id: appId,
      name: "Test app",
      description: "Test app description",
      redirectUri: "http://localhost:3000",
      private: true,
      verified: false
    })
    expect(consentApp.data.oauthAppConsent.secret).toBeUndefined()

    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: adminUser!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: consentApp.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize.errors).toBeDefined()
    expect(authorize.data).toBeNull()
  })

  test("Test token restoration", async () => {
    const consentApp = await gCall({
      source: OauthAppConsentQuery,
      variableValues: {
        input: {
          id: appId
        }
      },
      token: adminUser!.token
    })
    expect(consentApp.errors).toBeUndefined()

    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: consentApp.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize.errors).toBeUndefined()
    expect(authorize.data.oauthAppAuthorize.token).toBe(appToken)
  })

  test("De-authorize and test explicit user with private app", async () => {
    const deauthorize = await gCall({
      source: DeauthorizeAppMutation,
      token: manualUser!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(deauthorize.errors).toBeUndefined()
    expect(deauthorize.data.oauthAppDeauthorize.success).toBe(true)

    const data = await req!.get("/api/v3/oauth/user").set({
      Authorization: explicitAppToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    })
    expect(data.body).toMatchObject({
      errors: [
        {
          ...Errors.INVALID_TOKEN,
          name: "INVALID_TOKEN"
        }
      ]
    })
    expect(data.statusCode).toBe(400)

    const app = await gCall({
      source: OauthAppConsentQuery,
      token: manualUser!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(app.errors).toBeUndefined()

    const authorize = await gCall({
      source: AuthorizeAppMutation,
      token: manualUser!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: app.data.oauthAppConsent.scopes
        }
      }
    })
    expect(authorize.errors).toBeUndefined()
    expect(authorize.data.oauthAppAuthorize).toMatchObject({
      token: expect.any(String)
    })
    explicitAppToken = authorize.data.oauthAppAuthorize.token
  })

  test("Get apps from manager, private app should be listed", async () => {
    const data = await gCall({
      source: MyAppsQuery,
      token: manualUser!.token
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.oauthApps).toMatchObject([
      {
        name: "Test app",
        description: "Test app description",
        redirectUri: "http://localhost:3000",
        private: true,
        verified: false
      }
    ])
    expect(data.data.oauthApps.length).toBe(1)
  })

  test("Update app from manager account", async () => {
    const data = await gCall({
      source: UpdateOauthAppMutation,
      token: manualUser!.token,
      variableValues: {
        input: {
          id: appId,
          scopes: [
            "oauth.user.avatar",
            "oauth.save",
            "oauth.user.id",
            "oauth.user.username"
          ],
          name: "Test app",
          description: "Test app description",
          redirectUri: "http://localhost:3000",
          private: false,
          verified: false
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.updateOauthApp.success).toBe(true)
  })

  test("Add bot user", async () => {
    const data = await gCall({
      source: CreateBotAccountMutation,
      token: user!.token,
      variableValues: {
        input: {
          username: `OauthBot-${rid}`,
          id: appId
        }
      }
    })
    expect(data.errors).toBeUndefined()

    const acc = await gCall({
      source: CoreStateQuery,
      token: appSecret
    })
    expect(acc.errors).toBeUndefined()
    expect(acc.data.currentUser).toMatchObject({
      username: `OauthBot-${rid}`,
      id: expect.any(Number)
    })
  })

  test("Reset app secret", async () => {
    const data = await gCall({
      source: ResetOauthAppSecretMutation,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.resetOauthSecret.success).toBe(true)

    const acc = await gCall({
      source: CoreStateQuery,
      token: appSecret
    })
    expect(acc.errors).toBeUndefined()
    expect(acc.data.currentUser).toBeNull()

    const app = await gCall({
      source: MyAppQuery,
      token: user!.token,
      variableValues: {
        input: {
          id: appId
        }
      }
    })
    expect(app.errors).toBeUndefined()
    expect(app.data.oauthApp.secret).toBeDefined()
    expect(app.data.oauthApp.secret).not.toBe(appSecret)

    appSecret = app.data.oauthApp.secret

    const acc2 = await gCall({
      source: CoreStateQuery,
      token: appSecret
    })
    expect(acc2.errors).toBeUndefined()
    expect(acc2.data.currentUser).toMatchObject({
      username: `OauthBot-${rid}`,
      id: expect.any(Number)
    })
  })
})

beforeAll(async () => {
  await resetState()
  const uadmin = (await db.models.User.create({
    username: `Collectivizer${rid}admin`,
    password: rid,
    email: `${rid + "collectivizeradmin"}@example.com`.toLowerCase(),
    administrator: true,
    emailVerified: true
  })) as any
  await db.models.Session.create({
    userId: uadmin.id,
    token: await utils.generateAPIKey("session"),
    scopes: "*",
    type: "session"
  })
  adminUser = await getUser(uadmin.id, undefined, true)

  for (let i = 0; i < 2; i++) {
    const u = await gCall({
      source: RegisterMutation,
      variableValues: {
        input: {
          username: `Collectivizer${rid}-${i}`,
          password: rid,
          email: `${rid}-${i}-collectivizer@example.com`
        }
      }
    })
    if (u.errors) console.log(JSON.stringify(u.errors))
    expect(u.errors).toBeUndefined()
    expect(u.data?.register).toMatchObject({
      user: {
        id: expect.any(Number),
        username: `Collectivizer${rid}-${i}`,
        email: `${rid}-${i}-collectivizer@example.com`
      },
      token: expect.any(String)
    })
    if (i === 0) user = await getUser(u.data.register.user.id)
    else manualUser = await getUser(u.data.register.user.id)
  }
  const server = Container.get(Application)
  req = supertest(server.app)
})
