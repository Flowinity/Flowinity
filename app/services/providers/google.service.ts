import {Service} from "typedi"
import {GoogleAuth} from "google-auth-library"

@Service()
export class GoogleService {
    async generateToken() {
        try {
            const key = config.providers.google
            if (!key) return ""
            const auth = new GoogleAuth({
                keyFile: process.env.APP_ROOT + "/config/google.json",
                scopes: "https://www.googleapis.com/auth/firebase.messaging"
            })
            const client = await auth.getClient()
            const token = await client.getAccessToken()
            await redis.set("providers:google:token", token.token, "EX", 3500)
            console.log(token.token)
            return token.token
        } catch (e) {
            console.log(e)
            return ""
        }
    }
}
