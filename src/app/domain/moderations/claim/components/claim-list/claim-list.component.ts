import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  ɵɵsetComponentScope,
} from '@angular/core';
import { NewClaimModalComponent } from '../new-claim-modal/new-claim-modal.component';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
  MainContainerComponent,
  TableColumn,
  TableComponent,
} from 'ngx-dabd-grupo01';
import { CommonModule } from '@angular/common';
import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';
import { ClaimService } from '../../service/claim.service';
import { ClaimDTO, ClaimStatusEnum } from '../../models/claim.model';
import { RoleService } from '../../../../../shared/services/role.service';
import { NewInfractionModalComponent } from '../../../infraction/components/new-infraction-modal/new-infraction-modal.component';
import { FormsModule } from '@angular/forms';

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
    NgbDropdownModule,
    FormsModule,
  ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss',
})
export class ClaimListComponent {
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
  claimStatusKeys: string[] = [];

  role: string = '';
  userId: number | undefined;
  userPlotsIds: number[] = [];

  page: number = 1;
  size: number = 10;
  filterType: string = '';
  status: string = '';
  startDate: string = '';
  endDate: string = '';
  searchParams: { [key: string]: string | string[] | number[] | number } = {};

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('description') description!: TemplateRef<any>;
  @ViewChild('sanctionType') sanctionType!: TemplateRef<any>;
  @ViewChild('date') date!: TemplateRef<any>;
  @ViewChild('claimStatus') claimStatus!: TemplateRef<any>;
  @ViewChild('infraction') infraction!: TemplateRef<any>;

  @ViewChild('check') check!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngOnInit(): void {
    this.roleService.currentUserId$.subscribe((userId: number) => {
      this.userId = userId;
      this.loadItems();
    });

    this.roleService.currentLotes$.subscribe((plots: number[]) => {
      this.userPlotsIds = plots;
      this.loadItems();
    });

    this.roleService.currentRole$.subscribe((role: string) => {
      this.role = role;
      if (this.role === 'ADMIN') {
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
      this.loadItems();
    });

    this.claimStatusKeys = Object.keys(ClaimStatusEnum) as Array<
      keyof typeof ClaimStatusEnum
    >;
    this.searchSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(({ key, value }) => {
        this.searchParams = { [key]: value };
        this.page = 1;
        this.loadItems();
      });

    this.loadItems();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Nº de Multa', accessorKey: 'id' },
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
          headerName: 'Infracción',
          accessorKey: 'description',
          cellRenderer: this.infraction,
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
    if (this.role !== 'ADMIN') {
      this.searchParams = {
        ...this.searchParams,
        plotsIds: this.userPlotsIds,
        userId: this.userId!,
      };
    } else {
      if (this.searchParams['userId']) {
        delete this.searchParams['userId'];
      }
      if (this.searchParams['plotsIds']) {
        delete this.searchParams['plotsIds'];
      }
    }

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

  goToDetails = (id: number, mode: 'detail' | 'edit'): void => {
    this.router.navigate(['claim', id, mode]);
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

  openCreateInfractionModal(): void {
    const modalRef = this.modalService.open(NewInfractionModalComponent);
    modalRef.componentInstance.claims = this.checkedClaims;
    modalRef.componentInstance.sanctionTypeNumber =
      this.checkedClaims[0].sanction_type.id;
    modalRef.componentInstance.plotId = this.checkedClaims[0].plot_id;

    modalRef.result
      .then((result) => {
        if (result) {
          this.loadItems();
          this.checkedClaims = [];
        }
      })
      .catch(() => {});
  }

  setFilterType(type: string): void {
    this.filterType = type;
  }

  clearFilters(): void {
    this.filterType = '';
    this.startDate = '';
    this.endDate = '';
    this.status = '';
    this.searchParams = {};
    this.loadItems();
  }

  applyFilters(): void {
    if (this.filterType === 'fecha') {
      this.searchParams = {
        startDate: this.startDate,
        endDate: this.endDate,
      };
    } else if (this.filterType === 'estado') {
      this.searchParams = { claimStatus: [this.status] };
    }
    this.page = 1;
    this.loadItems();
  }

  disapproveClaim(id: number) {
    throw new Error('Method not implemented.');
  }
}
