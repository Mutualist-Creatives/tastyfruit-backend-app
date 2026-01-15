import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "../config/index.js";
import fs from "fs";
import path from "path";

const BUCKET_NAME = "main";

// Lazy initialization of Supabase client
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error(
        "Supabase configuration is missing. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
      );
    }

    supabaseClient = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey
    );
  }
  return supabaseClient;
}

export const uploadImage = async (filePath: string, folder = "publication") => {
  try {
    const supabase = getSupabaseClient();

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}${ext}`;
    const storagePath = `${folder}/${uniqueName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: getContentType(ext),
      });

    // Remove file from local storage after upload
    fs.unlinkSync(filePath);

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(error.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Upload service error:", error);
    // Attempt to remove file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return types[ext.toLowerCase()] || "application/octet-stream";
}
