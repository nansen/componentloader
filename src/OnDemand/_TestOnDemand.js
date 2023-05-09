import { Component } from "../Utilities/ComponentLoader"

export default class TestComponent extends Component {
    constructor() {
        super(...arguments)
        
        this.defaults = {
            text: `It should say ondemand default: on demand default.`,
        }
        this.setSettings()
        
        this.init()
    }
    
    init() {
        this.element.innerHTML = this.settings.text
    }
}
