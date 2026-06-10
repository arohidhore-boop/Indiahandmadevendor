import logo from "@/assets/india-handmade-logo.png";

export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="India Handmade — Gateway to Indian Heritage"
        style={{ height: size }}
        className="w-auto object-contain"
      />
    </div>
  );
}
