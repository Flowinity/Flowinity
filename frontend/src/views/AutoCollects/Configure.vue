<template>
  <v-container>
    <v-card class="rounded-xl" color="card" elevation="7">
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
                  v-model="rule.enabled"
                  inset
                  label="Enabled"
                ></v-switch>
                <v-switch
                  v-model="rule.requireApproval"
                  inset
                  label="Require approval before adding to collection"
                ></v-switch>
                <v-text-field
                  v-model="rule.name"
                  :rules="[(v: any) => !!v || 'Name is required']"
                  label="Name"
                ></v-text-field>
                <v-card-subtitle class="grey--text ml-n4 mb-2">
                  ACTION
                </v-card-subtitle>
                <v-autocomplete
                  v-model="rule.collectionId"
                  :items="$collections.write"
                  item-title="name"
                  item-value="id"
                  label="Add to Collection"
                ></v-autocomplete>
              </v-card-text>
              <v-card-subtitle class="mt-n7 grey--text">GROUPS</v-card-subtitle>
              <div v-for="(subrule, i) in rule.rules" :key="subrule.id">
                <v-card-subtitle v-if="i !== 0" class="grey--text">
                  OR
                  <v-btn icon @click="removeSubRule(rule, subrule.id)">
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
                        v-model="subsubrule.type"
                        :items="types"
                        item-title="text"
                        item-value="value"
                        label="Type"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-select
                        v-model="subsubrule.operator"
                        :items="operators"
                        item-title="text"
                        item-value="value"
                        label="Operator"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="subsubrule.value"
                        :rules="[(v: any) => !!v || 'Value is required']"
                        label="Value"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" style="max-width: 40px">
                      <v-btn
                        icon
                        @click="removeSubSubRule(subrule, subsubrule.id)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-alert
                    v-if="
                      isUnrecommendedOperator(
                        subsubrule.type,
                        subsubrule.operator
                      )
                    "
                    type="warning"
                    variant="text"
                  >
                    This operator ({{ subsubrule.operator }}) is not recommended
                    for this type ({{ subsubrule.type }}). It may not work as
                    expected.
                  </v-alert>
                </v-card-text>
                <v-sheet class="rounded-xxl mt-n3" outlined>
                  <v-card
                    class="rounded-xxl text-center justify-center"
                    color="white"
                    elevation="0"
                    height="30"
                    max-width="100%"
                    variant="outlined"
                    @click="subrule.rules.push(defaultSubRule())"
                  >
                    <v-icon size="30" style="height: 100%">mdi-plus</v-icon>
                    Create sub-sub-rule
                  </v-card>
                </v-sheet>
              </div>
              <v-sheet class="rounded-xxl mt-2" outlined>
                <v-card
                  class="rounded-xxl text-center justify-center"
                  color="white"
                  elevation="0"
                  height="50"
                  max-width="100%"
                  variant="outlined"
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
              <v-sheet class="rounded-xxl mt-3" outlined>
                <v-card
                  class="rounded-xxl"
                  color="white"
                  elevation="0"
                  height="50"
                  max-width="100%"
                  variant="outlined"
                  @click="saveRule(rule)"
                >
                  <v-icon size="30" style="width: 100%; height: 100%">
                    mdi-content-save
                  </v-icon>
                </v-card>
              </v-sheet>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-subtitle v-if="!rules.length">No rules found</v-card-subtitle>
        <v-sheet class="rounded-xxl mt-3" outlined>
          <v-card
            class="rounded-xxl"
            elevation="0"
            height="50"
            max-width="100%"
            variant="outlined"
            @click="createRule()"
          >
            <v-icon size="50" style="width: 100%; height: 100%">
              mdi-plus
            </v-icon>
          </v-card>
        </v-sheet>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {AutoCollectRule, SubRule, SubSubRule} from "@/models/autoCollectRule";
import {defineComponent} from "vue";

export default defineComponent({
  name: "AutoCollectSettings",
  data() {
    return {
      rules: [] as AutoCollectRule[],
      operators: [
        {text: "Contains", value: "contains"},
        {text: "Equals", value: "equals"},
        {text: "Does not Equal", value: "doesNotEq"},
        {text: "Does not Contain", value: "doesNotCo"},
        {text: "Greater Than", value: "gt"},
        {text: "Less Than", value: "lt"},
        {text: "Greater Than or Equal", value: "gte"},
        {text: "Less Than or Equal", value: "lte"}
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
      const {data} = await this.axios.get("/autoCollects/rules");
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
