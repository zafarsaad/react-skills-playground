"use client";

import { useZustandStore } from "@/lib/store/zustandStore";

const StatePage = () => {
  const count = useZustandStore((state) => state.count);
  const increase = useZustandStore((state) => state.increase);
  const reset = useZustandStore((state) => state.reset);

  return (
    <main className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">State Management</h2>
      <p className="text-gray-700">
        This page will demo useState, useReducer, and Zustand.
      </p>

      <section className="bg-gray-400 rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Zustand Demo</h3>
        <p>Count: {count}</p>
        <div className="space-x-2 mt-2">
          <button
            onClick={increase}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Increase
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Basic Hooks */}
      <section className="bg-gray-100 rounded-xl p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Basic Hooks
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useState</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (needs browser environment)
            </p>
          </div>
          <section className="bg-gray-100 rounded-xl p-4 shadow-sm border">
            <h4 className="font-medium text-gray-800">Example</h4>
            {/* Example */}
          </section>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useEffect</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (runs after render)
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useContext</h4>
            <p className="text-sm text-gray-600">
              SSR Compatible (can be used during server rendering)
            </p>
          </div>
        </div>
      </section>

      {/* Additional Hooks */}
      <section className="bg-gray-100 rounded-xl p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Additional Hooks
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useReducer</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (similar to useState)
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useCallback</h4>
            <p className="text-sm text-gray-600">
              SSR Compatible (just memoizes functions)
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useMemo</h4>
            <p className="text-sm text-gray-600">
              SSR Compatible (just memoizes values)
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useRef</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (needs browser environment)
            </p>
          </div>
        </div>
      </section>

      {/* Next.js Specific Hooks */}
      <section className="bg-gray-100 rounded-xl p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Next.js Specific Hooks
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useRouter</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (requires browser navigation)
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">usePathname</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (requires browser URL)
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800">useSearchParams</h4>
            <p className="text-sm text-gray-600">
              Client-side Only (requires browser URL)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StatePage;
