import { TestBed } from "@angular/core/testing";
import { SelectionService } from './selection.service'
import { defaultBox, defaultOption, localStorageKey } from "../constants";
import { IBox, IOption, ILSData } from "../types";

describe('SelectionService', () => {
  let selectionService: SelectionService;
    
  beforeEach(() => {
    TestBed.configureTestingModule({});
    selectionService = TestBed.inject(SelectionService);
    localStorage.clear();
  })

  afterEach(() => {
    localStorage.clear();
  });

  it('should get box from local storage on init correctly', () => {
    const boxes: IBox[] = [{...defaultBox, id: 1}, {...defaultBox, id: 2}, {...defaultBox, id: 1}];
    const data: ILSData = {boxes};
    localStorage.setItem(localStorageKey, JSON.stringify(data));
    selectionService.initData();
    expect(selectionService.boxes.value).toEqual(boxes);
  })

  it('should save data to Local Storage', () => {
    selectionService.boxes.next([defaultBox]);
    selectionService.saveData();
    const savedData = window.localStorage.getItem(localStorageKey);
    expect(savedData).not.toBeNull;
    const parsedData = JSON.parse(savedData!);
    expect(parsedData['boxes']).toEqual([defaultBox]);
  })

  it('should set activeBox on selectBox', () => {
    selectionService.boxes.next([defaultBox, {...defaultBox, id: 1}]);
    selectionService.selectBox(1);
    expect(selectionService.activeBoxId.value).toBe(1);
    expect(selectionService.activeBox.value).toEqual({...defaultBox, id: 1});
  })

  it('should not set activeBox on selectBox that not exist', () => {
    const activeBox: IBox = {...defaultBox, id: 1};
    selectionService.boxes.next([defaultBox, activeBox]);
    selectionService.selectBox(2);
    expect(selectionService.activeBoxId.value).not.toBe(1);
    expect(selectionService.activeBox.value).not.toEqual(activeBox);
  })

  it('should set active option in box inside boxes', () => {
    spyOn(selectionService, 'saveData');
    const activeBox: IBox = {...defaultBox, id: 1};
    selectionService.activeBox.next(activeBox);
    selectionService.activeBoxId.next(activeBox.id);
    selectionService.boxes.next([defaultBox, activeBox]);
    const option: IOption = {
      ...defaultOption,
      id: 1,
    }
    selectionService.selectOption(option);
    const box = selectionService.boxes.value.find(el => el.id === activeBox.id);
    expect(box).toBeTruthy();
    expect(box?.option).toEqual(option);
    expect(selectionService.saveData).toHaveBeenCalledTimes(1);
  })

  it('should change active box to next box on select option', () => {
    const activeBox: IBox = {...defaultBox, id: 1};
    selectionService.activeBox.next(activeBox);
    selectionService.activeBoxId.next(activeBox.id);
    selectionService.boxes.next([activeBox, defaultBox]);
    const option: IOption = {
      ...defaultOption,
      id: 1,
    }
    selectionService.selectOption(option);
    expect(selectionService.activeBoxId.value).toBeTruthy()
    expect(selectionService.activeBoxId.value).toBe(selectionService.boxes.value[1].id);
    expect(selectionService.activeBox.value).toEqual(selectionService.boxes.value[1]);
  })

  it('should clear options at all boxes on clearBoxes and clear option at activeBox if exists', () => {
    const activeBox: IBox = {...defaultBox, id: 1};
    selectionService.activeBox.next(activeBox);
    selectionService.clearBoxes();
    selectionService.boxes.value.forEach(box => {
      expect(box.option).toBeNull();
    })
    expect(selectionService.activeBox.value?.option).toBeNull();
  })

  it('should sum option value from all boxes', () => {
    const boxes: IBox[] = [{...defaultBox, id: 1}, {...defaultBox, id: 2}, {...defaultBox, id: 1}];
    boxes[1].option = {...defaultOption, value: 1};
    boxes[2].option = {...defaultOption, value: 2.12345};
    selectionService.boxes.next(boxes);
    expect(selectionService.getTotalValue()).toBe(+(1 + 2.12345).toFixed(2));
  })
})