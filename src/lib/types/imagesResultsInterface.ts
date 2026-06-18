export interface ImagesResult {
  type: string; // could be "image_result" but API shows "<string>"
  title: string;
  url: string;
  source: string;
  page_fetched: string;

  thumbnail: {
    src: string;
    width: number;
    height: number;
  };

  properties: {
    url: string;
    placeholder: string;
    width: number;
    height: number;
  };

  meta_url: {
    scheme: string;
    netloc: string;
    hostname: string;
    favicon: string;
    path: string;
  };

  confidence: string; // e.g. "low", "medium", "high"
}