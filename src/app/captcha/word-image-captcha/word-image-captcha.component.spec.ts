import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordImageCaptchaComponent } from './word-image-captcha.component';

describe('WordImageCaptchaComponent', () => {
  let component: WordImageCaptchaComponent;
  let fixture: ComponentFixture<WordImageCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordImageCaptchaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordImageCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
