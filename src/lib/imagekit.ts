const IK_BASE = "https://api.imagekit.io/v1";

function imagekitAuth() {
  const key = process.env.IMAGEKIT_PRIVATE_KEY!;
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export async function deleteImageKitFiles(fileIds: string[]): Promise<void> {
  const ids = fileIds.filter(Boolean);
  if (!ids.length) return;

  await fetch(`${IK_BASE}/files/bulk/delete`, {
    method: "POST",
    headers: {
      Authorization: imagekitAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileIds: ids }),
  });
}
