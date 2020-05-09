import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {
}

export interface Data {
}

export interface Methods {
}

export interface Computed {
}

export interface Props {
}

const options: ComponentOption = {
  name: 'Root',

  render() {
    return <div id="app">
      <router-view></router-view>
    </div>;
  }
}

export default options

