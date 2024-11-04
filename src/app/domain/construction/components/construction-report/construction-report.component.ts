import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MainContainerComponent } from '../../../../../../projects/ngx-dabd-grupo01/src/lib/main-container/main-container.component';
import { TableComponent } from '../../../../../../projects/ngx-dabd-grupo01/src/lib/table/table.component';
import {
  CONSTRUCTION_STATUSES_ENUM,
  ConstructionResponseDto,
} from '../../models/construction.model';
import { Observable } from 'rxjs';
import { ConstructionService } from '../../services/construction.service';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import {Filter, FilterConfigBuilder, TableColumn} from '../../../../../../projects/ngx-dabd-grupo01/src/public-api';
import { CommonModule } from '@angular/common';
import { GetValueByKeyForEnumPipe } from '../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-construction-report',
  standalone: true,
  imports: [
    MainContainerComponent,
    TableComponent,
    CommonModule,
    GetValueByKeyForEnumPipe,
    BaseChartDirective,
  ],
  templateUrl: './construction-report.component.html',
  styleUrl: './construction-report.component.scss',
})
export class ConstructionReportComponent {
  constructionService = inject(ConstructionService);

  CONSTRUCTION_STATUSES_ENUM = CONSTRUCTION_STATUSES_ENUM;

  columns: TableColumn[] = [];

  searchParams: { [key: string]: any } = {};

  items$: Observable<ConstructionResponseDto[]> =
    this.constructionService.items$;
  isLoading$: Observable<boolean> = this.constructionService.isLoading$;

  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  averageDuration = '';
  averageWorkers = '';

  // Datos genéricos para gráficos
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  // Datos para el gráfico de torta de construcciones por tipo de sanción
  public pieChartStatusLabels: string[] = [];
  public pieChartStatusDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ],
    },
  ];

  public lineChartLegend = true;

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Filtros:

  filterConfig: Filter[] = new FilterConfigBuilder()
    .dateFilter('Fecha desde', 'startDate', 'Placeholder')
    .dateFilter('Fecha hasta', 'endDate', 'Placeholder')
    .build();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Construcción', accessorKey: 'construction_id' },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        { headerName: 'Inicio', accessorKey: 'planned_start_date' },
        { headerName: 'Finalización', accessorKey: 'planned_end_date' },
        { headerName: 'Nombre', accessorKey: 'project_name' },
        { headerName: 'Dirección', accessorKey: 'project_address' },
        {
          headerName: 'Estado',
          accessorKey: 'construction_status',
          cellRenderer: this.statusTemplate,
        },
      ];
    });

    this.loadItems();

    this.items$.subscribe((items) => {
      this.updatePieChartStatusData(items);
    });
  }

  loadItems(): void {
    this.constructionService
      .getAllConstructions(1, 1000, this.searchParams)
      .subscribe((response) => {
        this.constructionService.setItems(response.items);
        this.constructionService.setTotalItems(response.total);
      });
  }

  onFilterValueChange(filters: Record<string, any>) {
    this.searchParams = {
      ...filters,
    };

    this.loadItems();
  }

  private updatePieChartStatusData(items: ConstructionResponseDto[]): void {
    const statusCounts: Record<string, number> = {};

    items.forEach((item) => {
      let status;
      const itemStatus = item.construction_status.toString();

      switch (itemStatus) {
        case 'APPROVED':
          status = 'Aprobada';
          break;
        case 'LOADING':
          status = 'En proceso de carga';
          break;
        case 'REJECTED':
          status = 'Rechazada';
          break;
        case 'IN_PROGRESS':
          status = 'En progreso';
          break;
        case 'COMPLETED':
          status = 'Finalizada';
          break;
        default:
          status = 'Desconocido';
      }

      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    this.pieChartStatusLabels = Object.keys(statusCounts);
    this.pieChartStatusDatasets[0].data = Object.values(statusCounts);
    this.updateKPIsData(items);
  }

  private updateKPIsData(items: ConstructionResponseDto[]): void {
    let totalDuration = 0;
    let totalWorkers = 0;

    items.forEach((item) => {
      const startDate = (item.actual_start_date || item.planned_start_date)
        .split('/')
        .reverse()
        .join('-');
      const endDate = (item.actual_end_date || item.planned_end_date)
        .split('/')
        .reverse()
        .join('-');

      const durationInDays = Math.floor(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 3600 * 24)
      );

      totalDuration += durationInDays;
      totalWorkers += item.workers.length;

      console.log({
        startDate,
        endDate,
        durationInDays,
        totalDuration,
        totalWorkers,
      });
    });

    const averageDurationInDays = Math.floor(totalDuration / items.length);
    const averageWorkers = Math.round(totalWorkers / items.length);

    const years = Math.floor(averageDurationInDays / 365);
    const remainingDaysAfterYears = averageDurationInDays % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);
    const days = remainingDaysAfterYears % 30;

    const yearString = years > 1 || years === 0 ? 'años' : 'año';
    const monthString = months > 1 || months === 0 ? 'meses' : 'mes';
    const dayString = days > 1 ? 'días' : 'dia';

    const workerString = averageWorkers > 1 ? 'trabajadores' : 'trabajador';

    const averageDurationString = `${years} ${yearString}, ${months} ${monthString} y ${days} ${dayString}`;
    const averageWorkersString = `${averageWorkers} ${workerString}`;

    this.averageDuration = averageDurationString;
    this.averageWorkers = averageWorkersString;
  }
}
