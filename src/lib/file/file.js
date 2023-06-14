
export class FileItem {
    constructor(id, box_id, left, top, width, height, link_id, link, title, year, rating, votes, confirmed) {
        this.id = id;
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
