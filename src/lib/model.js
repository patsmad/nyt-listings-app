import { writable, derived } from 'svelte/store';

export const annotatedFileData = writable([]);
export const annotatedFile = derived(annotatedFileData, ($annotatedFileData) => {
    return new AnnotatedFile($annotatedFileData.id, $annotatedFileData.name, $annotatedFileData.items?.map(item => {
        return new Item(item.id, item.x, item.y, item.boxes?.map(box => {
            return new Box(box.id, box.left, box.top, box.width, box.height, box.links?.map(link => {
                return new Link(link.id, link.link, link.confirmed, link.link_info?.title??'', link.link_info?.year??'')
            }))
        }))
    }))
});

export class FileItem {
    constructor(id, link, title, year) {
        this.id = id;
        this.link = link;
        this.title = title;
        this.year = year;
    }
}

class Link {
  constructor(id, link, confirmed, title, year) {
    this.id = id;
    this.link = link;
    this.confirmed = confirmed;
    this.title = title;
    this.year = year;
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
