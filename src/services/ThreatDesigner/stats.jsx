import axios from "axios";
import { getAuthToken } from "../Auth/auth.js";
import { config } from "../../config.js";

const baseUrl = config.controlPlaneAPI + "/threat-designer";

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    config.headers.Authorization = `Bearer ${token}`;

    // Add cache-busting timestamp to GET requests to prevent browser caching
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

async function deleteTm(id) {
  const statsPath = `/${id}`;
  return instance.delete(statsPath);
}

async function stopTm(id, sessionId) {
  const statsPath = `/${id}/session/${sessionId}`;
  return instance.delete(statsPath);
}

async function startThreatModeling(
  key = null,
  iteration = null,
  reasoning = false,
  title = null,
  description = null,
  assumptions = null,
  replay = false,
  id = null,
  instructions = null,
  imageType = null,
  applicationType = "hybrid",
  spaceId = null
) {
  const statsPath = "";
  const postData = {
    s3_location: key,
    iteration,
    title,
    description,
    assumptions,
    replay,
    id,
    reasoning,
    instructions,
    image_type: imageType,
    application_type: applicationType,
  };
  if (spaceId) {
    postData.space_id = spaceId;
  }
  return instance.post(statsPath, postData);
}

async function updateTm(id, payload, clientTimestamp = null) {
  const statsPath = `/${id}`;
  const requestPayload = { ...payload };

  // Add client timestamp for conflict detection
  if (clientTimestamp) {
    requestPayload.client_last_modified_at = clientTimestamp;
  }

  return instance.put(statsPath, requestPayload);
}

async function restoreTm(id) {
  const statsPath = `/restore/${id}`;
  return instance.put(statsPath);
}

async function generateUrl(fileType) {
  const statsPath = "/upload";
  const postData = {
    file_type: fileType,
  };
  return instance.post(statsPath, postData);
}

/** Supabase signed URLs must use /storage/v1/object/...; some API responses omit /storage/v1. */
function normalizeSupabaseSignedDownloadUrl(url) {
  if (typeof url !== "string" || !url.includes("supabase.co")) return url;
  if (url.includes("/storage/v1/")) return url;
  if (url.includes("/object/")) {
    return url.replace("/object/", "/storage/v1/object/");
  }
  return url;
}

async function getDownloadUrl(threatModelId) {
  const downloadPath = "/download";
  const postData = {
    threat_model_id: threatModelId,
  };
  try {
    const response = await instance.post(downloadPath, postData);
    const presignedUrl = normalizeSupabaseSignedDownloadUrl(
      typeof response.data === "string" ? response.data : String(response.data ?? "")
    );

    const fileResponse = await axios.get(presignedUrl, {
      responseType: "blob",
    });

    return fileResponse.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getDownloadUrlsBatch(threatModelIds) {
  const downloadPath = "/download/batch";
  const postData = {
    threat_model_ids: threatModelIds,
  };
  try {
    const response = await instance.post(downloadPath, postData);
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getThreatModelingStatus(id) {
  const statsPath = `/status/${id}`;
  return instance.get(statsPath);
}

async function getThreatModelingTrail(id) {
  const statsPath = `/trail/${id}`;
  return instance.get(statsPath);
}

async function getThreatModelingResults(id) {
  const statsPath = `/${id}`;
  return instance.get(statsPath);
}

async function getOwnedThreatModels(limit, cursor = null) {
  const params = new window.URLSearchParams();
  params.append("limit", limit);
  if (cursor) params.append("cursor", cursor);
  return instance.get(`/owned?${params.toString()}`);
}

async function getSharedThreatModels(limit, cursor = null) {
  const params = new window.URLSearchParams();
  params.append("limit", limit);
  if (cursor) params.append("cursor", cursor);
  return instance.get(`/shared?${params.toString()}`);
}

async function getCollaborators(id) {
  return instance.get(`/${id}/collaborators`);
}

async function createVersion(
  currentId,
  s3Location,
  title,
  description,
  assumptions,
  reasoning,
  mirrorAttackTrees,
  mirrorSharing,
  imageType
) {
  const postData = {
    version: true,
    id: currentId,
    s3_location: s3Location,
    title,
    description,
    assumptions,
    reasoning,
    mirror_attack_trees: mirrorAttackTrees,
    mirror_sharing: mirrorSharing,
    image_type: imageType,
  };
  return instance.post("", postData);
}

export {
  getThreatModelingStatus,
  getThreatModelingResults,
  startThreatModeling,
  createVersion,
  generateUrl,
  updateTm,
  getDownloadUrl,
  getDownloadUrlsBatch,
  deleteTm,
  getOwnedThreatModels,
  getSharedThreatModels,
  getThreatModelingTrail,
  restoreTm,
  stopTm,
  getCollaborators,
};
