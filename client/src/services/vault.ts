import api from "./api";

export interface VaultItem {
  id: string;
  title: string;
  type: "LOGIN" | "SECURE_NOTE" | "CREDIT_CARD" | "IDENTITY" | "DOCUMENT";
  category: string;
  username?: string;
  email?: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  tags: string[];
  fields?: {
    label: string;
    value: string;
    type: "text" | "password" | "email" | "url";
  }[];
}

export interface CreateVaultItemData {
  label: string;
  type: VaultItem["type"];
  notes?: string;
  tags?: string;
}

class VaultService {
  async getVaultItems(): Promise<VaultItem[]> {
    const response = await api.get("/vault");
    return response.data;
  }

  async getVaultItem(id: string): Promise<VaultItem> {
    const response = await api.get(`/vault/${id}`);
    return response.data;
  }

  async createVaultItem(data: CreateVaultItemData): Promise<VaultItem> {
    const response = await api.post("/vault", data);
    return response.data;
  }

  async updateVaultItem(
    id: string,
    data: Partial<CreateVaultItemData>
  ): Promise<VaultItem> {
    const response = await api.put(`/vault/${id}`, data);
    return response.data;
  }

  async deleteVaultItem(id: string): Promise<void> {
    await api.delete(`/vault/${id}`);
  }

  async toggleFavorite(id: string): Promise<VaultItem> {
    const response = await api.patch(`/vault/${id}/favorite`);
    return response.data;
  }

  async searchVaultItems(query: string): Promise<VaultItem[]> {
    const response = await api.get(
      `/vault/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  async getVaultAnalytics(): Promise<{
    totalItems: number;
    itemsByType: Record<string, number>;
    recentActivity: Array<{
      action: string;
      itemTitle: string;
      timestamp: string;
    }>;
  }> {
    const response = await api.get("/vault/analytics");
    return response.data;
  }
}

export const vaultService = new VaultService();
