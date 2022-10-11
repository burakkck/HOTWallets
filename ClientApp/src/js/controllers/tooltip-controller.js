import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["content", "info", "box", "detail"];

    work() {
        this.outputTarget.textContent = `Hello, ${this.sourceTarget.value}`;
        console.log(`Hello, ${this.sourceTarget.value}`);
    }

    open() {

        console.log("open");
        this.infoTarget.classList.remove("text-white");
        this.boxTarget.classList.remove("bg-gray-400", "ring-[#ffdb4d]");

        this.boxTarget.classList.add("bg-purple-700", "ring-purple-700");
        this.infoTarget.classList.add("text-yellow-400");

    }

    close() {

        console.log(`close`);
        this.infoTarget.classList.remove("text-yellow-400");
        this.infoTarget.classList.add("text-white");

        this.boxTarget.classList.remove("bg-purple-700", "ring-purple-700");
        this.boxTarget.classList.add("bg-gray-400", "ring-[#ffdb4d]");
    }

    change() {
        if (this.detailTarget.open) {
            this.open();
        } else {
            this.close();
        }


        //this.infoTarget.classList.remove("text-yellow-400");
        //this.infoTarget.classList.add("text-white");

        //this.boxTarget.classList.remove("bg-purple-700", "ring-purple-700");
        //this.boxTarget.classList.add("bg-gray-400", "ring-[#ffdb4d]");
    }
}

