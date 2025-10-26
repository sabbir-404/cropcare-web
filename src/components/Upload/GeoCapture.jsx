export default function GeoCapture({onGeo}:{onGeo:(lat:number,lon:number)=>void}) {
  return (
    <button
      className="rounded-lg bg-emerald-600 px-3 py-2 text-white"
      onClick={() => navigator.geolocation.getCurrentPosition(
        p => onGeo(p.coords.latitude, p.coords.longitude),
        () => alert("Location denied")
      )}
    >
      Use my location
    </button>
  );
}
