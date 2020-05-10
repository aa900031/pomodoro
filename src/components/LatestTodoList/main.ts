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
  handleItemCheckboxClick: TodoItemHandlers[TodoItemEvent.ClickCheckbox],
  handleItemPlayClick: TodoItemHandlers[TodoItemEvent.ClickPlay],
  handleMoreClick(): void
}

export interface Computed {

}

export interface Props {
  data: TodoItem[]
}

export const enum Event {
  ClickItemCheckbox = 'click-item-checkbox',
  ClickItemPlay = 'click-item-play',
  ClickMore = 'click-more',
}

export type Handlers = {
  [Event.ClickItemCheckbox]: TodoItemHandlers[TodoItemEvent.ClickCheckbox],
  [Event.ClickItemPlay]: TodoItemHandlers[TodoItemEvent.ClickPlay],
  [Event.ClickMore](): void
}

const options: ComponentOption = {
  name: 'LatestTodoList',

  props: {
    data: {
      type: Array,
      required: true,
    }
  },

  methods: {
    handleItemCheckboxClick(data) {
      this.$emit(Event.ClickItemCheckbox, data)
    },
    handleItemPlayClick(data) {
      this.$emit(Event.ClickItemPlay, data)
    },
    handleMoreClick() {
      this.$emit(Event.ClickMore)
    },
  },

  render(h) {
    return h('div', { staticClass: 'latest-todo-list' }, [
      this.data.map((todoItem) => {
        const key = `todo-item-${todoItem.id}`
        const props: TodoItemProps = {
          data: todoItem,
        }
        const listeners = {
          [TodoItemEvent.ClickCheckbox]: this.handleItemCheckboxClick,
          [TodoItemEvent.ClickPlay]: this.handleItemPlayClick,
        }
        return h(TodoItemComponent, { key, props, on: listeners })
      }),
      h('div', { staticClass: 'latest-todo-list__footer'}, [
        h('div', {
          staticClass: 'latest-todo-list__btn-more',
          on: { click: this.handleMoreClick }
        }, 'MORE')
      ])
    ])
  },
};

export default options;
