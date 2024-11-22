// import fs from "fs";

export class Library {
    constructor(name, dataFilePath) {
        this.name = name;
        this.dataFilePath = dataFilePath;
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
        this.saveBooksToFile(); // Lưu lại dữ liệu sau khi thêm
        console.log(`Sách "${book.title}" đã được thêm vào thư viện.`);
    }

    removeBook(id) {
        const index = this.books.findIndex((book) => book.id === id);
        if (index !== -1) {
            const removedBook = this.books.splice(index, 1)[0];
            this.saveBooksToFile(); // Lưu lại dữ liệu sau khi xóa
            console.log(`Sách "${removedBook.title}" đã bị xóa.`);
        } else {
            console.log(`Không tìm thấy sách với ID ${id}.`);
        }
    }

    displayBooks() {
        console.log("Danh sách sách trong thư viện:");
        this.books.forEach((book) => console.log(book.displayInfo()));
    }

    searchBookByTitle(keyword) {
        const results = this.books.filter((book) =>
            book.title.toLowerCase().includes(keyword.toLowerCase())
        );
        if (results.length > 0) {
            console.log("Kết quả tìm kiếm:");
            results.forEach((book) => console.log(book.displayInfo()));
        } else {
            console.log(`Không tìm thấy sách nào với từ khóa "${keyword}".`);
        }
    }

    findBookById(id) {
        return this.books.find((book) => book.id === id);
    }

    // Lưu dữ liệu vào file JSON
    saveBooksToFile() {
        try {
            // fs.writeFileSync(this.dataFilePath, JSON.stringify(this.books, null, 2), "utf-8");

            localStorage.setItem("data", JSON.stringify(this.books));

        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào file:", err);
        }
    }

    // Tải dữ liệu từ file JSON
    loadBooksFromFile(newBook) {
        newBook.forEach(element => {
            this.books.push(element);
        });
    }
}
