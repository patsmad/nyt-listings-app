import { writable, derived } from 'svelte/store';

export const linkFilesData = writable([]);
export const linkFiles = derived(linkFilesData, ($linkFilesData) => {
    return new LinkFiles(
        new LinkInfo(
            $linkFilesData.link_info?.link,
            $linkFilesData.link_info?.title??'',
            $linkFilesData.link_info?.year??'',
            $linkFilesData.link_info?.rating??0.0,
            $linkFilesData.link_info?.votes??0
        ),
        $linkFilesData.link_files?.map(link_file => {
            return new LinkFile(
                link_file.link_id,
                link_file.name,
                link_file.confirmed
            )
        })
    )
});

class LinkFiles {
  constructor(link_info, link_files) {
    this.link_info = link_info;
    this.link_files = link_files;
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

class LinkFile {
    constructor(id, file, confirmed) {
        this.id = id;
        this.file = file;
        this.confirmed = confirmed;
    }
}
