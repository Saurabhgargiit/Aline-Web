import { useId } from 'react';
import './Button.scss';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const Button = ({
    className = '',
    postionClass = '',
    title = '', //not to be given when svg is used
    svg,
    onClickCallBk,
    disabled = false,
    type = 'neutral',
    tooltip = '',
    placement = 'top',
    ariaLabel = '',
}) => {
    const clickHandler = (e) => {
        onClickCallBk(e);
    };
    const id = useId();
    const btnClass = !!title ? `buttonLayout ${type} ${className}` : `${className}`;

    return !!tooltip.trim() ? (
        <OverlayTrigger
            key={id + title + tooltip}
            placement={placement}
            overlay={<Tooltip id={id + title + tooltip}>{tooltip}</Tooltip>}
        >
            <div className={postionClass}>
                <button
                    className={btnClass}
                    onClick={clickHandler}
                    disabled={disabled}
                    id={id}
                    aria-label={!!title ? title : ariaLabel}
                >
                    {!!title ? title : svg}
                </button>
            </div>
        </OverlayTrigger>
    ) : (
        <div className={postionClass}>
            <button
                className={btnClass}
                onClick={clickHandler}
                disabled={disabled}
                id={id}
                aria-label={!!title ? title : ariaLabel}
            >
                {!!title ? title : svg}
            </button>
        </div>
    );
};

export default Button;
