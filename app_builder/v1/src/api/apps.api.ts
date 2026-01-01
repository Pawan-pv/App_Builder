export async function saveDraft(appId: string, schema: any) {
  const res = await fetch(`/api/apps/${appId}/draft`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ schema }),
  });

  if (!res.ok) {
    throw new Error("Failed to save draft");
  }
}
 