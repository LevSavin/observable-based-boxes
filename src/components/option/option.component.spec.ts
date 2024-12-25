import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OptionComponent } from './option.component'
import { SelectionService } from '../../services/selection.service';
import { defaultOption, defaultBox } from '../../constants';
import { BehaviorSubject, findIndex } from 'rxjs'
import { IBox } from '../../types';

describe('OptionComponent', () => {
  let component: OptionComponent;
  let fixture: ComponentFixture<OptionComponent>;
  let selectionService: jasmine.SpyObj<SelectionService>;
  const testOption = {
    id: 1,
    label: "test label",
    value: 123,
  }

  beforeEach(async () => {
    const selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectOption']);
    selectionServiceSpy.activeBox = new BehaviorSubject<IBox | null>(null);

    await TestBed.configureTestingModule({
      imports: [OptionComponent],
      providers: [
        {provide: SelectionService, useValue: selectionServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OptionComponent);
    component = fixture.componentInstance;
    selectionService = TestBed.inject(SelectionService) as jasmine.SpyObj<SelectionService>;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should have default option', () => {
    expect(component.option).toEqual(defaultOption);
  })

  it('should set input correctly', () => {
    component.option = testOption;
    fixture.detectChanges();
    expect(component.option).toEqual(testOption);
  })

  it('should set label correctly', () => {
    component.option = testOption;
    fixture.detectChanges();

    const labelElement: HTMLElement = fixture.nativeElement.querySelector('[data-label]')
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toBe(testOption.label);
  })

  it('should select option correctly', () => {
    component.option = testOption;
    const optionElement: HTMLElement = fixture.nativeElement.querySelector('[data-option]')
    expect(optionElement).toBeTruthy();
    optionElement.click();
    expect(selectionService.selectOption).toHaveBeenCalledOnceWith(testOption);
  })

  it('should set class option--active correctly', () => {
    component.option = testOption;
    const box = {...defaultBox, option: testOption};
    selectionService.activeBox.next(box);
    const optionElement: HTMLElement = fixture.nativeElement.querySelector('[data-option]');
    fixture.detectChanges();
    expect(optionElement).toBeTruthy();
    expect(selectionService.activeBox.value?.option?.id).toBe(component.option.id);
    expect(optionElement.classList).toContain('option--active');
  })

  it('should has no class option--active if inactive', () => {
    component.option = testOption;
    const box = {...defaultBox, option: defaultOption};
    selectionService.activeBox.next(box);
    const optionElement: HTMLElement = fixture.nativeElement.querySelector('[data-option]');
    fixture.detectChanges();
    expect(optionElement).toBeTruthy();
    expect(selectionService.activeBox.value?.option?.id).not.toBe(component.option.id);
    expect(optionElement.classList).not.toContain('option--active');
  })
})