import { ComponentLoader, Component, moduleSettings } from './ComponentLoader.js';

describe('ComponentLoader', () => {
  let componentLoader;

  beforeEach(() => {
    componentLoader = new ComponentLoader();
  });

  describe('_populateComponents', () => {
    it('should populate the components object with all components found in the Components folder', () => {
      const expectedComponents = {
        'component1': { component: {} },
        'component2': { component: {} }
      };

      // Mock the require() calls
      const requireMock = (path) => {
        return { default: {} };
      };
      require = requireMock;

      // Mock the require.context() call
      const requireContextMock = (path, recursive, pattern) => {
        return {
          keys: () => ['../Components/component1.js', '../Components/component2.js']
        };
      };
      require.context = requireContextMock;

      componentLoader._populateComponents();

      expect(componentLoader.components).to.deep.equal(expectedComponents);
    });
  });

  // describe('_addComponent', () => {
  //   it('should add a component to the components object', () => {
  //     const componentName = 'component1';
  //     const component = {};

  //     componentLoader._addComponent(componentName, component);

  //     expect(componentLoader.components).to.have.property(componentName).that.deep.equals({ component });
  //   });
  // });

  // describe('_startComponent', () => {
  //   it('should start a class component', () => {
  //     const componentName = 'Component';
  //     const componentSettings = {};
  //     const componentElement = document.createElement('div');

  //     componentLoader.components[componentName] = { component: Component };
  //     const component = componentLoader._startComponent(componentName, componentSettings, componentElement);

  //     expect(component).to.be.an.instanceof(Component);
  //   });

  //   it('should start a function component', () => {
  //     const componentName = 'component1';
  //     const componentSettings = {};
  //     const componentElement = document.createElement('div');
  //     const component = {};

  //     componentLoader.components[componentName] = { component };
  //     const initSpy = sinon.spy(component, 'init');
  //     const isClassStub = sinon.stub().returns(false);
  //     ComponentLoader.prototype.isClass = isClassStub;

  //     const result = componentLoader._startComponent(componentName, componentSettings, componentElement);

  //     expect(result).to.equal(component);
  //     expect(initSpy.calledOnceWithExactly(componentSettings, componentElement)).to.be.true;
  //   });

  //   it('should catch and log any errors', () => {
  //     const componentName = 'component1';
  //     const componentSettings = {};
  //     const componentElement = document.createElement('div');
  //     const error = new Error('Test error');

  //     const consoleErrorSpy = sinon.spy(console, 'error');
  //     const isClassStub = sinon.stub().throws(error);
  //     ComponentLoader.prototype.isClass = isClassStub;

  //     componentLoader._startComponent(componentName, componentSettings, componentElement);

  //     expect(consoleErrorSpy.calledOnceWithExactly(`bundled component component1 failed init:`, error)).to.be.true;

  //     consoleErrorSpy.restore();
  //   });
  // });

  // describe('init', () => {
  //   let querySelectorAllStub;
  //   let importStub;

  //   beforeEach(() => {
  //     querySelectorAllStub = sinon.stub(document, 'querySelectorAll');
  //     importStub = sinon.stub(window, 'import');
  //   });

  //   afterEach(() => {
  //     querySelectorAllStub.restore();
  //     importStub.restore();
  //   });
  // });
});
