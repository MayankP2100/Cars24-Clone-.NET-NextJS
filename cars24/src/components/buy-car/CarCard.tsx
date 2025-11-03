import Link from "next/link";
import {Heart} from "lucide-react";

export default function CarCard({car}) {
  const m = car.maintenanceInsights || {};
  const specs = car.specs || {};
  return (
    <Link
      key={car.id}
      href={`/buy-car/${car.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : "/placeholder-image.png"}
          alt={car.title || "Car"}
          className="w-full h-full object-cover"
        />
        <button
          title={car.title}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white"
        >
          <Heart className="h-4 w-4 text-gray-500 hover:text-red-500"/>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{car.title}</h3>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{specs.km ? `${specs.km} km` : "N/A"}</div>
          <div className="text-sm text-gray-600">{specs.transmission || "N/A"}</div>
          <div className="text-sm text-gray-600">{specs.fuel || "N/A"}</div>
          <div className="text-sm text-gray-600">{specs.owner || "N/A"}</div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">EMI from</div>
            <div className="font-semibold">₹{car.emi}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Price</div>
            <div className="font-semibold">₹{car.price}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {car.location}
        </div>
        {car.tag && (
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1.5 w-fit rounded-full mt-2">
            {car.tag}
          </div>
        )}
        <div>
          {m.monthlyMaintenanceCost !== 0 ? (
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1.5 w-fit rounded-full mt-2">
              Estimated maintenance cost: ₹{m.monthlyMaintenanceCost?.toString()}/mo
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1.5 w-fit rounded-full mt-2">
              Estimated maintenance cost not available.
            </div>
          )}
        </div>
        {/* Insights */}
        <div className="flex flex-col gap-1 bg-blue-100 p-2 rounded-lg mt-4">
          <p className="text-blue-800 text-sm">Insights</p>
          <ul className="list-disc list-outside ps-4">
            {m.serviceInsight && (
              <li className="text-sm text-gray-600">{m.serviceInsight}</li>
            )}
            {m.tireInsight && (
              <li className="text-sm text-gray-600">{m.tireInsight}</li>
            )}
            {m.batteryInsight && (
              <li className="text-sm text-gray-600">{m.batteryInsight}</li>
            )}
          </ul>
        </div>
      </div>
    </Link>
  );
}
