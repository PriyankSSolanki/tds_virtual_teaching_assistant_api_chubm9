import { useState, useEffect } from 'react';
import { AIPipeAuth } from '../utils/aipipe';

export function UsageTracker() {
  const [usage, setUsage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setIsLoading(true);
        const usageData = await AIPipeAuth.getUsage();
        setUsage(usageData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch usage data');
        console.error('Usage fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">API Usage</h3>
      {usage && (
        <div className="text-sm text-gray-600">
          <p>Requests today: {usage.requests_today || 0}</p>
          <p>Tokens used: {usage.tokens_used || 0}</p>
          {usage.budget_remaining && (
            <p>Budget remaining: ${usage.budget_remaining}</p>
          )}
        </div>
      )}
    </div>
  );
}
