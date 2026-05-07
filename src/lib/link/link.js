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
                link_file.file_id,
                link_file.file,
                link_file.file_date,
                link_file.file_width,
                link_file.file_height,
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
                link_file.link_id,
                $linkFilesData.link_info?.link,
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

export const max_height = 250;
export const max_width = 500;

class LinkFile {
    constructor(file_id, file, file_date, file_width, file_height, item_id, x, y, box_id, left, top, width, height, channel, time, duration_minutes, vcr_code, link_id, link, confirmed) {
        this.file_id = file_id;
        this.file = file;
        this.file_date = file_date;
        this.file_width = file_width;
        this.file_height = file_height;
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
        this.link = link;
        this.confirmed = confirmed;

        this.best_available_date = this.time ? this.time : this.file_date;
    }

    size() {
        return (this.width * this.height) / (this.file_width * this.file_height)
    }

    scale() {
        return Math.min(max_width / this.width, max_height / this.height);
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
        return Math.min(max_width / this.width(), max_height / this.height());
    }

    translate_x() {
        if (this.width() > max_width) {
            return max_width / 2 - this.width() / 2;
        } else {
            return 0;
        }
    }

    translate_y() {
        return max_height / 2 - this.height() / 2;
    }

    match(other) {
        return this.left == other.left && this.top == other.top && this.right == other.right && this.bottom == other.bottom;
    }
}
