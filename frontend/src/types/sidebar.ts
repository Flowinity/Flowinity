import { VNode } from "vue";

export type SidebarItem = {
  id: number;
  externalPath?: string;
  path?: string;
  name: string;
  icon?: string | VNode;
  new?: boolean;
  scope?: string | string[];
  warning?: boolean | string | number;
  experimentsRequired?: string[];
  click?: (instance: any) => void;
  exact?: boolean;
  customIcon?: string;
  if?: boolean;
  separator?: boolean;
};
