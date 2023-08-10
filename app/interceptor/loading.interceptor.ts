import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  isComponentNeedLoader!: boolean;
  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.isComponentNeedLoader = request.headers.has('component-name');
    if (this.isComponentNeedLoader) {
      this.loaderService.showLoader(); // Show the loader when the request starts

      return next.handle(request).pipe(
        finalize(() => {
          this.loaderService.hideLoader(); // Hide the loader when the request is completed
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
