import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BoxItemComponent } from './box-item.component'
import { SelectionService } from '../../services/selection.service';
import { defaultBox } from '../../constants';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs'


describe('BoxItemComponent', () => {
  let component: BoxItemComponent;
  let fixture: ComponentFixture<BoxItemComponent>;
  let selectionService: jasmine.SpyObj<SelectionService>;

  beforeEach(async () => {
    const selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectBox']);
    selectionServiceSpy.activeBoxId = new BehaviorSubject<number | null>(null);

    await TestBed.configureTestingModule({
      imports: [BoxItemComponent],
      providers: [
        { provide: SelectionService, useValue: selectionServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxItemComponent);
    component = fixture.componentInstance;
    selectionService = TestBed.inject(SelectionService) as jasmine.SpyObj<SelectionService>;
  })
  
  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should have default box and index', () => {
    expect(component.box).toEqual(defaultBox);
    expect(component.index).toBe(0);
  })

  it('should set inputs correctly', () => {
    const testBox = {
      id: 1,
      option: null,
    }
    component.box = testBox;
    component.index = 1;
    fixture.detectChanges();

    expect(component.box).toEqual(testBox);
    expect(component.index).toBe(1);
  })

  it('should call selectionService when clicked', () => {
    const testBox = {
      id: 1,
      option: null,
    }
    component.box = testBox;
    fixture.detectChanges();

    const box = fixture.debugElement.query(By.css('.box'))
    box.nativeElement.click();
    expect(selectionService.selectBox).toHaveBeenCalledTimes(1);
    expect(selectionService.selectBox).toHaveBeenCalledWith(testBox.id);
  })

  it('box should to has class box--active when active', () => {
    const testBox = {
      id: 1,
      option: null,
    }
    component.box = testBox;

    selectionService.activeBoxId.next(1);
    fixture.detectChanges();
    const box = fixture.nativeElement.querySelector('.box');
    expect(box).toBeTruthy();
    expect(box.classList).toContain('box--active');
  })

  it('box should to has no class box--active if inactive', () => {
    const testBox = {
      id: 1,
      option: null,
    }
    component.box = testBox;

    selectionService.activeBoxId.next(2);
    fixture.detectChanges();
    const box = fixture.nativeElement.querySelector('.box');
    expect(box).toBeTruthy();
    expect(box.classList).not.toContain('box--active');
  })
})