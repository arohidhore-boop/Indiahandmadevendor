import Image from "next/image";
import { asset } from "@/lib/asset";

export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center">
      <Image
        src={asset("/india-handmade-logo.png")}
        alt="India Handmade — Gateway to Indian Heritage"
        width={size * 3}
        height={size}
        style={{ height: size, width: "auto" }}
        className="object-contain"
        priority
      />
    </div>
  );
}
