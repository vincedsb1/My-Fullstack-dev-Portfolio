import Image, { type ImageProps } from "next/image";
import pp from "../../../public/pp.jpg";
import { SITE_NAME } from "@/lib/site";
export function Avatar({
  size = 144,
  sizes,
  loading,
  fetchPriority,
  alt = SITE_NAME,
  className = "rounded-full border-4 border-accent p-2",
}: {
  size?: number;
  sizes?: string;
  loading?: ImageProps["loading"];
  fetchPriority?: ImageProps["fetchPriority"];
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src={pp}
      alt={alt}
      width={size}
      height={size}
      sizes={sizes ?? `${size}px`}
      placeholder="blur"
      loading={loading}
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
