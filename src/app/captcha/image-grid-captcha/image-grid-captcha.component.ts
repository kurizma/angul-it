import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Output, EventEmitter } from '@angular/core';

const expectedGrid = [
  [false, false, false, false, false, false],
  [false, false, false, false, false, false],
  [true, true, false, false, false, false],
  [true, true, false, false, false, false],
  [false, false, false, false, false, false],
  [false, false, false, false, false, false]
];

@Component({
  selector: 'app-image-grid-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-grid-captcha.component.html',
  styleUrl: './image-grid-captcha.component.css'
})
export class ImageGridCaptchaComponent {
  @Output() result = new EventEmitter<boolean>();
  error: string = '';

  grid: { selected: boolean }[][];

  constructor() {
    // 6x6 grid, each cell is selectable
    this.grid = Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, () => ({ selected: false }))
    );
  }

  toggleCell(i: number, j: number) {
    // Toggle selection state for cell [i][j]
    this.grid[i][j].selected = !this.grid[i][j].selected;
  }

  isInputValid(): boolean {
    // Valid only if at least one cell is selected
    return this.grid.some(row => row.some(cell => cell.selected));
  }

  validateSelection() {
    // Compare selected matrix to expected grid
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (this.grid[i][j].selected !== expectedGrid[i][j]) {
          this.error = "Incorrect selection. Try again!";
          this.result.emit(false);
          return;
        }
      }
    }
    this.error = "";
    this.result.emit(true);
  }
}
