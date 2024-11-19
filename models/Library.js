import fs from "fs";

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
            fs.writeFileSync(this.dataFilePath, JSON.stringify(this.books, null, 2), "utf-8");
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào file:", err);
        }
    }

    // Tải dữ liệu từ file JSON
    async loadBooksFromFile() {
        try {
            if (fs.existsSync(this.dataFilePath)) {
                const data = fs.readFileSync(this.dataFilePath, "utf-8");
                const books = JSON.parse(data);

                const bookPromises = books.map(async (book) => {
                    if (book.weight) {
                        const { PrintedBook } = await import("./PrintedBook.js");
                        return new PrintedBook(book.id, book.title, book.author, book.year, book.weight);
                    } else if (book.fileSize) {
                        const { DigitalBook } = await import("./DigitalBook.js");
                        return new DigitalBook(book.id, book.title, book.author, book.year, book.fileSize);
                    } else {
                        const { Book } = await import("./Book.js");
                        return new Book(book.id, book.title, book.author, book.year);
                    }
                });

                return await Promise.all(bookPromises);
            } else {
                return [];
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu từ file:", err);
            return [];
        }
    }
}
