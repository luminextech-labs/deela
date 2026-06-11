"use client";

import { useState, useEffect } from "react";
import { supabase, type AdBanner, addAdBanner, updateAdBanner, deleteAdBanner } from "@/app/lib/supabase";

export default function AdsAdminPage() {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    if (!supabase) return;
    const { data } = await supabase
      .from("ad_banners")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBanners(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !supabase) return;

    const file = e.target.files[0];
    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("ad-banners")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("ad-banners")
        .getPublicUrl(filePath);

      await addAdBanner({
        image_url: urlData.publicUrl,
        link_url: "",
        title: file.name.replace(`.${fileExt}`, ""),
      });

      setMessage({ type: "success", text: "อัปโหลดสำเร็จ! 🎉" });
      fetchBanners();
    } catch (err) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" });
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await updateAdBanner(id, { is_active: !current });
    fetchBanners();
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบโฆษณานี้?")) return;
    await deleteAdBanner(id);
    fetchBanners();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📢 Ad Banner Admin</h1>
        <p className="text-gray-400 mb-8">จัดการโฆษณาของคุณ</p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/50 text-green-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">⬆️ อัปโหลดโฆษณาใหม่</h2>
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
              {uploading ? (
                <p className="text-blue-400">กำลังอัปโหลด...</p>
              ) : (
                <>
                  <p className="text-4xl mb-2">🖼️</p>
                  <p className="text-gray-400">คลิกเพื่อเลือกไฟล์รูปภาพ</p>
                  <p className="text-gray-600 text-sm mt-2">PNG, JPG, WEBP สูงสุด 5MB</p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Banner List */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">📋 รายการโฆษณา ({banners.length})</h2>

          {loading ? (
            <p className="text-gray-500">กำลังโหลด...</p>
          ) : banners.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ยังไม่มีโฆษณา</p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex items-center gap-4 bg-gray-800 rounded-lg p-4"
                >
                  <img
                    src={banner.image_url}
                    alt={banner.title || ""}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {banner.title || "ไม่มีชื่อ"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {banner.link_url || "ไม่มีลิงก์"}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={banner.is_active}
                        onChange={() => toggleActive(banner.id, banner.is_active)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-blue-600"></div>
                      <div className="absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {banner.is_active ? "เปิด" : "ปิด"}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-400 hover:text-red-300 text-xl"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}