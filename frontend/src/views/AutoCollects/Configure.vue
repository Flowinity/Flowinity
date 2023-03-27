<template>
  <v-container>
    <v-card color="card" class="rounded-xl" elevation="7">
      <v-toolbar color="toolbar">
        <v-toolbar-title>Configure AutoCollect</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title>My Rules</v-card-title>
        <v-expansion-panels>
          <v-expansion-panel v-for="rule in rules" :key="rule.id">
            <template v-slot:title>
              {{ rule.name }}
              <div style="float: right">
                <v-btn icon @click="deleteRule(rule.id)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:text color="toolbar">
              <v-card-text>
                <v-switch
                  inset
                  label="Enabled"
                  v-model="rule.enabled"
                ></v-switch>
                <v-switch
                  inset
                  label="Require approval before adding to collection"
                  v-model="rule.requireApproval"
                ></v-switch>
                <v-text-field
                  label="Name"
                  v-model="rule.name"
                  :rules="[(v: any) => !!v || 'Name is required']"
                ></v-text-field>
                <v-card-subtitle class="grey--text ml-n4 mb-2">
                  ACTION
                </v-card-subtitle>
                <v-autocomplete
                  :items="$collections.write"
                  item-value="id"
                  item-title="name"
                  label="Add to Collection"
                  v-model="rule.collectionId"
                ></v-autocomplete>
              </v-card-text>
              <v-card-subtitle class="mt-n7 grey--text">GROUPS</v-card-subtitle>
              <div v-for="(subrule, i) in rule.rules" :key="subrule.id">
                <v-card-subtitle class="grey--text" v-if="i !== 0">
                  OR
                  <v-btn text icon @click="removeSubRule(rule, subrule.id)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-subtitle>
                <v-card-text
                  v-for="subsubrule in subrule.rules"
                  :key="subsubrule.id"
                >
                  <v-row>
                    <v-col>
                      <v-select
                        :items="types"
                        label="Type"
                        v-model="subsubrule.type"
                        item-title="text"
                        item-value="value"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-select
                        :items="operators"
                        label="Operator"
                        v-model="subsubrule.operator"
                        item-title="text"
                        item-value="value"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Value"
                        v-model="subsubrule.value"
                        :rules="[(v: any) => !!v || 'Value is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" style="max-width: 40px">
                      <v-btn
                        text
                        icon
                        @click="removeSubSubRule(subrule, subsubrule.id)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-alert
                    type="warning"
                    variant="text"
                    v-if="
                      isUnrecommendedOperator(
                        subsubrule.type,
                        subsubrule.operator
                      )
                    "
                  >
                    This operator ({{ subsubrule.operator }}) is not recommended
                    for this type ({{ subsubrule.type }}). It may not work as
                    expected.
                  </v-alert>
                </v-card-text>
                <v-sheet outlined class="rounded-xxl mt-n3">
                  <v-card
                    max-width="100%"
                    height="30"
                    class="rounded-xxl text-center justify-center"
                    variant="outlined"
                    elevation="0"
                    color="white"
                    @click="subrule.rules.push(defaultSubRule())"
                  >
                    <v-icon style="height: 100%" size="30">mdi-plus</v-icon>
                    Create sub-sub-rule
                  </v-card>
                </v-sheet>
              </div>
              <v-sheet outlined class="rounded-xxl mt-2">
                <v-card
                  max-width="100%"
                  height="50"
                  variant="outlined"
                  elevation="0"
                  color="white"
                  class="rounded-xxl text-center justify-center"
                  @click="
                    rule.rules.push({
                      rules: [defaultSubRule()],
                      id: currentEpoch()
                    })
                  "
                >
                  <v-icon size="30" style="height: 100%">mdi-plus</v-icon>
                  Create sub-rule
                </v-card>
              </v-sheet>
              <v-sheet outlined class="rounded-xxl mt-3">
                <v-card
                  max-width="100%"
                  height="50"
                  variant="outlined"
                  elevation="0"
                  color="white"
                  class="rounded-xxl"
                  @click="saveRule(rule)"
                >
                  <v-icon style="width: 100%; height: 100%" size="30">
                    mdi-content-save
                  </v-icon>
                </v-card>
              </v-sheet>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-subtitle v-if="!rules.length">No rules found</v-card-subtitle>
        <v-sheet outlined class="rounded-xxl mt-3">
          <v-card
            max-width="100%"
            height="50"
            variant="outlined"
            elevation="0"
            class="rounded-xxl"
            @click="createRule()"
          >
            <v-icon style="width: 100%; height: 100%" size="50">
              mdi-plus
            </v-icon>
          </v-card>
        </v-sheet>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { AutoCollectRule, SubRule, SubSubRule } from "@/models/autoCollectRule";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AutoCollectSettings",
  data() {
    return {
      rules: [] as AutoCollectRule[],
      operators: [
        { text: "Contains", value: "contains" },
        { text: "Equals", value: "equals" },
        { text: "Does not Equal", value: "doesNotEq" },
        { text: "Does not Contain", value: "doesNotCo" },
        { text: "Greater Than", value: "gt" },
        { text: "Less Than", value: "lt" },
        { text: "Greater Than or Equal", value: "gte" },
        { text: "Less Than or Equal", value: "lte" }
      ],
      types: [
        {
          text: "Screenshot Text Metadata (OCR)",
          value: "metadata",
          notRecommendedOperators: ["lt", "gt", "lte", "gte"]
        },
        {
          text: "File Name",
          value: "name",
          notRecommendedOperators: ["lt", "gt", "lte", "gte"]
        },
        {
          text: "File Extension",
          value: "extension",
          notRecommendedOperators: ["lt", "gt", "lte", "gte"]
        },
        {
          text: "File Size",
          value: "size",
          notRecommendedOperators: []
        },
        {
          text: "OCR Word Count",
          value: "metadata-word-length",
          notRecommendedOperators: ["contains", "doesNotCo"]
        },
        {
          text: "OCR Character Count",
          value: "metadata-char-length",
          notRecommendedOperators: ["contains", "doesNotCo"]
        }
      ]
    };
  },
  methods: {
    isUnrecommendedOperator(type: string, operator: string) {
      const typeObj = this?.types?.find((t) => t?.value === type);
      if (typeObj) {
        return typeObj.notRecommendedOperators.includes(operator);
      }
    },
    async deleteRule(id: number) {
      await this.axios.delete(`/autoCollects/rules/${id}`);
      this.rules = this.rules.filter((rule: AutoCollectRule) => rule.id !== id);
    },
    currentEpoch() {
      return new Date().getTime();
    },
    defaultSubRule() {
      return {
        id: this.currentEpoch(),
        type: "metadata",
        value: "Speaker Stats",
        operator: "contains"
      };
    },
    removeSubSubRule(rule: SubRule, id: number) {
      rule.rules = rule.rules.filter(
        (subsubrule: SubSubRule) => subsubrule.id !== id
      );
    },
    removeSubRule(rule: AutoCollectRule, id: number) {
      rule.rules = rule.rules.filter((subrule: SubRule) => subrule.id !== id);
    },
    async getRules() {
      const { data } = await this.axios.get("/autoCollects/rules");
      this.rules = data;
    },
    async saveRule(rule: AutoCollectRule) {
      await this.axios.put(`/autoCollects/rules/${rule.id}`, rule);
      this.$toast.success("Rule saved.");
    },
    async createRule() {
      await this.axios.post("/autoCollects/rules", {
        name: "New Rule",
        enabled: false,
        collectionId: null,
        requireApproval: true,
        rules: [this.defaultSubRule()]
      });
      await this.getRules();
      this.$toast.success("Rule created.");
    }
  },
  mounted() {
    this.getRules();
    this.$app.title = "Configure AutoCollects";
  }
});
</script>

<style scoped></style>
