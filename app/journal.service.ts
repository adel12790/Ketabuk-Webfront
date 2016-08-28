import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Journal }           from './journal';
import { Observable }     from 'rxjs/Observable';
import { Config } from './config';

@Injectable()
export class JournalService
{
  private headers : Headers;
  private jwt: string;
  constructor (private http: Http)
  {
    // this.headers = new Headers();
    // //this.headers.append('Content-Type', 'application/json');
    this.jwt = localStorage.getItem('id_token');
    // if(jwt)
    //   this.headers.append('Authorization', 'Bearer ' + jwt);
  }

  private journalsUrl = Config.API_URL + 'journal';  // URL to web API

  getJournals (): Observable<Journal[]>
  {
    return this.http.get(this.journalsUrl + '?token=' + this.jwt)//, { headers: this.headers })
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getJournal (id: number): Observable<Journal>
  {
    return this.http.get(this.journalsUrl + '/' + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(response: Response)
  {
    let body = response.json();
    return body.journals || body.journal || { };
  }

  private handleError (error: any)
  {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
