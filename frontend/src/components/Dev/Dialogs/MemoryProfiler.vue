<template>
  <div class="dev-overlay" id="dev-overlay">
    <div class="dev-header" id="dev-header">
      TPU Memory Profiler (CTRL + ALT + M)
    </div>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Memory Usage by Store</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="[
                  { title: 'Store', key: 'name' },
                  { title: 'Size', key: 'size' }
                ]"
                :items="memoryUsageByStore"
                :hide-default-footer="true"
              >
                <template v-slot:item.size="{ item }">
                  {{ $functions.fileSize(item.props.title.size) }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MemoryProfiler",
  computed: {
    memoryUsageByStore() {
      return [
        {
          name: "ChatStore",
          size: JSON.stringify(this.$chat).length
        },
        {
          name: "UserStore",
          size: JSON.stringify(this.$user).length
        },
        {
          name: "ExperimentsStore",
          size: JSON.stringify(this.$experiments).length
        },
        {
          name: "AppStore",
          size: JSON.stringify(this.$app).length
        },
        {
          name: "FriendsStore",
          size: JSON.stringify(this.$friends).length
        },
        {
          name: "CollectionsStore",
          size: JSON.stringify(this.$collections).length
        },
        {
          name: "WorkspacesStore",
          size: JSON.stringify(this.$workspaces).length
        },
        {
          name: "VueRouter",
          size: JSON.stringify(this.$router).length
        },
        {
          name: "Total",
          size:
            JSON.stringify(this.$chat).length +
            JSON.stringify(this.$user).length +
            JSON.stringify(this.$experiments).length +
            JSON.stringify(this.$app).length +
            JSON.stringify(this.$friends).length +
            JSON.stringify(this.$collections).length +
            JSON.stringify(this.$workspaces).length
        }
      ];
    }
  },
  methods: {
    drag(element: any) {
      try {
        let pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        if (document.getElementById("dev-header")) {
          //@ts-ignore
          document.getElementById("dev-header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: any) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e: any) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          element.style.top = element.offsetTop - pos2 + "px";
          element.style.left = element.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
        }
      } catch (e) {
        console.log(e);
        this.$toast.error("Error while initializing memory profiler");
      }
    }
  },
  mounted() {
    this.drag(document.getElementById("dev-overlay"));
  }
});
</script>

<style scoped>
.dev-overlay {
  position: absolute;
  z-index: 9000;
  background-color: rgba(0, 0, 0, 0.37);
  text-align: center;
  width: 500px;
  right: 25px;
  top: 25px;
}

.dev-header {
  padding: 10px;
  cursor: move;
  z-index: 2001;
  background-color: #0190ea;
}
</style>
