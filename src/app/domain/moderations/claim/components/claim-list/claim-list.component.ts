import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NewClaimModalComponent } from '../new-claim-modal/new-claim-modal.component';
import { Router } from '@angular/router';
import { SanctionTypeService } from '../../../sanction-type/services/sanction-type.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ChargeTypeEnum,
  SanctionType,
} from '../../../sanction-type/models/sanction-type.model';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
  MainContainerComponent,
  TableColumn,
  TableComponent,
} from 'ngx-dabd-grupo01';
import { SanctionTypeFormComponent } from '../../../sanction-type/components/sanction-type-form/sanction-type-form.component';
import { CommonModule } from '@angular/common';
import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';
import { ClaimService } from '../../service/claim.service';
import { ClaimDTO, ClaimStatusEnum } from '../../models/claim.model';
import { RoleService } from '../../../../../shared/services/role.service';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [
    NewClaimModalComponent,
    CommonModule,
    TableComponent,
    MainContainerComponent,
    GetValueByKeyForEnumPipe,
    TruncatePipe,
  ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss',
})
export class ClaimListComponent {
  createInfraction() {
    throw new Error('Method not implemented.');
  }
  // Services:
  private readonly router = inject(Router);
  private claimService = inject(ClaimService);
  private modalService = inject(NgbModal);

  private roleService = inject(RoleService);
  ClaimStatusEnum = ClaimStatusEnum;

  // Properties:
  items$: Observable<ClaimDTO[]> = this.claimService.items$;
  totalItems$: Observable<number> = this.claimService.totalItems$;
  isLoading$: Observable<boolean> = this.claimService.isLoading$;
  searchSubject: Subject<{ key: string; value: any }> = new Subject();
  checkedClaims: ClaimDTO[] = [];
  isAdmin: boolean = false;

  page: number = 1;
  size: number = 10;
  searchParams: { [key: string]: string } = {};

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('description') description!: TemplateRef<any>;
  @ViewChild('sanctionType') sanctionType!: TemplateRef<any>;
  @ViewChild('date') date!: TemplateRef<any>;
  @ViewChild('claimStatus') claimStatus!: TemplateRef<any>;

  @ViewChild('check') check!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(200), // Espera 200 ms después de la última emisión
        distinctUntilChanged() // Solo emite si el valor es diferente al anterior
      )
      .subscribe(({ key, value }) => {
        this.searchParams = { [key]: value };
        this.page = 1;
        this.loadItems();
      });

    this.loadItems();

    this.roleService.currentRole$.subscribe((role: string) => {
      this.isAdmin = role === 'ADMIN';
      if (this.isAdmin) {
        this.columns.unshift({
          headerName: '',
          accessorKey: 'sanction_type.created_date',
          cellRenderer: this.check,
        });
      } else {
        if (this.columns[0]?.headerName === '') {
          this.columns.shift();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        {
          headerName: 'Alta',
          accessorKey: 'sanction_type.created_date',
          cellRenderer: this.date,
        },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        {
          headerName: 'Tipo',
          accessorKey: 'sanction_type.name',
          cellRenderer: this.sanctionType,
        },

        {
          headerName: 'Descripción',
          accessorKey: 'description',
          cellRenderer: this.description,
        },
        {
          headerName: 'Estado',
          accessorKey: 'description',
          cellRenderer: this.claimStatus,
        },
        {
          headerName: 'Acciones',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  loadItems(): void {
    this.claimService
      .getPaginatedClaims(this.page, this.size, this.searchParams)
      .subscribe((response) => {
        this.claimService.setItems(response.items);
        this.claimService.setTotalItems(response.total);
      });
  }

  onPageChange = (page: number): void => {
    this.page = page;
    this.loadItems();
  };

  onPageSizeChange = (size: number): void => {
    this.size = size;
    this.loadItems();
  };

  onSearchValueChange = (key: string, searchValue: any): void => {
    this.searchSubject.next({ key, value: searchValue });
  };

  goToDetails = (id: number): void => {
    this.router.navigate(['claim', id]);
  };

  openFormModal(sanctionTypeToEdit: number | null = null): void {
    const modalRef = this.modalService.open(NewClaimModalComponent);
    modalRef.componentInstance.sanctionTypeToEdit = sanctionTypeToEdit;
  }

  checkClaim(claim: ClaimDTO): void {
    const index = this.checkedClaims.indexOf(claim);

    if (index !== -1) {
      this.checkedClaims.splice(index, 1);
    } else {
      this.checkedClaims.push(claim);
    }
  }

  disbledCheck(claim: ClaimDTO): boolean {
    if (this.checkedClaims.length == 0) {
      return false;
    }
    if (this.checkedClaims[0].sanction_type.id != claim.sanction_type.id) {
      return true;
    }
    if (this.checkedClaims[0].plot_id !== claim.plot_id) {
      return true;
    }

    return false;
  }

  includesClaimById(claim: ClaimDTO): boolean {
    return this.checkedClaims.some((c) => c.id === claim.id);
  }

  
}
