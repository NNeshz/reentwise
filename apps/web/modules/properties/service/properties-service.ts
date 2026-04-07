import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  PropertyDetail,
  PropertyListItem,
  PropertyMutationRow,
} from "@/modules/properties/types/properties.types";
import {
  parsePropertiesList,
  parsePropertyDetail,
  parsePropertyMutationRow,
} from "@/modules/properties/lib/validate-property-payload";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

class PropertiesService {
  async createProperty(data: {
    name: string;
    address?: string;
  }): Promise<PropertyMutationRow> {
    const response = await apiClient.properties.owner.post({
      name: data.name,
      address: data.address,
    });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo crear la propiedad",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePropertyMutationRow(unwrapped);
  }

  async getOwnerProperties(): Promise<PropertyListItem[]> {
    const response = await apiClient.properties.owner.get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar las propiedades",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePropertiesList(unwrapped);
  }

  async getPropertyById(id: string): Promise<PropertyDetail> {
    const response = await apiClient.properties.owner({ id }).get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo cargar la propiedad",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePropertyDetail(unwrapped);
  }

  async updateProperty(data: {
    id: string;
    name: string;
    address?: string;
  }): Promise<PropertyMutationRow> {
    const response = await apiClient.properties.owner({ id: data.id }).put({
      name: data.name,
      address: data.address,
    });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo actualizar la propiedad",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePropertyMutationRow(unwrapped);
  }

  async deleteProperty(id: string): Promise<PropertyMutationRow> {
    const response = await apiClient.properties.owner({ id }).delete();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo eliminar la propiedad",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePropertyMutationRow(unwrapped);
  }
}

export const propertiesService = new PropertiesService();

export type {
  PropertyDetail,
  PropertyListItem,
  PropertyMutationRow,
  PropertySortOption,
} from "@/modules/properties/types/properties.types";
