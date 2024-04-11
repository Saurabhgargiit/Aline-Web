import React from 'react';
import './Table.scss';

const onKeyDownHandler = (e, functionName) => {
    if (e.key === 'Enter') {
        functionName(e);
    }
};

const Table = React.forwardRef((props, ref) => {
    const {
        className = '',
        tableClass = '',
        headers = [],
        rows = [],
        sortKey,
        sortDir,
        errorMsg = '',
    } = props;

    return (
        <div className={`aline-table-wrapper ${className}`}>
            <table className={tableClass}>
                <thead>
                    <tr>
                        {headers.map((header, i) => {
                            let classes = 'icon';
                            let labelClasses = 'label';
                            let handleSort = () => {};
                            let handleFilter = () => {};

                            if (header.sortable && header.id === sortKey) {
                                classes += ` sorted ${sortDir}`;
                                labelClasses = 'sorted-label';
                            }

                            if (header.onClick) {
                                handleSort = () => header.onClick(header, i);
                            }

                            if (header.onFilter) {
                                handleFilter = () => header.onFilter();
                            }

                            const ariaSort = header.sortable
                                ? header.order === 'asc'
                                    ? 'ascending'
                                    : header.order === 'desc'
                                    ? 'descending'
                                    : 'none'
                                : 'none';

                            return (
                                <th
                                    key={header.id || header.label}
                                    className={`${header.hidden ? 'ed-border-bottom' : ''}`}
                                    aria-sort={ariaSort}
                                >
                                    <div
                                        className={`${header.align || 'text-left'} ${
                                            header.hidden ? 'no-border-bottom' : ''
                                        }`}
                                    >
                                        <span
                                            className={`${labelClasses} ${
                                                header.hidden ? 'hidden' : ''
                                            }`}
                                            role={header.sortable ? 'button' : ''}
                                            tabIndex={header.sortable ? 0 : -1}
                                            onClick={handleSort}
                                            onKeyDown={(e) => onKeyDownHandler(e, handleSort)}
                                        >
                                            {header.children || header.label}
                                        </span>
                                        {header.onFilter && (
                                            <i
                                                className='header-filter icon-filter'
                                                onClick={handleFilter}
                                                onKeyDown={(e) => onKeyDownHandler(e, handleFilter)}
                                                role='button'
                                                aria-label={'Filter'}
                                                tabIndex={0}
                                            />
                                        )}
                                        {header.sortable && (
                                            <i
                                                className={`${classes} icon-sort-arrow`}
                                                onClick={handleSort}
                                                onKeyDown={(e) => onKeyDownHandler(e, handleSort)}
                                                aria-hidden='true'
                                            />
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody ref={ref}>
                    {!!errorMsg ? (
                        <div className='nodata center-position'>
                            <span className='error-Msg'> {errorMsg} </span>
                        </div>
                    ) : (
                        rows.map((row, i) => {
                            return (
                                <tr key={`table-row-${i}`}>
                                    {row.map((data) => {
                                        return <TableData key={data.id || data.label} {...data} />;
                                    })}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
});

const TableData = ({
    clamp,
    onClick,
    children,
    colSpan = 1,
    disabled = false,
    ariaLabel,
    ...data
}) => {
    let funcClick = () => {};

    if (onClick) {
        funcClick = () => {
            if (!disabled) {
                onClick(data);
            }
        };
    }

    return (
        <td className={data.align} colSpan={colSpan}>
            {clamp ? (
                <div
                    id={data.id}
                    onClick={funcClick}
                    onKeyDown={(e) => onKeyDownHandler(e, funcClick)}
                    role={onClick ? 'button' : ''}
                    tabIndex={onClick ? 0 : -1}
                    aria-label={ariaLabel || data.label}
                    aria-labelledby={data.ariaLabelledby}
                    aria-disabled={disabled}
                >
                    <span className='clamp'>{data.label}</span>
                </div>
            ) : (
                <div
                    id={data.id}
                    onClick={funcClick}
                    onKeyDown={(e) => onKeyDownHandler(e, funcClick)}
                    role={onClick ? 'button' : ''}
                    tabIndex={onClick ? 0 : -1}
                    aria-label={ariaLabel || data.label}
                    aria-labelledby={data.ariaLabelledby}
                    aria-disabled={disabled}
                >
                    {children || data.label}
                </div>
            )}
        </td>
    );
};

export default Table;
