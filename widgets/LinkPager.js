'use strict';

var Jii = require('jii');
var React = require('react');
var ReactView = require('../ReactView');
var DataProvider = require('jii/data/DataProvider');
var _noop = require('lodash/noop');

class LinkPager extends ReactView{

    /**
     * dataProvider.fetch() [For noLink = true]
     */
    fetch(){
        if(typeof(this.props.collection.fetch) == 'function'){
            this.props.collection.fetch();
        }
    }

    /**
     * [For use in events with arguments, so as not to cause incorrect parent.forceUpdate]
     * @param [argument] - not use
     */
    forceUpdate(argument) {
        super.forceUpdate.apply(this);
    }

    componentDidMount() {
        //update widget after fetch collection (listen model not call update widget, if models don't have changed -> but widget need update if changed totalCount)
        if(this.props.collection && typeof(this.props.collection.on) == 'function') {
            this.props.collection.on(DataProvider.EVENT_AFTER_FETCH, this.forceUpdate);
        }
    }
    componentWillUnmount() {
        if(this.props.collection && typeof(this.props.collection.on) == 'function') {
            this.props.collection.off(DataProvider.EVENT_AFTER_FETCH, this.forceUpdate);
        }
    }

    render(){
        const pagination = this.props.collection.getPagination();
        const links = pagination.getLinks();

        if(!links.self || Object.keys(links).length < 2) {
            return null;
        }

        return (
            <ul className='pagination'>
                {links.self &&
                <li className={'prev ' + (links.prev ? '' : 'disabled')}>
                    {this.props.noLink
                        ? <a href='javascript:void(0)'
                             onClick={() => {
                                 if(links.prev){
                                     pagination.setPage(pagination.getPage() - 1);
                                     this.fetch();
                                 }
                             }}>«</a>
                        : <a href={links.prev ? ('#' + links.prev) : 'javascript:void(0)'}>«</a>
                    }
                </li>
                }

                {this.renderPageButtons(pagination)}

                {links.next &&
                <li className='next'>
                    {this.props.noLink
                        ? <a href='javascript:void(0)'
                             onClick={() => {
                                 pagination.setPage(pagination.getPage() + 1);
                                 this.fetch();
                             }}>»</a>
                        : <a href={'#' + links.next}>»</a>
                    }
                </li>
                }
            </ul>
        );
    }

    renderPageButtons(pagination){
        const rangePages = this.getPageRange(pagination);
        const currentPage = pagination.getPage();

        let buttons = [];
        for(let indexPage = rangePages[0]; indexPage <= rangePages[1]; indexPage++){
            buttons.push(
                <li key={indexPage} className={indexPage == currentPage ? 'active' : ''}>

                    {this.props.noLink
                        ? <a href='javascript:void(0)'
                             onClick={() => {
                                 pagination.setPage(indexPage);
                                 this.fetch();
                             }}>{indexPage + 1}</a>
                        : <a href={'#' + pagination.createUrl(indexPage)}>
                        {indexPage + 1}
                    </a>
                    }

                </li>
            );
        }

        return buttons;
    }

    /**
     * @return {[]} the begin and end pages that need to be displayed.
     */
    getPageRange(pagination) {
        const currentPage = pagination.getPage();
        const pageCount = pagination.getPageCount();

        let beginPage = Math.max(0, currentPage - parseInt(this.props.maxButtonCount / 2));
        let endPage = beginPage + this.props.maxButtonCount - 1;

        if (endPage >= pageCount) {
            endPage = pageCount - 1;
            beginPage = Math.max(0, endPage - this.props.maxButtonCount + 1);
        }

        return [beginPage, endPage];
    }
}
LinkPager.defaultProps = {
    /**
     * {Collection}
     * You must set this property in order to make LinkPager work.
     */
    collection: null,
    /**
     * {integer} maximum number of page buttons that can be displayed. Defaults to 10.
     */
    maxButtonCount: 10,
    /**
     * {boolean} if needed change page without change url
     */
    noLink: false,
};
module.exports = LinkPager;