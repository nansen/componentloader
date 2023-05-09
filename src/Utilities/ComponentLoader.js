const isClass = (func) => {
  return typeof func === `function` &&
    /^class\s/.test(Function.prototype.toString.call(func))
}

export class ComponentLoader {
  constructor (log = false) {
    this.components = {}
    this.log = log
    this.initializedComponents = []
  }

  /**
   * Populates the components object with all components found in the Components folder.
   */
  _populateComponents () {
    const components = require.context(`../Components/`, true, /\.js$/).keys()
    components.forEach((component) => {
      const componentName = component.match(/([^/]+)(?=\.\w+$)/)[0]
      // we need to require the component so webpack adds it to the bundle
      const c = require(`../Components/${componentName}.js`)

      // finally add the component to the component loader
      this._addComponent(componentName, c.default ?? c)
    })
  }

  /**
   * Adds a component to the components object.
   * @param {*} componentName
   * @param {*} component
   */
  _addComponent (componentName, component) {
    // add component to the components object
    this.components[componentName] = {
      component
    }
  }

  _startComponent (componentName, componentSettings, componentElement, ondemand = false) {
    try {
      // check if component is class or function
      if (isClass(this.components[componentName].component)) {
        return new this.components[componentName].component(componentSettings, componentElement)
      } else {
        return this.components[componentName].component.init(componentSettings, componentElement)
      }
    } catch (e) {
      console.error(`${ondemand ? `ondemand` : `bundled`} component ${componentName} failed init:`, e)
    }
  }

  /**
  * Goes through each element with data-js attribute and either starts the component, or creates a dynamic import() for it to load a chunk and execute it.
  */
  init () {
    this._populateComponents()
    const componentElements = document.querySelectorAll(`[data-js]`)

    for (const componentElement of componentElements) {
      const componentsToInit = componentElement.dataset.js.split(` `) // split the data-js attribute into an array of components, if more than one is bound to element

      componentsToInit.forEach(componentName => {
        const elementInMap = this.initializedComponents.find(o => o.element === componentElement) // check if component already initialized on this element
        if (elementInMap && elementInMap.components.includes(componentName)) return // if component already initialized on this element, skip it

        // get the settings for this particular component
        const componentSettings = componentElement.hasAttribute(`data-js-${componentName}`) // does it have named settings object?
          ? componentElement.getAttribute(`data-js-${componentName}`) // it does!
          : typeof componentElement.dataset.jsSettings !== `undefined` // it did not, so check for generic settings object
            ? componentElement.dataset.jsSettings // has generic
            : `{}` // no generic as well so just give back an empty object

        let tempComponent

        if (this.components[componentName]) {
          tempComponent = this._startComponent(componentName, componentSettings, componentElement)
        } else {
          // import the component
          import(`../OnDemand/${componentName}.js`).then(c => { // eslint-disable-line
            this._addComponent(componentName, c.default ?? c)
            tempComponent = this._startComponent(componentName, componentSettings, componentElement, true)
          })
        }

        // add component to initializedComponents array
        if (elementInMap) {
          elementInMap.components.push({ name: componentName, component: tempComponent })
        } else {
          this.initializedComponents.push({
            element: componentElement,
            components: [{ name: componentName, component: tempComponent }]
          })
        }
      })
    }
  }
}

export class Component {
  constructor (settings, element) {
    this.element = element
    this._settings = settings
    this.settings = {}

    console.log(`settings from base class:`, settings)
  }

  // we only need a setter, we never get it as it's use is internal after setting it once
  set defaults (settings) { // eslint-disable-line
    console.log(`setter:`, settings)
    this.settings = settings
  }

  setSettings (defaultSettings) {
    if (defaultSettings) this.defaults = defaultSettings
    moduleSettings.set(this.settings, this._settings)
  }
}

/**
 * Helper function to merge settings overriden in HTML data attributes with the internal defaults.
 * Written in this way to keep backwards compatibility with our legacy components
 */
const settingsPropertyRegex = /([\w\-$]+):[\s\d\{\[\'\"\-ftun]/gi // ftun == false/true/undefined/null
const settingsQuoteRegex = /'/g
export const moduleSettings = {
  set: (settings, opts) => {
    // if we don't have any settings, return the defaults
    if (!opts) return settings

    if (opts[0] !== '{') {  // is using JSON syntax
        const jsonString = opts
            .replace(settingsPropertyRegex, '\"$1\":') // wrap all property names with quotes
            .replace(settingsQuoteRegex, '\"'); // replace single-quote character with double quotes

        opts = `{${jsonString}}`
    }
    
    opts = JSON.parse(opts)

    return Object.assign(settings, opts)
  }
}
