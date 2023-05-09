import { Component } from "../Utilities/ComponentLoader"

export default class TestComponent extends Component {
    constructor() {
        super(...arguments)
        this.defaults = {
            text: 'this is the default value'
        }
        this.setSettings()
        
        this.init()
    }
    
    init() {
        this.element.innerHTML = this.settings.text
    }
}
