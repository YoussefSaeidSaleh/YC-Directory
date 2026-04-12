"use client";
  
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
  
export default defineConfig({
  basePath: "/studio",

  projectId,     // لازم يكون موجود، غالبًا من env
  dataset,       // نفس الكلام

  schema,
  
  plugins: [
    structureTool({ structure }),   // ترتيب structure tool حسب docs
    visionTool({ defaultApiVersion: apiVersion }), // Vision plugin
  ],

  // لو عايز تتحكّم في أدوات القايمة (مثال:
  // tools: (prev) => [/* ترتيب أو حذف أدوات */ prev],
  
});  