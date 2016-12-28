'use strict';

var Jii = require('jii');
var React = require('react');
var ReactView = require('../ReactView');
var Dropdown = require('./Dropdown');
var Html = require('../helpers/Html');
var Request = require('jii/request/client/Request');
var InvalidConfigException = require('jii/exceptions/InvalidConfigException');
var _forIn = require('lodash/forIn');
var _cloneDeep = require('lodash/cloneDeep');
var _clone = require('lodash/clone');
var _trimStart = require('lodash/trimStart');
var _trimEnd = require('lodash/trimEnd');

/**
 * Nav renders a nav HTML component.
 *
 * @see http://getbootstrap.com/components/#dropdowns
 * @see http://getbootstrap.com/components/#nav
 */
class Nav extends ReactView
{
    render() {
        let route = this.props.route;
        if (route === null) {
            route = _trimEnd(new Request(location).getPathInfo(), '/');
        }

        let params = this.props.params;
        if (params === null) {
            //params = Jii.app.request.getQueryParams(); //TODO
        }

        let options = this.props.options;
        Html.addCssClass(options, {'widget': 'nav'});

        return (
            <ul {...Html.cssClassToString(options)}>
                {this.props.items.map((item, index) => {
                    if (item['visible'] || item['visible'] !== false) {
                        return this.renderItem(_cloneDeep(item), route, params, index);
                    }
                })}
            </ul>
        );
    }

    /**
     * Renders a widget's item.
     * @param {XML|object} item the item to render.
     * @param {string} route
     * @param {object} params
     * @param {number} index
     * @return {XML} the rendering result.
     */
    renderItem(item, route, params, index) {
        if (typeof(item) == 'string') {
            return item;
        }

        if (!item['label']) {
            throw new InvalidConfigException("The 'label' option is required.");
        }

        let items = item['items'];
        let linkOptions = item['linkOptions'] || [];
        let options = item['options'] || [];

        let active;
        if (item['active']) {
            active = item['active'] || false;
            delete item['active'];
        } else {
            active = this.isItemActive(item, route, params);
        }

        let dropDownCaret = null;
        if (!items || !items.length) {
            items = null;
        } else {
            linkOptions['data-toggle'] = 'dropdown';
            Html.addCssClass(options, {'widget': 'dropdown'});
            Html.addCssClass(linkOptions, {'widget': 'dropdown-toggle'});

            if (typeof(items) == 'object') {
                if (this.props.activateItems) {
                    items = this.isChildActive(items, options, route, params);
                }
                items = this.renderDropdown(items, item);
            }
            dropDownCaret = this.props.dropDownCaret;
        }

        if (this.props.activateItems && active) {
            Html.addCssClass(options, 'active');
        }

        return (
            <li key={index} {...Html.cssClassToString(options)}>
                {Html.a(dropDownCaret
                        ? <span>{item['label']} {dropDownCaret}</span>
                        : item['label'],
                    item['url'] || '#',
                    linkOptions)}

                {items}
            </li>
        );
    }

    /**
     * Renders the given items as a dropdown.
     * This method is called to create sub-menus.
     * @param {object} items the given items. Please refer to [[Dropdown.items]] for the array structure.
     * @param {object} parentItem the parent item information. Please refer to [[items]] for the structure of this array.
     * @return {XML} the rendering result.
     */
    renderDropdown(items, parentItem) {
        return (
            <Dropdown
                options={parentItem['dropDownOptions'] || []}
                items={items}
                clientOptions={false}
            />
        );
    }

    /**
     * Check to see if a child item is active optionally activating the parent.
     * @param {object} items @see items
     * @param {object} options parent
     * @param {string} route
     * @param {object} params
     * @return {object} @see items
     */
    isChildActive(items, options, route, params) {
        _forIn(items, (child, i) => {
            if (child['active'] || this.isItemActive(child, route, params)) {
                Html.addCssClass(items[i]['options'], 'active');
                if (this.props.activateParents) {
                    Html.addCssClass(options, 'active');
                }
            }
            delete items[i]['active'];
        });
        return items;
    }

    /**
     * Checks whether a menu item is active.
     * This is done by checking if [[route]] and [[params]] match that specified in the `url` option of the menu item.
     * When the `url` option of a menu item is specified in terms of an array, its first element is treated
     * as the route for the item and the rest of the elements are the associated parameters.
     * Only when its route and parameters match [[route]] and [[params]], respectively, will a menu item
     * be considered active.
     * @param {object} item the menu item to be checked
     * @param {string} route
     * @param {object} params
     * @return {boolean} whether the menu item is active
     */
    isItemActive(item, route, params) {
        if (item['url']) {
            if(typeof(item['url']) == 'string' && _trimStart(item['url'], ['#', '/']) !== route){
                return false;
            }

            if(typeof(item['url']) == 'object' && item['url'][0])
            {
                if (_trimStart(item['url'][0], ['#', '/']) !== route) {
                    return false;
                }
                delete item['url']['#'];

                if (item['url'].length > 1) {
                    let paramsUrl = _clone(item['url']);
                    delete paramsUrl[0];
                    for(var name in paramsUrl) {
                        if (paramsUrl.hasOwnProperty(name) &&
                            (paramsUrl[name] !== null && !params[name] || params[name] != paramsUrl[name]))
                        {
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        return false;
    }
}

Nav.defaultProps = {

    /**
     * @var {object} list of items in the nav widget. Each array element represents a single
     * menu item which can be either a string or an array with the following structure:
     *
     * - label: string, required, the nav item label.
     * - url: optional, the item's URL. Defaults to "#".
     * - visible: boolean, optional, whether this menu item is visible. Defaults to true.
     * - linkOptions: array, optional, the HTML attributes of the item's link.
     * - options: array, optional, the HTML attributes of the item container (LI).
     * - active: boolean, optional, whether the item should be on active state or not.
     * - dropDownOptions: array, optional, the HTML options that will passed to the [[Dropdown]] widget.
     * - items: array|string, optional, the configuration array for creating a [[Dropdown]] widget,
     *   or a string representing the dropdown menu. Note that Bootstrap does not support sub-dropdown menus.
     * - encode: boolean, optional, whether the label will be HTML-encoded. If set, supersedes the encodeLabels option for only this item.
     *
     * If a menu item is a string, it will be rendered directly without HTML encoding.
     */
    items: [],
    /**
     * @var boolean whether to automatically activate items according to whether their route setting
     * matches the currently requested route.
     * @see isItemActive
     */
    activateItems: true,
    /**
     * @var {boolean} whether to activate parent menu items when one of the corresponding child menu items is active.
     */
    activateParents: true,
    /**
     * @var {string} the route used to determine if a menu item is active or not.
     * If not set, it will use the route of the current request.
     * @see params
     * @see isItemActive
     */
    route: null,
    /**
     * @var {object} the parameters used to determine if a menu item is active or not.
     * If not set, it will use `_GET`.
     * @see route
     * @see isItemActive
     */
    params: null,
    /**
     * @var {string} this property allows you to customize the HTML which is used to generate the drop down caret symbol,
     * which is displayed next to the button text to indicate the drop down functionality.
     * Defaults `<b className="caret"></b>` will be used. To disable the caret, set this property to be an null.
     */
    dropDownCaret: <b className='caret'/>,
};
module.exports = Nav;