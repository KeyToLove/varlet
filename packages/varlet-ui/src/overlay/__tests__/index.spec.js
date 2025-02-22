import Overlay from '..'
import VarOverlay from '../Overlay'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { expect, vi } from 'vitest'

test('test overlay plugin', () => {
  const app = createApp({}).use(Overlay)
  expect(app.component(Overlay.name)).toBeTruthy()
})

const Wrapper = {
  components: {
    [VarOverlay.name]: VarOverlay,
  },
  props: ['onClick'],
  data: () => ({
    show: false,
  }),
  template: `
    <var-overlay v-model:show="show" v-bind="$props">
      default slot content
    </var-overlay>
  `,
}

test('test overlay show', async () => {
  const wrapper = mount(Wrapper)
  expect(document.body.querySelector('.var-overlay')).toBeFalsy()

  await wrapper.setData({ show: true })
  expect(wrapper.find('.var-overlay').isVisible()).toBeTruthy()
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setData({ show: false })
  expect(document.body.querySelector('.var-overlay')).toBeFalsy()

  wrapper.unmount()
})

test('test overlay click on clickOverlay', async () => {
  const onClick = vi.fn()

  const wrapper = mount(Wrapper, {
    props: {
      onClick,
    },
  })

  await wrapper.setData({ show: true })

  await wrapper.find('.var-overlay').trigger('click')
  expect(onClick).toHaveBeenCalledTimes(1)

  await wrapper.setData({ show: true })
  await wrapper.setProps({ closeOnClickOverlay: false })
  await wrapper.find('.var-overlay').trigger('click')
  expect(onClick).toHaveBeenCalledTimes(2)

  wrapper.unmount()
})
