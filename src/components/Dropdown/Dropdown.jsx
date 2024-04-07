import './Dropdown.scss';

const Dropdown = ({ options, onChangeCallBk, selectedValue, isMultiSelect = false }) => {
    const optionsList = options.map((el) => (
        <option key={el.key} value={el.value}>
            {el.label}
        </option>
    ));
    // console.log(optionsList);

    const changeHandler = (e) => {
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
        <div>
            <select
                className='selectBox'
                onChange={changeHandler}
                value={selectedValue}
                multiple={isMultiSelect}
            >
                {optionsList}
            </select>
        </div>
    );
};

export default Dropdown;
