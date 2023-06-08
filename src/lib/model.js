import { writable, derived } from 'svelte/store';

export const annotatedFileData = writable([]);
export const annotatedFile = derived(annotatedFileData, ($annotatedFileData) => {
    return new AnnotatedFile($annotatedFileData.id, $annotatedFileData.name, $annotatedFileData.items?.map(item => {
        return new Item(item.id, item.x, item.y, item.boxes?.map(box => {
            return new Box(box.id, box.left, box.top, box.width, box.height, box.links?.map(link => {
                return new Link(
                    link.id,
                    link.link,
                    link.confirmed,
                    link.link_info?.title??'',
                    link.link_info?.year??'',
                    link.link_info?.rating??0.0,
                    link.link_info?.votes??0
                )
            }))
        }))
    }))
});

export class FileItem {
    constructor(id, left, top, width, height, link, title, year, rating, votes, confirmed) {
        this.id = id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.link = link;
        this.title = title;
        this.year = year;
        this.rating = rating;
        this.votes = votes;
        this.confirmed = confirmed
    }

    scale(target) {
        return target / this.width;
    }

    translation(target) {
        if (this.scale(target) <= 1) {
            return (this.width - target) / 2;
        } else {
            return 0;
        }
    }
}

class Link {
  constructor(id, link, confirmed, title, year, rating, votes) {
    this.id = id;
    this.link = link;
    this.confirmed = confirmed;
    this.title = title;
    this.year = year;
    this.rating = rating;
    this.votes = votes;
  }
}

class Box {
  constructor(id, top, left, width, height, links) {
    this.id = id;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.links = links;
  }
}

class Item {
  constructor(id, x, y, boxes) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.boxes = boxes;
  }
}

class AnnotatedFile {
  constructor(id, name, items) {
    this.id = id;
    this.name = name;
    this.items = items;
  }
}

export const linkFilesData = writable([]);
export const linkFiles = derived(linkFilesData, ($linkFilesData) => {
    console.log($linkFilesData);
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
