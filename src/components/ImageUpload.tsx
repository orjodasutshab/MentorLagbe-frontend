"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { api, assetUrl, errorMessage } from "@/lib/api";
import { Icon } from "./icons";
import { Spinner } from "./ui";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file is not a valid image."));
    img.src = src;
  });
}

/** Shrinks the image in the browser so uploads stay small and fast. */
async function compress(file: File, maxDim: number): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function ImageUpload({
  label,
  value,
  onChange,
  maxDim = 1280,
  round = false,
  defaultOption,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  maxDim?: number;
  round?: boolean;
  defaultOption?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (PNG, JPG, WEBP or GIF).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("That image is too large. Please pick one under 15MB.");
      return;
    }
    setBusy(true);
    try {
      const imageBase64 = await compress(file, maxDim);
      const res = await api<{ url: string }>("/upload", {
        method: "POST",
        body: { imageBase64, filename: file.name.replace(/\.[^.]+$/, "") + ".jpg" },
      });
      onChange(res.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const preview = assetUrl(value);

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-border bg-surface ${
            round ? "h-24 w-24 rounded-full" : "h-24 w-40 rounded-xl"
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <Icon name="upload" size={24} className="text-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
              {busy ? <Spinner size={14} /> : <Icon name="upload" size={15} />}
              {busy ? "Uploading..." : "Upload image"}
            </button>
            {defaultOption ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(defaultOption)}>
                Use default
              </button>
            ) : null}
          </div>
          <input
            className="input"
            placeholder="or paste an image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
