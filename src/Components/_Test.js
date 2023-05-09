import { moduleSettings } from '../Utilities/ComponentLoader'

export const init = (opts, el) => {
  const settings = moduleSettings.set({
      background: 'red'
  }, opts)

  el.style.backgroundColor = settings.background
}
