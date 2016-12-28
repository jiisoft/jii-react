'use strict';

var Jii = require('jii');
var React = require('react');
var ReactView = require('../ReactView');
var Html = require('../helpers/Html');
var InvalidConfigException = require('jii/exceptions/InvalidConfigException');
var _cloneDeep = require('lodash/cloneDeep');

class Breadcrumbs extends ReactView{

    render(){
        if (!this.props.links || !this.props.links.length) {
            return null;
        }

        let links = [];
        if(this.props.homeLink !== false){
            if (!this.props.homeLink) {
                links.push(
                    this.renderItem({
                        'label': Jii.t('jii', 'Home'),
                        'url': Jii.app.getHomeUrl()
                    })
                );
            }
            else {
                links.push(this.renderItem(this.props.homeLink));
            }
        }

        this.props.links.map((link) => {
            if (typeof(link) != 'object') {
                link = {'label': link};
            }
            links.push(this.renderItem(_cloneDeep(link)));
        });

        return (
            <ul {...this.props.options}>
                {links.map((link, index) => {
                    return <li key={index} >{link}</li>
                })}
            </ul>
        );
    }

    renderItem(link){
        if(!link['label']){
            throw new InvalidConfigException('The "label" element is required for each link.');
        }

        if (link['url']) {
            let options = link;
            let url = link['url'];
            const label = link['label'];
            delete options['template'];
            delete options['label'];
            delete options['url'];

            link = Html.a(label, url, options);
        }
        else {
            link = link['label'];
        }

        return link;
    }
}
Breadcrumbs.defaultProps = {
    /**
     * {array} the HTML attributes for the breadcrumb container tag.
     */
    options: {'className': 'breadcrumb'},
    /**
     * {string} the first hyperlink in the breadcrumbs (called home link).
     * If this property is false, the home link will not be rendered.
     */
    homeLink: false,
    /**
     * {array} list of links to appear in the breadcrumbs. If this property is empty,
     * the widget will not render anything. Each array element represents a single link in the breadcrumbs
     * with the following structure:
     *
     * [
     *     'label': 'label of the link',  // required
     *     'url': 'url of the link',      // string
     *     'template': 'own template of the item', // optional, if not set this.props.itemTemplate will be used
     * ]
     * ```
     */
    links: [],
};
module.exports = Breadcrumbs;