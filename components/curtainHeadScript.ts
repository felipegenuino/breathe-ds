/**
 * Script for the <head> (before paint) of the Curtain: marks the curtain as seen
 * in this session, so it does not repeat on navigation or reload. Without it, the
 * curtain shows on every load. Plain module (no "use client"): a server layout
 * can call it.
 *   // Next (app/layout):
 *   import { curtainHeadScript } from "@breathe-ds/ui/components/curtainHeadScript";
 *   <script dangerouslySetInnerHTML={{ __html: curtainHeadScript("cg-curtain") }} />
 */
export function curtainHeadScript(storageKey = "cg-curtain") {
  const k = JSON.stringify(storageKey);
  return `try{var d=document.documentElement;if(sessionStorage.getItem(${k})){d.setAttribute('data-cg-curtain','seen')}else{sessionStorage.setItem(${k},'1')}}catch(e){}`;
}
