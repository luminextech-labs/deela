const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = "https://dtdkjwqwnqvzokayeps.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM";

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
    const filePath = path.join("/Users/adrenaline/Desktop/ads", file);

    const fileBuffer = fs.readFileSync(filePath);

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("ad-banners")
      .upload(`banners/${file}`, fileBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.log(`❌ ${file}: ${uploadError.message}`);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("ad-banners")
      .getPublicUrl(`banners/${file}`);

    // Insert to DB
    const { error: dbError } = await supabase.from("ad_banners").insert({
      image_url: urlData.publicUrl,
      link_url: "",
      title,
      is_active: true,
      order_index: i + 1,
    });

    if (dbError) {
      console.log(`❌ DB ${file}: ${dbError.message}`);
    } else {
      console.log(`✅ ${file} → ${urlData.publicUrl}`);
    }
  }
}

upload();