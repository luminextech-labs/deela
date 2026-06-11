import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const ads = [
  { file: "1.png", title: "โฆษณา 1" },
  { file: "2.png", title: "โฆษณา 2" },
  { file: "3.png", title: "โฆษณา 3" },
  { file: "4.png", title: "โฆษณา 4" },
];

async function upload() {
  for (let i = 0; i < ads.length; i++) {
    const { file, title } = ads[i];
    const filePath = `banners/${file}`;

    // Upload file
    const fileBuffer = Bun.file(`/Users/adrenaline/Desktop/ads/${file}`);
    const { error: uploadError } = await supabase.storage
      .from("ad-banners")
      .upload(filePath, fileBuffer);

    if (uploadError) {
      console.error(`❌ ${file}: ${uploadError.message}`);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("ad-banners")
      .getPublicUrl(filePath);

    // Insert to DB
    const { error: dbError } = await supabase.from("ad_banners").insert({
      image_url: urlData.publicUrl,
      link_url: "",
      title,
      is_active: true,
      order_index: i + 1,
    });

    if (dbError) {
      console.error(`❌ DB ${file}: ${dbError.message}`);
    } else {
      console.log(`✅ ${file} → ${urlData.publicUrl}`);
    }
  }
}

upload();