
const CustomButton = ({ className, postionClass, title, svg, fn }) => {
    const clickHandler = (e) => {
        fn();
    }

    return (
        <div className={postionClass}>
            <button
                className={className}
                onClick={clickHandler}
            >
                {title ? title : svg}
            </button>
        </div>
    )
}

export default CustomButton;