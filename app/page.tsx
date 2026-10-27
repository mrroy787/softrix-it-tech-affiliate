import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 0;
export async function generateMetadata() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return {
    title: data?.seo_title || "Softrix IT Tech | Live Events & Entertainment",
    description: data?.meta_description || "Discover live sports, festivals and entertainment experiences with Softrix IT Tech.",
    keywords: data?.keywords || "live events, sports, festivals, entertainment",
    alternates: data?.canonical_url ? { canonical: data.canonical_url } : undefined,
    robots: data?.robots || "index, follow",
    openGraph: { title: data?.seo_title || "Softrix IT Tech", description: data?.meta_description || "Discover live events.", images: data?.og_image ? [data.og_image] : [] }
  };
}
export default async function Home() {
 const supabase = createClient();
 const [{data:events}, {data:settings}] = await Promise.all([
  supabase.from("events").select("*").eq("status","published").order("display_order",{ascending:true}),
  supabase.from("site_settings").select("*").eq("id",1).maybeSingle()
 ]);
 return <><header className="top wrap"><Link className="logo" href="/"><span>SOFTRIX</span> <b>IT TECH</b></Link><nav><a href="#events">Featured Events</a><a href="#categories">Categories</a><a href="#faq">FAQ</a></nav><Link className="btn" href="#events">Explore Events ↗</Link></header>
 <main><section className="hero wrap"><div><div className="kicker">Your front row starts here</div><h1>{settings?.hero_heading || "Big events."}<br/><span className="grad">{settings?.hero_highlight || "Bigger moments."}</span></h1><p className="lead">{settings?.hero_description || "Discover college football, music festivals, global sports and live entertainment. Find your next can’t-miss event."}</p><div className="actions"><a className="btn" href="#events">Explore Live Events →</a><a className="outline" href="#categories">Browse Categories</a></div><div className="muted">Sports · Festivals · Live entertainment</div></div><div className="art"><div className="art-inner"><span className="tag">✦ LIVE EXPERIENCES</span><h2>Make room<br/>for the moment.</h2><p>Find an event. Feel the energy.</p></div></div></section>
 <section className="section wrap" id="events"><div className="section-head"><div><div className="kicker">Handpicked for you</div><h2>Featured Events</h2></div><span className="muted">Choose your next experience</span></div><div className="events">{events?.map((e:any)=><article className="event" key={e.id}><div className="thumb">{e.image_url?<img src={e.image_url} alt={e.name}/>:<div className="placeholder">✦</div>}</div><div className="event-body"><span className="chip">{e.category || "Live Event"}</span><h3>{e.name}</h3><p>{e.description}</p><Link className="btn" href={`/events/${e.slug}`}>{e.button_text || "Explore Event →"}</Link></div></article>)}</div>{(!events || events.length===0)&&<p className="muted">Events are being prepared. Please check back soon.</p>}</section>
 <section className="section wrap" id="categories"><div className="kicker">Explore your vibe</div><h2>One place. Many experiences.</h2><p className="muted">From game day to festival nights, discover the moments worth sharing.</p><div className="banner"><div><h2>Ready for the next big moment?</h2><p className="muted">Choose an event and check the official provider’s access details.</p></div><a className="btn" href="#events">See Featured Events →</a></div></section>
 <section className="section wrap faq" id="faq"><div className="kicker">Good to know</div><h2>Frequently Asked Questions</h2><details><summary>How do I visit an event?</summary><p>Select an event card to view details and continue to its linked event page. Review provider details and terms before purchasing or signing up.</p></details><details><summary>Are all events free?</summary><p>Availability, pricing and viewing rights vary by provider and location. Check the linked page for current details.</p></details><details><summary>Does this website provide the event stream?</summary><p>This website helps visitors discover events and may direct them to third-party providers.</p></details><p className="disclosure">{settings?.affiliate_disclosure || "Affiliate disclosure: Some links may be promotional or affiliate links. The site operator may earn a commission at no additional cost to you."}</p></section></main>
 <footer><div className="wrap foot"><span>© {new Date().getFullYear()} Softrix IT Tech. All rights reserved.</span><span>Entertainment discovery · Check official event details.</span><Link href="/admin/login">Admin</Link></div></footer></>;
}
