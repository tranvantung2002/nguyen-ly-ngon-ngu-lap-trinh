import { Book } from "./Book.js";

export class DigitalBook extends Book {
    constructor(id, title, author, year, fileSize) {
        super(id, title, author, year); // Gọi constructor lớp cha
        this.fileSize = fileSize; // Dung lượng file
    }

    // Ghi đè phương thức hiển thị thông tin sách
    displayInfo() {
        return `${super.displayInfo()}, Dung lượng: ${this.fileSize} MB`;
    }
}