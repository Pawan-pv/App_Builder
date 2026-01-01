const BASE_URL = "/api/entities";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const entityApi = {
  // Get all items in a collection (e.g., all "courses" for this app)
  getCollection: async (appId: string, collectionName: string) => {
    const res = await fetch(`${BASE_URL}/${appId}/${collectionName}`, { headers: getHeaders() });
    return res.json();
  },

  // Save a new entity (Course, Lesson, Product)
  save: async (appId: string, collectionName: string, data: any) => {
    const res = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ appId, collectionName, data }),
    });
    return res.json();
  },

  // Update specific entity data
  update: async (entityId: string, data: any) => {
    const res = await fetch(`${BASE_URL}/${entityId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ data }),
    });
    return res.json();
  }
};