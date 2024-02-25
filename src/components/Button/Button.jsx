import './Button.scss';

const Button = ({
    className,
    postionClass,
    title,
    svg,
    onClickCallBk,
    disabled = false,
    type = 'neutral',
}) => {
    const clickHandler = (e) => {
        onClickCallBk(e);
    };
    const btnClass = title ? `buttonLayout ${type} ${className}` : `${className}`;

    return (
        <div className={postionClass}>
            <button className={btnClass} onClick={clickHandler} disabled={disabled}>
                {title ? title : svg}
            </button>
        </div>
    );
};

export default Button;
