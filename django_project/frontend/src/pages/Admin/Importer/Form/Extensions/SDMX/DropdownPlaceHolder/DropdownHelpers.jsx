import axios from "axios";
import API_URLS from "./config";

const propagateAgencyOptions = async () => {
  const apiUrl = API_URLS.agencyScheme;
  const agencyList = [];

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    const agencySchemes = data?.AgencyScheme || [];
    agencySchemes.forEach((scheme) => {
      if (scheme.items && Array.isArray(scheme.items)) {
        scheme.items.forEach((agency) => {
          const agencyID = agency.id;
          const agencyName = agency.names?.find(name => name.locale === "en")?.value || agencyID;
          agencyList.push({ id: agencyID, name: agencyName });
        });
      }
    });
  } catch (error) {
    console.error("Error fetching agency options:", error);
  }

  return agencyList;
};

const restrictDataflowOptions = async (agencyParam) => {
  const apiUrl = API_URLS.dataflow;
  const dataflowDetailsList = [];

  if (!agencyParam) return dataflowDetailsList;

  try {
    const response = await axios.get(apiUrl);
    const xmlString = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const dataflows = xmlDoc.getElementsByTagName("str:Dataflow");
    Array.from(dataflows).forEach((dataflowNode) => {
      const agencyID = dataflowNode.getAttribute("agencyID");
      const dataflowID = dataflowNode.getAttribute("id");

      if (agencyID === agencyParam) {
        const nameNode = dataflowNode.getElementsByTagName("com:Name")[0];
        const dataflowName = nameNode ? nameNode.textContent : "Unnamed";

        const structureNode = dataflowNode.getElementsByTagName("str:Structure")[0];
        const refNode = structureNode ? structureNode.getElementsByTagName("Ref")[0] : null;

        const dataflowDsdID = refNode ? refNode.getAttribute("id") : null;

        dataflowDetailsList.push({
          name: dataflowName,
          id: dataflowID,
          dsdId: dataflowDsdID,
          dataflowAgency: agencyID,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching dataflows:", error);
    return { error: "Error fetching dataflows." };
  }

  console.log(dataflowDetailsList)
  return dataflowDetailsList;
};

const updateDimensions = async (dataflow, dataflowVersion = "1.0") => {
  const apiUrl = API_URLS.datastructure(dataflow.dataflowAgency, dataflow.dsdId, dataflowVersion);
  const dimensionSelections = {};

  try {
    const response = await axios.get(apiUrl);
    const xmlString = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const dimensionNodes = xmlDoc.getElementsByTagName("str:Dimension");
    Array.from(dimensionNodes).forEach((dimension) => {
      const conceptIdentityNode = dimension.getElementsByTagName("str:ConceptIdentity")[0];
      if (conceptIdentityNode) {
        const refNode = conceptIdentityNode.getElementsByTagName("Ref")[0];
        if (refNode) {
          const id = refNode.getAttribute("id");
          dimensionSelections[id] = [];
        }
      }
    });
  } catch (error) {
    return { error: "Error fetching dimensions" };
  }

  const { updatedDimensions, apiResponse } = await updateDsd(dataflow, dimensionSelections, dataflowVersion);

  return { dimensionSelections, updatedDimensions, apiResponse };
};

const updateDsd = async (dataflow, dimensions, dataflowVersion = "1.0") => {
  try {
    const urlSection = Object.entries(dimensions)
      .map(([key, values]) => values.join("+"))
      .join(".");

    const apiUrl = API_URLS.data(dataflow.dataflowAgency, dataflow.id, dataflowVersion, urlSection);

    const response = await axios.get(apiUrl);
    const apiResponse = response.data;

    const updatedDimensions = apiResponse.structure.dimensions.observation.reduce((map, dimension) => {
      map[dimension.id] = dimension.values;
      return map;
    }, {});

    return { updatedDimensions, apiResponse, sdmxImplementation: ["implementation 1"] };
  } catch (error) {
    console.error("Error fetching or parsing DSD from API:", error);
    return { error: "Error fetching data" };
  }
};

export { propagateAgencyOptions, restrictDataflowOptions, updateDimensions, updateDsd };