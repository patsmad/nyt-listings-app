import { writable, derived } from 'svelte/store';

export const annotatedFileData = writable([]);
export const annotatedFile = derived(annotatedFileData, ($annotatedFileData) => {
    return new AnnotatedFile($annotatedFileData.id, $annotatedFileData.name, $annotatedFileData.file_date, $annotatedFileData.items?.map(item => {
        return new Item(item.id, item.x, item.y, item.boxes?.map(box => {
            return new Box(box.id, box.left, box.top, box.width, box.height, box.channel, box.time, box.duration_minutes, box.vcr_code, box.links?.map(link => {
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
  constructor(id, name, file_date, items) {
    this.id = id;
    this.name = name;
    this.file_date = file_date;
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
  constructor(id, left, top, width, height, channel, time, duration_minutes, vcr_code, links) {
    this.id = id;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.channel = channel;
    this.time = time;
    this.duration_minutes = duration_minutes;
    this.vcr_code = vcr_code;
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
