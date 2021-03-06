'use strict';

const Jii = require('jii');
const _isObject = require('lodash/isObject');
const _map = require('lodash/map');
const _each = require('lodash/each');
const _has = require('lodash/has');
const _isString = require('lodash/isString');
const ActiveField = require('./ActiveField.jsx');
const React = require('react');
class DropDownList extends ActiveField {

    static normalizeItems(items) {
        const result = [];
        _each(items, (item, value) => {
            let isDisabled = false;
            let label = '';

            if (_isObject(item)) {
                label = item.label || '';
                isDisabled = !!item.disabled;

                if (_has(item, 'value')) {
                    value = item.value;
                }
            } else if (_isString(item)) {
                label = item;
            }

            result.push({
                label: label,
                value: value,
                disabled: isDisabled
            });
        });
        return result;
    }

    init() {
        super.init();
        this._onChange = this._onChange.bind(this);
    }

    renderInput() {
        return (
            <select
                {...this.props.inputOptions}
                id={this._getInputId()}
                name={this._getInputName()}
                className={[
                    this.props.inputOptions.className || '',
                    'form-control'
                ].join(' ')}
                onChange={this._onChange}
                value={this.state.value || ''}
            >
                {_map(DropDownList.normalizeItems(this.props.items), item => {
                    let optionProps = {
                        key: item.value,
                        value: item.value,
                        disabled: item.value.disabled
                    };

                    return <option {...optionProps}>{item.label}</option>
                })}
            </select>
        );
    }

    _onChange(e) {
        let value = e.target.value;

        this.setState({
            value: value
        });
        this.validateValue(value, e);
        this.props.inputOptions.onChange && this.props.inputOptions.onChange(e, value);
    }

}

DropDownList.defaultProps = Jii.mergeConfigs(ActiveField.defaultProps, {
    items: []
});

/**
         * @alias {props}
         */
DropDownList.propTypes = Jii.mergeConfigs(ActiveField.propTypes, {

    /**
             * @type {string}
             */
    items: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ])
});
module.exports = DropDownList;
