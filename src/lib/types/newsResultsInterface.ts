export interface NewsResult {
  type: "news_result";
  title: string;
  url: string;
  description: string;
  age: string;
  page_age: string;
  page_fetched: string;

  profile: {
    name: string;
    url: string;
    long_name: string;
    img: string;
  };

  fetched_content_timestamp: number;

  meta_url: {
    scheme: string;
    netloc: string;
    hostname: string;
    favicon: string;
    path: string;
  };

  breaking: boolean;

  thumbnail: {
    src: string;
    original: string;
  };

  extra_snippets: string[];

  icons: {
    href: string;
    sizes: string;
    rel: string;
    type: string;
    ext: string;
  }[];
}