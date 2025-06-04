"use client";

import { useRequestStore } from "@/lib/store/requestStore";
import { useEffect, useState } from "react";

export default function RecentRequests() {
  const [isHydrated, setIsHydrated] = useState(false);
  const requests = useRequestStore((state) => state.requests);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // or a loading state
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Requests</h3>
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests made yet</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((request, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium text-orange-500">
                  {request.type}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(request.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{request.endpoint}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
