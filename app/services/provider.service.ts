import { Service } from "typedi"
import axios from "axios"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"
import { ProfileLayoutComponent, User } from "@app/models/user.model"

@Service()
export class ProviderService {
  constructor() {}

  async tenor(search: string, next: string | undefined = undefined) {
    const { data } = await axios.get(
      `https://tenor.googleapis.com/v2/search?q=${search}&key=${config.providers.tenor}&limit=20&pos=${next}`
    )
    return data
  }

  async verifyUser(username: string, provider: string, currentUserId: number) {
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

    if (
      !user?.profileLayout?.layout.columns[0].rows.find(
        (row) => row.name === (provider === "lastfm" ? "last-fm" : provider)
      ) &&
      !user?.profileLayout?.layout.columns[0].rows
        .find((row) => row.name === "parent")
        ?.props.children.find(
          (child: ProfileLayoutComponent) =>
            child.name === (provider === "lastfm" ? "last-fm" : provider)
        ) &&
      user.id !== currentUserId
    )
      throw Errors.PROVIDER_WIDGET_DISABLED
    return user
  }
}
