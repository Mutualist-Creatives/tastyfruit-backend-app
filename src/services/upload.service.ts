import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "../config/index.js";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadImage = async (
  file: Express.Multer.File,
  folder = "publication"
) => {
  try {
    const supabase = getSupabaseClient();

    const fileName = file.originalname;
    const ext = path.extname(fileName);
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}${ext}`;
    const storagePath = `${folder}/${uniqueName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file.buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.mimetype,
      });

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
    throw error;
  }
};
