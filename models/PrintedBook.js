import { Book } from "./Book.js";

// Lớp con: PrintedBook (Sách giấy)
export class PrintedBook extends Book {
    constructor(id, title, author, year, weight) {
        super(id, title, author, year);
        this.weight = weight; // Trọng lượng sách
    }

    // Ghi đè phương thức hiển thị thông tin sách
    displayInfo() {
        return `${super.displayInfo()}, Trọng lượng: ${this.weight} kg`;
    }
}