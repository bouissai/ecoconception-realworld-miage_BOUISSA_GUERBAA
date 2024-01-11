import { Component, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  imports: [RouterLinkActive, RouterLink, AsyncPipe, NgIf, ShowAuthedDirective],
  standalone: true,
})
export class HeaderComponent {
  currentUser$ = inject(UserService).currentUser;

  bruit() {
    const audio = new Audio();
    audio.src = 'assets/ouais-cest-greg.mp3';
    audio.play();
  }
}
