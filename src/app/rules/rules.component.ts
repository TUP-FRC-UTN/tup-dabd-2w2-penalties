import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MainContainerComponent } from '../../../projects/ngx-dabd-grupo01/src/lib/main-container/main-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  Heading,
  List,
  Indent,
} from 'ckeditor5';
import { RoleService } from '../shared/services/role.service';
import {ConfigurationPenaltiesService} from "../shared/services/configuration-penalties.service";
import {RuleDto, Rules} from "./rules";
import * as http from "node:http";

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [MainContainerComponent, CommonModule, FormsModule, CKEditorModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent {
  //services
  private roleService = inject(RoleService);

  public Editor = ClassicEditor;

  private configService = inject(ConfigurationPenaltiesService);

  //variables
  rulesContent: string = '';
  editMode: boolean = false;
  isAdmin: boolean = true;
  currentRules!:Rules;


  public config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
    ],
    plugins: [Essentials, Bold, Italic, Undo, Paragraph, Heading, List, Indent],
    language: { ui: 'en' },
  };

  //methods
  ngOnInit(): void {
    this.roleService.currentRole$.subscribe((role: string) => {
      this.isAdmin = role === "ADMIN";
    });


    this.loadRules();
  }

  loadRules(): void {
    console.log("fetching data")
    this.configService.getRules().subscribe(rules => {
      console.log("data: ",rules)
      this.currentRules = rules;
      this.rulesContent = rules.rules
      console.log('rules object loaded ', this.currentRules);
      console.log('current rules: '+this.rulesContent)
    })
  }

  onChange({ editor }: any): void {
    this.rulesContent = editor.getData();
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  saveRules(): void {
    // localStorage.setItem('rulesContent', this.rulesContent);


    const newRules:Rules = this.currentRules
    newRules.rules= this.rulesContent;

    this.configService.putRules(newRules,5).subscribe({
      next: (result) => {
        console.log('new rules: ', result.rules);
        this.loadRules()
        this.editMode = false;
      },
      error: (error) => {
        console.log('error: ', error);
      }

    })

  }
}
