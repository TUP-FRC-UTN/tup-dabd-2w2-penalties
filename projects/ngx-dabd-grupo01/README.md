# TableComponent

El `TableComponent` es un componente reutilizable que muestra una tabla con soporte para paginación, búsqueda, exportación y renderizado de contenido personalizado mediante plantillas.

## Instalación

Primero, debes importar el componente en el módulo o componente donde desees utilizarlo:

```typescript
import { TableComponent } from "./table.component";
```

## Uso básico

A continuación se presenta un ejemplo básico de cómo usar el `TableComponent`:

```html
<app-table [items]="items" [columns]="columns" [pagination]="pagination" [isLoading]="isLoading"> </app-table>
```

### Inputs

- **items**: `any[]` (Requerido)
  - Los datos que se mostrarán en la tabla. Cada elemento del array representa una fila de la tabla.
- **columns**: `TableColumn[]` (Requerido)

  - Definición de las columnas que se mostrarán en la tabla. Cada columna tiene un `headerName` (nombre que aparece en el encabezado de la tabla) y un `accessorKey` (clave que indica qué propiedad del `item` se debe mostrar).

- **isLoading**: `boolean | null` (Opcional, por defecto: `false`)
  - Muestra un indicador de carga en la tabla si su valor es `true`.
- **pagination**: `TablePagination` (Opcional)

  - Objeto que maneja la paginación de la tabla. Incluye propiedades como `totalItems`, `page`, `size`, y métodos para cambiar de página o ajustar la cantidad de ítems por página.

- **height**: `string` (Opcional, por defecto: `'580px'`)

  - Define la altura de la tabla, útil para hacer la tabla con desplazamiento (scroll).

- **showSearchBar**: `boolean` (Opcional, por defecto: `true`)

  - Muestra u oculta la barra de búsqueda en la parte superior de la tabla.

- **showExportOptions**: `boolean` (Opcional, por defecto: `true`)
  - Muestra u oculta los botones de exportación (PDF y Excel).

### Outputs

- **searchValueChange**: `EventEmitter<string>`
  - Emite el valor de búsqueda cada vez que se cambia en la barra de búsqueda.

## Ejemplos de uso

### 1. Ejemplo Básico: Items, Columns e isLoading

#### Componente HTML (`basic-table.component.html`)

```html
<app-table [items]="items" [columns]="columns" [isLoading]="isLoading"></app-table>
```

#### Componente TypeScript (`basic-table.component.ts`)

```typescript
import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { TableColumn } from "path-to-table-component"; // Ajustar la ruta

@Component({
  selector: "app-basic-table",
  templateUrl: "./basic-table.component.html",
  styleUrls: ["./basic-table.component.css"],
})
export class BasicTableComponent implements OnInit {
  // Properties

  items: any[] = [];
  columns: TableColumn[] = [];
  isLoading: boolean = true;

  // Simulando un servicio con datos de ejemplo
  private dataService = {
    getItems: (): Observable<any[]> => {
      return of([
        { id: 1, name: "Item 1", description: "Description 1" },
        { id: 2, name: "Item 2", description: "Description 2" },
        { id: 3, name: "Item 3", description: "Description 3" },
      ]).pipe(delay(2000)); // Simula un retraso en la carga de los datos
    },
  };

  ngOnInit(): void {
    // Configuración de las columnas de la tabla
    this.columns = [
      { headerName: "ID", accessorKey: "id" },
      { headerName: "Name", accessorKey: "name" },
      { headerName: "Description", accessorKey: "description" },
    ];

    // Cargar los datos y simular el proceso de carga
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.dataService.getItems().subscribe((data) => {
      this.items = data;
      this.isLoading = false;
    });
  }
}
```

### Explicación

#### Inputs Utilizados

- `items`: Un array de objetos que representa los datos de la tabla. En este ejemplo, cada objeto tiene `id`, `name` y `description`.
- `columns`: Un array de objetos de tipo `TableColumn`, donde cada columna especifica un `headerName` y un `accessorKey` para mapear los datos de `items`.
- `isLoading`: Un booleano que indica si los datos aún están cargándose. Mientras esté en `true`, se mostrará un estado de carga.

### 2. Ejemplo con componentes añadidos

1. Un botón que permite recargar los datos.
2. Un `select` que simula ser un filtro para los elementos de la tabla.

### Ejemplo con Botón y Select de Filtro

#### Componente HTML (`filter-table.component.html`)

```html
<!-- Tabla que muestra los datos -->
<app-table [items]="filteredItems" [columns]="columns" [isLoading]="isLoading">
  <!-- Select para simular filtro -->
  <select id="filter" [(ngModel)]="selectedFilter" (change)="filterItems()">
    <option value="">All</option>
    <option *ngFor="let item of originalItems" [value]="item.name">{{ item.name }}</option>
  </select>

  <!-- Botón para recargar los datos -->
  <button (click)="reloadData()">Reload Data</button>
</app-table>
```

#### Componente TypeScript (`filter-table.component.ts`)

```typescript
import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { TableColumn } from "path-to-table-component"; // Ajustar la ruta

@Component({
  selector: "app-filter-table",
  templateUrl: "./filter-table.component.html",
  styleUrls: ["./filter-table.component.css"],
})
export class FilterTableComponent implements OnInit {
  // Properties

  originalItems: any[] = [];
  filteredItems: any[] = [];
  columns: TableColumn[] = [];
  isLoading: boolean = true;
  selectedFilter: string = "";

  // Simulando un servicio con datos de ejemplo
  private dataService = {
    getItems: (): Observable<any[]> => {
      return of([
        { id: 1, name: "Item 1", description: "Description 1" },
        { id: 2, name: "Item 2", description: "Description 2" },
        { id: 3, name: "Item 3", description: "Description 3" },
      ]).pipe(delay(2000)); // Simula un retraso en la carga de los datos
    },
  };

  ngOnInit(): void {
    // Configuración de las columnas de la tabla
    this.columns = [
      { headerName: "ID", accessorKey: "id" },
      { headerName: "Name", accessorKey: "name" },
      { headerName: "Description", accessorKey: "description" },
    ];

    // Cargar los datos iniciales
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.dataService.getItems().subscribe((data) => {
      this.originalItems = data;
      this.filteredItems = data; // Inicialmente, mostrar todos los datos
      this.isLoading = false;
    });
  }

  filterItems(): void {
    if (this.selectedFilter === "") {
      this.filteredItems = this.originalItems; // Si no hay filtro, mostrar todos
    } else {
      this.filteredItems = this.originalItems.filter((item) => item.name === this.selectedFilter);
    }
  }

  reloadData(): void {
    // Recargar los datos simulando una nueva obtención del servicio
    this.loadData();
  }
}
```

### 3. Ejemplo con Paginación

#### Componente HTML (`pagination-table.component.html`)

```html
<app-table
  [items]="(items$ | async) || []"
  [columns]="columns"
  [pagination]="{
    totalItems: (totalItems$ | async) || 0,
    page: page,
    size: size,
    onPageChange: onPageChange,
    onPageSizeChange: onPageSizeChange
  }"
  [isLoading]="isLoading$ | async"
  [showSearchBar]="true"
  [showExportOptions]="true"
>
</app-table>
```

#### Componente TypeScript (`pagination-table.component.ts`)

```typescript
@Component({
  selector: "app-item-list",
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: "./item-list.component.html",
})
export class ItemListComponent {
  // Servicios
  private itemService = inject(ItemService);

  // Propiedades
  items$: Observable<ItemResponseDto[]> = this.itemService.items$;
  totalItems$: Observable<number> = this.itemService.totalItems$;
  isLoading$: Observable<boolean> = this.itemService.isLoading$;
  page: number = 1;
  size: number = 10;

  columns: TableColumn[] = [
    { headerName: "Id", accessorKey: "item_id" },
    { headerName: "Project Name", accessorKey: "project_name" },
    { headerName: "Start Date", accessorKey: "start_date" },
    { headerName: "End Date", accessorKey: "end_date" },
  ];

  // Métodos
  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAllItems(this.page, this.size).subscribe();
  }

  onPageChange = (page: number): void => {
    this.page = page;
    this.loadItems();
  };

  onPageSizeChange = (size: number): void => {
    this.size = size;
    this.loadItems();
  };
}
```

4.  Para agregar un formateo personalizado a una columna de la tabla, como en el ejemplo donde añadiste un botón a la columna "Actions", puedes usar una plantilla Angular (`ng-template`) con `cellRenderer`. Aquí te muestro cómo hacerlo, utilizando un ejemplo en el que se añade un botón para ver detalles y otro para eliminar en la columna "Acciones" de una tabla.

### Paso 1: Crear el `ng-template` con los botones (en el HTML del componente)

```html
<ng-template #actionsTemplate let-item>
  <button class="btn btn-primary btn-sm me-2" (click)="goToDetails(item.item_id)">Ver más</button>
  <button class="btn btn-danger btn-sm" (click)="deleteItem(item.item_id)">Eliminar</button>
</ng-template>
```

### Paso 2: Configurar la tabla para utilizar el `cellRenderer` en la columna "Acciones" (en el archivo `.ts` del componente)

```typescript
@Component({
  selector: "app-item-list",
  standalone: true,
  imports: [CommonModule, TableComponent, MainContainerComponent],
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.css"],
})
export class ItemListComponent {
  // Services:
  private readonly router = inject(Router);
  private itemService = inject(ItemService);
  private modalService = inject(NgbModal);

  // Properties:
  items$: Observable<Item[]> = this.itemService.items$;
  totalItems$: Observable<number> = this.itemService.totalItems$;
  page: number = 1;
  size: number = 10;

  @ViewChild("actionsTemplate") actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngOnInit(): void {
    this.loadItems();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: "Id", accessorKey: "item_id" },
        { headerName: "Description", accessorKey: "description" },

        {
          headerName: "Actions",
          accessorKey: "actions",
          cellRenderer: this.actionsTemplate, // Asignamos el cellRenderer con la plantilla
        },
      ];
    });
  }

  loadItems(): void {
    this.itemService.getAllItems(this.page, this.size).subscribe((response) => {
      this.itemService.setItems(response.items);
      this.itemService.setTotalItems(response.total);
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

  goToDetails(id: number): void {
    this.router.navigate(["items", id]);
  }

  deleteItem(id: number): void {
    // Lógica para eliminar el item
    console.log(`Item con ID ${id} eliminado`);
  }
}
```

### Explicación:

- **`@ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;`**: Esto nos permite acceder al `ng-template` dentro del componente, y lo asignamos a la columna "Actions" mediante `cellRenderer`.
- **Plantilla `#actionsTemplate`**: Aquí defines los botones personalizados (Ver más y Eliminar) que se renderizan en la columna "Acciones".
- **`cellRenderer: this.actionsTemplate`**: Usamos `cellRenderer` para que la tabla renderice esta plantilla personalizada en la columna "Acciones".

## Interfaces

### `TableColumn`

```typescript
export interface TableColumn {
  headerName: string; // El nombre del encabezado de la columna
  accessorKey: string; // La clave del dato en los ítems para mostrar en la columna
  cellRenderer?: TemplateRef<any>; // Opcional: un template para renderizar contenido personalizado
}
```

### `TablePagination`

```typescript
export interface TablePagination {
  totalItems: number; // Total de ítems en la tabla
  page: number; // Página actual
  size: number; // Tamaño de la página (cantidad de ítems por página)
  onPageChange: (page: number) => void; // Método que se llama al cambiar la página
  onPageSizeChange: (itemsPerPage: number) => void; // Método que se llama al cambiar el tamaño de ítems por página
}
```
