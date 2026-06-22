import { useCallback, useEffect, useState } from 'react';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../utils/storage';

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings());

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  useEffect(() => {
    setSettingsState(loadSettings());
  }, []);

  return { settings, updateSettings, defaults: DEFAULT_SETTINGS };
}
