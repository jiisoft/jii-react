'use strict';

const Jii = require('jii');
const ActiveField = require('./ActiveField.jsx');
const React = require('react');
class Input extends ActiveField {

    init() {
        super.init();
        this._onBlur = this._onBlur.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    render() {
        if (this.props.type === 'hidden') {
            return this.renderInput();
        }

        return super.render();
    }

    renderInput() {
        return (
            <input
                {...this.props.inputOptions}
                id={this._getInputId()}
                name={this._getInputName()}
                type={this.props.type}
                placeholder={this.props.placeholder}
                className={[
                    this.props.inputOptions.className || '',
                    'form-control'
                ].join(' ')}
                onBlur={this._onBlur}
                onChange={this._onChange}
                value={this.state.value || ''}
            />
        );
    }

    _onBlur(e) {
        let value = e.target.value;

        this.setState({
            value: value
        });
        this.validateValue(value, e);
        this.props.inputOptions.onBlur && this.props.inputOptions.onBlur(e);
    }

    _onChange(e) {
        super._onChange(e);

        let value = e.target.value;

        this.setState({
            value: value
        });
        this.validateValue(value, e);
        this.props.inputOptions.onChange && this.props.inputOptions.onChange(e, value);
    }

}

Input.defaultProps = Jii.mergeConfigs(ActiveField.defaultProps, {
    type: 'text',
    placeholder: ''
});

/**
         * @alias {props}
         */
Input.propTypes = Jii.mergeConfigs(ActiveField.propTypes, {

    /**
             * @type {string}
             */
    type: React.PropTypes.string,

    /**
             * @type {string}
             */
    placeholder: React.PropTypes.string
});
module.exports = Input;
