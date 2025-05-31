import { writable, derived } from 'svelte/store';

export const yearsData = writable([]);
export const years = derived(yearsData, ($yearsData) => {
    return new YearsData(
        $yearsData.years?.map(year => {
            return new LinkInfo(
                year.link,
                year.title,
                year.year,
                year.rating,
                year.votes
            )
        })
    )
});

class YearsData{
  constructor(years) {
    this.years = years;
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
