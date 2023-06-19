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

class AnnotatedFile {
  constructor(id, name, items) {
    this.id = id;
    this.name = name;
    this.items = items;
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
  constructor(id, left, top, width, height, links) {
    this.id = id;
    this.left = left;
    this.top = top;
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
