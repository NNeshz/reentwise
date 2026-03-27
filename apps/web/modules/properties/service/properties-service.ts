import { apiClient } from "@/utils/api-connection";

class PropertiesService {
  async createProperty(data: { name: string; address?: string }) {
    const response = await apiClient.properties.owner.post({
      name: data.name,
      address: data.address,
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async getOwnerProperties() {
    const response = await apiClient.properties.owner.get();

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async getPropertyById(id: string) {
    const response = await apiClient.properties.owner({ id }).get();

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateProperty(data: { id: string; name: string; address?: string }) {
    const response = await apiClient.properties.owner({ id: data.id }).put({
      name: data.name,
      address: data.address,
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async deleteProperty(id: string) {
    const response = await apiClient.properties.owner({ id }).delete();

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}

export const propertiesService = new PropertiesService();
