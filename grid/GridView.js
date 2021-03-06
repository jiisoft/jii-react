'use strict';

const Jii = require('jii');
const DataColumn = require('./DataColumn');
const Model = require('jii/base/Model');
const InvalidConfigException = require('jii/exceptions/InvalidConfigException');
const _isEmpty = require('lodash/isEmpty');
const _isFunction = require('lodash/isFunction');
const _isObject = require('lodash/isObject');
const _isString = require('lodash/isString');
const _filter = require('lodash/filter');
const _each = require('lodash/each');
const _map = require('lodash/map');
const _size = require('lodash/size');
const _clone = require('lodash/clone');
const _extend = require('lodash/extend');
const _keys = require('lodash/keys');
const BaseListView = require('../widgets/BaseListView');
const React = require('react');
class GridView extends BaseListView {

    preInit() {
        // @todo Move to props for dynamically change
        this._columns = [];
        super.preInit(...arguments);
    }

    /**
     * Initializes the grid view.
     * This method will initialize required property values and instantiate [[columns]] objects.
     */
    init() {
        super.init();
        this._initColumns();
    }

    /**
     * Renders validator errors of filter model.
     * @returns {string} the rendering result.
     */
    renderErrors() {
        return ''; // @todo
    }

    /**
     * @inheritdoc
     */
    renderSection(name) {
        switch (name) {
            case '{errors}':
                return this.renderErrors();
        }

        return super.renderSection(name);
    }

    /**
     * Renders the data models for the grid view.
     */
    renderItems() {
        var caption = this.renderCaption();
        var columnGroup = this.renderColumnGroup();
        var tableHeader = this.props.showHeader ? this.renderTableHeader() : false;
        var tableBody = this.renderTableBody();
        var tableFooter = this.props.showFooter ? this.renderTableFooter() : false;

        return React.createElement.apply(React, [
            'table',
            this.props.tableOptions
        ].concat(_filter([
            caption,
            columnGroup,
            tableHeader,
            tableFooter,
            tableBody
        ])));
    }

    /**
     * Renders the caption element.
     * @returns {object} the rendered caption element or `false` if no caption element should be rendered.
     */
    renderCaption() {
        if (!_isEmpty(this.props.caption)) {
            return React.createElement('caption', this.props.captionOptions, this.props.caption);
        }
        return false;
    }

    /**
     * Renders the column group HTML.
     * @returns {boolean|object} the column group HTML or `false` if no column group should be rendered.
     */
    renderColumnGroup() {
        var requireColumnGroup = false;
        _each(this._columns, column => {
            if (!_isEmpty(column.options)) {
                requireColumnGroup = true;
            }
        });

        if (requireColumnGroup) {
            return React.createElement('colgroup', null, _map(this._columns, column => {
                /** @typedef {Column} column */
                return React.createElement('col', column.options);
            }));
        }
        return false;
    }

    /**
     * Renders the table header.
     * @returns {object} the rendering result.
     */
    renderTableHeader() {
        return React.createElement('thead', null, React.createElement('tr', this.props.headerRowOptions, _map(this._columns, column => {
            /** @typedef {Column} column */
            return column.renderHeaderCell();
        })));
    }

    /**
     * Renders the table footer.
     * @returns {object} the rendering result.
     */
    renderTableFooter() {
        return React.createElement('tfoot', null, React.createElement('tr', this.props.footerRowOptions, _map(this._columns, column => {
            /** @typedef {Column} column */
            return column.renderFooterCell();
        })));
    }

    /**
     * Renders the filter.
     * @returns {string} the rendering result.
     */
    renderFilters() {
        return ''; // @todo
    }

    /**
     * Renders the table body.
     * @returns {object} the rendering result.
     */
    renderTableBody() {
        var models = this.props.collection;
        var rows = [];

        _each(models, (model, index) => {
            var key = model.getPrimaryKey();
            if (this.props.beforeRow !== null) {
                var beforeRow = this.props.beforeRow.call(null, model, key, index, this);
                if (!_isEmpty(beforeRow)) {
                    rows.push(beforeRow);
                }
            }

            rows.push(this.renderTableRow(model, key, index));

            if (this.props.afterRow !== null) {
                var afterRow = this.props.afterRow.call(null, model, key, index, this);
                if (!_isEmpty(afterRow)) {
                    rows.push(afterRow);
                }
            }
        });

        if (!_isEmpty(rows)) {
            return React.createElement('tbody', null, rows);
        }

        return React.createElement('tbody', null, React.createElement('tr', null, React.createElement('td', {
            colSpan: _size(this._columns)
        }, this.renderEmpty())));
    }

    /**
     * Renders a table row with the given data model and key.
     * @param {mixed} model the data model to be rendered
     * @param {mixed} key the key associated with the data model
     * @param {number} index the zero-based index of the data model among the model array returned by [[dataProvider]].
     * @returns {object} the rendering result
     */
    renderTableRow(model, key, index) {
        var options = _isFunction(this.props.rowOptions) ? this.props.rowOptions.call(null, model, key, index, this) : _clone(this.props.rowOptions);
        options.key = _isObject(key) ? JSON.stringify(key) : String(key);

        return React.createElement('tr', options, _map(this._columns, column => {
            /** @typedef {Column} column */
            return column.renderDataCell(model, key, index);
        }));
    }

    /**
     * Creates column objects and initializes them.
     */
    _initColumns() {
        if (_isEmpty(this.props.columns)) {
            this._guessColumns();
        }

        var columns = [];
        _each(this.props.columns, (column, index) => {
            if (_isString(column)) {
                column = this._createDataColumn(column, index);
            } else {
                column = Jii.createObject(_extend({
                    className: this.props.dataColumnClassName || DataColumn,
                    grid: this,
                    key: (column.attribute || 'c') + index
                }, column));
            }

            if (column.visible) {
                columns.push(column);
            }
        });

        this._columns = columns;
    }

    /**
     * Creates a [[DataColumn]] object based on a string in the format of "attribute:format:label".
     * @param {string} text the column specification string
     * @param {number} index
     * @returns {DataColumn} the column instance
     * @throws InvalidConfigException if the column specification is invalid
     */
    _createDataColumn(text, index) {
        var matches = /^([^:]+)(:(\w*))?(:(.*))?/.exec(text);
        if (!matches) {
            throw new InvalidConfigException('The column must be specified in the format of "attribute", "attribute:format" or "attribute:format:label"');
        }

        return Jii.createObject({
            className: this.props.dataColumnClassName || DataColumn,
            grid: this,
            key: matches[1] + '-' + index,
            attribute: matches[1],
            format: matches[3] || 'text',
            label: matches[5] || null
        });
    }

    /**
     * This function tries to guess the columns to show from the given data
     * if [[columns]] are not explicitly specified.
     */
    _guessColumns() {
        var model = this.props.collection[0];
        if (!model && this.props.collection.modelClass) {
            model = this.props.collection.createModel();
        }
        if (model instanceof Model) {
            this._columns = model.attributes();
        } else if (_isObject(model)) {
            this._columns = _keys(model);
        }
    }

}

GridView.defaultProps = Jii.mergeConfigs(BaseListView.defaultProps, {
    dataColumnClassName: null,
    caption: null,
    captionOptions: {},
    tableOptions: {
        className: 'table table-striped table-bordered'
    },
    options: {
        className: 'grid-view'
    },
    headerRowOptions: {},
    footerRowOptions: {},
    rowOptions: {},
    beforeRow: null,
    afterRow: null,
    showHeader: true,
    showFooter: false,
    showOnEmpty: true,
    /**
     * @type {[]} grid column configuration. Each array element represents the configuration
     * for one particular grid column.
     */
    columns: {},
    emptyCell: ' ',
    layout: '{summary}\n{items}\n{pager}'
});

/**
 * @alias {props}
 */
GridView.propTypes = Jii.mergeConfigs(BaseListView.propTypes, {

    /**
     * @type {string} the default data column class if the class name is not explicitly specified when configuring a data column.
     * Defaults to 'DataColumn'.
     */
    dataColumnClassName: React.PropTypes.string,

    /**
     * @type {string} the caption of the grid table
     */
    caption: React.PropTypes.string,

    /**
     * @type {object} the HTML attributes for the caption element.
     */
    captionOptions: React.PropTypes.object,

    /**
     * @type {object} the HTML attributes for the grid table element.
     */
    tableOptions: React.PropTypes.object,

    /**
     * @type {object} the HTML attributes for the container tag of the grid view.
     * The "tag" element specifies the tag name of the container element and defaults to "div".
     */
    options: React.PropTypes.object,

    /**
     * @type {object} the HTML attributes for the table header row.
     */
    headerRowOptions: React.PropTypes.object,

    /**
     * @type {object} the HTML attributes for the table footer row.
     */
    footerRowOptions: React.PropTypes.object,

    /**
     * @type {object|function} the HTML attributes for the table body rows. This can be either an array
     * specifying the common HTML attributes for all body rows, or an anonymous function that
     * returns an array of the HTML attributes. The anonymous function will be called once for every
     * data model returned by [[dataProvider]]. It should have the following signature:
     *
     * ```js
     * function (model, key, index, grid)
     * ```
     *
     * - `model`: the current data model being rendered
     * - `key`: the key value associated with the current data model
     * - `index`: the zero-based index of the data model in the model array returned by [[dataProvider]]
     * - `grid`: the GridView object
     */
    rowOptions: React.PropTypes.object,

    /**
     * @type {function} an anonymous function that is called once BEFORE rendering each data model.
     * It should have the similar signature as [[rowOptions]]. The return result of the function
     * will be rendered directly.
     */
    beforeRow: React.PropTypes.func,

    /**
     * @type {function} an anonymous function that is called once AFTER rendering each data model.
     * It should have the similar signature as [[rowOptions]]. The return result of the function
     * will be rendered directly.
     */
    afterRow: React.PropTypes.func,

    /**
     * @type {boolean} whether to show the header section of the grid table.
     */
    showHeader: React.PropTypes.bool,

    /**
     * @type {boolean} whether to show the footer section of the grid table.
     */
    showFooter: React.PropTypes.bool,

    /**
     * @type {boolean} whether to show the grid view if [[dataProvider]] returns no data.
     */
    showOnEmpty: React.PropTypes.bool,

    /**
     * @type {string} the HTML display when the content of a cell is empty.
     * This property is used to render cells that have no defined content,
     * e.g. empty footer or filter cells.
     *
     * Note that this is not used by the [[DataColumn]] if a data item is `null`. In that case
     * the [[\jii\i18n\Formatter.nullDisplay|nullDisplay]] property of the [[formatter]] will
     * be used to indicate an empty data value.
     */
    emptyCell: React.PropTypes.string,

    /**
     * @type {string} the layout that determines how different sections of the list view should be organized.
     * The following tokens will be replaced with the corresponding section contents:
     *
     * - `{summary}`: the summary section. See [[renderSummary()]].
     * - `{errors}`: the filter model error summary. See [[renderErrors()]].
     * - `{items}`: the list items. See [[renderItems()]].
     * - `{sorter}`: the sorter. See [[renderSorter()]].
     * - `{pager}`: the pager. See [[renderPager()]].
     */
    layout: React.PropTypes.string
});
module.exports = GridView;