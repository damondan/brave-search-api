import {type WebResult} from '$lib/types/searchWebResultsInterface'
import {type NewsResult} from '$lib/types/newsResultsInterface'

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


