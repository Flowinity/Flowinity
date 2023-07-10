import {Service} from "typedi"
import {Compute, GoogleAuth} from "google-auth-library"
import {GetAccessTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";

@Service()
export class GoogleService {
    async generateToken(): Promise<string | null | undefined> {
        try {
            const key = config.providers.google

            if (!key) return ""

            const auth: GoogleAuth = new GoogleAuth({
                keyFile: process.env.APP_ROOT + "/config/google.json",
                scopes: "https://www.googleapis.com/auth/firebase.messaging"
            })
            const client: JSONClient | Compute = await auth.getClient()
            const token: GetAccessTokenResponse = await client.getAccessToken()

            await redis.set("providers:google:token", token.token, "EX", 3500)

            console.log(token.token)

            return token.token
        } catch (e) {
            console.log(e)
            return ""
        }
    }
}
