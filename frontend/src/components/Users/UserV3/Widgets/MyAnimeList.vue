<template>
  <v-card class="mx-2 my-5">
    <v-toolbar>
      <v-toolbar-title>
        MyAnimeList
        <v-chip size="small">BETA</v-chip>
        <template v-if="!loading">
          &bullet;
          {{ malUser.anime_statistics.num_episodes.toLocaleString() }}
          episodes &bullet;
          {{ malUser.anime_statistics.num_days_watched.toLocaleString() }}
          days
        </template>
      </v-toolbar-title>
      <v-btn icon @click="page > 1 ? page-- : (page = 1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="getMAL">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon @click="page < pages ? page++ : page">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar>
    <template v-if="!loading">
      <v-list>
        <v-list-item
          v-for="anime in computedRecent"
          :key="anime.node.id"
          :href="anime.url"
          target="_blank"
        >
          <template v-slot:prepend>
            <v-img
              :src="anime.node.main_picture.medium"
              width="40"
              class="mr-3"
            ></v-img>
          </template>
          <v-list-item-title>{{ anime.node.title }}</v-list-item-title>
          <v-progress-linear
            :model-value="
              (anime.node.my_list_status.num_episodes_watched /
                anime.node.num_episodes) *
              100
            "
            :color="getStatusColor(anime.node.my_list_status.status)"
            height="20"
            class="mt-1"
          >
            <strong
              :class="{
                'text-white':
                  (anime.node.my_list_status.num_episodes_watched /
                    anime.node.num_episodes) *
                    100 <
                  70
              }"
              style="font-size: 14px"
            >
              {{ anime.node.my_list_status.num_episodes_watched }}/{{
                anime.node.num_episodes
              }}
              ({{ anime.node.my_list_status.score || "-" }}/10)
            </strong>
          </v-progress-linear>
          <v-select
            v-model="anime.node.my_list_status.status"
            :items="statuses"
            item-title="text"
            item-value="value"
            class="mt-n3"
            @update:model-value="
              updateAnime(
                anime.node.id,
                anime.node.my_list_status.num_episodes_watched,
                anime.node.my_list_status.score,
                $event
              )
            "
            bg-color="transparent"
            :disabled="user.id !== $user.user?.id"
          >
            <template v-slot:append>
              <div style="display: flex; align-items: center">
                {{ $date(anime.node.my_list_status.updated_at).fromNow() }}
                <template
                  v-if="
                    user.id === $user.user?.id &&
                    anime.node.my_list_status.status === 'watching'
                  "
                >
                  <v-btn
                    icon
                    size="x-small"
                    @click="
                      updateAnime(
                        anime.node.id,
                        anime.node.my_list_status.num_episodes_watched - 1,
                        anime.node.my_list_status.score,
                        anime.node.my_list_status.status
                      )
                    "
                    :loading="partialLoading"
                  >
                    <v-icon>mdi-minus</v-icon>
                    <v-tooltip location="top" activator="parent" :eager="false">
                      Decrease watched episode count
                    </v-tooltip>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    @click="
                      updateAnime(
                        anime.node.id,
                        anime.node.my_list_status.num_episodes_watched + 1,
                        anime.node.my_list_status.score,
                        anime.node.my_list_status.status
                      )
                    "
                    :loading="partialLoading"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip location="top" activator="parent" :eager="false">
                      Increase watched episode count
                    </v-tooltip>
                  </v-btn>
                </template>
              </div>
            </template>
          </v-select>
        </v-list-item>
      </v-list>
    </template>
    <template v-else>
      <MessageSkeleton />
    </template>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import { MalUser } from "@/types/mal/user";
import { MalAnime } from "@/types/mal/anime";

export default defineComponent({
  name: "MyAnimeList",
  components: { MessageSkeleton },
  props: ["user", "component"],
  data() {
    return {
      recent: [] as MalAnime[],
      page: 1,
      malUser: null as MalUser | null,
      loading: true,
      partialLoading: false,
      statuses: [
        {
          text: "Watching",
          value: "watching"
        },
        {
          text: "Completed",
          value: "completed"
        },
        {
          text: "On Hold",
          value: "on_hold"
        },
        {
          text: "Dropped",
          value: "dropped"
        },
        {
          text: "Plan to Watch",
          value: "plan_to_watch"
        }
      ]
    };
  },
  computed: {
    perPage() {
      return this.component?.props?.display || 3;
    },
    computedRecent() {
      return this.recent.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
    pages() {
      return Math.ceil(this.recent.length / this.perPage);
    }
  },
  methods: {
    async updateAnime(
      id: number,
      episodes: number,
      score: number,
      status: string
    ) {
      await this.axios.patch(
        `/providers/userv3/mal/${this.user?.username}/anime`,
        {
          id,
          num_episodes_watched: episodes,
          score,
          status
        }
      );
      this.getMAL(false);
    },
    getStatusColor(status: string) {
      switch (status) {
        case "completed":
          return "success";
        case "dropped":
          return "error";
        case "on_hold":
          return "warning";
        case "plan_to_watch":
          return "indigo";
        case "watching":
          return "primary";
        default:
          return "grey";
      }
    },
    async getMAL(load = true) {
      if (load) {
        this.loading = true;
      } else {
        this.partialLoading = true;
      }
      const { data } = await this.axios.get(
        `/providers/userv3/mal/${this.user?.username}`
      );
      if (!data.data) return;
      this.recent = data.data;
      this.malUser = data.user;
      this.loading = false;
      this.partialLoading = false;
    }
  },
  mounted() {
    this.getMAL();
  }
});
</script>

<style scoped></style>
