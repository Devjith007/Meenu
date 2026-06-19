"use client";

import { useEffect, useRef, useState } from "react";

/* ----- editable content ----- */
const photos = [
  { cap: "Our first trip", note: "where it all began" },
  { cap: "That perfect sunset", note: "just the two of us" },
  { cap: "Most hated photo 😂", note: "(but I love it)" },
  { cap: "Something made you smile", note: "it melts me every time" },
  { cap: "Dancing in the rain", note: "no music needed" },
  { cap: "Coffee & you", note: "a perfect morning" },
  { cap: "Just us", note: "and that's everything" },
];

const fallbacks = [
  "photo-1469474968028-56623f02e42e", "photo-1494774157365-9e04c6720e47",
  "photo-1500917293891-ef795e70e1f6", "photo-1522202176988-66273c2fd55f",
  "photo-1516589178581-6cd7833ae3b2", "photo-1503516459261-40c66117780a",
  "photo-1518199266791-5375a83190b7", "photo-1490750967868-88aa4486c946",
];

const reasons = [
  "Because no matter what happens, you never leave my side.",
  "Because you've sacrificed so much for me without expecting anything in return.",
  "Because your confidence inspires me to be more confident in myself.",
  "Because I admire the way you stand up for yourself and the people you love.",
  "Because your attitude towards life is strong, positive, and fearless.",
  "Because you're kind-hearted, yet you know exactly when to be strong.",
  "Because you've always believed in me, even during the times I couldn't believe in myself.",
  "Because your character is beautiful—not just how you look, but who you are as a person.",
  "Because you make me want to become a better man every single day.",
  "Because despite all my flaws, mistakes, and imperfections, you still choose me and love me wholeheartedly. ❤️",
  "Because your smile is the brightest part of my day, no matter how tough things get.",
  "Because loving you is the easiest, most natural, and most beautiful thing I have ever done.",
];

const POP_GLYPHS = ["🌸", "💖", "🌷", "💕", "🌹", "💗", "🌼", "❤️", "💐", "✨", "🌺"];

export default function Home() {
  const preRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [btnLabel, setBtnLabel] = useState("Click Me, Birthday Girl 🎵");
  const [playing, setPlaying] = useState(false);

  /* spawn a spray of flower/heart particles into a container */
  function spawnPops(
    container: HTMLElement,
    count: number,
    opts: { x?: number; y?: number; fixed?: boolean; maxDist: number; lifeMs: number },
  ) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "pop";
      p.textContent = POP_GLYPHS[Math.floor(Math.random() * POP_GLYPHS.length)];
      if (opts.fixed) {
        p.style.position = "fixed";
        p.style.left = `${opts.x}px`;
        p.style.top = `${opts.y}px`;
        p.style.zIndex = "70";
      }
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * opts.maxDist;
      p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      p.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
      p.style.setProperty("--sc", (0.8 + Math.random() * 1.3).toFixed(2));
      p.style.fontSize = `${16 + Math.random() * 24}px`;
      p.style.animationDelay = `${(Math.random() * 0.35).toFixed(2)}s`;
      container.appendChild(p);
      const node = p;
      window.setTimeout(() => node.remove(), opts.lifeMs);
    }
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* floating hearts */
    const heartsLayer = heartsRef.current;
    if (heartsLayer) {
      heartsLayer.innerHTML = "";
      const glyphs = ["❤", "💕", "🌸", "💗", "🤍"];
      const count = window.innerWidth < 600 ? 14 : 24;
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        s.style.left = `${Math.random() * 100}vw`;
        s.style.fontSize = `${12 + Math.random() * 22}px`;
        s.style.animationDuration = `${10 + Math.random() * 14}s`;
        s.style.animationDelay = `${Math.random() * 16}s`;
        heartsLayer.appendChild(s);
      }
    }

    /* opening burst */
    function runBurst() {
      const layer = burstRef.current;
      if (!layer) return;
      const total = window.innerWidth < 600 ? 36 : 60;
      spawnPops(layer, total, {
        maxDist: Math.max(window.innerWidth, window.innerHeight) * 0.55,
        lifeMs: 2100,
      });
    }

    /* preloader → reveal → burst */
    const hold = reduce ? 600 : 2800;
    const t = window.setTimeout(() => {
      preRef.current?.classList.add("hide");
      if (!reduce) runBurst();
    }, hold);

    /* reveal-on-scroll */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  /* Click Me: music + celebration burst */
  function handleClickMe(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    spawnPops(document.body, window.innerWidth < 600 ? 26 : 40, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      fixed: true,
      maxDist: 360,
      lifeMs: 2000,
    });

    const song = audioRef.current;
    if (!song) return;

    if (song.paused) {
      song.volume = 0;
      const playPromise = song.play();
      if (playPromise && playPromise.then) {
        playPromise
          .then(() => {
            let v = 0;
            const fade = window.setInterval(() => {
              v = Math.min(0.75, v + 0.05);
              song.volume = v;
              if (v >= 0.75) window.clearInterval(fade);
            }, 80);
            setPlaying(true);
            setBtnLabel("Pause the Music ⏸");
          })
          .catch(() => setBtnLabel("Tap again to play 🎵"));
      }
    } else {
      song.pause();
      setPlaying(false);
      setBtnLabel("Play Our Song 🎵");
    }
  }

  const fallbackImg = (e: React.SyntheticEvent<HTMLImageElement>, id: string, w = 500) => {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = `https://images.unsplash.com/${id}?w=${w}&q=80`;
  };

  return (
    <>
      {/* preloader */}
      <div id="preloader" ref={preRef}>
        <div className="pl-heart">❤️</div>
        <p className="pl-quote">
          Roses are red,<br />violets are blue,<br />I am so lucky<br />to have you.
        </p>
        <div className="pl-dots"><span></span><span></span><span></span></div>
      </div>

      {/* opening burst layer */}
      <div id="burst" ref={burstRef} aria-hidden="true"></div>

      {/* floating hearts */}
      <div className="hearts" ref={heartsRef} aria-hidden="true"></div>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-card reveal">
          <div className="hero-top">
            <div className="hero-side">
              <span className="arrow">↓</span>
              <span>SCROLL DOWN</span>
            </div>
            <p className="eyebrow">Happy Birthday, My Love</p>
            <div className="hero-year">2026<br /><small>FOREVER</small></div>
          </div>

          <h1>HAPPY<br />BIRTHDAY ❤️</h1>
          <p className="sub">Every day with you is my favorite day.</p>

          <div className="polaroids">
            <figure className="polaroid p1">
              <img src="/photos/1.jpg" alt="Us" onError={(e) => fallbackImg(e, "photo-1518199266791-5375a83190b7")} />
            </figure>
            <figure className="polaroid p2">
              <img src="/photos/us.jpg" alt="Us" onError={(e) => fallbackImg(e, "photo-1522202176988-66273c2fd55f")} />
              <span className="tape"></span>
            </figure>
            <figure className="polaroid p3">
              <img src="/photos/2.jpg" alt="Us" onError={(e) => fallbackImg(e, "photo-1494774157365-9e04c6720e47")} />
            </figure>
            <span className="hero-script">my love</span>
          </div>

          <p className="hero-caption">— OUR FAVORITE MOMENTS —</p>
          <button
            className={`click-me${playing ? " playing" : ""}`}
            onClick={handleClickMe}
          >
            {btnLabel}
          </button>
        </div>
      </section>

      {/* background music */}
      <audio ref={audioRef} src="/music/perfect.mp3" loop preload="auto" />

      {/* ===== PHOTO MEMORIES ===== */}
      <section>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="script">Our Memories</span>
            <p>A few of my favorite moments with you</p>
          </div>
          <div className="gallery">
            {photos.map((p, i) => (
              <div className="photo-card reveal" key={i}>
                <img
                  src={`/photos/${i + 1}.jpg`}
                  alt={p.cap}
                  loading="lazy"
                  onError={(e) => fallbackImg(e, fallbacks[i % fallbacks.length], 600)}
                />
                <div className="cap">
                  <span>{p.cap}</span>
                  <p>{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BIRTHDAY MESSAGE ===== */}
      <section>
        <div className="wrap">
          <div className="letter reveal">
            <h3>A Little Letter For You</h3>
            <p>My love,</p>
            <p>
              Write your heartfelt message here. Tell her how she makes your world
              brighter, how grateful you are for every laugh, every quiet moment, and
              every adventure you&apos;ve shared. Speak from your heart — she&apos;ll
              feel every word.
            </p>
            <p>
              On your birthday, I just want you to know how deeply loved you are, today
              and always.
            </p>
            <p className="sign">— Forever yours 💕</p>
          </div>
        </div>
      </section>

      {/* ===== REASONS I LOVE YOU ===== */}
      <section>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="script">Reasons I Love You</span>
            <p>And honestly, there are countless more</p>
          </div>
          <div className="reasons">
            {reasons.map((text, i) => (
              <div className="reason reveal" key={i}>
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL ===== */}
      <section className="final">
        <div className="wrap reveal">
          <h2>Thank you for being part of my life.</h2>
          <span className="script">I love you forever ❤️</span>
          <div className="big-heart">❤️</div>
        </div>
      </section>

      <footer>Made with love, just for you. 🎂✨</footer>
    </>
  );
}
