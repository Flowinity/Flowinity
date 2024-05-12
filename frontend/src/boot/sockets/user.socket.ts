/*import { useSubscription } from "@vue/apollo-composable";
import { UserStatusSubscription } from "@/graphql/user/subscriptions/status.graphql";
import { useUserStore } from "@/stores/user.store";

export default function setup() {
  const userStore = useUserStore();
  const userStatus = useSubscription(UserStatusSubscription);

  userStatus.onResult(({ data: { onUserStatus } }) => {
    const index = userStore.tracked.findIndex((f) => f.id === userStatus.id);

    if (index === -1) return;
    userStore.tracked[index].status = userStatus.status;
    userStore.tracked[index].platforms = userStatus.platforms;
  });
}
*/
