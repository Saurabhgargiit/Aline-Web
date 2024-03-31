import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { MAXIMUM_RESULTS_ON_ONE_PAGE } from '../../utils/globalConstants';
import './AdvancedPagination.scss';

function AdvancedPagination({
    page = 1,
    maxResOnePage = MAXIMUM_RESULTS_ON_ONE_PAGE,
    totalRes = 70,
    topContainerClassName = '',
}) {
    const [curPage, setCurPage] = useState(1);
    const [leftEllipse, setLeftEllipse] = useState(false);
    const totalPage = Math.ceil(totalRes / maxResOnePage);
    console.log(totalPage);
    const [rightEllipse, setRightEllipse] = useState(totalPage >= 6);

    const gotoFirst = () => {
        setCurPage(1);
    };

    const gotoLast = () => {
        setCurPage(totalPage);
    };

    const gotoPrevious = () => {
        setCurPage((page) => page - 1);
    };

    const gotoNext = () => {
        setCurPage((page) => page + 1);
    };

    const gotoPage = (pageNo) => {
        setCurPage((page) => pageNo);
    };

    const leftEllipseClickHandler = () => {
        if (totalPage === 6) {
            setCurPage(2);
        } else {
            setCurPage((curPage) => curPage - 3);
        }
    };

    const rightEllipseClickHandler = () => {
        if (totalPage === 6) {
            setCurPage(5);
        } else {
            setCurPage((curPage) => curPage + 3);
        }
    };

    const renderPaginationItem = (start, end) => {
        const pages = [];
        for (let i = start; i < end; i++) {
            pages.push(
                <Pagination.Item
                    key={'page' + i}
                    id={'page' + i}
                    active={curPage === i}
                    onClick={() => gotoPage(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return pages;
    };

    const renderMidPagination = () => {
        //For Pages less than 6
        if (totalPage < 6) {
            return renderPaginationItem(2, totalPage);
        }

        //For Pages equals to 6
        else if (totalPage === 6) {
            if (curPage < 4) {
                if (!rightEllipse) {
                    setRightEllipse(true);
                    setLeftEllipse(false);
                }
                return renderPaginationItem(2, 5);
            } else if (curPage > 3) {
                if (!leftEllipse) {
                    setRightEllipse(false);
                    setLeftEllipse(true);
                }
                return renderPaginationItem(3, 6);
            }
        }

        //For pages more than 6
        else if (totalPage > 6) {
            if (curPage < 4) {
                if (!rightEllipse || leftEllipse) {
                    setRightEllipse(true);
                    setLeftEllipse(false);
                }
                return renderPaginationItem(2, 5);
            } else if (curPage > totalPage - 3) {
                if (!leftEllipse || rightEllipse) {
                    setRightEllipse(false);
                    setLeftEllipse(true);
                }
                return renderPaginationItem(totalPage - 3, totalPage);
            } else {
                if (!leftEllipse || !rightEllipse) {
                    setRightEllipse(true);
                    setLeftEllipse(true);
                }
                return renderPaginationItem(curPage - 1, curPage + 2);
            }
        }
    };

    useEffect(() => {}, [curPage]);

    return (
        <div className={'custom-pagination ' + topContainerClassName}>
            <Pagination>
                <Pagination.First
                    key='first'
                    id='first'
                    onClick={gotoFirst}
                    disabled={curPage === 1}
                />
                <Pagination.Prev
                    key='previous'
                    id='previous'
                    onClick={gotoPrevious}
                    disabled={curPage === 1}
                />
                <Pagination.Item
                    key={'page' + 1}
                    id={'page' + 1}
                    active={curPage === 1}
                    onClick={() => gotoPage(1)}
                >
                    {1}
                </Pagination.Item>

                {leftEllipse && <Pagination.Ellipsis onClick={leftEllipseClickHandler} />}
                {renderMidPagination()}

                {rightEllipse && <Pagination.Ellipsis onClick={rightEllipseClickHandler} />}

                {!(totalPage === 1) && (
                    <Pagination.Item
                        onClick={() => {
                            gotoPage(totalPage);
                        }}
                        active={curPage === totalPage}
                    >
                        {totalPage}
                    </Pagination.Item>
                )}
                <Pagination.Next
                    key='next'
                    id='next'
                    onClick={gotoNext}
                    disabled={curPage === totalPage}
                />
                <Pagination.Last
                    key='last'
                    id='last'
                    onClick={gotoLast}
                    disabled={curPage === totalPage}
                />
            </Pagination>
        </div>
    );
}

export default AdvancedPagination;
