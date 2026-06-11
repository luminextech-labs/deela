"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function DebugPage() {
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    async function runTests() {
      // 1. Test env vars
      setResults(r => ({
        ...r,
        env: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ หาย",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ มี" : "❌ หาย",
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "❌ หาย",
        }
      }));

      // 2. Test DNS resolution (fetch a small resource)
      try {
        const start = Date.now();
        const dnsTest = await fetch("https://dtdkjwqwnqvzokayeps.supabase.co", { 
          method: "HEAD",
          mode: "no-cors"
        });
        setResults(r => ({ 
          ...r, 
          dns: "✅ resolve ได้",
          dnsTime: `${Date.now() - start}ms`
        }));
      } catch (e: any) {
        setResults(r => ({ 
          ...r, 
          dns: "❌ " + e.message,
          dnsErrorType: e.name
        }));
      }

      // 3. Test Supabase API (actual query)
      try {
        const { data, error, status, statusText } = await supabase
          .from("ad_banners")
          .select("*");
        
        setResults(r => ({ 
          ...r, 
          supabase: { 
            dataCount: data?.length || 0,
            error,
            status,
            statusText 
          } 
        }));
      } catch (e: any) {
        setResults(r => ({ 
          ...r, 
          supabase: { error: e.message, errorName: e.name } 
        }));
      }

      // 4. Test direct fetch with apikey
      try {
        const res = await fetch(
          "https://dtdkjwqwnqvzokayeps.supabase.co/rest/v1/ad_banners?select=id",
          {
            headers: {
              "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`
            }
          }
        );
        const text = await res.text();
        setResults(r => ({ 
          ...r, 
          directFetch: { 
            status: res.status, 
            ok: res.ok,
            body: text.slice(0, 200)
          } 
        }));
      } catch (e: any) {
        setResults(r => ({ 
          ...r, 
          directFetch: { error: e.message } 
        }));
      }

      // 5. Test Google (to confirm internet works)
      try {
        const googleRes = await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        setResults(r => ({ ...r, internet: "✅ เชื่อมต่อได้" }));
      } catch (e: any) {
        setResults(r => ({ ...r, internet: "❌ " + e.message }));
      }
    }

    runTests();
  }, []);

  return (
    <div style={{ padding: 20, color: "white", fontFamily: "monospace", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>🔧 Deela Debug Page</h1>
      
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, color: "#888" }}>ENV Variables</h2>
        <pre style={{ background: "#222", padding: 10, borderRadius: 8 }}>
          {JSON.stringify(results.env || {}, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, color: "#888" }}>Internet Connection</h2>
        <pre style={{ background: "#222", padding: 10, borderRadius: 8 }}>
          {JSON.stringify(results.internet || "waiting...", null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, color: "#888" }}>DNS to Supabase</h2>
        <pre style={{ background: "#222", padding: 10, borderRadius: 8 }}>
          {JSON.stringify({
            status: results.dns || "waiting...",
            time: results.dnsTime || "-"
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, color: "#888" }}>Direct Fetch to Supabase REST</h2>
        <pre style={{ background: "#222", padding: 10, borderRadius: 8 }}>
          {JSON.stringify(results.directFetch || "waiting...", null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, color: "#888" }}>Supabase Client (via SDK)</h2>
        <pre style={{ background: "#222", padding: 10, borderRadius: 8 }}>
          {JSON.stringify(results.supabase || "waiting...", null, 2)}
        </pre>
      </div>
    </div>
  );
}