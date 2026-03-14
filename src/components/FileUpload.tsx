"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  briefId: string;
  category: string;
  existingUrls: string[];
  onUrlsChange: (urls: string[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function FileUpload({
  briefId,
  category,
  existingUrls,
  onUrlsChange,
  maxFiles = 10,
  accept = "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("briefId", briefId);
    formData.append("category", category);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxFiles - existingUrls.filter(Boolean).length;

      if (fileArray.length > remaining) {
        setError(`Maximum ${maxFiles} fichiers. Il reste ${remaining} place(s).`);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const urls: string[] = [];
        for (const file of fileArray) {
          const url = await uploadFile(file);
          if (url) urls.push(url);
        }
        onUrlsChange([...existingUrls.filter(Boolean), ...urls]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur d'upload");
      } finally {
        setUploading(false);
      }
    },
    [briefId, existingUrls, maxFiles, onUrlsChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeUrl = (index: number) => {
    onUrlsChange(existingUrls.filter((_, i) => i !== index));
  };

  const validUrls = existingUrls.filter(Boolean);

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${dragActive
            ? "border-brand-500 bg-brand-50"
            : "border-surface-200 hover:border-brand-300 hover:bg-surface-50"
          }`}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <span className="text-sm text-surface-500">Upload en cours...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-surface-400" />
            <span className="text-sm text-surface-600 font-medium">
              Glissez vos fichiers ici ou cliquez pour parcourir
            </span>
            <span className="text-xs text-surface-400">
              JPG, PNG, WebP, SVG, PDF — Max 10 Mo par fichier
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Uploaded files preview */}
      {validUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {validUrls.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-surface-200 bg-surface-50">
              {url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || url.includes("supabase") ? (
                <img
                  src={url}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              )}
              <button
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Manual URL fallback */}
      <details className="mt-3">
        <summary className="text-xs text-surface-400 cursor-pointer hover:text-surface-600">
          Ou ajoutez un lien manuellement (Google Drive, WeTransfer...)
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            className="input-field text-sm"
            placeholder="https://drive.google.com/..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const input = e.currentTarget;
                if (input.value) {
                  onUrlsChange([...existingUrls, input.value]);
                  input.value = "";
                }
              }
            }}
          />
        </div>
      </details>
    </div>
  );
}
