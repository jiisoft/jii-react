'use strict';

const Jii = require('jii');
const BaseObject = require('jii/base/BaseObject');
const Model = require('jii/base/Model');
const Collection = require('jii/base/Collection');
const InvalidParamException = require('jii/exceptions/InvalidParamException');
const _isFunction = require('lodash/isFunction');
const _uniqueId = require('lodash/uniqueId');
const _each = require('lodash/each');
const _extend = require('lodash/extend');
const React = require('react');
class ReactView extends React.Component {

    constructor() {
        super(...arguments);

        this.preInit();

        // Run custom init method
        this.init();
    }

    /**
     * Customized initialize method
     */
    init() {}

    /**
     * Return full class name with namespace
     * @returns {string}
     */
    className() {
        return this.constructor.name;
    }

    preInit() {
        /**
         * @type {object}
         */
        this.context = null;
        /**
         * @type {string}
         */
        this.id = _uniqueId(ReactView.ID_PREFIX);

        // Display class name in react warnings
        ReactView.displayName = this.className();
    }

    /**
         *
         * @param {ReactView} component
         * @param {string|Model|Collection} model
         * @param {string[]} [attributes]
         */
    static listenModel(component, model, attributes) {
        attributes = attributes || [];

        if (!(model instanceof Model) && !(model instanceof Collection)) {
            throw new InvalidParamException('Not found model for apply to state.');
        }

        // Event handler
        var onModelChange = () => {
            component.forceUpdate();
        };

        // Mount events
        var createMountHandler = (subscribeMethod, originalCallback) => {
            return () => {
                if (model instanceof Model) {
                    model[subscribeMethod](Model.EVENT_CHANGE, onModelChange);
                    model[subscribeMethod](Model.EVENT_CHANGE_ERRORS, onModelChange);
                    _each(attributes, attribute => {
                        model[subscribeMethod](Model.EVENT_CHANGE_NAME + attribute, onModelChange);
                    });
                }
                if (model instanceof Collection) {
                    model[subscribeMethod](Collection.EVENT_CHANGE, onModelChange);
                    _each(attributes, attribute => {
                        model[subscribeMethod](Collection.EVENT_CHANGE_NAME + attribute, onModelChange);
                    });
                }
                onModelChange();
                return originalCallback.apply(this, arguments);
            };
        };
        component.componentWillMount = createMountHandler('on', component.componentWillMount);
        component.componentWillUnmount = createMountHandler('off', component.componentWillUnmount);

        return model;
    }

    static wrapCallback(callback1, callback2) {
        return () => {
            if (!_isFunction(callback1) || callback1.apply(this, arguments) !== false) {
                callback2.apply(this, arguments);
            }
        };
    }

    setState() {
        super.setState.apply(this, arguments);
    }

    forceUpdate() {
        super.forceUpdate.apply(this, arguments);
    }

    componentDidMount() {}

    componentWillMount() {}

    componentWillUnmount() {}

    componentWillReceiveProps() {}

    componentDidUpdate() {}

    componentWillUpdate() {}

    listenModel(model, listenAttributes) {
        return ReactView.listenModel(this, model, listenAttributes);
    }

}

ReactView.ID_PREFIX = 'v';
_extend(ReactView.__static, BaseObject.__static);
_extend(ReactView.prototype, BaseObject.prototype);
module.exports = ReactView;