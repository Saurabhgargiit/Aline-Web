import './Dropdown.scss';

const Dropdown = ({
    propsClassName = '',
    errClassName = '',
    options,
    onChangeCallBk = () => {},
    selectedValue,
    isMultiSelect = false,
    id = 'select-id',
    disabled = false,
}) => {
    const optionsList = options.map((el) => (
        <option key={el.key} value={el.value}>
            {el.label}
        </option>
    ));
    // console.log(optionsList);

    const changeHandler = (e) => {
        e.stopPropagation();
        if (isMultiSelect) {
            // For a multi-select, construct an array of selected options
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
            onChangeCallBk(selectedOptions);
        } else {
            // For a single select, pass the single value
            onChangeCallBk(e.target.value);
        }
    };
    return (
        <div className={propsClassName}>
            <select
                id={id}
                className={'selectBox ' + errClassName}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => changeHandler(e)}
                value={selectedValue}
                multiple={isMultiSelect}
                disabled={disabled}
            >
                {optionsList}
            </select>
        </div>
    );
};

export default Dropdown;
