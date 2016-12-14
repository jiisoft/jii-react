'use strict';

var Jii = require('jii');
var ActiveField = require('./ActiveField.jsx');
class TextArea extends ActiveField {

    init() {
        super.init();
        this._onBlur = this._onBlur.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    renderInput() {
        return (
            <textarea
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
        let value = e.target.value;

        this.setState({
            value: value
        });
        this.validateValue(value, e);
        this.props.inputOptions.onChange && this.props.inputOptions.onChange(e, value);
    }

}
module.exports = TextArea;
