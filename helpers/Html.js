'use strict';

const _forIn = require('lodash/forIn');
const _uniq = require('lodash/uniq');
const _difference = require('lodash/difference');
const _values = require('lodash/values');

class Html{

    /**
     * Generates a hyperlink tag.
     * @param {string} text link body.
     * @param {object|string|null} url the URL for the hyperlink tag
     * @param {object} options the tag options in terms of name-value pairs. These will be rendered as
     * the attributes of the resulting tag.
     * If a value is null, the corresponding attribute will not be rendered.
     * @returns {XML} hyperlink tag
     */
    static a(text, url = null, options = []){
        options = Html.cssClassToString(options);

        if(url !== null){
            if (typeof(url) == 'object' && url[0].length) {
                url = url[0];

                //normalize begin link
                if(url[0] != '/' && url[0] != '#'){
                    url = '/' + url;
                }
            }

            //normalize end link
            if(url[url.length - 1] != '/'){
                url += '/';
            }

            options['href'] = url;
        }

        return <a {...options}>{text}</a>;
    }

    /**
     * Converting object className in string
     * @param {object} options
     * @returns {*}
     */
    static cssClassToString(options){
        if(options['class']){
            const classNameNew = options['class'];
            delete options['class'];
            Html.addCssClass(options, classNameNew);
        }

        if(options['className'] && typeof(options['className']) == 'object'){
            options['className'] = _values(options['className']).join(' ');
        }

        return options;
    }

    /**
     * Adds a CSS class (or several classes) to the specified options.
     * If the CSS class is already in the options, it will not be added again.
     * If class specification at given options is an array, and some class placed there with the named (string) key,
     * overriding of such key will have no effect. For example:
     *
     * ```php
     * options = {'class': {'persistent': 'initial'}};
     * Html.addCssClass(options, {'persistent': 'override'});
     * console.log(options['class']); // outputs: {'persistent': 'initial'};
     * ```
     *
     * @param {object} options the options to be modified.
     * @param {string|object} className the CSS class(es) to be added
     */
    static addCssClass(options, className) {
        if (options['className']) {
            if (typeof(options['className']) == 'object') {
                options['className'] = Html.mergeCssClasses(options['className'], className);
            }
            else {
                const classes = options['className'].split('/\s+/').filter(x => x);
                options['className'] = Html.mergeCssClasses(classes, className).join(' ');
            }
        } else {
            options['className'] = className;
        }
    }



    /**
     * Merges already existing CSS classes with new one.
     * This method provides the priority for named existing classes over additional.
     * {object} existingClasses already existing CSS classes.
     * {object} additionalClasses CSS classes to be added.
     * @return {object} merge result.
     */
    static mergeCssClasses(existingClasses, additionalClasses) {
        if(typeof(additionalClasses) == 'string'){
            additionalClasses = [additionalClasses];
        }

        _forIn(additionalClasses, (className, key) => {
            if (typeof(key) == 'number' && !(className in existingClasses)) {
                existingClasses.push(className);
            }
            else if (!existingClasses[key]) {
                existingClasses[key] = className;
            }
        });

        return _uniq(_values(existingClasses));
    }



    /**
     * Removes a CSS class from the specified options.
     * @param {object} options the options to be modified.
     * @param {string|object} className the CSS class(es) to be removed
     */
    static removeCssClass(options, className) {
        if (options['className']) {
            if (typeof(options['className']) == 'object') {
                const classes = _difference(options['className'], className);
                if (!classes || !classes.length) {
                    delete options['className'];
                } else {
                    options['className'] = classes;
                }
            } else {
                let classes = options['className'].split('/\s+/').filter(x => x);
                classes = _difference(classes, className);
                if (!classes || !classes.length) {
                    delete options['className'];
                } else {
                    options['className'] = classes.join(' ');
                }
            }
        }
    }
}

module.exports = Html;