export interface Component {
  id: string;
  name: string;
  props?: Record<string, any>;
  visible?: boolean;
  disabled?: boolean;
}

export interface Rows {
  rows: Component[];
}
