"use client";

import { UserWidget } from "@/lib/api";
import { BaseWidget } from "./BaseWidget";
import { useDashboard } from "@/context/DashboardContext";
import { useState } from "react";
import { updateUserWidget } from "@/lib/api";
import { FiAlertCircle, FiArrowDown, FiArrowUp } from "react-icons/fi";

interface CryptoWidgetProps {
  widget: UserWidget;
}

export const CryptoWidget = ({ widget }: CryptoWidgetProps) => {
  const { widgetData, fetchWidgetData } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState(widget.settings || {});
  const [isSaving, setIsSaving] = useState(false);

  const widgetState = widgetData[widget.id] || {
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateUserWidget(widget.id, { settings });
      setIsEditing(false);
      fetchWidgetData(widget.id);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettings = () => {
    if (widget.endpoint === "prices") {
      return (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="coins"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Cryptocurrencies (comma-separated)
            </label>
            <input
              id="coins"
              type="text"
              value={(settings.coins || []).join(",")}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  coins: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="bitcoin,ethereum,litecoin"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use the coin ID from CoinGecko (e.g., bitcoin, ethereum)
            </p>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              value={settings.currency || "usd"}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="jpy">JPY</option>
              <option value="aud">AUD</option>
              <option value="cad">CAD</option>
              <option value="chf">CHF</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      );
    }

    if (widget.endpoint === "historical") {
      return (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="coin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Cryptocurrency
            </label>
            <input
              id="coin"
              type="text"
              value={settings.coin || "bitcoin"}
              onChange={(e) =>
                setSettings({ ...settings, coin: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="bitcoin"
            />
          </div>

          <div>
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Days of History
            </label>
            <input
              id="days"
              type="number"
              min="1"
              max="365"
              value={settings.days || 14}
              onChange={(e) =>
                setSettings({ ...settings, days: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              value={settings.currency || "usd"}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="jpy">JPY</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <p className="text-gray-600 dark:text-gray-400">
        No configurable settings for this widget.
      </p>
    );
  };

  const renderWidgetContent = () => {
    if (isEditing) {
      return renderSettings();
    }

    if (widgetState.loading) {
      return (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (widgetState.error) {
      return (
        <div className="text-red-500 flex items-center">
          <FiAlertCircle className="mr-2" />
          {widgetState.error}
        </div>
      );
    }

    if (!widgetState.data) {
      return (
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      );
    }

    if (widget.endpoint === "prices") {
      const currency = settings.currency || "usd";
      const currencySymbol =
        currency === "usd"
          ? "$"
          : currency === "eur"
          ? "€"
          : currency === "gbp"
          ? "£"
          : currency.toUpperCase();

      return (
        <div className="space-y-2">
          {Object.entries(widgetState.data).map(
            ([coinId, data]: [string, any]) => {
              const price = data[currency];
              const change = data[`${currency}_24h_change`];
              const isPositive = change >= 0;

              return (
                <div
                  key={coinId}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {coinId.replace(/-/g, " ")}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {currencySymbol}{" "}
                      {price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div
                    className={`flex items-center ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <FiArrowUp size={14} className="mr-1" />
                    ) : (
                      <FiArrowDown size={14} className="mr-1" />
                    )}
                    <span>{Math.abs(change || 0).toFixed(2)}%</span>
                  </div>
                </div>
              );
            }
          )}

          {widgetState.lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {widgetState.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      );
    }

    if (widget.endpoint === "trending") {
      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Top trending coins on CoinGecko
          </p>

          {widgetState.data.coins?.slice(0, 5).map((item: any) => (
            <div
              key={item.item.id}
              className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              {item.item.thumb && (
                <img
                  src={item.item.thumb}
                  alt={item.item.name}
                  className="w-6 h-6 mr-2 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.item.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {item.item.symbol}
                </p>
              </div>
              <div className="ml-auto text-gray-700 dark:text-gray-300 text-sm">
                #{item.item.market_cap_rank || "N/A"}
              </div>
            </div>
          ))}

          {widgetState.lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {widgetState.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      );
    }

    // Default response
    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(widgetState.data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <BaseWidget widget={widget} onEditSettings={() => setIsEditing(true)}>
      {renderWidgetContent()}
    </BaseWidget>
  );
};
