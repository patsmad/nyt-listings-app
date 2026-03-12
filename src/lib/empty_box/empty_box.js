import { writable, derived } from 'svelte/store';

export const linkFilesData = writable([]);
export const linkFiles = derived(linkFilesData, ($linkFilesData) => {
    return $linkFilesData.map(link_file => {
            return new LinkFile(
                link_file.file_id,
                link_file.file,
                link_file.file_date,
                link_file.item_id,
                link_file.x,
                link_file.y,
                link_file.box_id,
                link_file.left,
                link_file.top,
                link_file.width,
                link_file.height,
                link_file.channel,
                link_file.time,
                link_file.duration_minutes,
                link_file.vcr_code,
                link_file.link_id
            )
        })
});

export const snippet_target = 400;

class LinkFile {
    constructor(file_id, file, file_date, item_id, x, y, box_id, left, top, width, height, channel, time, duration_minutes, vcr_code, link_id) {
        this.file_id = file_id;
        this.file = file;
        this.file_date = file_date;
        this.item_id = item_id;
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
        this.link = null;

        this.best_available_date = this.time ? this.time : this.file_date;
        this.tr_class = this.vcr_code ? "": "tr-null";
    }

    scale() {
        return snippet_target / this.width;
    }

    translation() {
        if (this.scale() <= 1) {
            return (this.width - snippet_target) / 2;
        } else {
            return 0;
        }
    }

    box() {
        return new Box(this.left, this.top, this.left + this.width, this.top + this.height);
    }

    time_as_decimal() {
        if (this.best_available_date !== null) {
            let date = new Date(this.best_available_date)
            return date.getTime()
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
