import { Library } from "./models/Library.js";
import { PrintedBook } from "./models/PrintedBook.js";
import { DigitalBook } from "./models/DigitalBook.js";
import readlineSync from "readline-sync";

const library = new Library("Thư viện Thành Phố", "./models/library-data.json");
library.books = await library.loadBooksFromFile();

while (true) {
    console.log("\nQuản lý Thư viện");
    console.log("1. Hiển thị danh sách sách");
    console.log("2. Thêm sách");
    console.log("3. Xóa sách");
    console.log("4. Mượn sách");
    console.log("5. Trả sách");
    console.log("6. Tìm sách theo tựa đề");
    console.log("7. Thoát");

    const choice = readlineSync.question("Chọn một chức năng: ");

    switch (choice) {
        case "1":
            library.displayBooks();
            break;
        case "2":
            const type = readlineSync.question("Loại sách (1: In, 2: Số): ");
            const id = parseInt(readlineSync.question("ID sách: "));
            const title = readlineSync.question("Tên sách: ");
            const author = readlineSync.question("Tác giả: ");
            const year = parseInt(readlineSync.question("Năm xuất bản: "));

            if (type === "1") {
                const weight = parseFloat(readlineSync.question("Trọng lượng sách (kg): "));
                const printedBook = new PrintedBook(id, title, author, year, weight);
                library.addBook(printedBook);
            } else if (type === "2") {
                const fileSize = parseFloat(readlineSync.question("Kích thước file (MB): "));
                const digitalBook = new DigitalBook(id, title, author, year, fileSize);
                library.addBook(digitalBook);
            } else {
                console.log("Loại sách không hợp lệ.");
            }
            break;
        case "3":
            const removeId = parseInt(readlineSync.question("Nhập ID sách muốn xóa: "));
            library.removeBook(removeId);
            break;
        case "4":
            const borrowId = parseInt(readlineSync.question("Nhập ID sách muốn mượn: "));
            const borrowBook = library.findBookById(borrowId);
            if (borrowBook) {
                console.log(borrowBook.borrowBook());
                library.saveBooksToFile(); // Lưu lại trạng thái mượn
            } else {
                console.log("Không tìm thấy sách với ID đã nhập.");
            }
            break;
        case "5":
            const returnId = parseInt(readlineSync.question("Nhập ID sách muốn trả: "));
            const returnBook = library.findBookById(returnId);
            if (returnBook) {
                console.log(returnBook.returnBook());
                library.saveBooksToFile(); // Lưu lại trạng thái trả
            } else {
                console.log("Không tìm thấy sách với ID đã nhập.");
            }
            break;
        case "6":
            const keyword = readlineSync.question("Nhập từ khóa tìm kiếm: ");
            library.searchBookByTitle(keyword);
            break;
        case "7":
            console.log("Thoát chương trình.");
            process.exit(0);
        default:
            console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
    }
}
