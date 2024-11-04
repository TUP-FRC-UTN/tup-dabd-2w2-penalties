import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MainContainerComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/lib/main-container/main-container.component';
import { TableComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/lib/table/table.component';
import { Observable } from 'rxjs';
import { Fine } from '../../models/fine.model';
import { FineService } from '../../services/fine.service';
import { CommonModule } from '@angular/common';
import { TableColumn } from 'ngx-dabd-grup01';
import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { FineStatusEnum } from '../../models/fine-status.enum';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import {
  Filter,
  FilterConfigBuilder,
} from '../../../../../../../projects/ngx-dabd-grupo01/src/public-api';

@Component({
  selector: 'app-fine-reports',
  standalone: true,
  imports: [
    CommonModule,
    MainContainerComponent,
    TableComponent,
    GetValueByKeyForEnumPipe,
    BaseChartDirective,
  ],
  templateUrl: './fine-reports.component.html',
  styleUrl: './fine-reports.component.scss',
})
export class FineReportsComponent {
  fineService = inject(FineService);

  columns: TableColumn[] = [];
  FineStatusEnum = FineStatusEnum;

  searchParams: { [key: string]: any } = {};

  items$: Observable<Fine[]> = this.fineService.items$;
  isLoading$: Observable<boolean> = this.fineService.isLoading$;

  @ViewChild('fineState') fineStateTemplate!: TemplateRef<any>;
  @ViewChild('fineDate') fineDateTemplate!: TemplateRef<any>;

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

  // Datos para el gráfico de torta de multas por tipo de sanción
  public pieChartSanctionTypeLabels: string[] = [];
  public pieChartSanctionTypeDatasets: ChartDataset<'pie', number[]>[] = [
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

  // Datos para el gráfico de barras de multas por lote
  public barChartPlotData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Cantidad de Multas',
      },
    ],
  };

  // Datos para el grafico de torta de multas por estado
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

  // Datos para el grafico de barras de multas por mes
  public barChartMonthlyData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Multas por Mes',
      },
    ],
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Nº', accessorKey: 'id' },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        {
          headerName: 'Tipo',
          accessorKey: 'type',
          cellRenderer: this.fineStateTemplate,
        },
        {
          headerName: 'Alta',
          accessorKey: 'type',
          cellRenderer: this.fineDateTemplate,
        },
      ];
    });

    this.loadItems();

    this.items$.subscribe((items) => {
      this.updatePieSanctionTypeChartData(items);
      this.updateBarPlotChartData(items);
      this.updatePieChartStatusData(items);
      this.updateBarChartMonthlyData(items);
    });
  }

  loadItems(): void {
    this.fineService
      .getPaginatedFines(1, 1000, this.searchParams)
      .subscribe((response) => {
        this.fineService.setItems(response.items);
        this.fineService.setTotalItems(response.total);
      });
  }

  // Multas por tipo de sanción
  private updatePieSanctionTypeChartData(items: Fine[]): void {
    const sanctionTypeCounts: Record<string, number> = {};

    items.forEach((item) => {
      const sanctionType = item.sanction_type.name;
      sanctionTypeCounts[sanctionType] =
        (sanctionTypeCounts[sanctionType] || 0) + 1;
    });

    this.pieChartSanctionTypeLabels = Object.keys(
      sanctionTypeCounts
    ) as string[];
    this.pieChartSanctionTypeDatasets[0].data = Object.values(
      sanctionTypeCounts
    ) as number[];
  }

  // Multas por estado
  private updatePieChartStatusData(items: Fine[]): void {
    const statusCounts: Record<string, number> = {};

    items.forEach((item) => {
      let status;
      const itemStatus = item.fine_state.toString();

      switch (itemStatus) {
        case 'APPROVED':
          status = 'Aprobada';
          break;
        case 'ON_ASSEMBLY':
          status = 'En asamblea';
          break;
        case 'REJECTED':
          status = 'Rechazada';
          break;
        default:
          status = 'Desconocido';
      }

      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    this.pieChartStatusLabels = Object.keys(statusCounts);
    this.pieChartStatusDatasets[0].data = Object.values(statusCounts);
  }

  // Multas por mes
  private updateBarChartMonthlyData(items: Fine[]): void {
    const monthlyCounts: Record<string, number> = {};

    items.forEach((item) => {
      const month = new Date(item.created_date).toLocaleString('default', {
        month: 'long',
      });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    this.barChartMonthlyData = {
      labels: Object.keys(monthlyCounts).map(
        (key) => `${key[0].toUpperCase()}${key.slice(1)}`
      ),
      datasets: [
        { data: Object.values(monthlyCounts), label: 'Cantidad de Multas' },
      ],
    };
  }

  // Multas por lote
  private updateBarPlotChartData(items: Fine[]): void {
    const plotCounts: Record<number, number> = {};

    items.forEach((item) => {
      const plotId = item.plot_id;
      plotCounts[plotId] = (plotCounts[plotId] || 0) + 1;
    });

    this.barChartPlotData = {
      labels: Object.keys(plotCounts).map((key) => `Lote ${key}`),
      datasets: [
        { data: Object.values(plotCounts), label: 'Cantidad de Multas' },
      ],
    };
  }

  filterConfig: Filter[] = new FilterConfigBuilder()
    .dateFilter('Fecha desde', 'startDate', 'Placeholder')
    .dateFilter('Fecha hasta', 'endDate', 'Placeholder')
    .build();

  onFilterValueChange(filters: Record<string, any>) {
    this.searchParams = {
      ...filters,
    };

    this.loadItems();
  }
}
