import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
export const revalidate = 0;
export async function generateMetadata({params}:{params:{slug:string}}) {
 const supabase=createClient(); const {data:e}=await supabase.from("events").select("*").eq("slug",params.slug).eq("status","published").maybeSingle();
 if(!e) return {title:"Event not found | Softrix IT Tech"};
 return {title:e.seo_title||`${e.name} | Softrix IT Tech`,description:e.meta_description||e.description,keywords:e.keywords||undefined,alternates:e.canonical_url?{canonical:e.canonical_url}:undefined,robots:e.robots||"index, follow",openGraph:{title:e.seo_title||e.name,description:e.meta_description||e.description,images:e.og_image?[e.og_image]:(e.image_url?[e.image_url]:[])}};
}
export default async function EventPage({params}:{params:{slug:string}}) {
 const supabase=createClient();const {data:e}=await supabase.from("events").select("*").eq("slug",params.slug).eq("status","published").maybeSingle();if(!e)notFound();
 return <><header className="top wrap"><Link className="logo" href="/">SOFTRIX <b>IT TECH</b></Link><Link className="outline" href="/">← All events</Link></header><main className="wrap"><section className="hero"><div><div className="kicker">{e.category||"Featured Event"}</div><h1>{e.name}</h1><p className="lead">{e.description}</p><div className="actions"><a className="btn" href={e.affiliate_url} target="_blank" rel="nofollow sponsored noopener">{e.button_text||"Continue to Event →"}</a><Link className="outline" href="/">Back to home</Link></div></div><div className="art">{e.image_url?<img src={e.image_url} alt={e.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div className="art-inner"><span className="tag">SOFTRIX IT TECH</span><h2>Live the moment.</h2></div>}</div></section><p className="disclosure">Please check the destination provider for availability, terms, and any costs. Some links may be affiliate links.</p></main></>;
}
