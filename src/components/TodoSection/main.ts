import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { TodoItem } from '@/models/todo-item';
import TodoItemComponent from '@/components/TodoItem/Main.vue';
import {
  Props as TodoItemProps,
  Event as TodoItemEvent,
  Handlers as TodoItemHandlers,
} from '@/components/TodoItem/main';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {
  handleTodoItemCheckboxClick: TodoItemHandlers[TodoItemEvent.ClickCheckbox]
  handleTodoItemPlayClick: TodoItemHandlers[TodoItemEvent.ClickPlay]
  handleHeaderClick(): void
}

export interface Computed {
  headerArrowIconName: string
  bodyStyle: Record<string, string>
}

export interface Props {
  title: string
  data: TodoItem[]
  visibleBody: boolean
}

export const enum Event {
  ClickHeader = 'click-header',
  ClickItemCheckbox = 'click-item-checkbox',
  ClickItemPlay = 'click-item-play',
}

export type Handlers = {
  [Event.ClickHeader](): void
  [Event.ClickItemCheckbox](item: TodoItem): void
  [Event.ClickItemPlay](item: TodoItem): void
}

const options: ComponentOption = {
  name: 'TodoSection',

  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    visibleBody: {
      type: Boolean,
      required: true,
    }
  },

  computed: {
    headerArrowIconName() {
      return this.visibleBody ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    bodyStyle() {
      return {
        display: this.visibleBody ? 'block' : 'none',
      }
    }
  },

  methods: {
    handleTodoItemCheckboxClick(item) {
      this.$emit(Event.ClickItemCheckbox, item)
    },
    handleTodoItemPlayClick(item) {
      this.$emit(Event.ClickItemPlay, item)
    },
    handleHeaderClick() {
      this.$emit(Event.ClickHeader)
    },
  },

  render(h) {
    const headerListeners = {
      click: this.handleHeaderClick,
    }
    return h('div', { staticClass: 'todo-section' }, [
      h('div', { staticClass: 'todo-section__header', on: headerListeners }, [
        h('div', { staticClass: 'todo-section__title' }, this.title),
        h('span', { staticClass: 'material-icons' }, this.headerArrowIconName),
      ]),
      h('div', { staticClass: 'todo-section__body', style: this.bodyStyle }, [
        this.data.map(item => {
          const props: TodoItemProps = {
            data: item,
            white: true,
          }
          const listeners = {
            [TodoItemEvent.ClickCheckbox]: this.handleTodoItemCheckboxClick,
            [TodoItemEvent.ClickPlay]: this.handleTodoItemPlayClick,
          }
          return h(TodoItemComponent, { props, on: listeners })
        })
      ]),
    ])
  },
};

export default options;
