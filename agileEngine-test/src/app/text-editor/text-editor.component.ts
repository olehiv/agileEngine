import {Component, Input, NgZone, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
const endpoint = 'https://api.datamuse.com/sug?k=demo&v=enwiki&s=';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  @Input() buttons: any;

  public editor;
  public currentSelectedText;
  public synonyms: any;
  public tooltipTop;
  public tooltipLeft;

  public storageOptions = {};
  public activeActions: string[] = [];

  public bClick(action) {
    this.editor.contentDocument.execCommand(action, false, null);
    this.setToMemory(action);
  }

  public setToMemory(action) {
    let arr = this.storageOptions[this.currentSelectedText] = this.storageOptions[this.currentSelectedText] || [];
    const i = arr.indexOf(action);
    i !== -1 ? arr.splice(i, 1) : arr.push(action);
    this.storageOptions[this.currentSelectedText] = [...arr];
    this.activeActions = [...this.storageOptions[this.currentSelectedText]];
    this.updateButtonsAccordingToAction();
  }

  constructor(
    public zone: NgZone,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.preparIframe();
    this.registeriframeClick();
  }

  private preparIframe() {
    this.editor = (document.getElementById('textEditorFrame') as any);
    this.editor.contentDocument.body.contentEditable = true;
  }

  private registeriframeClick() {
    this.editor.contentWindow.document.body.onclick = this.iframeClick.bind(this);
  }

  private iframeClick(event) {
    setTimeout(() => {
      this.zone.run(() => {
        this.currentSelectedText = this.getIframeSelectionText(this.editor);
        if (this.currentSelectedText.length > 0) {
          this.http.get(endpoint + this.currentSelectedText).subscribe(data => {
            this.synonyms = data;

            console.log(this.currentSelectedText);
            this.tooltipTop = (event.clientY + 10) + 'px';
            this.tooltipLeft = (event.clientX + 10) + 'px';
          });
        }
        this.storageOptions[this.currentSelectedText] = this.storageOptions[this.currentSelectedText] || [];
        this.activeActions = (this.currentSelectedText.length > 1) ? [...this.storageOptions[this.currentSelectedText]] : [];
        this.updateButtonsAccordingToAction();
      });
    }, 0);
  }

  private updateButtonsAccordingToAction() {
    this.buttons = this.buttons.map(b => {
      b.selected = (this.activeActions.indexOf(b.action) !== -1);
      return b;
    })
  }

  private getIframeSelectionText(iframe) {
    let win = iframe.contentWindow;
    let doc = win.document;

    if (win.getSelection) {
      return win.getSelection().toString();
    } else if (doc.selection && doc.selection.createRange) {
      return doc.selection.createRange().text;
    }
  }

}
