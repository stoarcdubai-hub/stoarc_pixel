// Pixel font: each letter is 5 columns x 7 rows
var F={
  S:[".####","#....","#....",".###.","....#","....#","####."],
  T:["#####","..#..","..#..","..#..","..#..","..#..","..#.."],
  O:[".###.","#...#","#...#","#...#","#...#","#...#",".###."],
  A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],
  R:["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],
  C:[".###.","#...#","#....","#....","#....","#...#",".###."]
};
var W="STOARC";

// Projects live inside pixels. 1 = first lit pixel (top-left of the S).
var PROJECTS={
  1:{title:"First project",text:"This is the first project living inside the first pixel. Replace this text with your own."}
};

// Header pages
var PAGES={
  about:{title:"About stoarc",text:"Write a few sentences about stoarc here."},
  contact:{title:"Contact",text:"hello@example.com"}
};

var g=document.getElementById("grid"),
    ov=document.getElementById("ov"),
    box=document.getElementById("box"),
    n=0,open=null;

function rnd(a){return (Math.random()-.5)*a}

// Build the pixel letters (each pixel gets a random start position for the intro)
for(var r=0;r<7;r++)for(var c=0;c<35;c++){
  var L=Math.floor(c/6),k=c%6,lit=k<5&&F[W[L]][r][k]==="#";
  if(!lit){var e=document.createElement("div");e.className="empty";g.appendChild(e);continue}
  n++;
  var b=document.createElement("button");
  b.className="px";b.dataset.n=n;b.dataset.l=W[L];
  b.style.setProperty("--dx",rnd(innerWidth*1.3)+"px");
  b.style.setProperty("--dy",rnd(innerHeight*1.3)+"px");
  b.style.setProperty("--r",rnd(720)+"deg");
  b.style.setProperty("--d",(Math.random()*0.9).toFixed(2)+"s");
  b.setAttribute("aria-label","Pixel "+n+" of letter "+W[L]);
  b.onclick=function(){
    var id=+this.dataset.n,
        p=PROJECTS[id]||{title:"Empty pixel",text:"A project will live here."};
    show(this,"PIXEL "+String(id).padStart(3,"0")+" · LETTER "+this.dataset.l,p.title,p.text);
  };
  g.appendChild(b);
}

// Header buttons
document.querySelectorAll("nav button").forEach(function(btn){
  btn.onclick=function(){
    var p=PAGES[this.dataset.page];
    show(this,"STOARC",p.title,p.text);
  };
});

function place(el){
  var r=el.getBoundingClientRect();
  ov.style.left=r.left+"px";ov.style.top=r.top+"px";
  ov.style.width=r.width+"px";ov.style.height=r.height+"px";
}

function show(el,tag,title,text){
  open=el;
  box.innerHTML="<small></small><h1></h1><p></p><button id='x'>← zoom out</button>";
  box.querySelector("small").textContent=tag;
  box.querySelector("h1").textContent=title;
  box.querySelector("p").textContent=text;
  document.getElementById("x").onclick=close;
  ov.className="";ov.style.display="block";place(el);ov.offsetWidth;
  ov.style.left=0;ov.style.top=0;ov.style.width="100vw";ov.style.height=innerHeight+"px";
  ov.classList.add("full");
  setTimeout(function(){ov.classList.add("show")},650);
}

function close(){
  if(!open)return;
  ov.classList.remove("show","full");place(open);
  setTimeout(function(){ov.style.display="none";open.focus();open=null},800);
}

addEventListener("keydown",function(e){if(e.key==="Escape")close()});

// ===== Services marquee (NEW) =====
(function(){
  var root=document.getElementById("svc-rows");
  if(!root)return;

  var SERVICES=[
    {title:"Master Planning & Urban Design",text:"Describe this service here."},
    {title:"Architecture",text:"Describe this service here."},
    {title:"Project Management Consultancy / Construction Management",text:"Describe this service here."},
    {title:"MEP Design & Drawing",text:"Describe this service here."}
  ];

  SERVICES.forEach(function(s,i){
    var row=document.createElement("div");
    row.className="svc-row"+(i%2?" rev":"");
    row.tabIndex=0;
    row.setAttribute("role","button");
    row.setAttribute("aria-label",s.title);
    row.style.setProperty("--dur",(34+i*6)+"s"); // each row a different speed

    var item=document.createElement("span");
    item.className="svc-item";
    item.innerHTML="<span class='svc-dot'></span><span class='svc-name'></span>";
    item.querySelector(".svc-name").textContent=s.title;

    // two identical halves so translating -50% loops seamlessly
    function half(hidden){
      var h=document.createElement("div");
      h.className="svc-half";
      if(hidden)h.setAttribute("aria-hidden","true");
      for(var k=0;k<4;k++)h.appendChild(item.cloneNode(true));
      return h;
    }
    var track=document.createElement("div");
    track.className="svc-track";
    track.appendChild(half(false));
    track.appendChild(half(true));
    row.appendChild(track);

    // reuse your zoom overlay
    function go(){show(row,"SERVICE "+String(i+1).padStart(2,"0"),s.title,s.text)}
    row.onclick=go;
    row.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}};

    root.appendChild(row);
  });
})();