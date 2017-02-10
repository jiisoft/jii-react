'use strict';

const Jii = require('jii');
const React = require('react');
const ReactView = require('../ReactView');
const Html = require('../helpers/Html');
const _merge = require('lodash/merge');
const _clone = require('lodash/clone');

class NavBar extends ReactView
{
    render(){
        //Main tag
        let options = _clone(this.props.options);
        if (!options['className']) {
            Html.addCssClass(options, ['navbar', 'navbar-default']);
        }
        else {
            Html.addCssClass(options, {'widget': 'navbar'});
        }

        if(!options['id']){
            options['id'] = String.fromCharCode(97 + parseInt(Math.random() * 25)) + parseInt(Math.random() * 10000)
        }

        if (!options['role']) {
            options['role'] = 'navigation';
        }

        //Inner container tag
        let innerContainerOptions = _clone(this.props.innerContainerOptions);
        if(this.props.renderInnerContainer && !innerContainerOptions['className']) {
            Html.addCssClass(innerContainerOptions, 'container');
        }

        //Container tag
        let containerOptions = _clone(this.props.containerOptions);
        if (!containerOptions['id']) {
            containerOptions['id'] = options['id'] + '-collapse';
        }
        Html.addCssClass(containerOptions, {'collapse': 'collapse', 'widget': 'navbar-collapse'});

        //Brand Tag
        let srcBrand = false;
        let brandOptions = _clone(this.props.brandOptions);
        if (this.props.brandLabel !== false) {
            Html.addCssClass(brandOptions, {'widget': 'navbar-brand'});
            srcBrand = this.props.brandUrl === false
                ? Jii.app.getHomeUrl()
                : this.props.brandUrl;
        }

        return (
            <nav {...Html.cssClassToString(options)}>
                <div {...Html.cssClassToString(innerContainerOptions)}>
                    <div className='navbar-header'>
                        {this.renderToggleButton()}
                        {this.props.brandLabel &&
                            Html.a(this.props.brandLabel, srcBrand, brandOptions)
                        }
                    </div>
                    <div {...Html.cssClassToString(containerOptions)}>
                        {this.props.children}
                    </div>
                </div>
            </nav>
        );
    }

    /**
     * Renders collapsible toggle button.
     * @return {XML} the rendering toggle button.
     */
    renderToggleButton() {
        return(
            <button
                className='navbar-toggle'
                data-toggle='collapse'
                data-target={'#' + this.props.containerOptions['id']}
            >
                <span className='sr-only'>{this.props.screenReaderToggleText}</span>
                <span className='icon-bar'/>
                <span className='icon-bar'/>
                <span className='icon-bar'/>
            </button>
        );
    }
}

NavBar.defaultProps = {
    /**
     * @var {object} the HTML attributes for the widget container tag.
     */
    options: [],
    /**
     * @var {object} the HTML attributes for the container tag.
     */
    containerOptions: [],
    /**
     * @var {string|boolean} the text of the brand or false if it's not used.
     * @see http://getbootstrap.com/components/#navbar
     */
    brandLabel: false,
    /**
     * @var {array|string|boolean} url the URL for the brand's hyperlink tag.
     * will be used for the 'href' attribute of the brand link. Default value is false that means
     * [[homeUrl]] will be used.
     * You may set it to `null` if you want to have no link at all.
     */
    brandUrl: false,
    /**
     * @var array the HTML attributes of the brand link.
     */
    brandOptions: [],
    /**
     * @var string text to show for screen readers for the button to toggle the navbar.
     */
    screenReaderToggleText: 'Toggle navigation',
    /**
     * @var {boolean} whether the navbar content should be included in an inner div container which by default
     * adds left and right padding. Set this to false for a 100% width navbar.
     */
    renderInnerContainer: true,
    /**
     * @var {Array} the HTML attributes of the inner container.
     */
    innerContainerOptions: [],

};
module.exports = NavBar;
