import sharp from "sharp";
export async function prepareImage(file: File) {
  if (file.size > 10 * 1024 * 1024 || file.size === 0)
    throw new Error("사진은 10MB 이하로 등록해 주세요.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const m = await sharp(bytes, { limitInputPixels: 40000000 }).metadata();
  if (!["jpeg", "png", "webp"].includes(m.format ?? ""))
    throw new Error("JPG, PNG, WebP 사진을 선택해 주세요.");
  return sharp(bytes, { limitInputPixels: 40000000 })
    .rotate()
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 88 })
    .toBuffer();
}
