import {
  createGuideSocialImage,
  guideSocialAlt,
  guideSocialSize,
} from "./guideSocialImage";

export const alt = guideSocialAlt;
export const size = guideSocialSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createGuideSocialImage();
}
