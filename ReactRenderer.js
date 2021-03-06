/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */
'use strict';

const Jii = require('jii');
const React = require('react');
const ReactDOM = require('react-dom');
// Set React variable as global for compiled code
if (typeof global !== 'undefined') {
    global.React = React;
}
if (typeof window !== 'undefined') {
    window.React = React;
    window.ReactDOM = ReactDOM;
}
const ReactView = require('./ReactView');
const IRenderer = require('jii/view/IRenderer');
class ReactRenderer extends IRenderer {

    preInit() {
        /**
     * @type {object}
     */
        this._lazyContent = null;
        /**
     * @type {ReactView}
     */
        this.layout = null;
        super.preInit(...arguments);
    }

    /**
     *
     * @param {*} view
     * @param {Context} context
     * @param {object} params
     * @param {Controller} controller
     * @param {WebView} webView
     * @returns {*}
     */
    render(view, context, params, controller, webView) {
        var content = React.createElement(view, params);
        if (this.layout) {
            this.layout.setState({
                content: null
            });
            // @todo
            this.layout.setState({
                content: content
            });
        } else {
            this._lazyContent = content;
        }

        return content;
    }

    /**
     *
     * @param {*} view
     * @param {Context} context
     * @param {object} params
     * @param {Controller} controller
     * @param {WebView} webView
     * @returns {*}
     */
    renderLayout(view, context, params, controller, webView) {
        view = Jii.namespace(view);

        // Set current layout
        // TODO update layout props on change only context
        if (!this.layout || !(this.layout instanceof view) || params.context !== context) {
            var container = document.getElementById(ReactRenderer.APP_ID_PREFIX + Jii.app.id);

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

}

ReactRenderer.APP_ID_PREFIX = 'app-';
module.exports = ReactRenderer;