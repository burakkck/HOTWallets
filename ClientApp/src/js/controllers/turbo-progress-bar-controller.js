import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="turbo-progress-bar"
export default class extends Controller {
    connect() {
        Turbo.setProgressBarDelay(1);

        document.addEventListener("turbo:before-fetch-request", () => {
            Turbo.navigator.adapter.progressBar.setValue(0);
            Turbo.navigator.adapter.progressBar.show();
        });

        document.addEventListener("turbo:before-fetch-response", () => {
            Turbo.navigator.adapter.progressBar.setValue(100);
            Turbo.navigator.adapter.progressBar.hide();
        });
    }

    disconnect() {
        //  detach events if needed
    }
};
