import { useState, useEffect, useCallback } from "react";
import { SquareMenu, MenuSyncResponse } from "@shared/api";

interface UseSquareMenuState {
  menu: SquareMenu | null;
  loading: boolean;
  error: string | null;
  syncTime: number | null;
}

const CACHE_KEY = "square_menu_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSquareMenu() {
  const [state, setState] = useState<UseSquareMenuState>({
    menu: null,
    loading: true,
    error: null,
    syncTime: null,
  });

  const getCachedMenu = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { menu, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return menu;
    } catch (error) {
      console.error("Cache read error:", error);
      return null;
    }
  }, []);

  const cacheMenu = useCallback((menu: SquareMenu) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          menu,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Cache write error:", error);
    }
  }, []);

  const syncMenu = useCallback(async (forceSync = false) => {
    // Try cache first unless force syncing
    if (!forceSync) {
      const cached = getCachedMenu();
      if (cached) {
        setState({
          menu: cached,
          loading: false,
          error: null,
          syncTime: cached.lastSyncTime,
        });
        return cached;
      }
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/square/sync-menu");
      const data = (await response.json()) as MenuSyncResponse;

      if (!data.success) {
        throw new Error(data.error || "Failed to sync menu");
      }

      cacheMenu(data.menu);
      setState({
        menu: data.menu,
        loading: false,
        error: null,
        syncTime: data.menu.lastSyncTime,
      });

      return data.menu;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [getCachedMenu, cacheMenu]);

  // Initial sync on mount
  useEffect(() => {
    syncMenu().catch((error) => {
      console.error("Initial menu sync failed:", error);
    });
  }, [syncMenu]);

  const getProduct = useCallback(
    (productId: string) => {
      return state.menu?.products.find((p) => p.id === productId);
    },
    [state.menu]
  );

  const getCategory = useCallback(
    (categoryId: string) => {
      return state.menu?.categories.find((c) => c.id === categoryId);
    },
    [state.menu]
  );

  const getModifier = useCallback(
    (modifierId: string) => {
      return state.menu?.modifiers.find((m) => m.id === modifierId);
    },
    [state.menu]
  );

  const getProductsByCategory = useCallback(
    (categoryId: string) => {
      if (!state.menu) return [];
      return state.menu.products.filter(
        (p) => p.categoryId === categoryId && p.available
      );
    },
    [state.menu]
  );

  return {
    menu: state.menu,
    loading: state.loading,
    error: state.error,
    syncTime: state.syncTime,
    syncMenu,
    getProduct,
    getCategory,
    getModifier,
    getProductsByCategory,
  };
}
