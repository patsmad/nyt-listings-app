import { derived } from 'svelte/store';
import { annotatedFile } from './annotated.js'

export const fileItems = derived(annotatedFile, annotatedFile => annotatedFile.items?.map(item => {
    let boxes = item.boxes.map(box => {
        let links = box.links.map(link => {
            return new FileItem(item.id, annotatedFile.file_date, item.x, item.y, box.id, box.left, box.top, box.width, box.height, box.channel, box.time, box.duration_minutes, box.vcr_code, link.id, link.link, link.title, link.year, link.rating, link.votes, link.confirmed)
        })
        return links.length > 0 ? links : [new FileItem(item.id, annotatedFile.file_date, item.x, item.y, box.id, box.left, box.top, box.width, box.height, box.channel, box.time, box.duration_minutes, box.vcr_code, null, '', '', '', null, null, false)]
    })
    return boxes.length > 0 ? boxes : [new FileItem(item.id, annotatedFile.file_date, item.x, item.y, null, null, null, null, null, null, null, null, null, null, '', '', '', null, null, false)]
}).flat(2))

export const snippet_target = 400;

export class FileItem {
    constructor(id, file_date, x, y, box_id, left, top, width, height, channel, time, duration_minutes, vcr_code, link_id, link, title, year, rating, votes, confirmed) {
        this.id = id;
        this.file_date = file_date;
        this.x = x;
        this.y = y;
        this.box_id = box_id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.channel = channel;
        this.time = time;
        this.duration_minutes = duration_minutes;
        this.vcr_code = vcr_code;
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
        return snippet_target / this.width;
    }

    translation() {
        if (this.scale() < 1) {
            return (this.width - snippet_target) / 2;
        } else {
            return 0;
        }
    }

    box() {
        return new Box(this.left, this.top, this.left + this.width, this.top + this.height);
    }

    time_as_decimal() {
        if (this.time !== null) {
            let date = new Date(this.time)
            date = new Date(date.toLocaleString('en-US', {timeZone: 'Europe/London'}));
            return date.getHours() + date.getMinutes() / 60;
        } else {
            return null;
        }
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
        return snippet_target / this.width();
    }

    scaled_height() {
        return this.height() * this.scale();
    }

    scaled_width() {
        return this.width() * this.scale();
    }

    translation() {
        return -(this.width() - snippet_target) / 2;
    }

    match(other) {
        return this.left == other.left && this.top == other.top && this.right == other.right && this.bottom == other.bottom;
    }

    largest_height() {
        if (this.scale() < 1) {
            return this.height();
        } else {
            return this.scaled_height();
        }
    }
}
