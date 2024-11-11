import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MainContainerComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/lib/main-container/main-container.component';
import { TableComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/lib/table/table.component';
import { ConfirmAlertComponent, TableColumn } from 'ngx-dabd-grupo01';
import { Observable } from 'rxjs';
import {
  InfractionResponseDTO,
  InfractionStatusEnum,
} from '../../models/infraction.model';
import { InfractionServiceService } from '../../services/infraction-service.service';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import {
  Filter,
  FilterConfigBuilder,
} from '../../../../../../../projects/ngx-dabd-grupo01/src/public-api';
import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { BaseChartDirective } from 'ng2-charts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-infraction-reports',
  standalone: true,
  imports: [
    CommonModule,
    MainContainerComponent,
    TableComponent,
    GetValueByKeyForEnumPipe,
    BaseChartDirective,
  ],
  templateUrl: './infraction-reports.component.html',
  styleUrl: './infraction-reports.component.scss',
})
export class InfractionReportsComponent {
  infractionService = inject(InfractionServiceService);

  columns: TableColumn[] = [];

  InfractionStatusEnum = InfractionStatusEnum;

  searchParams: { [key: string]: any } = {};

  private modalService = inject(NgbModal);

  items$: Observable<InfractionResponseDTO[]> = this.infractionService.items$;
  isLoading$: Observable<boolean> = this.infractionService.isLoading$;

  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;
  @ViewChild('fineTemplate') fineTemplate!: TemplateRef<any>;

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

  // Datos para el gráfico de torta de infracciones por tipo de sanción
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

  // datos para el gráfico de barras de infracciones por lote
  public barChartPlotData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Cantidad de Infracciones',
      },
    ],
  };

  // Filtros:

  filterConfig: Filter[] = new FilterConfigBuilder()
    .dateFilter('Fecha desde', 'startDate', 'Placeholder')
    .dateFilter('Fecha hasta', 'endDate', 'Placeholder')
    .build();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'N.°', accessorKey: 'id' },
        {
          headerName: 'Alta',
          accessorKey: 'created_date',
          cellRenderer: this.dateTemplate,
        },
        {
          headerName: 'Multa',
          accessorKey: 'fine_id',
          cellRenderer: this.fineTemplate,
        },
        {
          headerName: 'Estado',
          accessorKey: 'infraction_status',
          cellRenderer: this.statusTemplate,
        },
        { headerName: 'Lote', accessorKey: 'plot_id' },
      ];
    });

    this.loadItems();

    this.items$.subscribe((items) => {
      this.updatePieChartStatusData(items);
      this.updateBarPlotChartData(items);
      /* thisthis.updatePieChartStatusData(items);
      this.updateBarChartMonthlyData(items); */
    });
  }

  loadItems(): void {
    this.infractionService
      .getAllInfractions(1, 1000, this.searchParams)
      .subscribe((response) => {
        this.infractionService.setItems(response.items);
        this.infractionService.setTotalItems(response.total);
      });
  }

  onFilterValueChange(filters: Record<string, any>) {
    this.searchParams = {
      ...filters,
    };

    this.loadItems();
  }

  private updatePieChartStatusData(items: InfractionResponseDTO[]): void {
    const statusCounts: Record<string, number> = {};

    items.forEach((item) => {
      let status;
      const itemStatus = item.infraction_status.toString();

      switch (itemStatus) {
        case 'APPROVED':
          status = 'Aprobada';
          break;
        case 'ON_APPEALING':
          status = 'En asamblea';
          break;
        case 'REJECTED':
          status = 'Rechazada';
          break;
        case 'CREATED':
          status = 'Creada';
          break;
        default:
          status = 'Desconocido';
      }

      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    this.pieChartStatusLabels = Object.keys(statusCounts);
    this.pieChartStatusDatasets[0].data = Object.values(statusCounts);
  }

  // infracciones por lote
  private updateBarPlotChartData(items: InfractionResponseDTO[]): void {
    const plotCounts: Record<number, number> = {};

    items.forEach((item) => {
      const plotId = item.plot_id;
      plotCounts[plotId] = (plotCounts[plotId] || 0) + 1;
    });

    this.barChartPlotData = {
      labels: Object.keys(plotCounts).map((key) => `Lote ${key}`),
      datasets: [
        { data: Object.values(plotCounts), label: 'Cantidad de infracciones' },
      ],
    };
  }

  infoModal() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertType = 'info';

    modalRef.componentInstance.alertTitle = 'Ayuda';
    modalRef.componentInstance.alertMessage = `Esta pantalla presenta reportes detallados de las infracciones registradas, ofreciendo información clave sobre cada construcción, como el número de construcción, lote, fechas de inicio y finalización, y el motivo de la infracción. Además, cuenta con gráficos interactivos que permiten visualizar el estado de las construcciones y analizar distintos aspectos, como la distribución de infracciones por tipo de sanción, estado, lote y mes, proporcionando una comprensión visual de las tendencias y patrones. También incluye estadísticas relevantes, como la duración promedio de las obras y la cantidad promedio de trabajadores. Las herramientas de filtrado, búsqueda y exportación facilitan una gestión efectiva de los datos, permitiendo al usuario organizar y analizar la información de manera precisa y estructurada.`;
  }
}
