'use client';

import React, { useState, useEffect } from 'react';
import '../../styles/themes.css';

interface MetricItem {
  _id: string;
  operation: string;
  section: string;
  details: string;
  timestamp: string;
  metadata?: {
    changes?: {
      before?: Record<string, any>;
      after?: Record<string, any>;
      fields?: string[];
    };
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface MetricsResponse {
  metrics: MetricItem[];
  pagination: PaginationInfo;
}

export default function EnhancedMetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const loadMetrics = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/metrics?type=paginated&days=7&page=${page}&limit=5`);
      if (response.ok) {
        const data: MetricsResponse = await response.json();
        setMetrics(data.metrics);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics(1);
  }, []);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'CREATE': return 'text-green-400';
      case 'UPDATE': return 'text-blue-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'CREATE': return '🟢';
      case 'UPDATE': return '🔵';
      case 'DELETE': return '🔴';
      default: return '⚪';
    }
  };

  const renderChangeDetails = (item: MetricItem) => {
    const changes = item.metadata?.changes;
    if (!changes || !changes.before || !changes.after) {
      return <p className="text-sm admin-loading">No detailed changes available</p>;
    }

    const { before, after, fields } = changes;

    return (
      <div className="mt-3 p-3 admin-card rounded border">
        <h5 className="font-semibold mb-2 admin-title">Changes Made:</h5>
        {fields && fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field} className="text-sm">
                <span className="font-medium admin-label">{field}:</span>
                <div className="ml-4 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">From:</span>
                    <code className="admin-input px-2 py-1 rounded text-xs">
                      {JSON.stringify(before[field]) || 'null'}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-400">To:</span>
                    <code className="admin-input px-2 py-1 rounded text-xs">
                      {JSON.stringify(after[field]) || 'null'}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm admin-loading">No specific field changes tracked</p>
        )}
      </div>
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.pages) {
      loadMetrics(newPage);
    }
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="admin-card p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="admin-spinner animate-spin rounded-full h-8 w-8 border-b-2"></div>
          <span className="ml-3 admin-loading">Loading activity logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold admin-title">Recent Activity</h4>
        {pagination && (
          <span className="text-sm admin-loading">
            {pagination.total} total operations
          </span>
        )}
      </div>

      {metrics.length === 0 ? (
        <p className="admin-loading text-center py-8">No recent activity found</p>
      ) : (
        <div className="space-y-3">
          {metrics.map((item) => (
            <div key={item._id} className="activity-item p-4 rounded-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded(item._id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getOperationIcon(item.operation)}</span>
                  <div>
                    <span className={`activity-operation ${getOperationColor(item.operation)}`}>
                      {item.operation}
                    </span>
                    <span className="admin-title"> - {item.section}</span>
                    <p className="text-sm admin-loading mt-1">{item.details}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="activity-timestamp text-sm">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  <span className="text-sm admin-loading">
                    {expandedItems.has(item._id) ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {expandedItems.has(item._id) && (
                <div className="mt-3 border-t border-gray-600 pt-3">
                  {renderChangeDetails(item)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev || loading}
              className="admin-btn-secondary px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              ← Previous
            </button>
            <span className="admin-loading text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext || loading}
              className="admin-btn-secondary px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Next →
            </button>
          </div>
          <div className="admin-loading text-sm">
            Showing {metrics.length} of {pagination.total} operations
          </div>
        </div>
      )}

      {loading && metrics.length > 0 && (
        <div className="flex items-center justify-center mt-4">
          <div className="admin-spinner animate-spin rounded-full h-6 w-6 border-b-2"></div>
          <span className="ml-2 admin-loading text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
}
