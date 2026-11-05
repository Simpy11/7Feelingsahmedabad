import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownWideNarrow, ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronDown, ChevronLeft,
  ChevronRight, Clock3, Heart, Home as HomeIcon, Instagram, Menu, Minus, Plus, Search,
  ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound, X,
} from 'lucide-react';
import { Link, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { campaignImages, categories, products } from './catalog.js';
import logo from '../logo/WhatsApp Image 2026-11-04 at 13.59.08.jpeg?url';

const StoreContext = createContext(null);
const STORAGE = { cart: '7f-cart', wishlist: '7f-wishlist', application: '7f-application', approved: '7f-approved', demoSession: '7f-demo-session' };
const readStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
};

function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(STORAGE.cart, []));
  const [wishlist, setWishlist] = useState(() => readStorage(STORAGE.wishlist, []));
  const [application, setApplication] = useState(() => readStorage(STORAGE.application, null));
  const [approved, setApproved] = useState(() => readStorage(STORAGE.approved, false));
  const [demoSession, setDemoSession] = useState(() => readStorage(STORAGE.demoSession, false));
  const [toast, setToast] = useState('');
  const [quickView, setQuickView] = useState(null);
  useEffect(() => localStorage.setItem(STORAGE.cart, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(STORAGE.wishlist, JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem(STORAGE.application, JSON.stringify(application)), [application]);
  useEffect(() => localStorage.setItem(STORAGE.approved, JSON.stringify(approved)), [approved]);
  useEffect(() => localStorage.setItem(STORAGE.demoSession, JSON.stringify(demoSession)), [demoSession]);
  const value = {
    cart, wishlist, application, approved, demoSession, setDemoSession, toast, setToast, quickView, setQuickView, setApplication, setApproved,
    addCart(product, color, sets) {
      setCart((items) => {
        const key = `${product.id}-${color}`;
        const found = items.find((item) => item.key === key);
        return found
          ? items.map((item) => item.key === key ? { ...item, sets: item.sets + sets } : item)
          : [...items, { key, productId: product.id, color, sets }];
      });
    },
    setCartSets(key, sets) {
      setCart((items) => items.map((item) => item.key === key ? { ...item, sets } : item).filter((item) => item.sets > 0));
      if (sets < 1) setToast('Style removed from your enquiry');
    },
    removeCart(key) {
      setCart((items) => items.filter((item) => item.key !== key));
      setToast('Style removed from your enquiry');
    },
    toggleWishlist(id) {
      const saved = wishlist.includes(id);
      setWishlist((items) => saved ? items.filter((item) => item !== id) : [...items, id]);
      setToast(saved ? 'Removed from your wishlist' : 'Saved to your wishlist');
    },
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

const useStore = () => useContext(StoreContext);

function App() {
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <StoreProvider>
      <div className="announcement"><span>AHMEDABAD · GUJARAT</span><span>Wholesale fashion, made for your boutique</span><span>B2B · Setwise ordering</span></div>
      <div className="sticky-shell">
        <Header search={search} setSearch={setSearch} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
        <Navigation mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileNavigation />
      <Toast />
      <QuickViewOverlay />
    </StoreProvider>
  );
}

function Header({ search, setSearch, mobileMenu, setMobileMenu }) {
  const navigate = useNavigate();
  const { cart, wishlist } = useStore();
  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/collection${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);
  };
  return (
    <header className="header container">
      <button className="icon-button mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
      <Link to="/" className="brand" aria-label="7Feelings home"><img src={logo} alt="7Feelings" /><span>AHMEDABAD</span></Link>
      <form className="searchbox" onSubmit={submitSearch}>
        <Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search styles, prints, or catalogue references..." aria-label="Search products" /><button aria-label="Submit search"><ArrowRight size={18} /></button>
      </form>
      <div className="header-actions">
        <Link to="/register?mode=login" className="header-link"><span className="action-icon"><UserRound size={20} /></span><span>Retailer</span></Link>
        <Link to="/wishlist" className="header-link"><span className="action-icon"><Heart size={20} /></span><span>Wishlist</span>{wishlist.length > 0 && <b className="count">{wishlist.length}</b>}</Link>
        <Link to="/cart" className="header-link"><span className="action-icon"><ShoppingBag size={20} /></span><span>Enquiry cart</span>{cart.length > 0 && <b className="count">{cart.length}</b>}</Link>
        <Link to="/register?mode=login" className="button button-small">Retailer sign in <ArrowRight size={15} /></Link>
      </div>
    </header>
  );
}

function Navigation({ mobileMenu, setMobileMenu }) {
  const links = [['New collection', '/collection'], ['Kurtis & ethnic wear', '/collection?category=Kurtis%20%26%20ethnic%20wear'], ['Printed styles', '/collection?q=printed'], ['Our story', '/about']];
  return <nav className={`navigation ${mobileMenu ? 'navigation-open' : ''}`}><div className="container nav-inner">
    {links.map(([label, to]) => <div className={`nav-item ${label === 'Kurtis & ethnic wear' ? 'has-dropdown' : ''}`} key={label}>
      <NavLink to={to} onClick={() => setMobileMenu(false)}>{label}{label === 'Kurtis & ethnic wear' && <ChevronDown size={14} />}</NavLink>
      {label === 'Kurtis & ethnic wear' && <div className="nav-dropdown"><Link to="/collection?category=Kurtis%20%26%20ethnic%20wear">All ethnic wear <ArrowRight size={14} /></Link><Link to="/collection?q=printed">Printed styles <ArrowRight size={14} /></Link><span>Product details confirmed with our team</span></div>}
    </div>)}
    <Link to="/register" className="nav-cta" onClick={() => setMobileMenu(false)}>Wholesale enquiries <ArrowRight size={15} /></Link>
  </div></nav>;
}

function Home() {
  const edits = [
    { id: 'new-lookbook', eyebrow: 'A FRESH LOOK AT THE CATALOGUE', title: 'New to the lookbook', items: products.slice(0, 10) },
    { id: 'print-styles', eyebrow: 'PRINTS & DETAILS', title: 'Printed styles', items: products.filter((product) => product.image).slice(12, 22) },
    { id: 'explore-ethnic', eyebrow: 'EXPLORE THE SUPPLIED COLLECTION', title: 'Ethnic wear, your way', items: products.slice(28, 38) },
  ];
  return <>
    <section className="hero container">
      <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> MADE IN AHMEDABAD · FOR BOUTIQUES EVERYWHERE</span><h1>Elegance in <em>Every Thread</em></h1><p>Discover exclusive women's ethnic collections, crafted for retailers and boutiques.</p><div className="hero-actions"><Link to="/collection" className="button">Explore Collection <ArrowRight size={17} /></Link><Link to="/register" className="text-link">Become a Retailer <ChevronRight size={16} /></Link></div><div className="hero-proof"><span><BadgeCheck size={17} /> Manufacturer & wholesaler</span><span><Truck size={17} /> Pan-India B2B supply</span></div></div>
      <div className="hero-visual"><div className="hero-image-main"><img src={campaignImages[0]} alt="7Feelings ethnic fashion campaign" /></div><div className="hero-image-inset"><img src={campaignImages[2]} alt="Colourful 7Feelings collection" /></div><div className="hero-stamp"><span>STYLE</span><b>with<br />feeling</b><span>7F · AHMEDABAD</span></div><div className="hero-caption">A new season, woven with colour <ArrowRight size={15} /></div></div>
      <div className="hero-number">01 <span>/</span> 03</div>
    </section>
    <section className="trust-strip"><div className="container trust-inner"><span><Sparkles /> Curated ethnic collections</span><span><ShieldCheck /> Quality-led craftsmanship</span><span><ShoppingBag /> Setwise wholesale ordering</span><span><Truck /> Proudly based in Ahmedabad</span></div></section>
    <section className="section container"><SectionHeading eyebrow="FIND YOUR NEXT FAVOURITE" title="Explore the collection" action="View all styles" to="/collection" /><div className="category-grid">{categories.map((category, index) => <Link to={`/collection?category=${encodeURIComponent(category.name)}`} className={`category-card category-${index}`} key={category.name}><img src={category.image} alt="" /><span className="category-overlay" /><span className="category-text"><small>VISUAL CATALOGUE · CONFIRM DETAILS</small><b>{category.name}</b><span>Explore collection <ArrowRight size={14} /></span></span></Link>)}</div></section>
    {edits.map((edit, index) => <section className={`section carousel-section ${index % 2 ? 'section-tint' : ''}`} key={edit.id}><div className="container"><ProductCarousel {...edit} /></div></section>)}
    <section className="feature-band container"><div className="feature-photo"><img src={campaignImages[1]} alt="7Feelings collection lookbook" /><span>THE 7FEELINGS PROMISE</span></div><div className="feature-copy"><span className="eyebrow">A PARTNER FOR YOUR BOUTIQUE</span><h2>Good style is better when it’s <em>shared.</em></h2><p>We’re an Ahmedabad-based women’s wear manufacturer and wholesaler, bringing thoughtfully designed ethnic styles to retailers across India.</p><div className="feature-list"><span><Check /> Trend-conscious collections</span><span><Check /> Setwise ordering for retailers</span><span><Check /> A real team, right here in Ahmedabad</span></div><Link to="/about" className="text-link">Get to know us <ArrowRight size={16} /></Link></div></section>
    <section className="cta-panel container"><div><span className="eyebrow">YOUR NEXT COLLECTION STARTS HERE</span><h2>Retail with <em>feeling.</em></h2><p>Tell us about your business and our team will help you find the right styles and wholesale details.</p></div><Link className="button button-light" to="/register">Start a wholesale enquiry <ArrowRight size={17} /></Link><span className="cta-watermark">7F</span></section>
  </>;
}

function SectionHeading({ eyebrow, title, action, to }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <Link to={to} className="text-link">{action} <ArrowRight size={15} /></Link>}</div>;
}

function ProductGrid({ items, onQuickView }) {
  const { wishlist, toggleWishlist, setQuickView } = useStore();
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} saved={wishlist.includes(product.id)} onWishlist={() => toggleWishlist(product.id)} onQuickView={() => (onQuickView ?? setQuickView)(product)} />)}</div>;
}

function ProductCarousel({ eyebrow, title, items, id }) {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);
  const slider = React.useRef(null);
  const { setQuickView } = useStore();
  const updateArrows = () => {
    const element = slider.current;
    if (!element) return;
    setCanGoBack(element.scrollLeft > 2);
    setCanGoForward(element.scrollLeft + element.clientWidth < element.scrollWidth - 2);
  };
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [items.length]);
  const scroll = (direction) => slider.current?.scrollBy({ left: direction * slider.current.clientWidth * 0.82, behavior: 'smooth' });
  return <div className="carousel-shell">
    <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p className="carousel-note">Catalogue imagery only · Confirm product details with our team</p></div><div className="carousel-controls"><button type="button" onClick={() => scroll(-1)} disabled={!canGoBack} aria-label={`Scroll ${title} backwards`}><ChevronLeft /></button><button type="button" onClick={() => scroll(1)} disabled={!canGoForward} aria-label={`Scroll ${title} forwards`}><ChevronRight /></button><Link to="/collection" className="text-link">View all <ArrowRight size={15} /></Link></div></div>
    <div className="carousel-track" id={id} ref={slider} onScroll={updateArrows}><ProductGrid items={items} onQuickView={setQuickView} /></div>
  </div>;
}

function ProductCard({ product, saved, onWishlist, onQuickView }) {
  const { approved } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageLabel = `7Feelings catalogue style ${product.code}`;
  return <article className="product-card">
    <div className={`product-image ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}><img src={product.image} alt={imageLabel} loading="lazy" onLoad={() => setImageLoaded(true)} /></Link>
      <button type="button" className={`wishlist-button ${saved ? 'saved' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} onClick={onWishlist}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
      <span className="product-tag">THE COLLECTION</span>
      <button type="button" className="quick-view-button" onClick={onQuickView}><Search size={15} /> Quick view</button>
    </div>
    <div className="product-info">
      <span className="product-type">KURTA · ETHNIC WEAR</span>
      <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
      <span className="product-code">{product.code} <i>· demo reference</i></span>
      <div className="product-facts"><span>Fabric <b>Confirm with team</b></span><span>Sizes <b>Confirm with team</b></span><span>Colours <b>Confirm with team</b></span><span>Set quantity <b>Complete sets · confirm pack</b></span></div>
      <div className="product-foot"><span>{approved ? 'Wholesale price on enquiry' : 'Price for approved retailers'}</span><Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}><ArrowRight size={17} /></Link></div>
    </div>
  </article>;
}

function Collection() {
  const [params, setParams] = useSearchParams();
  const [type, setType] = useState('All styles');
  const [sort, setSort] = useState('featured');
  const search = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const [collectionSearch, setCollectionSearch] = useState(search);
  useEffect(() => setCollectionSearch(search), [search]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let items = products.filter((p) => {
      const matchesQuery = !query || [p.name, p.code, p.category, p.fabric, p.color, p.searchTerms].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = !category || category.toLowerCase().includes('kurtis') || category.toLowerCase().includes('printed') || category.toLowerCase().includes('colourful');
      const matchesType = type === 'All styles' || p.type === type;
      return matchesQuery && matchesCategory && matchesType;
    });
    if (sort === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'code') items = [...items].sort((a, b) => a.code.localeCompare(b.code));
    if (sort === 'code-desc') items = [...items].sort((a, b) => b.code.localeCompare(a.code));
    return items;
  }, [search, category, type, sort]);
  return <div className="container page-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} /> Collection</div><div className="listing-title"><div><span className="eyebrow">THE 7FEELINGS CATALOGUE</span><h1>{search ? `Results for “${search}”` : category || 'Explore the collection'}</h1><p>Browse visual references from our supplied collection. Confirm availability, fabric, set details and wholesale pricing with our team.</p></div><form className="listing-search" onSubmit={(event) => { event.preventDefault(); const query = collectionSearch.trim(); setParams(query ? { q: query } : {}); }}><Search size={18} /><input value={collectionSearch} onChange={(event) => setCollectionSearch(event.target.value)} placeholder="Search styles or reference..." /><button aria-label="Search collection"><ArrowRight size={17} /></button></form></div>
    <div className="listing-layout"><aside className="filter-panel"><div className="filter-heading">REFINE THE EDIT <ArrowDownWideNarrow size={16} /></div><label className="filter-label">Category</label><button type="button" className={`filter-option ${!category && !search ? 'active' : ''}`} onClick={() => { setParams({}); setType('All styles'); }}><span>Kurtis & ethnic wear</span><span>{products.length}</span></button><button type="button" className={`filter-option ${search === 'printed' ? 'active' : ''}`} onClick={() => { setParams({ q: 'printed' }); setType('All styles'); }}><span>Printed styles</span><ChevronRight size={15} /></button><div className="filter-divider" /><label className="filter-label" htmlFor="type-filter">Product type</label><select id="type-filter" value={type} onChange={(event) => setType(event.target.value)}><option>All styles</option><option>Kurta / ethnic wear</option></select><div className="filter-divider" /><div className="filter-note"><ShieldCheck size={17} /><span>Wholesale pricing is shared with approved retailers. Apply to learn more.</span><Link to="/register">Retailer access <ArrowRight size={14} /></Link></div></aside><div className="listing-results"><div className="result-toolbar"><span><b>{filtered.length}</b> catalogue references <span className="result-note">· details confirmed on enquiry</span></span><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="code">Reference code: low to high</option><option value="code-desc">Reference code: high to low</option></select></label></div>{filtered.length ? <ProductGrid items={filtered} /> : <EmptyState title="No styles found" text="Try another search or browse the full collection." action={<button type="button" className="button" onClick={() => { setParams({}); setType('All styles'); }}>View all styles</button>} />}</div></div></div>;
}

function ProductPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const [sets, setSets] = useState(1);
  const [added, setAdded] = useState(false);
  const { addCart, wishlist, toggleWishlist, setToast } = useStore();
  if (!product) return <NotFound />;
  const saved = wishlist.includes(product.id);
  return <div className="container page-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} /><Link to="/collection">Collection</Link><ChevronRight size={14} />{product.code}</div><div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.name} /><span>7FEELINGS · CATALOGUE REFERENCE</span></div><div className="detail-copy"><span className="eyebrow">KURTA · ETHNIC WEAR</span><h1>{product.name}</h1><span className="detail-sku">Reference {product.code} <span>· demo code</span></span><div className="detail-rule" /><div className="confirm-banner"><ShieldCheck size={18} /><div><b>Let’s confirm the details together</b><span>This image is from the supplied catalogue. Exact style, inventory and specifications are confirmed by our team.</span></div></div><p className="detail-description">{product.description}</p><div className="spec-grid"><div><small>FABRIC</small><span>Confirm with team</span></div><div><small>AVAILABLE SIZES</small><span>Confirm with team</span></div><div><small>COLOUR OPTIONS</small><span>Confirm with team</span></div><div><small>SET CONTENTS</small><span>Confirm with team</span></div><div><small>MINIMUM ORDER</small><span>Confirm with team</span></div><div><small>WHOLESALE PRICE</small><span>For approved retailers</span></div></div><label className="sets-label" htmlFor="set-count">Number of complete sets <span>Set composition to be confirmed before order</span></label><div className="quantity-control"><button aria-label="Decrease set quantity" onClick={() => setSets(Math.max(1, sets - 1))}><Minus size={16} /></button><span>{sets}</span><button aria-label="Increase set quantity" onClick={() => setSets(sets + 1)}><Plus size={16} /></button><b>set{sets > 1 ? 's' : ''}</b></div><div className="detail-actions"><button className="button" onClick={() => { addCart(product, 'Confirm with team', sets); setAdded(true); setToast(`${sets} complete set${sets > 1 ? 's' : ''} added to your enquiry`); }}>{added ? <><Check size={17} /> Added to enquiry</> : <>Add to enquiry <ArrowRight size={17} /></>}</button><button className={`button-outline ${saved ? 'saved' : ''}`} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save style'}</button></div><p className="fine-print"><ShieldCheck size={14} /> Your enquiry is not an order. Our team confirms set composition, availability and pricing.</p></div></div><section className="section related-section"><SectionHeading eyebrow="KEEP EXPLORING" title="More from the collection" action="See all styles" to="/collection" /><ProductGrid items={products.filter((item) => item.id !== product.id).slice(0, 4)} /></section></div>;
}

function Register() {
  const { application, setApplication, approved, setApproved, demoSession, setDemoSession, setToast } = useStore();
  const [params, setParams] = useSearchParams();
  const loginMode = params.get('mode') === 'login';
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const docs = ['visitingCard', 'businessProof'].map((key) => formData.get(key)?.name).filter(Boolean);
    const record = { ...values, visitingCard: docs[0] ?? '', businessProof: docs[1] ?? '', status: 'Pending approval', submittedAt: new Date().toISOString() };
    setApplication(record);
    setApproved(false);
    setDemoSession(false);
    setSubmitted(true);
    setError('');
    setToast('Retailer application saved as pending approval');
  };
  const submitLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('loginEmail') ?? '').trim().toLowerCase();
    const mobile = String(formData.get('loginMobile') ?? '').replace(/\D/g, '');
    const applicationEmail = String(application?.email ?? '').trim().toLowerCase();
    const applicationMobile = String(application?.mobile ?? '').replace(/\D/g, '');
    if (!application || email !== applicationEmail || mobile !== applicationMobile) {
      setLoginError('No matching demo retailer application was found. Check your details or register first.');
      setToast('Demo sign-in details did not match');
      setDemoSession(false);
      return;
    }
    if (!approved) {
      setLoginError('Your retailer application is still pending approval.');
      setToast('Your application is still pending approval');
      setDemoSession(false);
      return;
    }
    setLoginError('');
    setDemoSession(true);
    setToast('Demo retailer sign-in successful');
  };
  return <div className="container page-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} />Retailer registration</div><div className="registration-layout"><div className="registration-intro"><span className="eyebrow">FOR BOUTIQUES & FASHION RETAILERS</span><h1>Let’s make something <em>beautiful.</em></h1><p>Tell us a little about your business. Our Ahmedabad team will follow up to discuss the collection and wholesale terms.</p><div className="registration-benefits"><span><Check /> Wholesale collection access</span><span><Check /> Setwise ordering details</span><span><Check /> A personal introduction to our team</span></div><div className="demo-notice"><ShieldCheck size={18} /><span><b>Frontend demonstration</b>This form is a local demo only. It does not send your information to 7Feelings.</span></div></div><div className="registration-form-wrap"><div className="registration-tabs"><button type="button" className={`registration-tab ${!loginMode ? 'active' : ''}`} onClick={() => { setParams({}); setLoginError(''); }}>Retailer registration</button><button type="button" className={`registration-tab ${loginMode ? 'active' : ''}`} onClick={() => { setParams({ mode: 'login' }); setLoginError(''); }}>Retailer sign in</button></div>{loginMode ? <><h2>Retailer demo sign in</h2><p>Use the email and mobile number from your local demo application.</p>{demoSession && <div className="demo-notice login-notice"><ShieldCheck size={18} /><span><b>Signed in for this demo</b>Your demo retailer session is active on this browser. No real account service is connected.</span><button type="button" className="text-link" onClick={() => { setDemoSession(false); setToast('Demo retailer signed out'); }}>Sign out</button></div>}<form className="registration-form" onSubmit={submitLogin}><div className="form-grid"><FormField label="Email address" name="loginEmail" required type="email" /><FormField label="Mobile number" name="loginMobile" required pattern="[0-9+ ]{8,16}" type="tel" /></div>{loginError && <span className="form-error" role="alert">{loginError}</span>}<button className="button form-submit">Sign in to demo account <ArrowRight size={17} /></button><small className="privacy-note"><ShieldCheck size={14} /> Demo-only sign in uses your browser-stored retailer application.</small></form><button type="button" className="form-reset register-switch" onClick={() => { setParams({}); setLoginError(''); }}>New retailer? Register here</button></> : <><h2>Retailer application</h2><p>All information is saved in this browser only.</p>{submitted || application ? <div className="application-status"><div className="status-icon"><Clock3 /></div><span className="eyebrow">APPLICATION STATUS</span><h3>{approved ? 'Retailer access enabled' : 'Your application is pending'}</h3><p>{approved ? 'Demo approval is active in this browser. Wholesale prices remain hidden because verified prices were not provided.' : 'Thanks for your interest. Your demo application is saved locally. This is not a real verification or approval.'}</p><div className="status-chip"><span />{approved ? 'Demo approved' : 'Pending approval'}</div><div className="demo-approval"><b>Demo approval controls</b><span>Use these controls to preview the retailer experience. No real review takes place.</span><div><button type="button" className="button button-small" onClick={() => { setApproved(true); setToast('Demo retailer application approved'); }}>Approve demo</button><button type="button" className="text-link" onClick={() => { setApproved(false); setDemoSession(false); setToast('Demo application reset to pending'); }}>Reset to pending</button></div></div><button type="button" className="form-reset" onClick={() => { setApplication(null); setApproved(false); setDemoSession(false); setSubmitted(false); setToast('Demo application cleared'); }}>Submit another application</button></div> : <form className="registration-form" onSubmit={submit} onInvalid={() => setError('Please complete all required fields.')}><div className="form-grid"><FormField label="Business name" name="businessName" required /><FormField label="Owner name" name="ownerName" required /><FormField label="Mobile number" name="mobile" required pattern="[0-9+ ]{8,16}" type="tel" /><FormField label="WhatsApp number" name="whatsapp" required pattern="[0-9+ ]{8,16}" type="tel" /><FormField label="Email address" name="email" required type="email" /><FormField label="State" name="state" required /><FormField label="City" name="city" required /><FormField label="Business type" name="businessType" required select options={['Boutique', 'Retail store', 'Online retailer', 'Distributor', 'Other']} /><label className="form-field full-field"><span>Full business address *</span><textarea name="address" required rows="3" /></label><FormField label="GST number (optional)" name="gst" /><label className="form-field"><span>Upload visiting card (optional)</span><input type="file" name="visitingCard" accept="image/*,.pdf" /></label><label className="form-field full-field"><span>Upload business / address proof (optional)</span><input type="file" name="businessProof" accept="image/*,.pdf" /></label></div>{error && <span className="form-error" role="alert">{error}</span>}<button className="button form-submit">Submit retailer application <ArrowRight size={17} /></button><small className="privacy-note"><ShieldCheck size={14} /> Demo only. Files are not uploaded or transmitted.</small></form>}</>}</div></div></div>;
}

function FormField({ label, name, required, type = 'text', pattern, select, options }) {
  return <label className="form-field"><span>{label}{required && ' *'}</span>{select ? <select name={name} required={required}><option value="">Select type</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input name={name} type={type} pattern={pattern} required={required} />}</label>;
}

function Cart() {
  const { cart, setCartSets, removeCart, approved } = useStore();
  const items = cart.map((entry) => ({ ...entry, product: products.find((product) => product.id === entry.productId) })).filter((entry) => entry.product);
  return <div className="container page-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} />Enquiry cart</div><div className="page-title"><span className="eyebrow">WHOLESALE ENQUIRY</span><h1>Your collection shortlist</h1><p>Choose the styles you’d like to discuss with our team.</p></div>{items.length ? <div className="cart-layout"><div className="cart-items">{items.map(({ key, product, color, sets }) => <article className="cart-item" key={key}><Link to={`/product/${product.id}`} className="cart-thumb"><img src={product.image} alt="" /></Link><div className="cart-item-info"><span className="product-type">{product.code}</span><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link><span className="cart-meta">Colour: confirm with team · Composition: confirm with team</span><span className="cart-meta">Complete sets only · Pieces per set confirmed on enquiry</span></div><div className="cart-item-actions"><div className="quantity-control compact"><button aria-label="Remove one set" onClick={() => setCartSets(key, sets - 1)}><Minus size={14} /></button><span>{sets}</span><button aria-label="Add one set" onClick={() => setCartSets(key, sets + 1)}><Plus size={14} /></button></div><b>set{sets > 1 ? 's' : ''}</b><button className="remove-link" onClick={() => removeCart(key)}>Remove</button></div></article>)}</div><aside className="order-summary"><span className="eyebrow">ENQUIRY SUMMARY</span><h2>Your shortlist</h2><div className="summary-row"><span>Styles selected</span><b>{items.length}</b></div><div className="summary-row"><span>Total sets requested</span><b>{items.reduce((sum, item) => sum + item.sets, 0)}</b></div><div className="summary-row"><span>Pieces / pack details</span><b>On enquiry</b></div><div className="summary-total"><span>Wholesale pricing</span><b>{approved ? 'Confirmed with team' : 'For approved retailers'}</b></div><Link to="/register" className="button summary-button">Request wholesale details <ArrowRight size={17} /></Link><p><ShieldCheck size={14} /> No order is placed and no payment is taken on this demo.</p></aside></div> : <EmptyState title="Your shortlist is waiting" text="Save a few styles to start a wholesale enquiry." action={<Link to="/collection" className="button">Explore the collection <ArrowRight size={16} /></Link>} />}</div>;
}

function Wishlist() {
  const { wishlist, toggleWishlist } = useStore();
  const saved = wishlist.map((id) => products.find((item) => item.id === id)).filter(Boolean);
  return <div className="container page-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} />Wishlist</div><div className="page-title"><span className="eyebrow">YOUR SAVED EDIT</span><h1>Styles to come back to</h1><p>Keep a shortlist of visual references for your next collection enquiry.</p></div>{saved.length ? <ProductGrid items={saved} /> : <EmptyState title="No saved styles just yet" text="Tap the heart on any catalogue style to keep it here." action={<Link to="/collection" className="button">Explore styles <ArrowRight size={16} /></Link>} />}</div>;
}

function MobileNavigation() {
  const { cart, wishlist } = useStore();
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
    <NavLink to="/" end><HomeIcon /><span>Home</span></NavLink>
    <NavLink to="/collection"><Search /><span>Explore</span></NavLink>
    <NavLink to="/wishlist"><span className="mobile-nav-icon"><Heart />{wishlist.length > 0 && <b>{wishlist.length}</b>}</span><span>Saved</span></NavLink>
    <NavLink to="/cart"><span className="mobile-nav-icon"><ShoppingBag />{cart.length > 0 && <b>{cart.length}</b>}</span><span>Enquiry</span></NavLink>
    <NavLink to="/register"><UserRound /><span>Retailer</span></NavLink>
  </nav>;
}

function Toast() {
  const { toast, setToast } = useStore();
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast, setToast]);
  if (!toast) return null;
  return <div className="toast-message" role="status"><Check size={17} />{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></div>;
}

function QuickViewOverlay() {
  const { quickView, setQuickView } = useStore();
  if (!quickView) return null;
  return <QuickView product={quickView} onClose={() => setQuickView(null)} />;
}

function QuickView({ product, onClose }) {
  const [sets, setSets] = useState(1);
  const { addCart, setToast } = useStore();
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <div className="quick-view-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="quick-view-dialog" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
      <button className="quick-view-close" onClick={onClose} aria-label="Close quick view"><X /></button>
      <div className="quick-view-photo"><img src={product.image} alt={`7Feelings catalogue style ${product.code}`} /></div>
      <div className="quick-view-content"><span className="eyebrow">VISUAL CATALOGUE REFERENCE</span><h2 id="quick-view-title">{product.name}</h2><span className="detail-sku">{product.code} · demo reference only</span><p>Confirm fabric, colours, sizes, availability and the style’s own set composition with the 7Feelings team.</p><div className="quick-view-specs"><span>Fabric <b>Confirm with team</b></span><span>Sizes <b>Confirm with team</b></span><span>Colours <b>Confirm with team</b></span><span>Wholesale price <b>For approved retailers</b></span></div><label className="sets-label">Complete sets <span>Set contents and minimum order confirmed on enquiry</span></label><div className="quantity-control"><button aria-label="Decrease set quantity" onClick={() => setSets(Math.max(1, sets - 1))}><Minus size={16} /></button><span>{sets}</span><button aria-label="Increase set quantity" onClick={() => setSets(sets + 1)}><Plus size={16} /></button><b>set{sets > 1 ? 's' : ''}</b></div><div className="quick-view-actions"><button className="button" onClick={() => { addCart(product, 'Confirm with team', sets); setToast(`${sets} complete set${sets > 1 ? 's' : ''} added to your enquiry`); onClose(); }}>Add to enquiry <ArrowRight size={16} /></button><Link className="button-outline" to={`/product/${product.id}`} onClick={onClose}>Full details</Link></div></div>
    </section>
  </div>;
}

function EmptyState({ title, text, action }) {
  return <div className="empty-state"><div><ShoppingBag /></div><h2>{title}</h2><p>{text}</p>{action}</div>;
}

function About() {
  return <div className="container page-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14} />About 7Feelings</div><section className="about-hero"><div><span className="eyebrow">A LITTLE ABOUT US</span><h1>Made with care.<br /><em>Worn with feeling.</em></h1><p>7Feelings Apparel Private Limited is a women’s wear manufacturer and B2B wholesaler based in Ahmedabad, Gujarat. We work with boutiques and fashion retailers to bring expressive ethnic styles to their customers.</p><Link to="/collection" className="button">Explore our catalogue <ArrowRight size={17} /></Link></div><img src={campaignImages[2]} alt="7Feelings fashion campaign" /></section><section className="contact-section"><div><span className="eyebrow">COME SAY HELLO</span><h2>From Ahmedabad,<br />with feeling.</h2><p>A-604, Sakar Raj Residency,<br />Near Safal Estate, Kathwada,<br />Ahmedabad, Gujarat – 382430</p><div className="hours"><Clock3 size={17} /><span>Monday–Friday: 9:30 AM–8:00 PM<br />Saturday: 9:30 AM–6:00 PM<br />Sunday: Closed</span></div></div><div className="contact-card"><span className="eyebrow">LET’S TALK WHOLESALE</span><h3>Our team is here to help.</h3><p>Connect with us about the collection, ordering and retailer enquiries.</p><a className="contact-link" href="https://wa.me/919558192473" target="_blank" rel="noreferrer">WhatsApp · +91 9558192473 <ArrowRight size={16} /></a><a className="contact-link" href="https://wa.me/919537894978" target="_blank" rel="noreferrer">WhatsApp · +91 9537894978 <ArrowRight size={16} /></a><Link className="contact-link" to="/register">Wholesale registration <ArrowRight size={16} /></Link><span className="instagram-note"><Instagram size={16} /> Instagram handle not supplied</span></div></section></div>;
}

function NotFound() {
  return <div className="container page-wrap"><EmptyState title="We can’t find that page" text="The page may have moved. Let’s find your next favourite style." action={<Link to="/" className="button"><ArrowLeft size={16} /> Back to home</Link>} /></div>;
}

function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Link to="/" className="brand"><img src={logo} alt="7Feelings" /><span>AHMEDABAD</span></Link><p>Women’s ethnic wear, thoughtfully made for retailers and boutiques.</p><span className="footer-location">AHMEDABAD, GUJARAT · INDIA</span></div><div className="footer-column"><b>EXPLORE</b><Link to="/collection">The collection</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Enquiry cart</Link></div><div className="footer-column"><b>FOR RETAILERS</b><Link to="/register">Wholesale registration</Link><Link to="/register">Wholesale enquiries</Link><Link to="/about">Contact us</Link></div><div className="footer-column"><b>GET IN TOUCH</b><a href="https://wa.me/919558192473" target="_blank" rel="noreferrer">WhatsApp · +91 9558192473</a><a href="https://wa.me/919537894978" target="_blank" rel="noreferrer">WhatsApp · +91 9537894978</a><Link to="/about">Address & hours</Link></div></div><div className="footer-bottom"><span>© 2026 7Feelings Apparel Private Limited</span><span>Wholesale catalogue demonstration · Details confirmed by our team</span></div></div></footer>;
}

export default function Root() {
  return <App />;
}
