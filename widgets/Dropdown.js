'use strict';

var Jii = require('jii');
var React = require('react');
var ReactView = require('../ReactView');
var Html = require('../helpers/Html');
var _clone = require('lodash/clone');
var _forEach = require('lodash/forEach');
var _merge = require('lodash/merge');
var InvalidParamException = require('jii/exceptions/InvalidParamException');

class Dropdown extends ReactView{

    /**
     * Renders the widget.
     */
    render() {
        let submenuOptions = _clone(this.props.submenuOptions);
        if (submenuOptions === null) {
            submenuOptions = _clone(this.props.options);
            delete submenuOptions['id'];
        }

        let options = _clone(this.props.options);
        Html.addCssClass(options, {'widget': 'dropdown-menu'});
        return this.renderItems(this.props.items, options, submenuOptions);
    }

    /**
     * Renders menu items.
     * @param {object} items the menu items to be rendered
     * @param {object} options the container HTML attributes
     * @param {object} submenuOptionsGlobal
     * @return string the rendering result.
     */
    renderItems(items, options, submenuOptionsGlobal) {
        return (
            <ul {...Html.cssClassToString(options)}>
                {items.map((item, index) =>
                    this.renderItem(item, options, submenuOptionsGlobal, index))
                }
            </ul>
        );
    }

    renderItem(item, options, submenuOptionsGlobal, index){
        if (item['visible'] == false) {
            return null;
        }
        if (typeof(item) == 'string') {
            return item;
        }
        if (!item['label']) {
            throw new InvalidParamException("The 'label' option is required.");
        }

        let itemOptions = item['options'] || [];
        let linkOptions = item['linkOptions'] || [];
        linkOptions['tabIndex'] = '-1';
        const url = item['url'] ? item['url'] : null;
        let content;
        if (!item['items'] || !item['items'].length) {
            if (url === null) {
                content = item['label'];
                Html.addCssClass(itemOptions, {'widget': 'dropdown-header'});
            }
            else {
                content = Html.a(item['label'], url, linkOptions);
            }
        }
        else {
            let submenuOptions = _clone(submenuOptionsGlobal);

            if (item['submenuOptions']) {
                submenuOptions = _merge(submenuOptionsGlobal, item['submenuOptions']);
            }
            Html.addCssClass(itemOptions, {'widget': 'dropdown-submenu'});
            return (
                <li key={index} {...Html.cssClassToString(itemOptions)}>
                    {Html.a(item['label'], url === null ? '#' : url, linkOptions)}
                    {this.renderItems(item['items'], submenuOptions)}
                </li>
            );
        }

        return <li key={index} {...Html.cssClassToString(itemOptions)}>{content}</li>;
    }
}

Dropdown.defaultProps = {
    /**
     * @var {object} list of menu items in the dropdown. Each array element can be either an HTML string,
     * or an array representing a single menu with the following structure:
     *
     * - label: string, required, the label of the item link
     * - url: {string|object}, optional, the url of the item link. This will be processed by [[Url.to()]].
     *   If not set, the item will be treated as a menu header when the item has no sub-menu.
     * - visible: boolean, optional, whether this menu item is visible. Defaults to true.
     * - linkOptions: {object}, optional, the HTML attributes of the item link.
     * - options: {object}, optional, the HTML attributes of the item.
     * - items: {object}, optional, the submenu items. The structure is the same as this property.
     *   Note that Bootstrap doesn't support dropdown submenu. You have to add your own CSS styles to support it.
     * - submenuOptions: {object}, optional, the HTML attributes for sub-menu container tag. If specified it will be
     *   merged with [[submenuOptions]].
     *
     * To insert divider use `<li role="presentation" className="divider"></li>`.
     */
    items: [],
    /**
     * @var boolean whether the labels for header items should be HTML-encoded.
     */
    encodeLabels: true,
    /**
     * @var {object|null} the HTML attributes for sub-menu container tags.
     * If not set - [[options]] value will be used for it.
     */
    submenuOptions: false,
};

module.exports = Dropdown;