import {type WebResult} from '$lib/types/searchWebResultsInterface';
import {type NewsResult} from '$lib/types/newsResultsInterface';
import { type VideosResult } from '$lib/types/videoResultsInterface';
import { type ImagesResult } from '$lib/types/imagesResultsInterface';

interface WebSelectionState {
	selectedWebResults: WebResult[];
}

export const webSelectionState = $state<WebSelectionState>({
	selectedWebResults: []
});

interface NewsSelectionState {
	selectedNewsResults: NewsResult[];
}

export const newsSelectionState = $state<NewsSelectionState>({
	selectedNewsResults: []
});

interface VideosSelectionState {
	selectedVideosResults: VideosResult[];
}

export const videosSelectionState = $state<VideosSelectionState>({
	selectedVideosResults: []
});

interface ImagesSelectionState {
	selectedImagesResults: ImagesResult[];
}

export const imagesSelectionState = $state<ImagesSelectionState>({
	selectedImagesResults: []
});


