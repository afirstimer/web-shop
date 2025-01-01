import React, { useState } from 'react';
import './DropdownSearch.css';
import { CFormLabel } from '@coreui/react';

const DropdownSearch = ({ label, options, value, setValue }) => {
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue);

        const filtered = options.filter(option =>
            option.toLowerCase().includes(inputValue.toLowerCase())
        );

        if (!filtered.includes(inputValue)) {
            setFilteredOptions([...filtered, inputValue]);
        } else {
            setFilteredOptions(filtered);
        }

        setShowDropdown(true);
    };

    const handleOptionSelect = (option) => {
        setValue(option);
        setShowDropdown(false);
    };

    return (
        <div className="dropdown-search">
            <CFormLabel>{label}:</CFormLabel>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder={`Tìm hoặc thêm ${label}`}
                className="form-control"
            />
            {showDropdown && (
                <ul className="form-control dropdown-list">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={option === value ? 'selected' : ''}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownSearch;