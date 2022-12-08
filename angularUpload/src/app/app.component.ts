import { FileService } from './file.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public baseURL = 'http://localhost:3000/';
  public over = false;
  public filesHolder$: Observable<
    { file: File; progress$: Observable<number> }[]
  > = this.fileService.filesHolder$.asObservable();
  @ViewChild('fileinput', { static: true }) inputRef!: ElementRef;

  constructor(private fileService: FileService) {}

  openFile() {
    this.inputRef.nativeElement.click();
  }

  addFiles($event: Event) {
    const files = ($event.target as HTMLInputElement).files;
    if (files) {
      this.fileService.addFiles(files);
    }
  }

  removeFile(index: number) {
    this.fileService.removeFile(index);
  }

  dropFile($event: DragEvent) {
    if ($event.dataTransfer) {
      const files = $event.dataTransfer.files;
      this.fileService.addFiles(files);
    }
  }
}
