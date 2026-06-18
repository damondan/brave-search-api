export interface VideosResult {
  type: "video_result";
  url: string;
  title: string;
  description: string;
  age: string;
  page_age: string;
  page_fetched: string;

  fetched_content_timestamp: number;

  video: {
    duration: string;
    views: number;
    creator: string;
    publisher: string;
    requires_subscription: boolean;
    tags: string[];

    author: {
      name: string;
      url: string;
      long_name: string;
      img: string;
    };
  };

  meta_url: {
    scheme: string;
    netloc: string;
    hostname: string;
    favicon: string;
    path: string;
  };

  thumbnail: {
    src: string;
    original: string;
  };
}