import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-image-grid-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-grid-captcha.component.html',
  styleUrl: './image-grid-captcha.component.css'
})
export class ImageGridCaptchaComponent {
   // Example: select all images with cats
  images = [
    { src: 'assets/cat1.jpg', isCorrect: true },
    { src: 'assets/dog1.jpg', isCorrect: false },
    { src: 'assets/cat2.jpg', isCorrect: true },
    { src: 'assets/bird1.jpg', isCorrect: false },
    // Add more as needed
  ];
  selected: boolean[] = Array(this.images.length).fill(false);
  error: string = '';

  verifyImageGrid() {
    const isValid = this.images.every((img, i) => img.isCorrect === this.selected[i]);
    this.error = isValid ? '' : 'Incorrect selection. Try again!';
    // You can emit an @Output event to parent for success/failure here.
  }
}
