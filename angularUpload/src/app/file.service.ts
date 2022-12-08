import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  public filesHolder$ = new BehaviorSubject<
    {
      file: File;
      progress$: Observable<number>;
    }[]
  >([]);

  constructor(private http: HttpClient) {}

  public addFiles(files: FileList) {
    this.filesHolder$.next([
      ...this.filesHolder$.value,
      ...Array.from(files).map((f: File) => {
        const formData = new FormData();
        formData.append('f', f);
        const request = new HttpRequest('POST', '/api/files', formData, {
          reportProgress: true,
        });
        return {
          file: f,
          progress$: this.http.request(request).pipe(
            map((event: HttpEvent<any>) => {
              switch (event.type) {
                case HttpEventType.Sent: {
                  return 0;
                }
                case HttpEventType.UploadProgress: {
                  return event.total
                    ? Math.round((event.loaded / event.total) * 100)
                    : 0;
                }
                case HttpEventType.Response: {
                  return 100;
                }
                default: {
                  return 0;
                }
              }
            })
          ),
        };
      }),
    ]);
  }

  public removeFile(index: number) {
    const files = this.filesHolder$.value.slice();
    this.http.delete(`/api/files/${files[index].file.name}`).subscribe();
    files.splice(index, 1);
    this.filesHolder$.next(files);
  }
}
