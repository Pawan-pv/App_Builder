import axios from 'axios';

export const useBuilder = (appId: string) => {
  const saveDraft = async (layoutData: any) => {
    try {
      const response = await axios.put(`/api/apps/${appId}/draft`, {
        schema: layoutData, 
      });
      return response.data;
    } catch (error) {
      console.error("Failed to save draft", error);
    }
  };

  const publish = async () => {
    try {
      // This triggers the Node.js publish service we just wrote
      const response = await axios.post(`/api/publish/${appId}`);
      alert("App is now LIVE for students!");
      return response.data;
    } catch (error) {
      console.error("Publishing failed", error);
    }
  };

  return { saveDraft, publish };
};