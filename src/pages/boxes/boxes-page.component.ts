import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxItemComponent } from '../../components/box-item/box-item.component';
import { OptionComponent } from '../../components/option/option.component';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-boxes-page-component',
  standalone: true,
  imports: [CommonModule, BoxItemComponent, OptionComponent],
  templateUrl: './boxes-page.component.html',
  styleUrl: './boxes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesPageComponent {
  protected readonly selectionService = inject(SelectionService);
}
