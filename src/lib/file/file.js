import { derived } from 'svelte/store';
import { annotatedFile } from './annotated.js'

export const fileItems = derived(annotatedFile, annotatedFile => annotatedFile.items?.map(item => {
    let boxes = item.boxes.map(box => {
        let links = box.links.map(link => {
            return new FileItem(item.id, item.x, item.y, box.id, box.left, box.top, box.width, box.height, link.id, link.link, link.title, link.year, link.rating, link.votes, link.confirmed)
        })
        return links.length > 0 ? links : [new FileItem(item.id, item.x, item.y, box.id, box.left, box.top, box.width, box.height, null, '', '', '', null, null, false)]
    })
    return boxes.length > 0 ? boxes : [new FileItem(item.id, item.x, item.y, null, null, null, null, null, null, '', '', '', null, null, false)]
}).flat(2))

export class FileItem {
    constructor(id, x, y, box_id, left, top, width, height, link_id, link, title, year, rating, votes, confirmed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.box_id = box_id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.link_id = link_id;
        this.link = link;
        this.title = title;
        this.year = year;
        this.rating = rating;
        this.votes = votes;
        this.confirmed = confirmed
        this.link_edit = false;
    }

    scale() {
        return 400 / this.width;
    }

    translation() {
        return (this.width - 400) / 2;
    }

    box() {
        return new Box(this.left, this.top, this.left + this.width, this.top + this.height);
    }
}

class Box {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    width() {
        return this.right - this.left;
    }

    height() {
        return this.bottom - this.top;
    }

    scale() {
        return 400 / this.width();
    }

    scaled_height() {
        return this.height() * this.scale();
    }

    scaled_width() {
        return this.width() * this.scale();
    }

    translation() {
        return (this.width() - 400) / 2;
    }

    match(other) {
        return this.left == other.left && this.top == other.top && this.right == other.right && this.bottom == other.bottom;
    }
}
