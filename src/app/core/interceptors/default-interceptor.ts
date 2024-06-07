import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private toast: ToastrService) {}
  public static noShow: boolean = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/api/')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(mergeMap((event: HttpEvent<any>) => this.handleOkReq(event)));
  }

  private handleOkReq(event: HttpEvent<any>): Observable<any> {
    if (event instanceof HttpResponse) {
      const body: any = event.body;
      // failure: { code: **, msg: 'failure' }
      // success: { code: 0,  msg: 'success', data: {} }
      if(body == true){
        return of(event)
      }
      if (body && 'code' in body && body.code !== 0) {
        if (body.msg) {
          this.toast.error(body.msg);
        }
        return throwError(() => []);
      }
    }
    // Pass down event if everything is OK
    return of(event);
  }
}
