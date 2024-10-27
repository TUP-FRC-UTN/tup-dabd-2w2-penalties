import {
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Plot } from '../../../../cadastre/plot/models/plot.model';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ClaimService } from '../../service/claim.service';
import { SanctionTypeService } from '../../../sanction-type/services/sanction-type.service';
import { CadastreService } from '../../../../cadastre/services/cadastre.service';
import { SanctionType } from '../../../sanction-type/models/sanction-type.model';
import { CommonModule, NgClass } from '@angular/common';
import { ClaimNew } from '../../models/claim.model';
import { RoleService } from '../../../../../shared/services/role.service';

@Component({
  selector: 'app-new-claim-modal',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './new-claim-modal.component.html',
  styleUrl: './new-claim-modal.component.scss',
})
export class NewClaimModalComponent implements OnInit {
  //services
  private cadastreService = inject(CadastreService);
  private sanctionService = inject(SanctionTypeService);
  private claimService = inject(ClaimService);
  private roleService = inject(RoleService);

  //variables
  plots: Plot[] | undefined;
  sanctionTypes: SanctionType[] | undefined;
  plotId: number | undefined;
  sanctionTypeId: number | undefined;
  description: string | undefined;

  userId: number | undefined;

  //variable para los archivos
  selectedFiles: File[] = [];

  // Modal logic
  private modalService = inject(NgbModal);
  closeResult = '';
  activeModal = inject(NgbActiveModal);

  ngOnInit() {
    this.roleService.currentUserId$.subscribe((userId: number) => {
      this.userId = userId;
    });

    // Obtener lotes
    this.cadastreService.getPlots().subscribe({
      next: (response) => {
        this.plots = response.content;
      },
      error: (error) => {
        console.error('Error fetching plots:', error);
      },
    });

    // Obtener tipos de sanción
    this.sanctionService.getSanctionTypes().subscribe({
      next: (response) => {
        this.sanctionTypes = response;
      },
      error: (error) => {
        console.error('Error fetching sanction types:', error);
      },
    });
  }

  //medotod de agregar archivos
  onFilesSelected(event: any) {
    const files = event.target.files;
    this.selectedFiles = [];
    for (let file of files) {
      this.selectedFiles.push(file);
    }
  }

  // Método para enviar el formulario de reclamos
  submitClaim() {
    if (
      this.plotId &&
      this.sanctionTypeId &&
      this.description &&
      this.imageForm.valid
    ) {
      const newClaim: ClaimNew = {
        // user_id: this.userId!,
        plot_id: this.plotId,
        sanction_type_entity_id: this.sanctionTypeId,
        description: this.description,
        proofs_id: [], // vacío por ahora
      };

      console.log({ cameraFile: this.imageForm.get('image')?.value });

      this.claimService.createClaim(newClaim).subscribe({
        next: (response) => {
          console.log('Reclamo creado con éxito', response);
        },
        error: (error) => {
          console.error('Error al crear el reclamo:', error);
        },
      });
    } else {
      console.error('Faltan datos obligatorios en el formulario');
    }
  }

  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;

  private stream: MediaStream | null = null;

  imageForm: FormGroup;
  isCameraOpen = false;
  isFrontCamera: boolean = true;
  capturedImage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.imageForm = this.fb.group({
      image: [null],
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.capturedImage = reader.result as string;
        this.imageForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  async startCamera(): Promise<void> {
    try {
      this.isCameraOpen = true;
      const constraints = {
        video: {
          facingMode: this.isFrontCamera ? 'user' : 'environment',
        },
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoPreview.nativeElement.srcObject = this.stream;
    } catch (error) {
      console.error('Error al acceder a la cámara: ', error);
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.isCameraOpen = false;
      this.stream = null;
    }
  }

  capturePhoto(): void {
    if (this.stream) {
      const video = this.videoPreview.nativeElement;
      const canvas = document.createElement('canvas');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.capturedImage = canvas.toDataURL('image/png');
        this.imageForm.patchValue({ image: this.capturedImage });
      }

      this.stopCamera();
    }
  }

  toggleCamera() {
    this.isFrontCamera = !this.isFrontCamera;
    this.stopCamera();
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  removeCapturedImage(): void {
    this.capturedImage = null;
    this.imageForm.patchValue({ image: null });
  }
}
