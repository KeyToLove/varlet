<template>
  <div :class="n('wrap')" @click="handleClick">
    <div :class="n()">
      <div
        :class="
          classes(
            n('action'),
            [checked || isIndeterminate, n('--checked'), n('--unchecked')],
            [errorMessage || checkboxGroupErrorMessage, n('--error')],
            [formDisabled || disabled, n('--disabled')]
          )
        "
        :style="{ color: checked || isIndeterminate ? checkedColor : uncheckedColor }"
        v-hover:desktop="handleHovering"
        v-ripple="{ disabled: formReadonly || readonly || formDisabled || disabled || !ripple }"
      >
        <slot name="indeterminate-icon" v-if="isIndeterminate">
          <var-icon
            :class="classes(n('icon'), [withAnimation, n('--with-animation')])"
            name="minus-box"
            :size="iconSize"
            var-checkbox-cover
          />
        </slot>
        <slot name="checked-icon" v-if="checked && !isIndeterminate">
          <var-icon
            :class="classes(n('icon'), [withAnimation, n('--with-animation')])"
            name="checkbox-marked"
            :size="iconSize"
            var-checkbox-cover
          />
        </slot>
        <slot name="unchecked-icon" v-if="!checked && !isIndeterminate">
          <var-icon
            :class="classes(n('icon'), [withAnimation, n('--with-animation')])"
            name="checkbox-blank-outline"
            :size="iconSize"
            var-checkbox-cover
          />
        </slot>
        <var-hover-overlay :hovering="!disabled && !formDisabled && hovering" />
      </div>

      <div
        :class="
          classes(
            n('text'),
            [errorMessage || checkboxGroupErrorMessage, n('--error')],
            [formDisabled || disabled, n('--disabled')]
          )
        "
        v-if="$slots.default"
      >
        <slot />
      </div>
    </div>

    <var-form-details :error-message="errorMessage" />
  </div>
</template>

<script lang="ts">
import VarIcon from '../icon'
import VarFormDetails from '../form-details'
import Ripple from '../ripple'
import Hover from '../hover'
import VarHoverOverlay, { useHoverOverlay } from '../hover-overlay'
import { defineComponent, ref, computed, nextTick } from 'vue'
import { props, type ValidateTriggers } from './props'
import { useValidation, createNamespace } from '../utils/components'
import { useCheckboxGroup, type CheckboxProvider } from './provide'
import { useForm } from '../form/provide'
import { call } from '@varlet/shared'
import { useVModel } from '@varlet/use'

const { name, n, classes } = createNamespace('checkbox')

export default defineComponent({
  name,
  directives: { Ripple, Hover },
  components: {
    VarIcon,
    VarFormDetails,
    VarHoverOverlay,
  },
  props,
  setup(props) {
    const value = useVModel(props, 'modelValue')
    const isIndeterminate = useVModel(props, 'indeterminate')
    const checked = computed(() => value.value === props.checkedValue)
    const checkedValue = computed(() => props.checkedValue)
    const withAnimation = ref(false)
    const { checkboxGroup, bindCheckboxGroup } = useCheckboxGroup()
    const { hovering, handleHovering } = useHoverOverlay()
    const { form, bindForm } = useForm()
    const {
      errorMessage,
      validateWithTrigger: vt,
      validate: v,
      // expose
      resetValidation,
    } = useValidation()

    const checkboxProvider: CheckboxProvider = {
      checkedValue,
      checked,
      sync,
      validate,
      resetValidation,
      reset,
      resetWithAnimation,
    }

    call(bindCheckboxGroup, checkboxProvider)
    call(bindForm, checkboxProvider)

    function validateWithTrigger(trigger: ValidateTriggers) {
      nextTick(() => {
        const { validateTrigger, rules, modelValue } = props
        vt(validateTrigger, trigger, rules, modelValue)
      })
    }

    function change(changedValue: any) {
      const { checkedValue, onChange } = props

      value.value = changedValue
      isIndeterminate.value = false

      call(onChange, value.value)
      validateWithTrigger('onChange')
      changedValue === checkedValue ? checkboxGroup?.onChecked(checkedValue) : checkboxGroup?.onUnchecked(checkedValue)
    }

    function handleClick(e: Event) {
      const { disabled, readonly, checkedValue, uncheckedValue, onClick } = props

      if (form?.disabled.value || disabled) {
        return
      }

      call(onClick, e)

      if (form?.readonly.value || readonly) {
        return
      }

      withAnimation.value = true
      const maximum = checkboxGroup ? checkboxGroup.checkedCount.value >= Number(checkboxGroup.max.value) : false

      if (!checked.value && maximum) {
        return
      }

      change(checked.value ? uncheckedValue : checkedValue)
    }

    function sync(values: Array<any>) {
      const { checkedValue, uncheckedValue } = props
      value.value = values.includes(checkedValue) ? checkedValue : uncheckedValue
    }

    function resetWithAnimation() {
      withAnimation.value = false
    }

    // expose
    function reset() {
      value.value = props.uncheckedValue
      resetValidation()
    }

    // expose
    function toggle(changedValue?: any) {
      const { checkedValue, uncheckedValue } = props

      const shouldReverse = ![checkedValue, uncheckedValue].includes(changedValue)
      if (shouldReverse) {
        changedValue = checked.value ? uncheckedValue : checkedValue
      }

      change(changedValue)
    }

    // expose
    function validate() {
      return v(props.rules, props.modelValue)
    }

    return {
      isIndeterminate,
      withAnimation,
      checked,
      errorMessage,
      checkboxGroupErrorMessage: checkboxGroup?.errorMessage,
      formDisabled: form?.disabled,
      formReadonly: form?.readonly,
      hovering,
      n,
      classes,
      handleHovering,
      handleClick,
      toggle,
      reset,
      validate,
      resetValidation,
    }
  },
})
</script>

<style lang="less">
@import '../styles/common';
@import '../ripple/ripple';
@import '../form-details/formDetails';
@import '../icon/icon';
@import '../hover-overlay/hoverOverlay';
@import './checkbox';
</style>
