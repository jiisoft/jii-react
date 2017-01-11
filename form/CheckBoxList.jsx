'use strict';

const Jii = require('jii');
const _isObject = require('lodash/isObject');
const _isString = require('lodash/isString');
const _has = require('lodash/has');
const _indexOf = require('lodash/indexOf');
const _map = require('lodash/map');
const _filter = require('lodash/filter');
const _uniq = require('lodash/uniq');
const ActiveField = require('./ActiveField.jsx');
const React = require('react');
const DropDownList = require('./DropDownList.jsx');
class CheckBoxList extends ActiveField {

    init() {
        super.init();
        this._onChange = this._onChange.bind(this);
    }

    renderInput() {
        return (
            <div
                id={this._getInputId()}
            >
                {_map(DropDownList.normalizeItems(this.props.items), this.renderItem.bind(this))}
            </div>
        );
    }

    renderItem(item) {

        if (this.props.inline) {
            return this.renderItemLabel(item.label, item.value, item.disabled);
        }

        return (
            <div className={'checkbox' + (item.disabled ? ' disabled' : '')} key={item.value}>
                {this.renderItemLabel(item.label, item.value, item.disabled)}
            </div>
        );
    }

    renderItemLabel(label, value, isDisabled) {
        return (
            <label className={this.props.inline ? 'checkbox-inline' : ''} key={this.props.inline ? value : null}>
                <input
                    {...this.props.inputOptions}
                    type="checkbox"
                    name={this._getInputName()}
                    checked={_indexOf([].concat(this.state.value), value) !== -1}
                    disabled={isDisabled}
                    value={value}
                    onChange={this._onChange}
                /> {label}
            </label>
        );
    }

    _onChange(e) {
        let values = [].concat(this.state.value);
        if (e.target.checked) {
            values.push(e.target.value);
        } else {
            values = _filter(values, v => v !== e.target.value);
        }
        values = _uniq(values);

        this.setState({
            value: values
        });
        this.validateValue(values, e);
        this.props.inputOptions.onChange && this.props.inputOptions.onChange(e, values);
    }

}

CheckBoxList.defaultProps = Jii.mergeConfigs(ActiveField.defaultProps, {
    inline: false,
    items: []
});

/**
         * @alias {Jii.react.form.CheckBoxList.prototype.props}
         */
CheckBoxList.propTypes = Jii.mergeConfigs(ActiveField.propTypes, {

    /**
             * @type {boolean}
             */
    inline: React.PropTypes.bool,

    /**
             * @type {string}
             */
    items: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ])
});
module.exports = CheckBoxList;
