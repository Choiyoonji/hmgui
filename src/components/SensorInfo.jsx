import React from "react";

function SensorInfo({ cameraImages = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-full mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Observation (Camera Images)
      </h2>

      <div className="flex space-x-4 mb-6">
        {/* Ego View */}
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-700 mb-2">Ego View RGB</div>
          <img
            src={cameraImages["ego_rgb"] || ""}
            alt="Ego View RGB"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        {/* Exo View */}
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-700 mb-2">Exo View RGB</div>
          <img
            src={cameraImages["exo_rgb"] || ""}
            alt="Exo View RGB"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SensorInfo;
