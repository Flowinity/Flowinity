import { Service } from "typedi"
import axios from "axios"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"
import { User } from "@app/models/user.model"
import cryptoRandomString from "crypto-random-string"
import { ProfileLayoutComponent } from "@app/classes/graphql/user/profileLayout"

@Service()
export class ProviderService {
  constructor() {}

  async getLinkableProviders(user: User) {
    const malCodeChallenge: string = cryptoRandomString({ length: 128 })

    if (user)
      await redis.set(
        `providers:mal:${user.id}:code_challenge`,
        malCodeChallenge,
        { EX: 3600 }
      )

    let availableProviders: object[] = []

    if (config.providers.lastfm.key && config.providers.lastfm.secret)
      availableProviders.push({
        name: "Last.fm",
        id: "lastfm",
        key: config.providers.lastfm.key,
        url: `https://www.last.fm/api/auth/?api_key=${config.providers.lastfm.key}`,
        shortText: "Last.fm",
        color: "red",
        available: true
      })
    if (
      config.providers.discord.oAuthClientId &&
      config.providers.discord.oAuthClientSecret &&
      config.providers.discord.applicationId &&
      config.providers.discord.oAuthRedirectUri &&
      config.providers.discord.publicKey
    )
      availableProviders.push({
        id: "discord",
        key: config.providers.discord.oAuthClientId,
        url: `https://discord.com/api/oauth2/authorize?client_id=${config.providers.discord.oAuthClientId}&redirect_uri=${config.providers.discord.oAuthRedirectUri}&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections`,
        name: "Discord",
        shortText: "Discord",
        color: "#7289DA",
        available: true
      })
    if (config.providers.mal.key && config.providers.mal.secret)
      availableProviders.push({
        name: "MyAnimeList",
        id: "mal",
        key: config.providers.mal.key,
        url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${config.providers.mal.key}&code_challenge=${malCodeChallenge}&grant_type=authorization_code`,
        shortText: "MAL",
        color: "#2e51a2",
        available: true
      })

    return availableProviders
  }

  async tenor(search: string, next: string | undefined = undefined) {
    const { data } = await axios.get(`https://tenor.googleapis.com/v2/search`, {
      params: {
        q: search ? search : this.randomTenor(),
        key: config.providers.tenor,
        limit: 20,
        pos: next
      }
    })
    return data
  }

  async verifyUser(
    username: string,
    provider: string,
    currentUserId: number | undefined
  ) {
    const user = await User.findOne({
      where: {
        username: username
      },
      include: [
        {
          model: Integration,
          required: true,
          where: {
            type: provider
          }
        }
      ]
    })
    if (!user) throw Errors.USER_NOT_FOUND
    if (!currentUserId && !user.publicProfile) throw Errors.USER_NOT_FOUND

    if (
      !user?.profileLayout?.layout.columns[0].rows.find(
        (row) => row.name === (provider === "lastfm" ? "last-fm" : provider)
      ) &&
      !user?.profileLayout?.layout.columns[0].rows
        .find((row) => row.name === "parent")
        ?.props?.children?.find(
          (child: ProfileLayoutComponent) =>
            child.name === (provider === "lastfm" ? "last-fm" : provider)
        ) &&
      user.id !== currentUserId
    )
      throw Errors.PROVIDER_WIDGET_DISABLED
    return user
  }

  randomTenor() {
    const options = [
      "alyx vance",
      "jitsi",
      "gordon freeman",
      "when node.js",
      "epic embed fail",
      "loosey goosey",
      "my reaction to that information",
      "deez nuts breaking bad",
      "embed perms at level 10"
    ]
    // check if system time is 4:20-9am/pm
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    if (
      (hours === 4 && minutes >= 20) ||
      (hours >= 5 && hours <= 9) ||
      (hours === 16 && minutes <= 20)
    )
      return "420 missed"
    return options[Math.floor(Math.random() * options.length)]
  }
}
