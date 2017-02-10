'use strict';

const Jii = require('jii');
const React = require('react');
const ReactView = require('jii-react/ReactView');
const BooleanValidator = require('jii/validators/BooleanValidator.js');
const InvalidConfigException = require('jii/exceptions/InvalidConfigException.js');
const Formatter = require('jii/i18n/Formatter.js');
const Model = require('jii/base/Model');
const Inflector = require('jii/helpers/Inflector');
const _cloneDeep = require('lodash/cloneDeep');

class DetailView extends ReactView {
    
    init(){
        super.init();

        if (this.props.model === null) {
            throw new InvalidConfigException('Please specify the "model" property.');
        }

        this.formatter = _cloneDeep(this.props.formatter);
        if (this.formatter === null && Jii.app.hasComponent('formatter')) {
            this.formatter = Jii.app.formatter;
        } 
        else if (this.formatter.length) {
            this.formatter = Jii.createObject(this.formatter);
        }
        
        if (!this.formatter instanceof Formatter) {
            throw new InvalidConfigException('The "formatter" property must be either a Format object or a configuration array.');
        }
    }

    render() {
        const attributes = this.normalizeAttributes();

        return (
            <table {...this.props.options}>
                <tbody>
                    {attributes.map((attribute, index) => {
                        return this.renderAttribute(attribute, index);
                    })}
                </tbody>
            </table>
        );
    }

    /**
     * Renders a single attribute.
     * @param {Array} attribute the specification of the attribute to be rendered.
     * @param {number} index the zero-based index of the attribute in the [[attributes]] array
     * @return string the rendering result
     */
    renderAttribute(attribute, index) {
        return (
            <tr key={index}>
                <th {...attribute['captionOptions']}>{attribute['label']}</th>
                <td {...attribute['contentOptions']}>{this.formatter.format(attribute['value'], attribute['format'])}</td>
            </tr>
        );
    }

    /**
     * Normalizes the attribute specifications.
     * @return {Array} attribute
     */
    normalizeAttributes() {
        let attributes = _cloneDeep(this.props.attributes);

        if (attributes === null) {
            if (this.props.model instanceof Model) {
                attributes = this.props.model.attributes();
            }
            else if (typeof(this.props.model) == 'object') {
                attributes = Object.keys(this.props.model);
            }
            else {
                throw new InvalidConfigException('The "model" property must be either an array or an object.');
            }
        }

        attributes.map((attribute, i) => {
            if (typeof(attribute) == 'string') {
                const matches = /^([\w\.]+)(:(\w*))?(:(.*))?/.exec(attribute);
                if (!matches.length) {
                    throw new InvalidConfigException('The attribute must be specified in the format of "attribute", "attribute:format" or "attribute:format:label"');
                }

                attribute = {
                    'attribute': matches[1],
                    'format': matches[3] ? matches[3] : 'text',
                    'label': matches[5] ? matches[5] : null,
                };
            }

            if (typeof(attribute) !== 'object') {
                throw new InvalidConfigException('The attribute configuration must be an array.');
            }

            if (attribute['visible'] === false) {
                delete attributes[i];
                return;
            }

            if (!attribute['format']) {
                attribute['format'] = 'text';
            }

            if (attribute['attribute']) {
                const attributeName = attribute['attribute'];

                if (!attribute['label']) {
                    attribute['label'] = this.props.model instanceof Model
                        ? this.props.model.getAttributeLabel(attributeName)
                        : Inflector.camel2words(attributeName, true);
                }
                if (!('value' in attribute)) {
                    attribute['value'] = this.props.model instanceof Model
                        ? this.props.model.get(attributeName)
                        : this.props.model[attributeName];
                }
                else if(typeof(attribute['value']) == 'function'){
                    attribute['value'] = attribute['value'](this.props.model, attributeName);
                }
            }
            else if (!attribute['label'] || !('value' in attribute)) {
                throw new InvalidConfigException('The attribute configuration requires the "attribute" element to determine the value and display label.');
            }

            attributes[i] = attribute;
        });

        return attributes;
    }
}

DetailView.defaultProps = {
    /**
     * @var {object} the data model whose details are to be displayed. This can be a [[Model]] instance,
     * an associative array, an object that implements [[Arrayable]] interface or simply an object with defined
     * accessible non-static properties.
     */
    model: null,
    /**
     * @var {Array} a list of attributes to be displayed in the detail view. Each array element
     * represents the specification for displaying one particular attribute.
     */
    attributes: null,
    /**
     * @var {object} the HTML attributes for the container tag of this widget. The `tag` option specifies
     * what container tag should be used. It defaults to `table` if not set.
     */
    options: {'className': 'table table-striped table-bordered detail-view'},
    /**
     * @var {object|Formatter} the formatter used to format model attribute values into displayable texts.
     * This can be either an instance of [[Formatter]] or an configuration array for creating the [[Formatter]]
     * instance. If this property is not set, the `formatter` application component will be used.
     */
    formatter: null
};

module.exports = DetailView;