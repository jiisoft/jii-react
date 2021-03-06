'use strict';

const Jii = require('jii');
const ActiveForm = require('./ActiveForm.jsx');
const ReactView = require('../ReactView');
const React = require('react');
class Button extends ReactView {

    getLayout() {
        return this.props.layout || this.context.layout || this.context.form.props.layout;
    }

    render() {
        return (
            <div
                {...this.props.options}
            >
                <div
                    className={
                        this.getLayout() === ActiveForm.LAYOUT_HORIZONTAL ?
                            'col-sm-offset-' +  + this.context.form.props.cols[0] + ' col-sm-' + this.context.form.props.cols[1] :
                            ''
                    }
                >
                    {this.renderButton()}
                </div>
            </div>
        );
    }

    renderButton() {
        if (this.props.type === 'submit') {
            return (
                <input
                    {...this.props.inputOptions}
                    type='submit'
                    value={String(this.props.children || '')}
                />
            );
        }

        return (
            <button {...this.props.inputOptions}>
                {this.props.children}
            </button>
        );
    }

}

Button.defaultProps = {

    type: 'button',

    options: {
        className: 'form-group'
    },

    inputOptions: {
        className: 'btn btn-default'
    },

    layout: null
}

/**
         * @alias {props}
         */
Button.propTypes = {

    type: React.PropTypes.string,

    options: React.PropTypes.object,

    inputOptions: React.PropTypes.object,

    layout: React.PropTypes.string
};

/**
         * @alias {context}
         */
Button.contextTypes = {

    /**
             * @type {ActiveForm}
             */
    form: React.PropTypes.object.isRequired,

    /**
             * @type {string}
             */
    layout: React.PropTypes.string
};
module.exports = Button;
