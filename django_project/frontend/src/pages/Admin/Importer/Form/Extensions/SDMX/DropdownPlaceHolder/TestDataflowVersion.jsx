import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  propagateAgencyOptions,
  restrictDataflowOptions,
  propagateDataflowVersions,
} from "./DropdownHelpers"; // Adjust the path as necessary

const TestDataflowVersions = () => {
  // ==========================
  // State Variables
  // ==========================
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);

  const [dataflowOptions, setDataflowOptions] = useState([]);
  const [selectedDataflow, setSelectedDataflow] = useState(null);

  const [dataflowVersions, setDataflowVersions] = useState([]);
  const [loading, setLoading] = useState({
    agency: false,
    dataflow: false,
    versions: false,
  });
  const [error, setError] = useState({
    agency: null,
    dataflow: null,
    versions: null,
  });

  // ==========================
  // Handlers
  // ==========================

  // Fetch agency options on component mount
  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading((prev) => ({ ...prev, agency: true }));
      try {
        const agencies = await propagateAgencyOptions();
        setAgencyOptions(
          agencies.map((agency) => ({
            value: agency.id,
            label: agency.name,
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, agency: "Error fetching agencies." }));
      } finally {
        setLoading((prev) => ({ ...prev, agency: false }));
      }
    };

    fetchAgencies();
  }, []);

  // Fetch dataflow options when an agency is selected
  useEffect(() => {
    const fetchDataflows = async () => {
      if (!selectedAgency) return;
      setLoading((prev) => ({ ...prev, dataflow: true }));
      try {
        const dataflows = await restrictDataflowOptions(selectedAgency.value);
        setDataflowOptions(
          dataflows.map((dataflow) => ({
            value: dataflow.id,
            label: dataflow.name,
            dataflowAgency: dataflow.dataflowAgency,
            dsdId: dataflow.dsdId,
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, dataflow: "Error fetching dataflows." }));
      } finally {
        setLoading((prev) => ({ ...prev, dataflow: false }));
      }
    };

    fetchDataflows();
  }, [selectedAgency]);

  // Fetch dataflow versions when a dataflow is selected
  useEffect(() => {
    const fetchDataflowVersions = async () => {
      if (!selectedDataflow) return;

      setLoading((prev) => ({ ...prev, versions: true }));
      try {
        const versions = await propagateDataflowVersions({
          dataflowAgency: selectedDataflow.dataflowAgency,
          id: selectedDataflow.value,
        });
        if (versions.error) throw new Error(versions.error);
        setDataflowVersions(versions);
      } catch (err) {
        console.error("Error fetching dataflow versions:", err.message); // Log the error message
        console.error("Selected Dataflow causing error:", selectedDataflow); // Log the selectedDataflow object
        setError((prev) => ({
          ...prev,
          versions: "Error fetching dataflow versions.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, versions: false }));
      }
    };

    fetchDataflowVersions();
  }, [selectedDataflow]);


  // ==========================
  // Render
  // ==========================
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dataflow Versions Tester</h1>

      {/* Agency Selection */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Select Agency</h2>
        {loading.agency ? (
          <p style={styles.loadingText}>Loading agencies...</p>
        ) : error.agency ? (
          <p style={styles.error}>{error.agency}</p>
        ) : (
          <div style={styles.selectWrapper}>
            <Select
              options={agencyOptions}
              value={selectedAgency}
              onChange={(selected) => {
                setSelectedAgency(selected);
                setSelectedDataflow(null);
                setDataflowVersions([]);
                setError((prev) => ({ ...prev, dataflow: null, versions: null }));
              }}
              placeholder="Select Agency"
              styles={customSelectStyles}
            />
          </div>
        )}
      </section>

      {/* Dataflow Selection */}
      {selectedAgency && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Select Dataflow</h2>
          {loading.dataflow ? (
            <p style={styles.loadingText}>Loading dataflows...</p>
          ) : error.dataflow ? (
            <p style={styles.error}>{error.dataflow}</p>
          ) : dataflowOptions.length > 0 ? (
            <div style={styles.selectWrapper}>
              <Select
                options={dataflowOptions}
                value={selectedDataflow}
                onChange={(selected) => {
                  setSelectedDataflow(selected);
                  setDataflowVersions([]);
                  setError((prev) => ({ ...prev, versions: null }));
                }}
                placeholder="Select Dataflow"
                styles={customSelectStyles}
              />
            </div>
          ) : (
            <p style={styles.infoText}>No dataflows available for this agency.</p>
          )}
        </section>
      )}

      {/* Dataflow Versions Display */}
      {selectedDataflow && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Available Dataflow Versions</h2>
          {loading.versions ? (
            <p style={styles.loadingText}>Loading dataflow versions...</p>
          ) : error.versions ? (
            <p style={styles.error}>{error.versions}</p>
          ) : dataflowVersions.length > 0 ? (
            <ul style={styles.versionList}>
              {dataflowVersions.map((version, index) => (
                <li key={index} style={styles.versionItem}>
                  {version}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.infoText}>No versions available for this dataflow.</p>
          )}
        </section>
      )}
    </div>
  );
};

// ==========================
// Custom Styles for React Select
// ==========================
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "48px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

// ==========================
// Styling
// ==========================
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    color: "#333",
  },
  title: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#2c3e50",
  },
  section: {
    marginBottom: "40px",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "#ecf0f1",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    marginBottom: "20px",
    color: "#2980b9",
  },
  selectWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  loadingText: {
    textAlign: "center",
    color: "#e67e22",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    fontWeight: "bold",
  },
  infoText: {
    textAlign: "center",
    color: "#7f8c8d",
  },
  versionList: {
    listStyleType: "none",
    padding: 0,
  },
  versionItem: {
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
  },
};

export default TestDataflowVersions;
