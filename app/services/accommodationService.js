import API from "../../axios/index";

export const getAccommodations = async (filters = {}) => {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  const response = await API.get("/accommodations", {
    params,
  });

  return response.data;
};