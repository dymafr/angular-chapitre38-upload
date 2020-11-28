import { FileService } from "./file.service";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { fromEvent, Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public over: boolean;
  public filesHolder$: Observable<
    { file: File; progress$: Observable<number> }[]
  > = this.fileService.filesHolder$.asObservable();
  @ViewChild("fileinput", { static: true }) inputRef: ElementRef;

  constructor(private fileService: FileService) {}

  openFile() {
    this.inputRef.nativeElement.click();
  }

  addFiles($event) {
    const files = $event.target.files;
    this.fileService.addFiles(files);
  }

  removeFile(index) {
    this.fileService.removeFile(index);
  }

  dropFile($event) {
    if ($event.dataTransfer) {
      const files = $event.dataTransfer.files;
      this.fileService.addFiles(files);
    }
  }
}
