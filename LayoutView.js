'use strict';

var Jii = require('jii');
var ReactView = require('./ReactView');

/**
 * @class Jii.react.LayoutView
 * @extends Jii.react.ReactView
 */
var LayoutView = Jii.defineClass('Jii.react.LayoutView', /** @lends Jii.react.LayoutView.prototype */{

    __extends: ReactView,

    /**
     * @type {object}
     */
    state: {

        content: null

    }

});

module.exports = LayoutView;