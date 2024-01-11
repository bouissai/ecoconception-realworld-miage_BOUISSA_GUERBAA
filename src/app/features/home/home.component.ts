import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TagsService } from "../../core/services/tags.service";
import { ArticleListConfig } from "../../core/models/article-list-config.model";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { ArticleListComponent } from "../../shared/article-helpers/article-list.component";
import { takeUntil, tap } from "rxjs/operators";
import {interval, Subject, Subscription} from "rxjs";
import { UserService } from "../../core/services/user.service";
import { LetDirective } from "@rx-angular/template/let";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {CarouselModule} from "primeng/carousel";
import { Product } from "src/app/core/models/product";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styleUrls: [],
  imports: [
    NgClass,
    ArticleListComponent,
    AsyncPipe,
    LetDirective,
    NgForOf,
    ShowAuthedDirective,
    ButtonModule,
    TagModule,
    CarouselModule,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private sub!: Subscription ;
  listConfig: ArticleListConfig = {
    type: "all",
    filters: {},
  };
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroy$ = new Subject<void>();

  products : string[]= ["blue-band.jpg","blue-band.jpg","blue-band.jpg"]
  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated
      .pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            this.setListTo("feed");
          } else {
            this.setListTo("all");
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
      );

    // le code ci-dessous correspond à un reflow
      this.sub = interval(15000).subscribe(()=>{
        location.reload();
      })

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setListTo(type: string = "", filters: Object = {}): void {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === "feed" && !this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }

    // Otherwise, set the list object
    this.listConfig = { type: type, filters: filters };
  }


}
