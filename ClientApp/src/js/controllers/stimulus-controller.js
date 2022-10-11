import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["source", "output"]

    work() {
        this.outputTarget.textContent = `Hello, ${this.sourceTarget.value}`;
        console.log(`Hello, ${this.sourceTarget.value}`);
    }
}

