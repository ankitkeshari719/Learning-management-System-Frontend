import { Component, OnInit, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SessionService, ThemeService, LoaderService } from "./core/services";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  showLoader: boolean;
  theme: string;

  constructor(
    private loaderService: LoaderService,
    private themeService: ThemeService,
    translate: TranslateService,
    private sessionService: SessionService
  ) {
    var theme = this.sessionService.getItem("selected-theme");
    if (theme != null && theme.length > 0) {
      this.theme = theme;
      this.themeService.selectTheme(theme);
    } else {
      this.theme = "theme-teal";
    }

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang("en");
    var language = this.sessionService.getItem("ng-prime-language");
    if (language != null && language.length > 0) {
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use(language);
    } else {
      this.sessionService.setItem("ng-prime-language", "en");
    }
  }

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.themeService.theme.subscribe((val: string) => {
      this.theme = val;
    });
  }

  ngOnDestroy() {
    this.themeService.theme.observers.forEach(function (element) {
      element.complete();
    });
    this.loaderService.status.observers.forEach(function (element) {
      element.complete();
    });
  }
}
