import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = false;

  showLoader(): void {
    this.loading = true;
    // Implement logic to show the loader (e.g., set a flag, show a spinner component, etc.)
  }

  hideLoader(): void {
    this.loading = false;
    // Implement logic to hide the loader (e.g., reset the flag, hide the spinner component, etc.)
  }

  isLoading(): boolean {
    return this.loading;
  }
}
