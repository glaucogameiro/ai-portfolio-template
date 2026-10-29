(() => {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl = value => /^(https:\/\/|mailto:|assets\/|README\.md$|sample-[a-z-]+\.svg$|#)/.test(value || "") ? esc(value) : "#";
  const paras = lines => lines.map(line=>"<p>"+esc(line)+"</p>").join("");
  const date = value => value ? new Date(value+"T12:00:00").toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}) : "Learning record";
  const credentialMeta = c => [c.date ? date(c.date) : c.status || "Learning record",c.duration].filter(Boolean).join(" · ");
  const kind = value => ({visual_prototype:"Visual prototype",promotional_storyboard:"Historical storyboard",product_capture:"Product capture",diagram:"Diagram"}[value] || "Project image");
  const slot = '<div id="mobile-ambient-holder" class="mobile-ambient-holder" aria-hidden="true"></div>';
  let data;
  const assets = new Map();
  const routeMeta = {
    "core-profile":{number:"01",title:"Core Profile",subtitle:"Applied AI, entrepreneurship & executive leadership."},
    skills:{number:"02",title:"Agent Topology & Skills",subtitle:"Business needs. Connected systems. Human judgment."},
    projects:{number:"03",title:"AI Systems Lab",subtitle:"Products, integrations and ideas in development."},
    credentials:{number:"04",title:"Credentials Vault",subtitle:"A continuing learning journey."},
    contact:{number:"05",title:"Contact & Integration",subtitle:"Connect, explore and continue the conversation."}
  };
  const external = (label,url) => '<a class="inline-link" href="'+safeUrl(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' <span aria-hidden="true">↗</span></a>';
  const imageButton = (asset,group,index,css="") => '<button type="button" class="gallery-thumb '+css+'" data-gallery="'+esc(group)+'" data-index="'+index+'" aria-label="Enlarge '+esc(asset.caption)+'"><img src="'+safeUrl(asset.src)+'" alt="'+esc(asset.alt)+'" loading="lazy" width="640" height="400"><span>'+esc(asset.kindLabel||kind(asset.kind))+' <b aria-hidden="true">↗</b></span></button>';
  function core() {
    const p=data.profile;
    return '<div class="profile-intro"><p class="profile-headline">'+esc(p.headline)+'</p>'+paras(p.intro)+'</div>'+slot+
      '<nav class="profile-jumps" aria-label="On this page"><button data-scroll="core-practice">Practice</button><button data-scroll="core-experience">Experience</button><button data-scroll="core-education">Education</button><button data-scroll="core-languages">Languages</button></nav>'+
      '<section id="core-practice" class="profile-block"><p class="content-label">WHAT I BRING</p><h2>From business needs to working systems.</h2><div class="practice-grid">'+p.practice.map((item,i)=>'<article class="practice-item"><span class="item-number">0'+(i+1)+'</span><h3>'+esc(item.title)+'</h3><p>'+esc(item.description)+'</p></article>').join('')+'</div></section>'+
      '<section id="core-experience" class="profile-block experience-block"><p class="content-label">PROFESSIONAL JOURNEY</p><h2>Experience across products, people and operations.</h2><div class="timeline">'+p.experience.map(item=>'<article class="timeline-item"><div class="timeline-date">'+esc(item.period)+'</div><div><p class="content-label">'+esc(item.category)+'</p><h3>'+esc(item.role)+'</h3><p class="organization">'+esc(item.organization)+'</p><ul>'+item.points.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div></article>').join('')+'</div></section>'+
      '<section id="core-education" class="profile-block"><p class="content-label">FOUNDATIONS & CONTINUING EDUCATION</p><h2>Education.</h2><div class="education-grid">'+p.education.map(item=>'<article class="education-item"><span class="status-label">'+esc(item.status)+'</span><h3>'+esc(item.title)+'</h3><p>'+esc(item.provider)+'</p><p class="record-meta">'+esc(item.period)+'</p><p>'+esc(item.details)+'</p></article>').join('')+'</div><a class="inline-link" href="#credentials">Explore certificates & learning records <span aria-hidden="true">↗</span></a></section>'+
      '<section id="core-languages" class="profile-block language-block"><p class="content-label">COMMUNICATION</p><h2>Languages.</h2><div class="language-list">'+p.languages.map(item=>'<p><strong>'+esc(item.name)+'</strong><span>'+esc(item.level)+'</span></p>').join('')+'</div></section>'+
      '<aside class="knowledge-note"><span class="content-label">PRACTICE & KNOWLEDGE</span><p>'+esc(p.knowledgeNote)+'</p><a class="inline-link" href="#skills">Explore skills in context <span aria-hidden="true">↗</span></a></aside><div class="explore-links"><a href="#projects"><small>SEE THE WORK</small><strong>Projects & visual studies</strong><span aria-hidden="true">↗</span></a><a href="#contact"><small>GET IN TOUCH</small><strong>Contact & résumé</strong><span aria-hidden="true">↗</span></a></div>';
  }
  function skills() {
    return '<div class="page-intro"><p>My work connects product conception, business requirements, workflow design and the coordination of AI-assisted implementation. I define how people, agents and systems should work together, then review whether the resulting workflow serves its intended purpose.</p></div><div class="skill-groups">'+data.skills.map((group,i)=>'<section class="skill-group"><span class="item-number">0'+(i+1)+'</span><h2>'+esc(group.category)+'</h2><ul>'+group.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></section>').join('')+'</div><section class="profile-block introductory-panel"><p class="content-label">INTRODUCTORY CONCEPTUAL KNOWLEDGE</p><h2>Learning foundations.</h2><div class="technology-list">'+data.introductoryKnowledge.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div><p>These are introductory learning topics. Technologies used in the applications are described within each project; they are distinct from independently mastered programming languages and SDKs.</p></section><div class="explore-links"><a href="#projects"><small>APPLICATION CONTEXT</small><strong>Explore projects & integrations</strong><span aria-hidden="true">↗</span></a><a href="#credentials"><small>LEARNING RECORDS</small><strong>View certificates</strong><span aria-hidden="true">↗</span></a></div>'+slot;
  }
  function projects() {
    return '<div class="page-intro"><p>A portfolio of business workflows and consumer products. Each case identifies my contribution, the project stage and its integration context.</p></div><div class="collection-tools"><label for="project-search">Find a project<input id="project-search" type="search" placeholder="Name, integration or technology" autocomplete="off"></label><p id="project-count" class="collection-count" aria-live="polite">'+data.projects.length+' projects</p></div><div class="project-grid" id="project-grid">'+data.projects.map((p,i)=>{
      const cover=assets.get(p.gallery[0]);
      return '<article class="project-card" data-project-card data-search="'+esc([p.name,p.summary,...p.technologies].join(' ').toLowerCase())+'">'+(cover?'<button class="project-cover" data-project="'+esc(p.id)+'" aria-label="Open '+esc(p.name)+'"><img src="'+safeUrl(cover.src)+'" alt="'+esc(cover.alt)+'" width="640" height="340" loading="lazy"><span>'+kind(cover.kind)+'</span></button>':'<div class="project-index" aria-hidden="true">'+String(i+1).padStart(2,'0')+'<span>CASE STUDY</span></div>')+'<div class="project-card-copy"><span class="status-label">'+esc(p.stage)+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.summary)+'</p><div class="technology-list compact">'+p.technologies.slice(0,4).map(x=>'<span>'+esc(x)+'</span>').join('')+'</div><button class="card-action" data-project="'+esc(p.id)+'">Explore project <span aria-hidden="true">↗</span></button></div></article>';
    }).join('')+'</div><p id="project-empty" class="empty-result" hidden>No matching projects. Try a different word.</p>'+slot;
  }
  function credentials() {
    return '<div class="page-intro"><p>Certificates and learning records across AI agents, leadership, blockchain and introductory development topics. Select a record to view its certificate image.</p><p class="learning-scope">These records document learning, participation or completion. They do not establish professional programming proficiency.</p></div><div class="collection-tools"><label for="credential-search">Find a learning record<input id="credential-search" type="search" placeholder="Course, provider or topic" autocomplete="off"></label><p id="credential-count" class="collection-count" aria-live="polite">'+data.credentials.length+' records</p></div><div class="credential-grid" id="credential-grid">'+data.credentials.map(c=>'<article class="credential-card" data-credential-card data-search="'+esc([c.title,c.officialTitle,c.issuer,...c.topics].join(' ').toLowerCase())+'">'+(c.images.length?'<button class="certificate-cover" data-credential="'+esc(c.id)+'" aria-label="View '+esc(c.title)+' certificate"><img src="'+safeUrl(c.images[0])+'" alt="Certificate for '+esc(c.officialTitle)+'" width="640" height="450" loading="lazy"></button>':'')+'<div class="credential-card-copy"><span class="record-meta">'+esc(credentialMeta(c))+'</span><h2>'+esc(c.title)+'</h2><p>'+esc(c.issuer)+'</p><span class="status-label">'+esc(c.scope)+'</span><button class="card-action" data-credential="'+esc(c.id)+'"> '+(c.images.length?'View certificate':'View record')+' <span aria-hidden="true">↗</span></button></div></article>').join('')+'</div><p id="credential-empty" class="empty-result" hidden>No matching learning records. Try a different word.</p>'+slot;
  }
  function contact() {
    const c=data.contact;
    return '<div class="page-intro"><p>Explore my work, connect through LinkedIn or get in touch by email.</p></div><div class="contact-grid"><a class="contact-item" href="mailto:'+esc(c.email)+'"><span class="content-label">EMAIL</span><strong>'+esc(c.email)+'</strong><span aria-hidden="true">↗</span></a><a class="contact-item" href="'+safeUrl(c.linkedin)+'" target="_blank" rel="noopener noreferrer"><span class="content-label">LINKEDIN</span><strong>Example profile link</strong><span aria-hidden="true">↗</span></a><a class="contact-item" href="'+safeUrl(c.resume)+'" download="'+esc(c.resumeDownloadName)+'"><span class="content-label">GUIDE</span><strong>Customization guide</strong><span aria-hidden="true">↓</span></a>'+c.links.map(link=>'<a class="contact-item" href="'+safeUrl(link.url)+'" target="_blank" rel="noopener noreferrer"><span class="content-label">EXPLORE</span><strong>'+esc(link.label)+'</strong><span aria-hidden="true">↗</span></a>').join('')+'</div><p class="location-line">'+esc(data.profile.location)+'</p>'+slot;
  }
  const renderers={"core-profile":core,skills,projects,credentials,contact};
  let mediaItems=[],mediaIndex=0;
  const mediaDialog=()=>document.getElementById("media-dialog");
  function showMedia(items,index=0) {
    mediaItems=items;mediaIndex=index;
    paintMedia();
    if(!mediaDialog().open)mediaDialog().showModal();
    window.GGCircuitBackground?.setOverlay(true);
  }
  function paintMedia() {
    const item=mediaItems[mediaIndex];
    const img=document.getElementById("media-image");img.src=item.src;img.alt=item.alt;
    document.getElementById("media-title").textContent=item.title || item.caption;
    document.getElementById("media-caption").textContent=item.caption;
    document.getElementById("media-kind").textContent=item.kindLabel || kind(item.kind);
    document.getElementById("media-counter").textContent=(mediaIndex+1)+" / "+mediaItems.length;
    document.getElementById("media-prev").hidden=mediaItems.length<2;
    document.getElementById("media-next").hidden=mediaItems.length<2;
    document.getElementById("media-original").href=item.src;
    document.getElementById("media-verification").hidden=!item.verificationUrl;
    if(item.verificationUrl && /^https:\/\//.test(item.verificationUrl))document.getElementById("media-verification").href=item.verificationUrl;
  }
  function stepMedia(direction) {mediaIndex=(mediaIndex+direction+mediaItems.length)%mediaItems.length;paintMedia();}
  function openProject(id) {
    const p=data.projects.find(x=>x.id===id);if(!p)return;
    const dialog=document.getElementById("project-dialog");
    document.getElementById("project-dialog-title").textContent=p.name;
    document.getElementById("project-dialog-content").innerHTML='<span class="status-label">'+esc(p.stage)+'</span><p class="project-lead">'+esc(p.summary)+'</p>'+paras(p.paragraphs)+'<section class="project-detail-block"><p class="content-label">MY CONTRIBUTION</p><p>'+esc(p.contribution)+'</p></section>'+(p.technologies.length?'<section class="project-detail-block"><p class="content-label">'+esc(p.technologyLabel.toUpperCase())+'</p><div class="technology-list">'+p.technologies.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div></section>':'')+(p.gallery.length?'<section class="project-detail-block"><h3>Visual gallery</h3><div class="detail-gallery">'+p.gallery.map((id,i)=>imageButton(assets.get(id),p.id,i)).join('')+'</div></section>':'')+(p.links.length?'<div class="project-links">'+p.links.map(link=>external(link.label,link.url)).join('')+'</div>':'');
    dialog.showModal();window.GGCircuitBackground?.setOverlay(true);
  }
  function bind() {
    document.addEventListener("click",event=>{
      const button=event.target.closest("button");if(!button)return;
      if(button.dataset.project)openProject(button.dataset.project);
      if(button.dataset.credential){const c=data.credentials.find(x=>x.id===button.dataset.credential);if(c.images.length)showMedia(c.images.map((src,i)=>({src,title:c.title,alt:c.officialTitle+" — page "+(i+1),caption:c.issuer+" · "+credentialMeta(c)+". "+c.displayNote,kindLabel:c.type,verificationUrl:c.verificationUrl})));else {document.getElementById("project-dialog-title").textContent=c.title;document.getElementById("project-dialog-content").innerHTML='<span class="status-label">'+esc(c.scope)+'</span><p class="project-lead">'+esc(c.issuer)+'</p><p class="record-meta">'+esc(credentialMeta(c))+'</p>'+paras(c.description?[c.description]:[])+'<div class="technology-list">'+c.topics.map(topic=>'<span>'+esc(topic)+'</span>').join('')+'</div>';document.getElementById("project-dialog").showModal();window.GGCircuitBackground?.setOverlay(true);}}
      if(button.dataset.gallery){const p=data.projects.find(x=>x.id===button.dataset.gallery);showMedia(p.gallery.map(id=>assets.get(id)),Number(button.dataset.index));}
      if(button.dataset.scroll){document.getElementById(button.dataset.scroll)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});}
    });
    document.addEventListener("input",event=>{
      const type=event.target.id==="project-search"?"project":event.target.id==="credential-search"?"credential":null;if(!type)return;
      const query=event.target.value.trim().toLocaleLowerCase();let count=0;
      document.querySelectorAll('[data-'+type+'-card]').forEach(card=>{const matches=card.dataset.search.includes(query);card.hidden=!matches;if(matches)count++;});
      document.getElementById(type+"-empty").hidden=count>0;
      document.getElementById(type+"-count").textContent=count+ (type==="project"?(count===1?" project":" projects"):(count===1?" record":" records"));
    });
    document.getElementById("media-close").addEventListener("click",()=>mediaDialog().close());
    document.getElementById("project-close").addEventListener("click",()=>document.getElementById("project-dialog").close());
    document.getElementById("media-prev").addEventListener("click",()=>stepMedia(-1));
    document.getElementById("media-next").addEventListener("click",()=>stepMedia(1));
    document.addEventListener("keydown",event=>{if(!mediaDialog().open)return;if(event.key==="ArrowRight"){event.preventDefault();stepMedia(1);}if(event.key==="ArrowLeft"){event.preventDefault();stepMedia(-1);}});
    [mediaDialog(),document.getElementById("project-dialog")].forEach(dialog=>{
      dialog.addEventListener("close",()=>window.GGCircuitBackground?.setOverlay(Boolean(document.querySelector('dialog[open]'))));
      dialog.addEventListener("click",event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
    });
  }
  window.GGPortfolio={
    async load(){const response=await fetch("content.json",{cache:"no-store"});if(!response.ok)throw new Error("Portfolio content unavailable");data=await response.json();data.projects=data.projects.map(p=>({gallery:[],links:[],technologies:[],paragraphs:[],...p})).sort((a,b)=>(a.order??500)-(b.order??500));data.credentials=data.credentials.map(c=>({images:[],topics:[],description:"",duration:"",date:"",scope:"Learning record",...c})).sort((a,b)=>b.date.localeCompare(a.date));routeMeta["core-profile"].subtitle=data.profile.subtitle;data.gallery.forEach(item=>assets.set(item.id,item));bind();return routeMeta;},
    render(key){return renderers[key]?.() || "";},
    closeDialogs(){document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());}
  };
})();
