import React from "react";
import { Sparkles } from "lucide-react";

const MIEByResha = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-purple-600" size={32} />
        <h3 className="text-2xl font-bold text-gray-800">MIEH by Resha</h3>
      </div>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">Welcome to MIEH</h4>
          <p className="text-gray-700 mb-4">
            Manage your exclusive collection and track special orders from MIEH
            by Resha.
          </p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            View Collection
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Exclusive Items</h5>
            <p className="text-3xl font-bold text-purple-600">24</p>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Special Orders</h5>
            <p className="text-3xl font-bold text-purple-600">8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MIEByResha;
