import './Dropdown.scss';

const Dropdown = ({ options, onChangeCallBk }) => {
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
            <select className='selectBox' onChange={changeHandler}>
                {optionsList}
            </select>
        </div>
    );
};

export default Dropdown;
