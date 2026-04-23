import { byId, isPlaceholder, type BrandAspect, type BrandImage as BrandImageMeta } from "@/brand/imagery";

type AspectDimensions = { width: number; height: number };

const ASPECT_DIMENSIONS: Record<BrandAspect, AspectDimensions> = {
  "4:5":  { width: 1600, height: 2000 },
  "16:9": { width: 1920, height: 1080 },
  "1:1":  { width: 1600, height: 1600 },
  "3:4":  { width: 1500, height: 2000 },
};

type CommonProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  alt?: string;
};

type ByIdProps = CommonProps & { id: number; image?: never };
type ByImageProps = CommonProps & { image: BrandImageMeta; id?: never };

export type BrandImageProps = ByIdProps | ByImageProps;

export function BrandImage(props: BrandImageProps) {
  const image = props.image ?? byId(props.id as number);
  const { width, height } = ASPECT_DIMENSIONS[image.aspect];

  /**
   * Stage 1: no real assets yet. We render a gradient placeholder that
   * preserves aspect ratio so layout is correct. Stage 2 flips
   * isPlaceholder() to false and the <img> renders normally.
   */
  if (isPlaceholder(image)) {
    return (
      <div
        role="img"
        aria-label={props.alt ?? image.alt}
        className={props.className}
        style={{
          aspectRatio: `${width} / ${height}`,
          background: "var(--gradient-horizon)",
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  const loading = props.priority ? "eager" : "lazy";
  const fetchPriority = props.priority ? "high" : "auto";

  return (
    <img
      src={image.src}
      alt={props.alt ?? image.alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      sizes={props.sizes}
      className={props.className}
    />
  );
}
