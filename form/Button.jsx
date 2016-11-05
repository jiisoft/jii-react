'use strict';

var Jii = require('jii');
var ActiveForm = require('./ActiveForm.jsx');
var ReactView = require('../ReactView');
var React = require('react');

/**
 * @class Jii.react.form.Button
 * @extends Jii.react.ReactView
 */
var Button = Jii.defineClass('Jii.react.form.Button', /** @lends Jii.react.form.Button.prototype */{

    __extends: ReactView,

    __static: /** @lends Jii.react.form.Button */{

        /**
         * @alias {Jii.react.form.Button.prototype.context}
         */
        contextTypes: {

            /**
             * @type {Jii.react.form.ActiveForm}
             */
            form: React.PropTypes.object.isRequired,

            /**
             * @type {string}
             */
            layout: React.PropTypes.string,

        },

        /**
         * @alias {Jii.react.form.Button.prototype.props}
         */
        propTypes: {

            type: React.PropTypes.string,

            options: React.PropTypes.object,

            inputOptions: React.PropTypes.object,

            layout: React.PropTypes.string,

        },

        defaultProps: {

            type: 'button',

            options: {
                className: 'form-group'
            },

            inputOptions: {
                className: 'btn btn-default'
            },

            layout: null,

        }

    },

    getLayout() {
        return this.props.layout || this.context.layout || this.context.form.props.layout;
    },

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
    },

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

});

module.exports = Button;