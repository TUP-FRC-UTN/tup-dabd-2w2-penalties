import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './role-selector.component.html',
  styleUrl: './role-selector.component.scss'
})
export class RoleSelectorComponent {
  roles: string[] = ['OWNER', 'ADMIN', 'USER'];
  selectedRole: string = '';

  lotes: number[] = [1, 2, 3, 4, 5];  
  selectedLotes: number[] = []; 
  
  userIds: number[] = [1, 2, 3, 4, 5];  
  selectedUserId: number = 0;  

  constructor(private roleService: RoleService) {}

  onRoleChange(event: Event) {
    const target = event.target as HTMLSelectElement; 
    const selectedValue = target.value;
    this.roleService.changeRole(selectedValue);
    console.log(`Selected role: ${selectedValue}`);
  }

  onLotesChange(event: any) {
    this.selectedLotes = Array.from(event.target.selectedOptions, (option: any) => option.value);
    this.roleService.changeLotes(this.selectedLotes);
    console.log(`Selected lotes: ${this.selectedLotes}`);
  }

  onUserIdChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.selectedUserId = +selectedValue;  
    this.roleService.changeUserId(this.selectedUserId);
    console.log(`Selected User ID: ${this.selectedUserId}`);
  }
}
