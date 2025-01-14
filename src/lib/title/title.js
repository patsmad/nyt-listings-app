import { writable, derived } from 'svelte/store';

export const titlesData = writable([]);
export const titles = derived(titlesData, ($titlesData) => {
    return new TitlesData(
        $titlesData.titles?.map(title => {
            return new LinkInfo(
                title.link,
                title.title,
                title.year,
                title.rating,
                title.votes
            )
        })
    )
});

class TitlesData{
  constructor(titles) {
    this.titles = titles;
  }
}

class LinkInfo {
    constructor(link, title, year, rating, votes) {
        this.link = link;
        this.title = title;
        this.year = year;
        this.rating = rating;
        this.votes = votes;
    }
}
