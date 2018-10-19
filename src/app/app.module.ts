import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { ProsemirrorModule } from './prosemirror/prosemirror.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ProsemirrorModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
