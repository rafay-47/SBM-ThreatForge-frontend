import axios from "axios";
import { Packer } from "docx";

export const downloadDocument = async (doc, title) => {
  try {
    const blob = await Packer.toBlob(doc);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.docx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download document");
  }
};

export const downloadPDFDocument = (doc, title) => {
  try {
    doc.save(`${title}.pdf`);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download PDF document");
  }
};

export const uploadFile = async (base64File, presignedUrl, fileType) => {
  if (!base64File) {
    throw new Error("No file provided.");
  }

  try {
    // Send base64 data directly to backend for server-side upload
    // This avoids CORS issues with Supabase signed URLs
    const uploadEndpoint = "http://localhost:8000/threat-designer/upload";

    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await (await import("../../services/Auth/auth.js")).getAuthToken()}`,
      },
      body: JSON.stringify({
        data: base64File,
        file_type: fileType,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return { success: true, message: "Upload successful!", name: result.name };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Upload failed. Please try again.");
  }
};
