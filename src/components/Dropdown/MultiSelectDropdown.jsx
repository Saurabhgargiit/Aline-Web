import React, { useState, useRef, useEffect } from 'react';
import './MultiSelectDropdown.scss';

const MultiSelectDropdown = ({
  label,
  options,
  handleCheckboxChange = () => {},
  selectedCheckBox = [],
  className,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={dropdownRef} className={'dropdown-container ' + className}>
      <button onClick={toggleDropdown} className="dropdown-button">
        {label}
      </button>
      {isDropdownOpen && (
        <ul className="dropdown-list">
          {options.map((el, i) => {
            const { value, label } = el;
            const checked = selectedCheckBox.includes(value);
            return (
              <li key={i + value} className="dropdown-item">
                <label htmlFor={`checkbox-${i}`} className="checkbox-container">
                  <>
                    <input
                      type="checkbox"
                      id={`checkbox-${i}`}
                      checked={checked}
                      onChange={e => handleCheckboxChange(e, value)}
                    />
                    <span className="checkbox"></span>
                  </>
                  <span className="multidrop-label">{label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
