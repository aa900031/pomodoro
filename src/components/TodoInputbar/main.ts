import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps, PropType } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { State as PomodoroState } from '@/models/pomodoro-item';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {
  formData: FormData
}

export interface Methods {
  handleInputTextInput(event: globalThis.Event): void
  handleFormSubmit(event: globalThis.Event): void
  validatedFormData(): boolean
}

export interface Computed {
  rootClassName: string[]
}

export interface Props {
  state: PomodoroState
}

export const enum Event {
  Submit = 'submit',
}

export type Handlers = {
  [Event.Submit](formData: FormData): void
}

interface FormData {
  name: string
}

const craeteFormData = (): FormData => {
  return {
    name: '',
  }
}

const cloneFormData = (formData: FormData): FormData => {
  return JSON.parse(JSON.stringify(formData))
}

const options: ComponentOption = {
  name: 'TodoInputbar',

  props: {
    state: {
      type: String as PropType<PomodoroState>,
      required: true,
    },
  },

  data() {
    return {
      formData: craeteFormData(),
    }
  },

  computed: {
    rootClassName() {
      return [`is-${this.state}`]
    },
  },

  methods: {
    handleInputTextInput(event) {
      const $el = event.target as HTMLInputElement;
      this.formData.name = $el.value;
    },
    handleFormSubmit(event) {
      event.preventDefault();

      const validated = this.validatedFormData()
      if (!validated) {
        return
      }

      const formData: FormData = cloneFormData(this.formData)

      this.$emit(Event.Submit, formData)
      this.formData = craeteFormData()
    },
    validatedFormData() {
      const name = this.formData.name
      if (!name || typeof name !== 'string') {
        return false;
      }

      return true
    }
  },

  render(h) {
    return h('form', {
      staticClass: 'todo-inputbar',
      class: this.rootClassName,
      on: { submit: this.handleFormSubmit }
    }, [
      h('input', {
        staticClass: 'todo-inputbar__input',
        domProps: { value: this.formData.name },
        attrs: { placeholder: 'ADD A NEW MISSION...' },
        on: { input: this.handleInputTextInput }
      }),
      h('button', {
        staticClass: 'todo-inputbar__btn-submit',
        attrs: { type: 'submit' }
      }, [
        h('span', { staticClass: 'material-icons' }, 'add'),
      ])
    ]);
  },
};

export default options;
