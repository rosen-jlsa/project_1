"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>,
});

export default Map;
