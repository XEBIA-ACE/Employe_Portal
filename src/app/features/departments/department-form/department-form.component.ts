import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
})
export class DepartmentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  departmentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private deptService: DepartmentService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (this.departmentId) {
      this.isEditMode = true;
      this.loadDepartment(this.departmentId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(10)]],
      description: [''],
      location: [''],
      isActive: [true],
      budget: [null, [Validators.min(0)]],
      currency: ['USD'],
    });
  }

  private loadDepartment(id: string): void {
    this.isLoading = true;
    this.deptService.getDepartment(id).subscribe({
      next: (dept) => {
        this.form.patchValue(dept);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.goBack();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.form.value;

    const request$ = this.isEditMode && this.departmentId
      ? this.deptService.updateDepartment(this.departmentId, payload)
      : this.deptService.createDepartment(payload);

    request$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => {
        const msg = this.isEditMode ? 'Department updated.' : 'Department created.';
        this.notification.success(msg);
        this.goBack();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/departments']);
  }
}
