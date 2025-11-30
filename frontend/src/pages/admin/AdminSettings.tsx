import { useState, useEffect } from 'react';
import { Settings, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export function AdminSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { settings: data } = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category: string, key: string, value: string) => {
    try {
      setSaving(true);
      await api.updateSetting({ key, value, category });
      alert('Setting updated successfully');
      loadSettings();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = Object.keys(settings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Platform Settings
        </h1>
        <p className="text-gray-600 mt-1">Configure platform behavior</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{category}</h2>
          <div className="space-y-4">
            {settings[category]?.map((setting: any) => (
              <div key={setting.key} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    {setting.key.replace(/_/g, ' ')}
                  </label>
                  {setting.description && (
                    <p className="text-xs text-gray-600 mb-2">{setting.description}</p>
                  )}
                  <input
                    type="text"
                    defaultValue={setting.value}
                    onBlur={(e) => handleSave(category, setting.key, e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={saving}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No settings configured</p>
        </div>
      )}
    </div>
  );
}
