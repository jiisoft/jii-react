'use strict';

const Jii = require('jii');
const ActiveField = require('./ActiveField.jsx');
const React = require('react');
class CheckBox extends ActiveField {

    init() {
        super.init();
        this._onChange = this._onChange.bind(this);
    }

    renderLabel() {
        return null;
    }

    renderWrapper(children) {
        return (
            <div
                {...this.props.wrapperOptions}
                className={[
                    this.props.wrapperOptions.className || '',
                    'col-sm-offset-' + this.context.form.props.cols[0],
                    'col-sm-' + this.context.form.props.cols[1]
                ].join(' ')}
            >
                {children}
            </div>
        );
    }

    renderInput() {
        return (
            <div
                id={this._getInputId()}
                className={'checkbox' + (this.props.inputOptions.disabled ? ' disabled' : '')}
            >
                <label className={this.props.inline ? 'checkbox-inline' : ''}>
                    <input
                        {...this.props.inputOptions}
                        type="checkbox"
                        name={this._getInputName()}
                        checked={this.state.value == true}
                        onChange={this._onChange}
                    /> {this.context.model.getAttributeLabel(this._getAttributeName())}
                </label>
            </div>
        );
    }

    _onChange(e) {
        let value = e.target.checked;

        this.setState({
            value: value
        });
        this.validateValue(value, e);
        this.props.inputOptions.onChange && this.props.inputOptions.onChange(e, value);
    }

}
module.exports = CheckBox;
