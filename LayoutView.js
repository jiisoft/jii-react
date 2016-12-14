'use strict';

var Jii = require('jii');
var ReactView = require('./ReactView');
class LayoutView extends ReactView {

    preInit() {
        /**
     * @type {object}
     */
        this.state = {

            content: null
        };
        super.preInit(...arguments);
    }

}
module.exports = LayoutView;