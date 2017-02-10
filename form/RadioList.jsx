'use strict';

const Jii = require('jii');
const _isObject = require('lodash/isObject');
const _map = require('lodash/map');
const ActiveField = require('./ActiveField.jsx');
const React = require('react');
const DropDownList = require('./DropDownList.jsx');
class RadioList extends ActiveField {

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
            <div className={'radio' + (item.disabled ? ' disabled' : '')} key={item.value}>
                {this.renderItemLabel(item.label, item.value, item.disabled)}
            </div>
        );
    }

    renderItemLabel(label, value, isDisabled) {
        return (
            <label className={this.props.inline ? 'radio-inline' : ''} key={this.props.inline ? value : null}>
                <input
                    {...this.props.inputOptions}
                    type="radio"
                    name={this._getInputName()}
                    checked={this.state.value == value}
                    disabled={isDisabled}
                    value={value}
                    onChange={this._onChange}
                /> {label}
            </label>
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

RadioList.defaultProps = Jii.mergeConfigs(ActiveField.defaultProps, {
    inline: false,
    items: []
});

/**
         * @alias {props}
         */
RadioList.propTypes = Jii.mergeConfigs(ActiveField.propTypes, {

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
module.exports = RadioList;
