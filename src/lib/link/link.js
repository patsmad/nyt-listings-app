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
                link_file.item_id,
                link_file.x,
                link_file.y,
                link_file.box_id,
                link_file.left,
                link_file.top,
                link_file.width,
                link_file.height,
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

export const snippet_target = 400;

class LinkFile {
    constructor(file_id, file, item_id, x, y, box_id, left, top, width, height, link_id, link, confirmed) {
        this.file_id = file_id;
        this.file = file;
        this.item_id = item_id;
        this.x = x;
        this.y = y;
        this.box_id = box_id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.link_id = link_id;
        this.link = link;
        this.confirmed = confirmed;
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
