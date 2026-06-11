"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type DebugState = {
  envUrl: string;
  envKey: string;
  internetTest: string;
  dnsTest: string;
  directFetch: string;
  supabaseTest: string;
};

export default function DebugPage() {
  const [state, setState] = useState<DebugState>({
    envUrl: "...",
    envKey: "...",
    internetTest: "...",
    dnsTest: "...",
    directFetch: "...",
    supabaseTest: "..."
  });

  useEffect(() => {
    // Test 1: ENV
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ หาย";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ มี" : "❌ หาย";
    setState(s => ({ ...s, envUrl: url, envKey: key }));

    // Test 2: Internet (Google)
    fetch("https://www.google.com/generate_204", { cache: "no-store" })
      .then(() => setState(s => ({ ...s, internetTest: "✅ ได้" })))
      .catch((e) => setState(s => ({ ...s, internetTest: "❌ " + String(e.message) })));

    // Test 3: DNS (fetch Supabase)
    const startDns = Date.now();
    fetch("https://dtdkjwqwnqvzokayeps.supabase.co", { cache: "no-store" })
      .then(() => setState(s => ({ ...s, dnsTest: `✅ ${Date.now() - startDns}ms` })))
      .catch((e) => setState(s => ({ ...s, dnsTest: "❌ " + String(e.message) })));

    // Test 4: Direct fetch REST API
    const keyVal = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    fetch("https://dtdkjwqwnqvzokayeps.supabase.co/rest/v1/ad_banners?select=id&limit=1", {
      headers: { "apikey": keyVal, "Authorization": "Bearer " + keyVal }
    })
      .then(res => setState(s => ({ ...s, directFetch: "status: " + res.status })))
      .catch(e => setState(s => ({ ...s, directFetch: "❌ " + String(e.message) })));

    // Test 5: Supabase SDK
    if (supabase) {
      supabase.from("ad_banners").select("id").limit(1)
        .then(({ data, error }) => {
          if (error) setState(s => ({ ...s, supabaseTest: "❌ " + error.message }));
          else setState(s => ({ ...s, supabaseTest: "✅ count: " + (data?.length ?? 0) }));
        });
    } else {
      setState(s => ({ ...s, supabaseTest: "❌ supabase = null" }));
    }
  }, []);

  return (
    <div style={{ padding: 20, color: "white", fontFamily: "monospace", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>🔧 Deela Debug</h1>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 800 }}>
        <tbody>
          <tr style={{ background: "#222" }}>
            <td style={{ padding: 12, border: "1px solid #444", fontWeight: "bold" }}>ENV URL</td>
            <td style={{ padding: 12, border: "1px solid #444" }}>{state.envUrl}</td>
          </tr>
          <tr style={{ background: "#222" }}>
            <td style={{ padding: 12, border: "1px solid #444", fontWeight: "bold" }}>ENV Key</td>
            <td style={{ padding: 12, border: "1px solid #444" }}>{state.envKey}</td>
          </tr>
          <tr style={{ background: "#222" }}>
            <td style={{ padding: 12, border: "1px solid #444", fontWeight: "bold" }}>Internet (Google)</td>
            <td style={{ padding: 12, border: "1px solid #444" }}>{state.internetTest}</td>
          </tr>
          <tr style={{ background: "#222" }}>
            <td style={{ padding: 12, border: "1px solid #444", fontWeight: "bold" }}>DNS → Supabase</td>
            <td style={{ padding: 12, border: "1px solid #444" }}>{state.dnsTest}</td>
          </tr>
          <tr style={{ background: "#222" }}>
            <td style={{ padding: 12, border: "1px solid #444", fontWeight: "bold" }}>Direct Fetch REST</td>
            <td style={{ padding: 12, border: "1px solid #444" }}>{state.directFetch}</td>
          </tr>
          <tr style={{ background: "#222" }}>
            <td style={{ padding: 12, border: "1px solid #444", fontWeight: "bold" }}>Supabase SDK</td>
            <td style={{ padding: 12, border: "1px solid #444" }}>{state.supabaseTest}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}