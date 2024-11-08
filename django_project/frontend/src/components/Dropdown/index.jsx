import React, { useState, useMemo } from "react";

const Dropdown = ({ title, options, selectedValues, onSelectionChange }) => {
    const [searchQuery, setSearchQuery] = useState(""); // State for the search input

    // Handle the change in search input
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter and rank options based on the search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;

        return options
            .filter(option => option.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by search query
            .sort((a, b) =>
                a.toLowerCase().indexOf(searchQuery.toLowerCase()) -
                b.toLowerCase().indexOf(searchQuery.toLowerCase())
            ); // Rank based on relevance
    }, [options, searchQuery]);

    // Handle selection changes in the dropdown
    const handleChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        onSelectionChange(selectedOptions); // Send selected values back to the parent
    };

    return (
        <div style={{ marginBottom: "15px" }}>
            <label>{title}</label>
            {/* Search input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search options..."
                style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
            />
            {/* Dropdown with light blue background */}
            <select
                multiple
                value={selectedValues}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "5px",
                    backgroundColor: "#ADD8E6", // Light blue background
                    color: "black",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}
            >
                {filteredOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;