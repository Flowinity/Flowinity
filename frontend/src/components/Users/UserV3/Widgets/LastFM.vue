<template>
  <v-card class="mx-2 my-5">
    <v-toolbar>
      <v-toolbar-title>
        Last.fm
        <v-chip size="small">BETA</v-chip>
        <template v-if="!loading">
          &bullet; {{ parseInt(attributes.total).toLocaleString() }} scrobbles
        </template>
      </v-toolbar-title>
      <v-btn icon @click="page > 1 ? page-- : (page = 1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="getLastFM">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="page < parseInt(attributes.totalPages) ? page++ : page"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar>
    <template v-if="!loading">
      <v-list>
        <v-list-item
          v-for="track in computedTracks"
          :key="track?.date?.uts"
          :href="track.url"
          target="_blank"
          :active="track['@attr']?.nowplaying === 'true'"
        >
          <template v-slot:prepend>
            <v-avatar size="36" tile>
              <v-img :src="track.image[1]['#text']" />
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ track.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ track.artist["#text"] }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-list-item-subtitle>
              {{
                track?.date?.uts
                  ? $date(track?.date?.uts * 1000).fromNow()
                  : "Scrobbling now"
              }}
            </v-list-item-subtitle>
          </template>
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

export default defineComponent({
  name: "LastFM",
  components: { MessageSkeleton },
  props: ["user"],
  data() {
    return {
      tracks: [],
      attributes: {
        total: "0",
        totalPages: "0"
      },
      page: 1,
      loading: true
    };
  },
  computed: {
    computedTracks() {
      return this.tracks.slice((this.page - 1) * 7, this.page * 7);
    }
  },
  methods: {
    async getLastFM() {
      this.loading = true;
      const { data } = await this.axios.get(
        `/providers/userv3/lastfm/${this.user?.username}`
      );
      if (!data.recenttracks) return;
      this.tracks = data.recenttracks.track;
      this.attributes = data.recenttracks["@attr"];
      this.loading = false;
    }
  },
  mounted() {
    this.getLastFM();
  }
});
</script>

<style scoped></style>
