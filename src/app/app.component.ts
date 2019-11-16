import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchLocsCtrl = new FormControl();
  filteredLocs: any;
  isLoading = false;
  errorMsg: string;
  isKnown = false;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.searchLocsCtrl.valueChanges
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredLocs = [];
          this.isLoading = true;
        }),

        switchMap(value =>  this.http.get("http://35.180.182.8/search?keywords="+value+"&language=en")
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )

        )
      )
      .subscribe(data => {
        /*if (data['Search'] == undefined) {
          this.errorMsg = data['Error'];
          this.filteredLocs = [];
          //console.log("")
        } else {*/
          this.errorMsg = "";
          this.filteredLocs = data["entries"];
      //  }

        console.log( this.filteredLocs);


      if (typeof this.filteredLocs !== 'undefined' && this.filteredLocs.length > 0) {
        // the array is defined and has at least one element

        this.isKnown=true;  }
      });
  }
}
