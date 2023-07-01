import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoViewerPage } from './photo-viewer.page';

describe('PhotoViewerPage', () => {
  let component: PhotoViewerPage;
  let fixture: ComponentFixture<PhotoViewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PhotoViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
