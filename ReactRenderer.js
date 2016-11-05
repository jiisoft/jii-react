/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

'use strict';

var Jii = require('jii');

var React = require('react');
var ReactDOM = require('react-dom');

// Set React variable as global for compiled code
if (typeof global !== 'undefined') {
    global.React = React;
}
if (typeof window !== 'undefined') {
    window.React = React;
    window.ReactDOM = ReactDOM;
}

var ReactView = require('./ReactView');
var IRenderer = require('../IRenderer');

/**
 * ViewEvent represents events triggered by the [[View]] component.
 *
 * @class Jii.react.ReactRenderer
 * @extends Jii.view.IRenderer
 */
var ReactRenderer = Jii.defineClass('Jii.react.ReactRenderer', /** @lends Jii.react.ReactRenderer.prototype */{

    __extends: IRenderer,

    __static: /** @lends Jii.react.ReactRenderer */{

        APP_ID_PREFIX: 'app-'

    },

    /**
     * @type {Jii.react.ReactView}
     */
    layout: null,

    /**
     * @type {object}
     */
    _lazyContent: null,

    /**
     *
     * @param {*} view
     * @param {Jii.base.Context} context
     * @param {object} params
     * @param {Jii.base.Controller} controller
     * @param {Jii.view.WebView} webView
     * @returns {*}
     */
    render(view, context, params, controller, webView) {
        var content = React.createElement(view, params);
        if (this.layout) {
            this.layout.setState({content: null}); // @todo
            this.layout.setState({
                content: content
            });
        } else {
            this._lazyContent = content;
        }

        return content;
    },

    /**
     *
     * @param {*} view
     * @param {Jii.base.Context} context
     * @param {object} params
     * @param {Jii.base.Controller} controller
     * @param {Jii.view.WebView} webView
     * @returns {*}
     */
    renderLayout(view, context, params, controller, webView) {
        view = Jii.namespace(view);

        // Set current layout
        var name = view.className();
        if (!this.layout || this.layout.className() !== name) {
            var container = document.getElementById(this.__static.APP_ID_PREFIX + Jii.app.id);

            params.context = context;
            this.layout = ReactDOM.render(React.createElement(view, params), container);
        }

        if (this._lazyContent) {
            this.layout.setState({
                content: this._lazyContent
            });
            this._lazyContent = null;
        }

        return this.layout;
    }

});

module.exports = ReactRenderer;