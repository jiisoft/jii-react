'use strict';

var Jii = require('jii');
var React = require('react');
var ReactView = require('../ReactView');
var _noop = require('lodash/noop');

class LinkPager extends ReactView{


    render(){
        const links = this.props.pagination.getLinks();

        return (
            <ul className='pagination'>
                {links.self &&
                <li className={'prev ' + (links.prev ? '' : 'disabled')}>
                    {this.props.noLink
                        ? <a href='javascript:void(0)'
                             onClick={() => {
                                 if(links.prev){
                                     this.props.pagination.setPage(this.props.pagination.getPage() - 1);
                                     this.props.changePage();
                                 }
                             }}>«</a>
                        : <a href={links.prev ? ('#' + links.prev) : 'javascript:void(0)'}>«</a>
                    }
                </li>
                }

                {this.renderPageButtons()}

                {links.next &&
                <li className='next'>
                    {this.props.noLink
                        ? <a href='javascript:void(0)'
                             onClick={() => {
                                 this.props.pagination.setPage(this.props.pagination.getPage() + 1);
                                 this.props.changePage();
                             }}>»</a>
                        : <a href={'#' + links.next}>»</a>
                    }
                </li>
                }
            </ul>
        );
    }

    renderPageButtons(){
        const rangePages = this.getPageRange();
        const currentPage = this.props.pagination.getPage();

        let buttons = [];
        for(let indexPage = rangePages[0]; indexPage <= rangePages[1]; indexPage++){
            buttons.push(
                <li key={indexPage} className={indexPage == currentPage ? 'active' : ''}>

                    {this.props.noLink
                        ? <a href='javascript:void(0)'
                             onClick={() => {
                                 this.props.pagination.setPage(indexPage);
                                 this.props.changePage();
                             }}>{indexPage + 1}</a>
                        : <a href={'#' + this.props.pagination.createUrl(indexPage)}>
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
    getPageRange() {
        const currentPage = this.props.pagination.getPage();
        const pageCount = this.props.pagination.getPageCount();

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
     * {Pagination} the pagination object that this pager is associated with.
     * You must set this property in order to make LinkPager work.
     */
    pagination: null,
    /**
     * {integer} maximum number of page buttons that can be displayed. Defaults to 10.
     */
    maxButtonCount: 10,
    /**
     * {boolean} if needed change page without change url
     */
    noLink: false,
    /**
     * {function} if noLink = true
     */
    changePage: _noop
};
module.exports = LinkPager;