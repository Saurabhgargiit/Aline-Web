import './Dropdown.scss';

const Dropdown = ({ options, onChangeCallBk, selectedValue }) => {
    const optionsList = options.map((el) => (
        <option key={el.key} value={el.value}>
            {el.label}
        </option>
    ));
    // console.log(optionsList);
    const changeHandler = (e) => {
        onChangeCallBk(e);
    };
    return (
        <div>
            <select className='selectBox' onChange={changeHandler} value={selectedValue}>
                {optionsList}
            </select>
        </div>
    );
};

export default Dropdown;
