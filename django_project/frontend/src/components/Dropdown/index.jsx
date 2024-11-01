import React, { useState, useMemo } from "react";


// dimension options =  a dictionary of all the dimensions, where the key is each dimension (dropdown) and the 
// value is a list of all the options that the user can select for each dimension

// dimension selected = a dictionary of all the dimensions, where the key is each dimension (dropdown) and the 
// value is a list of that the user has selected for each dimension

// TODO: DropdownComponent
// this component should make a dropdown for each dimension option with the dropdown holding the proper values
// should also update the dimensionsSelected that is passed in

const DropdownComponent = ({ dimensionOptions, dimensionsSelected, onDimensionsChange }) => {
    // function to handle selection changes and update dimensionsSelected in the parent
    const handleSelectionChange = (dimension, selectedValues) => {
        const updatedSelections = { ...dimensionsSelected, [dimension]: selectedValues };
        onDimensionsChange(updatedSelections); // send back to parent new selection state
    };

    return (
        <div>
            <h2>Select Options</h2>
            {/* render a SingleDropdown for each dimension */}
            {Object.keys(dimensionOptions).map((dimension) => (
                <SingleDropdown
                    key={dimension}
                    dimension={dimension}
                    options={dimensionOptions[dimension]}
                    selectedValues={dimensionsSelected[dimension] || []} // set default to empty array if none selected
                    onSelectionChange={(selectedValues) => handleSelectionChange(dimension, selectedValues)}
                />
            ))}
        </div>
    );
};

// TODO: SingleDropdown
// subcomponent to render each individual dropdown
// should take in a dimensionOptions item, and dimensionsSelected
// title if the key, options in dropdown are the values
// logic to handle/ modify dimensionsSelected when options are selected
// search function

const SingleDropdown = ({ dimension, options, selectedValues, onSelectionChange }) => {
    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter and rank options based on the search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;

        return options
            .filter(option => option.toLowerCase().includes(searchQuery.toLowerCase())) // Filter options by search
            .sort((a, b) => a.toLowerCase().indexOf(searchQuery.toLowerCase()) - b.toLowerCase().indexOf(searchQuery.toLowerCase())); // Rank based on relevance
    }, [options, searchQuery]);

    // Handle dropdown selection change
    const handleChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        onSelectionChange(selectedOptions); // Send updated selections to parent component
    };

    return (
        <div style={{ marginBottom: "15px" }}>
            <label>{dimension}</label>
            {/* Search input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search options..."
                style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
            />
            {/* Dropdown with multiple selection */}
            <select multiple value={selectedValues} onChange={handleChange} style={{ width: "100%", padding: "5px" }}>
                {filteredOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownComponent;
