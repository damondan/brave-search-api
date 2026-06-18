

// Web:
// WebResponse, WebResult, Profile, MetaUrl, 
// Thumbnail, Video, Movie, Rating, Organization
// --- Top-level web section ---
export interface SearchMain {
  type: "search";
  query: {
    original: string;
    is_navigational: boolean;
    country: string;
    state: string;
    reddit_cluster?: string;
    more_results_available: boolean;
  };
  web: {
    type: "search";
    results: WebResult[];
  }
  summarizer: Summarizer[];
}

// --- Summarizer ---
export interface Summarizer {
  type: "summarizer";
  key: string;
}

// --- Main Result Object (this is the big one you pasted) ---
export interface WebResult {
  title: string
  url: string
  is_source_local: false
  is_source_both: false
  description: string
  page_age: string
  page_fetched?: string;
  fetched_content_timestamp?: number;

  profile?: Profile;
  language?: string;
  family_friendly?: boolean;

  type: "search_result";
  subtype?: string;
  is_live?: boolean;

  deep_results?: any; // unknown structure
  schemas?: any[];

  meta_url?: MetaUrl;
  thumbnail?: Thumbnail;

  age?: string;

  location?: any;   // {33 properties}
  restaurant?: any; // {33 properties}

  video?: VideoData;
  movie?: Movie;

  faq?: FAQ;
  qa?: QA;

  book?: Book;
  rating?: Rating;

  article?: Article;

  product?: Product;
  product_cluster?: Product[];

  cluster_type?: string;
  cluster?: any[]; // {11 properties}

  creative_work?: CreativeWork;
  music_recording?: CreativeWork;

  review?: Review;

  recipe?: any; // {18 properties}

  software?: Software;
  organization?: Organization;

  content_type?: string;
  extra_snippets?: string[];

  icons?: Icon[];
}

// --- Reusable base types ---
export interface Profile {
  name: string;
  url: string;
  long_name?: string;
  img?: string;
}

export interface Thumbnail {
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  bg_color?: string;
  original?: string;
  logo?: boolean;
  duplicated?: boolean;
  theme?: string;
}

export interface Rating {
  ratingValue: number;
  bestRating: number;
  reviewCount: number;
  profile: Profile;
  is_tripadvisor: boolean;
}

export interface MetaUrl {
  scheme?: string;
  netloc?: string;
  hostname?: string;
  favicon?: string;
  path?: string;
}

export interface Person {
  type: string;
  name: string;
  url: string;
  thumbnail?: Thumbnail;
  email?: string;
}

// --- Main nested structures ---

export interface VideoData {
  duration: string;
  views: string; // NOTE: API shows "<string>"
  creator?: string;
  publisher?: string;
  thumbnail?: Thumbnail;
  tags?: string[];
  author?: Profile;
  requires_subscription?: boolean;
}

export interface Movie {
  name: string;
  description: string;
  url: string;
  thumbnail: Thumbnail;
  release: string;
  directors: Person[];
  actors: Person[];
  rating: Rating;
  duration: string;
  genre: string[];
  query: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  title: string;
  url: string;
  meta_url: MetaUrl;
}

export interface FAQ {
  items: FAQItem[];
}

export interface QA {
  question: string;
  answer: {
    text: string;
    author: string;
    upvoteCount: number;
    downvoteCount: number;
  };
}

export interface Book {
  title: string;
  author: Person[];
  date: string;
  price: {
    price: string;
    priceCurrency: string;
  };
  pages: number;
  publisher: Person;
  rating: Rating;
}

export interface Article {
  author: Person[];
  date: string;
  publisher: {
    type: string;
    name: string;
    url: string;
    thumbnail: Thumbnail;
    contact_points: ContactPoint[];
  };
  thumbnail: Thumbnail;
  isAccessibleForFree: boolean;
}

export interface ContactPoint {
  type: string;
  name: string;
  url: string;
  thumbnail?: Thumbnail;
  telephone?: string;
  email?: string;
}

export interface ProductOffer {
  url: string;
  priceCurrency: string;
  price: string;
}

export interface Product {
  type: "Product";
  name: string;
  url: string;
  category: string;
  price: string;
  thumbnail: Thumbnail;
  description: string;
  offers: ProductOffer[];
  rating: Rating;
  gtin?: string;
  gtin8?: string;
  gtin12?: string;
  gtin13?: string;
  gtin14?: string;
}

export interface CreativeWork {
  name: string;
  rating: Rating;
  thumbnail: Thumbnail;
}

export interface Review {
  type: "Review";
  name: string;
  thumbnail: Thumbnail;
  description: string;
  rating: Rating;
}

export interface Software {
  name: string;
  author: string;
  version: string;
  codeRepository: string;
  homepage: string;
  datePublished: string;
  is_npm: boolean;
  is_pypi: boolean;
  stars: number;
  forks: number;
  programmingLanguage: string;
}

export interface Organization {
  type: string;
  name: string;
  url: string;
  thumbnail: Thumbnail;
  contact_points: ContactPoint[];
}

export interface Icon {
  href: string;
  sizes: string;
  rel: string;
  type: string;
  ext: string;
}

