const { DigitalBook } = require("../models/DigitalBook");
const { Library } = require("../models/Library");
const { PrintedBook } = require("../models/PrintedBook");

const library = new Library("Thư viện Thành Phố", "./src/models/library-data.json");

class Controller {
    static async getList(req, res) {
        try {
            library.books = await library.loadBooksFromFile();

            return res.send({ status: 1, message: "Thành công", data: library.books });
        } catch (error) {
            console.log(error);
            return res.send({ status: 0, message: error.message });
        }
    }
    static async editList(req, res) {
        try {
            library.books = await library.loadBooksFromFile();

            const { id, type, weight, title, author, year, fileSize } = req.body;

            library.editBook(id, type, weight, title, author, year, fileSize);

            return res.send({ status: 1, message: "Thành công" });
        } catch (error) {
            console.log(error);
            return res.send({ status: 0, message: error.message });
        }
    }

    static async addList(req, res) {
        try {
            library.books = await library.loadBooksFromFile();

            const { type, weight, title, author, year, fileSize } = req.body;

            if (type == 2) {
                const printedBook = new PrintedBook(library.books.length + 1, title, author, year, weight);
                library.addBook(printedBook);
            } else if (type == 1) {
                const digitalBook = new DigitalBook(library.books.length + 1, title, author, year, fileSize);
                library.addBook(digitalBook);
            }

            return res.send({ status: 1, message: "Thành công" });
        } catch (error) {
            console.log(error);
            return res.send({ status: 0, message: error.message });
        }
    }

    static async removeList(req, res) {
        try {

            const { id } = req.body;

            library.removeBook(id);

            return res.send({ status: 1, message: "Thành công" });
        } catch (error) {
            console.log(error);
            return res.send({ status: 0, message: error.message });
        }
    }

    static async findList(req, res) {
        try {

            const { keyword } = req.body;

            const books = library.findBook(keyword);


            return res.send({ status: 1, message: "Thành công", data: books });
        } catch (error) {
            console.log(error);
            return res.send({ status: 0, message: error.message });
        }
    }
}

module.exports = {
    Controller
}