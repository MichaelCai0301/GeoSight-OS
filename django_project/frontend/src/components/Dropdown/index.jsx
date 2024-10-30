import React, { useState, useEffect } from "react";

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

const SingleDropdown = ({ dimension, options, selectedValues, onSelectionChange }) => {
   
    const handleChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        onSelectionChange(selectedOptions); // send updated selections to DropdownComponent
    };

    return (
        <div style={{ marginBottom: "15px" }}>
            <label>{dimension}</label>
            <select multiple value={selectedValues} onChange={handleChange} style={{ width: "100%", padding: "5px" }}>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownComponent;
