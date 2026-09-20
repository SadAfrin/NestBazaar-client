"use client";

import { useEffect, useState } from "react";

const PALETTE = [
  "bg-emerald-600",
  "bg-teal-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-orange-600",
  "bg-cyan-700",
];

const SIZES = {
  xs: { box: "w-8 h-8", text: "text-sm" },
  sm: { box: "w-9 h-9", text: "text-sm" },
  md: { box: "w-10 h-10", text: "text-base" },
  lg: { box: "w-12 h-12", text: "text-lg" },
  xl: { box: "w-20 h-20", text: "text-2xl" },
};

const ROUNDED = {
  full: "rounded-full",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

function getInitial(name) {
  const trimmed = String(name || "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function colorForName(name) {
  const value = String(name || "?").trim() || "?";
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function Avatar({
  name = "",
  src,
  size = "md",
  rounded = "full",
  className = "",
  alt,
}) {
  const [failed, setFailed] = useState(false);
  const imageUrl = typeof src === "string" ? src.trim() : "";
  const showImage = Boolean(imageUrl) && !failed;
  const sizeCls = SIZES[size] || SIZES.md;
  const roundCls = ROUNDED[rounded] || ROUNDED.full;
  const initial = getInitial(name);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt={alt || name || "User avatar"}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${sizeCls.box} ${roundCls} object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeCls.box} ${roundCls} ${colorForName(name)} text-white flex items-center justify-center font-black shrink-0 select-none ${sizeCls.text} ${className}`}
      aria-label={name || "User avatar"}
      title={name}
    >
      {initial}
    </div>
  );
}
