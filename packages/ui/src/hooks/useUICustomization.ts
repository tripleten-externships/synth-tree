import { useState, useEffect } from "react";

// Types for UI component customizations
export interface UICustomizationSettings {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  [key: string]: any; // Allow additional custom properties
}

export interface UICustomization {
  id: string;
  instanceId: string;
  componentType: string;
  settings: UICustomizationSettings;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Mock GraphQL client (replace with actual implementation)
const mockApiClient = {
  async getUICustomization(
    instanceId: string
  ): Promise<UICustomization | null> {
    // TODO: Replace with actual GraphQL query
    const stored = localStorage.getItem(`ui_customization_${instanceId}`);
    return stored ? JSON.parse(stored) : null;
  },

  async saveUICustomization(data: {
    instanceId: string;
    componentType: string;
    settings: UICustomizationSettings;
  }): Promise<UICustomization> {
    // TODO: Replace with actual GraphQL mutation
    const customization: UICustomization = {
      id: `${data.instanceId}_${Date.now()}`,
      instanceId: data.instanceId,
      componentType: data.componentType,
      settings: data.settings,
      createdBy: "mock_user", // TODO: Get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `ui_customization_${data.instanceId}`,
      JSON.stringify(customization)
    );
    return customization;
  },

  async deleteUICustomization(instanceId: string): Promise<boolean> {
    // TODO: Replace with actual GraphQL mutation
    localStorage.removeItem(`ui_customization_${instanceId}`);
    return true;
  },
};

// Hook for managing UI component customizations
export function useUICustomization(instanceId: string, componentType: string) {
  const [customization, setCustomization] = useState<UICustomization | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customization on mount
  useEffect(() => {
    async function loadCustomization() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await mockApiClient.getUICustomization(instanceId);
        setCustomization(data);
      } catch (err: any) {
        setError(err.message || "Failed to load customization");
      } finally {
        setIsLoading(false);
      }
    }

    if (instanceId) {
      loadCustomization();
    } else {
      setIsLoading(false);
    }
  }, [instanceId]);

  // Save customization
  const saveCustomization = async (settings: UICustomizationSettings) => {
    try {
      setError(null);
      const data = await mockApiClient.saveUICustomization({
        instanceId,
        componentType,
        settings,
      });
      setCustomization(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to save customization");
      throw err;
    }
  };

  // Delete customization
  const deleteCustomization = async () => {
    try {
      setError(null);
      await mockApiClient.deleteUICustomization(instanceId);
      setCustomization(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete customization");
      throw err;
    }
  };

  return {
    customization,
    isLoading,
    error,
    saveCustomization,
    deleteCustomization,
  };
}

// Hook for getting applied settings with defaults
export function useUISettings(
  instanceId: string,
  componentType: string,
  defaultSettings: UICustomizationSettings = {}
) {
  const {
    customization,
    isLoading,
    error,
    saveCustomization,
    deleteCustomization,
  } = useUICustomization(instanceId, componentType);

  // Merge customization settings with defaults
  const settings = {
    ...defaultSettings,
    ...(customization?.settings || {}),
  };

  return {
    settings,
    hasCustomization: !!customization,
    isLoading,
    error,
    saveCustomization,
    deleteCustomization,
  };
}
