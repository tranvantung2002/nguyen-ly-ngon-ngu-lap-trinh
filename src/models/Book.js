export class Book {
    constructor(id, title, author, year) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.isAvailable = true; // Trạng thái sách (mặc định là sẵn sàng)
    }

    // Phương thức mượn sách
    borrowBook() {
        if (this.isAvailable) {
            this.isAvailable = false;
            return `${this.title} đã được mượn.`;
        } else {
            return `${this.title} hiện không có sẵn.`;
        }
    }

    // Phương thức trả sách
    returnBook() {
        this.isAvailable = true;
        return `${this.title} đã được trả lại.`;
    }

    // Phương thức hiển thị thông tin sách
    displayInfo() {
        return `ID: ${this.id}, Tựa: ${this.title}, Tác giả: ${this.author}, Năm: ${this.year}, Trạng thái: ${this.isAvailable ? "Sẵn sàng" : "Đã mượn"}`;
    }
}